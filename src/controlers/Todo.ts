import { createHmac } from 'crypto';

import { RequestHandler, NextFunction } from 'express';
import { WebsocketRequestHandler } from 'express-ws';
import WebSocket from 'ws';

import { Todo, TodoAttributes } from '../models/Todo';
import { CSRF_SECRET } from '../constants';

type TodoPayload = Omit<TodoAttributes, 'list_code'>

/**
 * Pass any asynchronous errors onto {@link NextFunction}
 *
 * @param handler Normal request handler
 * @returns Request handler that handles asynchronous requests
 */
const asyncHandler = <
  P,
  ResBody = any,
  ReqBody = any,
  ReqQuery = any,
  Locals extends Record<string, any> = Record<string, any>,
>(
  handler: RequestHandler<P, ResBody, ReqBody, ReqQuery, Locals>,
) => {
  const wrapper: RequestHandler<P, ResBody, ReqBody, ReqQuery, Locals> = (req, res, next: NextFunction) => {
    const result = handler(req, res, next);
    return Promise.resolve(result).catch(next);
  };
  return wrapper;
};

const CSRF_TOKENS: Record<string, string> = {};

/** Respond with 200 */
export const handleHealthCheck: RequestHandler = (_, res) => res.status(200).end();

/** Respond with all {@link Todo Todos} that have the provided {@link Todo.list_code list_code}*/
export const handleReadTodos = asyncHandler<{ code: string }>(async (req, res) => {
  const list_code = req.params.code;
  const todos = await Todo.findAll({ where: { list_code } });

  const sid = req.session.id
  const csrfToken = createHmac('sha256', CSRF_SECRET).update(Date.now().toString()).update(sid).digest('hex');
  CSRF_TOKENS[sid] = csrfToken;

  return res.json({ todos, csrf_token: csrfToken });
});

/** Create and respond with {@link Todo} */
export const handleCreateTodo = asyncHandler<{ code: string }, any, string>(async (req, res) => {
  const list_code = req.params.code;
  const text = req.body;
  const newTodo = await Todo.create({ list_code, text, created: Date.now() });
  return res.json(newTodo);
});

/** Update and respond with {@link Todo} */
export const handleUpdateTodo = asyncHandler<{ code: string }, any, TodoPayload>(async (req, res) => {
  const list_code = req.params.code;
  const { created, ...todoPayload } = req.body;
  if (todoPayload.text) todoPayload.updated = Date.now();
  await Todo.update({ list_code, ...todoPayload }, { where: { created } });
  const updatedTodo = await Todo.findOne({ where: { list_code, created } });
  return res.json(updatedTodo);
});

/** Delete {@link Todo} */
export const handleDeleteTodo = asyncHandler<{ code: string; created: string }>(async (req, res) => {
  const list_code = req.params.code;
  const created = Number(req.params.created);
  await Todo.destroy({ where: { list_code, created } });
  return res.status(200).end();
});

/** Mapping of rooms to mapping of user IDs to {@link WebSocket} */
const ROOMS: Record<string, Record<string, WebSocket>> = {};

type WebsocketActions = 'create' | 'update' | 'delete';
type WebsocketResponse = WebsocketActions | 'error';

/** Process and respond to provided action and payload with a {@link WebsocketResponse} and payload */
const getWebsocketResponse = async (
  list_code: string,
  action: WebsocketActions,
  payload: any,
): Promise<[WebsocketResponse, any]> => {
  switch (action) {
    case 'create': {
      const text: string = payload;
      const newTodo = await Todo.create({ list_code, text, created: Date.now() });
      return ['create', newTodo];
    }
    case 'update': {
      const { created, ...todoPayload } = payload as TodoPayload;
      if (todoPayload.text) todoPayload.updated = Date.now();
      await Todo.update({ list_code, ...todoPayload }, { where: { created } });
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

/** Broadcast member count to all members of {@link list_code} {@link ROOMS room} */
const updateMemberCount = (list_code: string) => {
  const responseString = JSON.stringify(['memberCount', Object.values(ROOMS[list_code]!).length])
  for (const member of Object.values(ROOMS[list_code]!)) {
    member.send(responseString);
  }
}

export const handleWebsocket: WebsocketRequestHandler = (ws, req) => {
  const csrfToken = req.headers['sec-websocket-protocol']?.split(', ').slice(1)[0];
  if (csrfToken !== CSRF_TOKENS[req.session.id]) return ws.close();

  const list_code = req.params['code']!;

  const uuid = Date.now().toString();
  if (!(list_code in ROOMS)) ROOMS[list_code] = {};
  ROOMS[list_code]![uuid] = ws;
  updateMemberCount(list_code);

  ws.on('close', () => {
    delete ROOMS[list_code]![uuid];
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
    for (const member of Object.values(ROOMS[list_code]!)) {
      member.send(responseString);
    }
  });
};
