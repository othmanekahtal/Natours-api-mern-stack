class ErrorHandler extends Error {
  statusCode;
  status;
  isOperational;

  constructor({ message, statusCode }) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode.toString().startsWith('4') ? 'failed' : 'error';
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ErrorHandler;