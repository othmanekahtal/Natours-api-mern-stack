const ErrorHandler = require('./../utils/errorHandler');
const errorDev = (error, res) => res.status(error.statusCode).json({
  status: error.status,
  message: error.message,
  error,
  stack: error.stack
});

const errorProd = (error, res) => {
  if (error.isOperational) {
    return res.status(error.statusCode).json({
      status: error.status,
      message: error.message
    });
  }
  res.status(500).json({
    status: 'error',
    message: 'Something went very wrong!'
  });

};
module.exports = (error, req, res, next) => {
  console.log(error);
  error.statusCode ||= 500;
  error.status ||= 'error';
  if (process.env.NODE_ENV === 'development') {
    errorDev(error, res);
  } else if (process.env.NODE_ENV === 'production') {
    let err = { ...error };
    if (error.name === 'CastError') {
      err = new ErrorHandler({
        message: `invalid ${err.path}:${err.value}`,
        statusCode: 400
      });
    }
    errorProd(err, res);
  }
};