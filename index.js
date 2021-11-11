const express = require('express');
const morgan = require('morgan');
const server = express();
const Tours = require('./Routes/toursRoutes');
const Users = require('./Routes/usersRoutes');
server.use(express.json());
server.use(morgan('dev'));
// how to access to static files in nodejs :

server.use(express.static('public/'));
// or:
// express.static('public/');
// server.use((request, response, next) => {
//   console.log('my middleware executed!');
//   next();
// });
server.use('/api/v1/tours', Tours);
server.use('/api/v1/users', Users);
module.exports = server;
