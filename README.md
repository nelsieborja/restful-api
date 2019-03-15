WIP...

# Dependencies

- `Node.js`
- `Express`
- `nodemon` - watches file changes and restarts server automatically
- `@babel/cli` - compiles files from the command line
- `@babel/node` - compiles recent JS features down to a version that node understands
- `@babel/preset-env` - tells Babel to convert any recent feature used in the app to the target version specified in the Babel config file
- `body-parser` - middleware that parses incoming request bodies, makes it available under the `req.body` property
- `sequelize-cli` - creates CLI for running Sequelize related commands
- `pg` - PostgreSQL client for Node.js; creates app's database connection
- `pg-hstore` - serializes/deserializes JSON data to `hstore` format
- `dotenv` - gives access to node environment from the app

# Config Files

- `.babelrc` - Babel config file
- `.sequelizerc` - Sequelize config file; bootstrap the app with the paths specified in the file

# PostgreSQL and Sequelize Implementation Guide

1. ### Install dependencies with the following command
   ```shell
   yarn add sequelize-cli sequelize pg pg-hstore
   ```
2. ### Configure Sequelize for the App

   Create a file called `.sequelizerc` in the root directory and add the following code to it:

   ```js
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

3. ### Bootstrap the App with the following command:

   ```shell
   node_modules/.bin/sequelize init
   ```

4. ### Configure environment variable

   This is to set the values for `config.use_env_variable` which is used in `index.js` file in the models folder with the environment values:

   - #### Configure `dotenv`

     ```shell
     yarn add dotenv
     ```

   - #### Require `dotenv` file at the top of `index.js`

     ```js
     // db/models/index.js
     require('dotenv').config();
     ```

   - #### Create `.env` file in the root directory

     This will contain all node environment variables.

   - #### Replace `development` section with the following code in `database.json` file:
     ```js
      // config/database.json
     "development": {
       "use_env_variable": "DATABASE_URL"
     },
     ```

# References

- [Babel 7 and Nodemon Setup](https://www.codementor.io/michaelumanah/how-to-set-up-babel-7-and-nodemon-with-node-js-pbj7cietc)
- [HTTP Status Codes](https://httpstatuses.com/)
- [hstore](https://www.postgresql.org/docs/9.3/hstore.html)
