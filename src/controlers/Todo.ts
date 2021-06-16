import { Todo, TodoAttributes } from '../models/Todo.js';
import { RequestHandler } from 'express';
import Query from 'mysql2/typings/mysql/lib/protocol/sequences/Query';

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
  const newTodo = await Todo.create({ list_code, text });
  return res.json(newTodo);
});

export const handleUpdateTodo = asyncHandler<{ code: string }, any, TodoPayload>(async (req, res) => {
  const list_code = req.params.code;
  const { created, ...todoPayload } = req.body;
  await Todo.update({ list_code, ...todoPayload }, { where: { created } });
  const updatedTodo = await Todo.findOne({ where: { list_code, created } });
  return res.json(updatedTodo);
});

export const handleDeleteTodo = asyncHandler<{ code: string; created: string }>(async (req, res) => {
  const list_code = req.params.code;
  const created = Number(req.params.created);
  await Todo.destroy({ where: { list_code, created } });
  return res.status(200).end();
});
