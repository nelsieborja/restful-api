# Dependencies

- `Node.js`
- `Express`
- `nodemon` - watches file changes and restarts server automatically
- `@babel/cli` - compiles files from the command line
- `@babel/node` - compiles recent JS features down to a version that node understands
- `@babel/preset-env` - tells Babel to convert any recent feature used in the app to the target version specified in the Babel config file
- `body-parser` - middleware that parses incoming request bodies, makes it available under the `req.body` property
- `sequelize` - Node.js ORM for Postgres
- `sequelize-cli` - creates CLI for running Sequelize related commands
- `pg` - PostgreSQL client for Node.js; creates app's database connection
- `pg-hstore` - serializes/deserializes JSON data to `hstore` format
- `dotenv` - gives access to node environment from the app

<br>

# Config Files

- `.babelrc` - Babel config file
- `.sequelizerc` - Sequelize config file; bootstrap the app with the paths specified in the file
- `.env` - Contains all node enviroment variables

<br>

# PostgreSQL and Sequelize Implementation Guide

1. ### Install dependencies with the following command
   ```shell
   $ yarn add sequelize-cli sequelize pg pg-hstore
   ```
2. ### Configure Sequelize for the App

   Create the config file called `.sequelizerc` in the root directory, should contain the following code:

   ```js
   // .sequelizerc
   const path = require('path');

   module.exports = {
     config: path.resolve('config', 'database.json'),
     'models-path': path.resolve('db', 'models'),
     'migrations-path': path.resolve('db', 'migrations')
   };
   ```

   - Use `config/database.json` file for config settings
   - Use `db/models` as models folder
   - Use `db/migrations` as migrations folder

3. ### Bootstrap the App with the following command

   ```shell
   $ node_modules/.bin/sequelize init
   ```

   This will create an empty project by creating the corresponding folders specified in the config file.

   > Dependencies installed locally will use the command pattern `node_modules/.bin/sequelize` instead of using `sequelize` directly

4. ### Configure environment variable

   The `index.js` file lives in models folder has the following code:

   ```js
   // db/models/index.js
   ...
   const env = process.env.NODE_ENV || 'development';
   const config = require(__dirname + '/../../config/database.json')[env];

   ...
   if (config.use_env_variable) {
     sequelize = new Sequelize(process.env[config.use_env_variable], config);
   } else {
     sequelize = new Sequelize(config.database, config.username, config.password, config);
   }
   ...
   ```

   The `config.use_env_variable` is what needs to be setting its value with the environment variables. Also note that the `config` variable is pointed to `database.json` file in config folder, will update that file as well later.

   - #### Install `dotenv`

     ```shell
     $ yarn add dotenv
     ```

   - #### Require `dotenv` file at the top of `index.js`

     ```js
     // db/models/index.js
     require('dotenv').config();
     ```

   - #### Create `.env` file in the root directory, should contain the following code

     ```js
     // .env
     DATABASE_URL=postgres://username@localhost:5432/database_name
     ```

     This will contain all node environment variables, for now it only contains the DB endpoint.

   - #### Replace `development` section with the following code in `database.json` file:
     ```js
      // config/database.json
     "development": {
       "use_env_variable": "DATABASE_URL"
     },
     ```

   With all that being set, `config.use_env_variable` will now have the value of the DB endpoint on `development` environment.

5. ### Create the Models

   The goal is to have each `Todo` with multiple `TodoItem`s.

   - Create `Todo` model with the following command:

     ```shell
     $ node_modules/.bin/sequelize model:create --name Todo --attributes title:string
     ```

     - `--name` refers to the name of the model
     - `--attribute` refers to the attributes the model should have

     This will generate a `todo.js` file in the models folder and a corresponding migration file in the migration folder.

   - Create `TodoItems` with the following command:

     ```shell
     $ node_modules/.bin/sequelize model:create --name TodoItem --attributes description:string
     ```

   - Create relationship between `Todo` and `TodoItem`

     Add the following code in `todo.js` file:

     ```js
     // db/models/todo.js
     ...
     Todo.associate = function(models) {
       // associations can be defined here
       Todo.hasMany(models.TodoItem, {
         foreignKey: 'todoId'
       });
     };
     ...
     ```

     The `Todo.hasMany` sets the relationship as one-to-many. While the `foreignKey: 'todoId'` means that `todoId` is going to be the foreign key column in `TodoItem`. Let's add that:

     ```js
     // db/models/todoitem.js
     ...
     TodoItem.associate = function(models) {
       // associations can be defined here
       TodoItem.belongsTo(models.Todo, {
         foreignKey: 'todoId',
         onDelete: 'CASCADE'
       });
     };
     ...
     ```

     The `TodoItem.belongsTo` sets each `TodoItem` to be linked to one `Todo`. The `onDelete: 'CASCADE'` means if a `Todo` is deleted then the associated `TodoItem` should also be deleted.

   - Modify the migration script for `TodoItem` to include a `todoId` field

     Add the following code to the file:

     ```js
     ...
     todoId: {
       type: Sequelize.INTEGER,
       onDelete: 'CASCADE',
       references: {
         model: 'Todos',
         key: 'id',
         as: 'todoId',
       },
     },
     ...
     ```

     - `model` tells which model this ForeignKey refers to

6. ### Finally, run the migration with the following command

   ```shell
   $ node_modules/.bin/sequelize db:migrate
   ```

   The database should now have the tables created with the relationship being set and defined.

<br>

# Postgres Setup on Mac

1. Install [Postgres.app](https://postgresapp.com/) and follow setup instructions.
2. Install the [postgres CLI tools](https://postgresapp.com/documentation/cli-tools.html).
3. Open up a new terminal window to ensure your changes have been saved.
4. Verify that it worked correctly. The `psql` should point to the path containing the Postgres.app directory.

   ```shell
   $ which psql
   /Applications/Postgres.app/Contents/Versions/latest/bin/psql
   ```

<br>

# References

- [Babel 7 and Nodemon Setup](https://www.codementor.io/michaelumanah/how-to-set-up-babel-7-and-nodemon-with-node-js-pbj7cietc)
- [Postgres Setup](https://devcenter.heroku.com/articles/heroku-postgresql#local-setup)
- [HTTP Status Codes](https://httpstatuses.com/)
- [hstore](https://www.postgresql.org/docs/9.3/hstore.html)
