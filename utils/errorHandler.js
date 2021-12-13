class ErrorHandler {
  static error404({ status = 'failed', message }) {
    const err = new Error(message);
    err.status ||= status;
    err.statusCode = 404;
    return err;
  }

  static error500({ status = 'error', message }) {
    const err = new Error(message);
    err.status ||= status;
    err.statusCode = 500;
    return err;
  }

  static error({ status, message, statusCode }) {
    const err = new Error(message);
    err.status = status;
    err.statusCode = statusCode;
    return err;
  }
}


module.exports = ErrorHandler;