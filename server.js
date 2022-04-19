const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
const mongoose = require('mongoose');
const port = process.env.PORT || 8080;
const server = require('./index');
process.on('uncaughtException', (error) => {
  process.exit(1);
});
const database = process.env.HOSTED_DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(database).then(() => console.log('Database connected'));
const app = server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

process.on('unhandledRejection', (error) => {
  app.close(() => {
    process.exit(1);
  });
});
