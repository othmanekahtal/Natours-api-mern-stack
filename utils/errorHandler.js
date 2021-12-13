// class ErrorHandler {
//   static error404({ status = 'failed', message }) {
//     const err = new Error(message);
//     err.status ||= status;
//     err.statusCode = 404;
//     return err;
//   }
//
//   static error500({ status = 'error', message }) {
//     const err = new Error(message);
//     err.status ||= status;
//     err.statusCode = 500;
//     return err;
//   }
//
//   static error({ status, message, statusCode }) {
//     const err = new Error(message);
//     err.status = status;
//     err.statusCode = statusCode;
//     return err;
//   }
// }


class ErrorHandler extends Error {
  statusCode;
  status;

  constructor({ message, statusCode }) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode.toString().startsWith('4') ? 'failed' : 'error';
    Error.captureStackTrace(this, this.constructor);
  }

  // static error404({ status = 'failed', message }) {
  //   const err = new Error(message);
  //   err.status ||= status;
  //   err.statusCode = 404;
  //   return err;
  // }
  //
  // static error500({ status = 'error', message }) {
  //   const err = new Error(message);
  //   err.status ||= status;
  //   err.statusCode = 500;
  //   return err;
  // }
  //
  // static error({ status, message, statusCode }) {
  //   const err = new Error(message);
  //   err.status = status;
  //   err.statusCode = statusCode;
  //   return err
  // function(i,e,arr){}
  // arr.map( fn)
  // }

}

module.exports = ErrorHandler;