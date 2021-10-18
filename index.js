const express = require('express');
const morgan = require('morgan');
const server = express();
const Tours = require('./Routes/toursRoutes');
const Users = require('./Routes/usersRoutes');
server.use(express.json());
server.use(morgan('dev'));

server.use((request, response, next) => {
  console.log('my middleware executed!');
  next();
});
server.use('/api/v1/tours', Tours);
server.use('/api/v1/users', Users);

module.exports = server;
