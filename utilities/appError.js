// this is to create errors for users.
// params: error message and status code

class AppError extends Error {
  constructor(message, statusCode) {
    // super: pass message to extended class
    super(message);
    // to set the statusCode of the error to params statusCode
    this.statusCode = statusCode;

    // tenary to update status. if its 404 ? fail : error
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    // operational errors meant to be sent to the client
    this.isOperational = true;

    // to trace the source of the error
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
