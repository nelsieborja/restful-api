// Express Router middleware
import express from 'express';
import * as TodosController from './controllers/todos.controller';

// Create route handler
const TodosRouter = express.Router();

/**
 * `app.[method](<endpoint>, <callbackFunction>)`
 * @param {String} endpoint - api URL
 * @param {Function} callbackFunction - runs every hit on the endpoint
 * method: get|post|put|delete
 */
// Get all todos
TodosRouter.get('/api/v1/todos', TodosController.getAllTodos);
// Get single todo
// `:id` param that holds the ID of todo
TodosRouter.get('/api/v1/todos/:id', TodosController.getTodo);
// Create todo
TodosRouter.post('/api/v1/todos', TodosController.createTodo);
// Update todo
TodosRouter.put('/api/v1/todos/:id', TodosController.updateTodo);
// Delete todo
TodosRouter.delete('/api/v1/todos/:id', TodosController.deleteTodo);

export default TodosRouter;
