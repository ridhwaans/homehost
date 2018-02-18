'use strict';

//http://stackoverflow.com/questions/31089801/extending-error-in-javascript-with-es6-syntax

/**
 * Base class for errors that occur because of errors in requests reported by API or because of a timeout
 */
class ApiError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else { 
      this.stack = (new Error(message)).stack; 
    }
  }
}

exports.ApiError = ApiError
