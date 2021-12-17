const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
process.on('uncaughtException', error => {
  console.log(`${error.name} : ${error.message}`);
  process.exit(1);
});
const server = require('./index');
const app = server.listen(8080, () => {
  console.log('listen on port 8080...');
});

process.on('unhandledRejection', error => {
    console.log(`${error.name} : ${error.message}`);
    app.close(() => {
      console.log('app stopped!');
      process.exit(1);
    });
  }
);