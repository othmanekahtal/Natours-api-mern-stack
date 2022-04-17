const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({ path: './.env' });
const port = process.env.PORT || 8080;
process.on('uncaughtException', (error) => {
  
  
  process.exit(1);
});
const database = process.env.HOSTED_DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(database).then(() => 
const server = require('./index');
const app = server.listen(port, () => {
  
});

process.on('unhandledRejection', (error) => {
  
  app.close(() => {
    
    process.exit(1);
  });
});
