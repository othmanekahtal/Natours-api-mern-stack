const dotenv = require('dotenv');
const mongoose = require('mongoose');
const port = process.env.PORT || 8080;
dotenv.config({ path: './.env' });
process.on('uncaughtException', error => {
  console.log(`${error.name} : ${error.message}`);
  process.exit(1);
});
const database = process.env.HOSTED_DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);

mongoose
  .connect(database)
  .then(() => console.log('DB connection successful!'));
const server = require('./index');
const app = server.listen(port, () => {
  console.log(`listen on port ${8080}...`);
});

process.on('unhandledRejection', error => {
    console.log(`${error.name} : ${error.message}`);
    app.close(() => {
      console.log('app stopped!');
      process.exit(1);
    });
  }
);