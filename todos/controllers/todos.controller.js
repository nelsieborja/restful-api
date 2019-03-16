/**
 * Controllers Structure
 * @param {Object} res
 * @param {Object} options
 * @param {Int} status - set HTTP status to:
 * 200 [default]: "OK"
 * 201: "Created"
 * 400: "Bad Request"
 * 403: "Forbidden"
 * 404: "Not Found"
 * 500: Internal Server Error
 */

import { Todo as TodoModel } from '../../db/models';

// Common custom `res` handler, being success state set as default
const response = (res, options, status = 200) =>
  res.status(status).send({ success: true, ...options });

// Get all todos controller
export const getAllTodos = (req, res) => {
  TodoModel.findAll()
    // Returns todos with a successful response
    .then(todos => response(res, { message: 'Todos retrieved successfully', todos }))
    // Catches any internal server error
    .catch(error => response(res, { message: error }, 500));
};

// Get single todo controller
export const getTodo = ({ params: { id } }, res) => {
  // Searches todo by its ID
  TodoModel.findByPk(parseInt(id, 10))
    .then(todo => {
      if (todo) {
        // Returns todo with a successful response
        return response(res, { message: 'Todo retrieved successfully', todo });
      }

      // Returns "Not Found" response in case todo doesn't exist in DB
      return response(res, { success: false, message: 'Todo does not exist' }, 404);
    })
    // Catches any internal server error
    .catch(error => response(res, { message: error }, 500));
};

// Create todo controller
export const createTodo = ({ body: { title } }, res) => {
  // Validates body requests
  if (!title) {
    return response(res, { success: false, message: 'Title is required' }, 400);
  }

  // Checks if todo already exists in DB, by searching for `title` attribute
  TodoModel.findOne({ where: { title } })
    .then(todoAlreadyExists => {
      // Returns "Forbidden" response if todo already exists in DB
      if (todoAlreadyExists) {
        return response(
          res,
          { success: false, message: 'A todo with that title already exists' },
          403
        );
      }

      // Otherwise create the todo and returns with "Created" response along with the created todo
      TodoModel.create({ title })
        .then(todo => response(res, { message: 'Todo added successfully', todo }, 201))
        // Catches any internal server error
        .catch(error => response(res, { message: error }, 500));
    })
    // Catches any internal server error
    .catch(error => response(res, { message: error }, 500));
};

// Update todo controller
export const updateTodo = ({ params: { id }, body: { title } }, res) => {
  // Searches todo by its ID
  TodoModel.findByPk(parseInt(id, 10))
    .then(todo => {
      // Returns "Not Found" response if todo doesn't exist in DB
      if (!todo) return response(res, { success: false, message: 'Todo not found' }, 404);

      // Validates body requests
      if (!title) return response(res, { success: false, message: 'Title is required' }, 400);

      // Returns successful response along with the updated todo
      todo
        .update({ title })
        .then(updatedTodo =>
          response(res, {
            message: 'Todo updated successfully',
            updatedTodo
          })
        )
        // Catches any internal server error
        .catch(error => response(res, { message: error }, 500));
    })
    // Catches any internal server error
    .catch(error => response(res, { message: error }, 500));
};

// Delete todo controller
export const deleteTodo = ({ params: { id } }, res) => {
  // Searches todo by its ID
  TodoModel.findByPk(parseInt(id, 10))
    .then(todo => {
      // Returns "Not Found" response if todo doesn't exist in DB
      if (!todo) return response(res, { success: false, message: 'Todo not found' }, 404);

      // Deletes todo
      todo.destroy();
      // Returns successful response
      return response(res, { message: 'Todo deleted successfully' });
    })
    // Catches any internal server error
    .catch(error => response(res, { message: error }, 500));
};
