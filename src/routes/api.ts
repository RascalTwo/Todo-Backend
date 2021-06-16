import { handleHealthCheck, handleCreateTodo, handleDeleteTodo, handleReadTodos, handleUpdateTodo } from '../controlers/Todo';
import express, { Router } from 'express';

const router = Router();

router
	.route('/')
	.get(handleHealthCheck);

router
	.route('/:code')
	.all(express.text())
	.all(express.json())
	.get(handleReadTodos)
	.post(handleCreateTodo)
	.put(handleUpdateTodo);

router
	.route('/:code/:created')
	.delete(handleDeleteTodo);

export default router