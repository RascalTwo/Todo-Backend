import { Todo, TodoAttributes } from '../models/Todo.js';
import { RequestHandler } from 'express';
import Query from 'mysql2/typings/mysql/lib/protocol/sequences/Query';
import { WebsocketRequestHandler } from 'express-ws';
import WebSocket from 'ws';

type TodoPayload = Omit<TodoAttributes, 'list_code'> & {
  created: number;
  text: string;
  completed: number | null;
};

const asyncHandler = <
  P,
  ResBody = any,
  ReqBody = any,
  ReqQuery = Query,
  Locals extends Record<string, any> = Record<string, any>,
>(
  handler: RequestHandler<P, ResBody, ReqBody, ReqQuery, Locals>,
) => {
  const wrapper: RequestHandler<P, ResBody, ReqBody, ReqQuery, Locals> = (req, res, next) => {
    const result = handler(req, res, next);
    return Promise.resolve(result).catch(next);
  };
  return wrapper;
};

export const handleHealthCheck: RequestHandler = (_, res) => res.status(200).end();

export const handleReadTodos = asyncHandler<{ code: string }>(async (req, res) => {
  const list_code = req.params.code;
  const todos = await Todo.findAll({ where: { list_code } });
  return res.json(todos);
});

export const handleCreateTodo = asyncHandler<{ code: string }, any, string>(async (req, res) => {
  const list_code = req.params.code;
  const text = req.body;
  const newTodo = await Todo.create({ list_code, text, created: Date.now() });
  return res.json(newTodo);
});

export const handleUpdateTodo = asyncHandler<{ code: string }, any, TodoPayload>(async (req, res) => {
  const list_code = req.params.code;
  const { created, ...todoPayload } = req.body;
  await Todo.update({ list_code, ...todoPayload, updated: Date.now() }, { where: { created } });
  const updatedTodo = await Todo.findOne({ where: { list_code, created } });
  return res.json(updatedTodo);
});

export const handleDeleteTodo = asyncHandler<{ code: string; created: string }>(async (req, res) => {
  const list_code = req.params.code;
  const created = Number(req.params.created);
  await Todo.destroy({ where: { list_code, created } });
  return res.status(200).end();
});

const rooms: Record<string, Record<string, WebSocket>> = {};

type WebsocketActions = 'create' | 'update' | 'delete';
type WebsocketResponses = WebsocketActions | 'error';

const getWebsocketResponse = async (
  list_code: string,
  action: WebsocketActions,
  payload: any,
): Promise<[WebsocketResponses, any]> => {
  switch (action) {
    case 'create': {
      const text: string = payload;
      const newTodo = await Todo.create({ list_code, text, created: Date.now() });
      return ['create', newTodo];
    }
    case 'update': {
      const { created, ...todoPayload } = payload as TodoPayload;
      await Todo.update({ list_code, ...todoPayload, updated: Date.now() }, { where: { created } });
      const updatedTodo = await Todo.findOne({ where: { list_code, created } });
      return ['update', updatedTodo];
    }
    case 'delete': {
      const created: number = payload;
      await Todo.destroy({ where: { list_code, created } });
      return ['delete', created];
    }
    default:
      return ['error', `Unknown action: ${action}`];
  }
};

const updateMemberCount = (list_code: string) => {
  const responseString = JSON.stringify(['memberCount', Object.values(rooms[list_code]!).length])
  for (const member of Object.values(rooms[list_code]!)) {
    member.send(responseString);
  }
}

export const handleWebsocket: WebsocketRequestHandler = (ws, req) => {
  const list_code = req.params['code']!;

  const uuid = Date.now().toString();
  if (!(list_code in rooms)) rooms[list_code] = {};
  rooms[list_code]![uuid] = ws;
  updateMemberCount(list_code);

  ws.on('close', () => {
    delete rooms[list_code]![uuid];
    updateMemberCount(list_code);
  });

  ws.on('message', async message => {
    const [action, payload]: [WebsocketActions, any] = JSON.parse(message as string);
    const response = await getWebsocketResponse(list_code, action, payload);
    const responseString = JSON.stringify(response);

    if (response[0] === 'error') {
      ws.send(responseString);
      return;
    }
    for (const member of Object.values(rooms[list_code]!)) {
      member.send(responseString);
    }
  });
};
