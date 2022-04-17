const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const server = express();
const Tours = require('./Routes/toursRoutes');
const Users = require('./Routes/usersRoutes');
const { reviewRouter } = require('./Routes/reviewRoutes');
const Auth = require('./Routes/authRoutes');
const { protect } = require('./Controllers/authController');
const errorHandler = require('./utils/errorHandler');
const errorHandle = require('./Controllers/globalErrorHandler');
// if cycle not finished yet At this moment , we have a router that handled in the previous middlewares
/**
 * all == all verbs put,delete,patch,get,post
 */

// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
server.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  server.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
server.use('/api', limiter);

// Body parser, reading data from body into req.body
server.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
server.use(mongoSanitize());

// Data sanitization against XSS
// convert all html or malicious code to symbols
server.use(xss());

// Prevent parameter pollution
server.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// Serving static files
server.use(express.static(`${__dirname}/public`));

// Test middleware
server.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

server.use('/api/v1', Auth);
server.use('/api/v1/users', Users);
server.use('/api/v1/reviews', reviewRouter);
server.use('/api/v1/tours', Tours);

server.all('*', function (req, res, next) {
  next(
    new errorHandler({
      message: `Can't find ${req.originalUrl} on this server`,
      statusCode: 404,
    })
  );
});

/*
we create a central middleware for handle all errors
 */
server.use(errorHandle);
module.exports = server;
