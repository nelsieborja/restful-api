import express from 'express';
import bodyParser from 'body-parser';
import TodosRouter from './todos/routes.config';

// Set up the Express App
const app = express();

// Parse incoming requests data
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: false })); // for NOT parsing application/x-www-form-urlencoded
// Inject todos Routes middleware
app.use(TodosRouter);

const PORT = 5000;

// `app.listen` creates a web server, takes 2 params:
// 1st: port of the server will be running on
// 2nd: optional callback function fires when server is created
app.listen(PORT, err => {
  if (err) throw err;
  console.log(`> Ready on http://localhost:${PORT}`);
});
