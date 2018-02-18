'use strict';
const ae = require("./api-error");

/**
 * Error thrown when a request did not succeed (did not return 200 or 201)
 */
class ResponseError extends ae.ApiError {
  /**
   * Create the exception
   * @param {Request} request - ID of the item which will be modified
   * @param {number} statusCode - The values for the individual properties
   * @param {string} message - Error message from the API
   */
  constructor(request, statusCode, message) {
    super(message);
    this.request = request;
    this.statusCode = statusCode;
  }
}

exports.ResponseError = ResponseError
