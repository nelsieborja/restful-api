import express from 'express';
import bodyParser from 'body-parser';
import db from './db/db';

// Set up the Express App
const app = express();

// Parse incoming requests data
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: false })); // for NOT parsing application/x-www-form-urlencoded

// Get all todos
// `app.get` makes get request to the server with 2 params:
// 1st: the endpoint `/api/v1/todos` meant to return the todos in the DB
// 2nd: function that runs every hit on this endpoint
app.get('/api/v1/todos', (req, res) => {
  // Function takes 2 parameters:
  // req - an object that contains information about the request
  // res - also an object that contains the information about the response and methods
  // that will be sent back to the client
  // `res.status()` sends back the status of the request (400: HTTP Status to "OK")
  // `res.send()` sends back the response to the client along with the param resource (JSON object in this case)
  res.status(200).send({
    success: true,
    message: 'Todos retrieved successfully',
    todos: db
  });
});

// Create todo
app.post('/api/v1/todos', ({ body: { title, description } }, res) => {
  if (!title) {
    // 400: HTTP Status to "Bad Request"
    return res.status(400).send({
      success: false,
      message: 'Title is required'
    });
  } else if (!description) {
    return res.status(400).send({
      success: false,
      message: 'Description is required'
    });
  }

  const todo = {
    id: db.length + 1,
    title,
    description
  };
  db.push(todo);

  // 201: HTTP Status to "Created"
  return res.status(201).send({
    success: true,
    message: 'Todo added successfully'
  });
});

// Get single todo
// `:id` param that holds the ID of todo
app.get('/api/v1/todos/:id', (req, res) => {
  // `req.params` - an object that contains all the parameters passed to the routes
  const id = parseInt(req.params.id, 10);

  // Loop through DB to find which ID matches the param ID
  const todo = db.filter(todo => todo.id === id);

  if (todo.length > 0) {
    return res.status(200).send({
      success: true,
      message: 'Todo retrieved successfully',
      todo
    });
  }

  // 404: HTTP Status to "Not Found"
  return res.status(404).send({
    success: false,
    message: 'Todo does not exist'
  });
});

// Delete todo
app.delete('/api/v1/todos/:id', ({ params: { id } }, res) => {
  for (const index in db) {
    if (db[index].id === parseInt(id, 10)) {
      db.splice(index, 1);
      return res.status(200).send({
        success: true,
        message: 'Todo deleted successfully'
      });
    }
  }

  return res.status(404).send({
    success: false,
    message: 'todo not found'
  });
});

// Update todo
app.put('/api/v1/todos/:id', ({ params: { id }, body: { title, description } }, res) => {
  const todoUpdateID = parseInt(id, 10);
  let todoFoundIndex = null;

  for (const index in db) {
    if (db[index].id === todoUpdateID) {
      todoFoundIndex = index;
    }
  }

  if (!todoFoundIndex) {
    return res.status(404).send({
      success: false,
      message: 'Todo not found'
    });
  }

  if (!title) {
    return res.status(400).send({
      success: false,
      message: 'Title is required'
    });
  } else if (!description) {
    return res.status(400).send({
      success: false,
      message: 'Description is required'
    });
  }

  const updatedTodo = {
    id: todoUpdateID,
    title,
    description
  };
  db.splice(todoFoundIndex, 1, updatedTodo);

  return res.status(201).send({
    success: true,
    message: 'Todo updated successfully',
    updatedTodo
  });
});

const PORT = 5000;

// `app.listen` creates a web server, takes 2 params:
// 1st: port of the server will be running on
// 2nd: optional callback function fires when server is created
app.listen(PORT, err => {
  if (err) throw err;
  console.log(`> Ready on http://localhost:${PORT}`);
});
