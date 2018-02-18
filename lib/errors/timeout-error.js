'use strict';
const ae = require("./api-error");

/**
 * Error thrown when a request is not processed within the timeout
 */
class TimeoutError extends ae.ApiError {
  /**
   * Create the exception
   * @param {Request} request - Request which caused the exception
   * @param {Object} innerException - Exception from underlying HTTP library
   */
  constructor(request, innerException) {
    super(`Client did not get response within ${request.timeout} ms`);
    this.request = request;
    this.innerException = innerException;
  }
}

exports.TimeoutError = TimeoutError
