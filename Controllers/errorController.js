exports.errorHandle = (error, req, res, next) => {
  console.log(error);
  error.statusCode ||= 500;
  error.status ||= 'error';
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message
  });
};