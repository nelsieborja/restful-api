/**
 * Controllers Structure
 * @param {Object} res
 * @param {Object} options
 * @param {Int} status - set HTTP status to:
 * 200 [default]: "OK"
 * 201: "Created"
 * 404: "Not Found"
 * 400: "Bad Request"
 */

import db from '../../db/db';

// Common custom `res` handler, being success state set as default
const response = (res, options, status = 200) =>
  res.status(status).send({ success: true, ...options });

export const getAllTodos = (req, res) => {
  return response(res, {
    message: 'Todos retrieved successfully',
    todos: db
  });
};

export const getTodo = ({ params: { id } }, res) => {
  // `req.params` - an object that contains all the parameters passed to the routes

  // Loop through `db` to find which todo ID matches the param ID
  const todo = db.filter(todo => todo.id === parseInt(id, 10));

  // Returns the match with a successful response
  if (todo.length > 0) {
    return response(res, {
      message: 'Todo retrieved successfully',
      todo
    });
  }

  // Returns "Not Found" response in case no match found
  return response(
    res,
    {
      success: false,
      message: 'Todo does not exist'
    },
    404
  );
};

export const createTodo = ({ body: { title } }, res) => {
  // Validates body requests
  if (!title || !description) {
    return response(
      res,
      {
        success: false,
        message: `${!title ? 'Title' : 'Description'} is required`
      },
      400
    );
  }

  // Creates new todo
  const createdTodo = {
    id: db.length + 1,
    title,
    description
  };
  // Inserts new todo to `db`
  db.push(createdTodo);

  // Returns "Created" response along with the new todo
  return response(
    res,
    {
      message: 'Todo added successfully',
      createdTodo
    },
    201
  );
};

export const updateTodo = ({ params: { id }, body: { title, description } }, res) => {
  const todoUpdateID = parseInt(id, 10);
  let todoFoundIndex = null;

  // Searches the index of param ID in `db`
  for (const index in db) {
    if (db[index].id === todoUpdateID) {
      todoFoundIndex = index;
    }
  }

  // Returns "Not Found" response if index not found
  if (!todoFoundIndex) {
    return response(
      res,
      {
        success: false,
        message: 'Todo not found'
      },
      404
    );
  }

  // Validates body requests
  if (!title || !description) {
    return response(
      res,
      {
        success: false,
        message: `${!title ? 'Title' : 'Description'} is required`
      },
      400
    );
  }

  // Creates new object for the todo to update
  const updatedTodo = {
    id: todoUpdateID,
    title,
    description
  };
  // Replaces todo with new the object
  db.splice(todoFoundIndex, 1, updatedTodo);

  // Returns successful response along with the updated todo
  return response(res, {
    message: 'Todo updated successfully',
    updatedTodo
  });
};

export const deleteTodo = ({ params: { id } }, res) => {
  // Loop through `db` to find which todo ID matches the param ID
  for (const index in db) {
    if (db[index].id === parseInt(id, 10)) {
      // Removes matched todo from the `db`
      db.splice(index, 1);
      // Returns successful response
      return response(res, {
        message: 'Todo deleted successfully'
      });
    }
  }

  // Otherwise returns "Not Found" response
  return response(
    res,
    {
      success: false,
      message: 'todo not found'
    },
    404
  );
};
