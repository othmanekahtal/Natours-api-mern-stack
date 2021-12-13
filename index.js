const express = require('express');
const morgan = require('morgan');
const server = express();
const Tours = require('./Routes/toursRoutes');
const Users = require('./Routes/usersRoutes');
const errorHandler = require('./utils/errorHandler.js');
server.use(express.json());
// for dev only :
server.use(morgan('dev'));
server.use(express.static('public/'));
server.use('/api/v1/tours', Tours);
server.use('/api/v1/users', Users);

// if cycle not finished yet At this moment , we have a router that handled in the previous middlewares
/**
 * all == all verbs put,delete,patch,get,post
 */

server.all('*', function(req, res, next) {
  // res.status(404).json({
  //   status: 'error',
  //   message: `Can't find ${req.originalUrl} on this server`
  // });
  // const error = new Error(`Can't find ${req.originalUrl} on this server`);
  // error.status = 'failed';
  // error.statusCode = 404;
  // next(error);
  next(errorHandler.error404({ message: `Can't find ${req.originalUrl} on this server` }));
});

/*
we create a central middleware for handle all errors
 */
server.use((error, req, res, next) => {
  error.statusCode ||= 500;
  error.status ||= 'error';
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message
  });
});
/**
 * @type {*|Express}
 * if we pass any parameter to next() function automatically express will know that was an error
 * when we pass param to next() express skip all middlewares in stack to the error handler
 */
module.exports = server;
