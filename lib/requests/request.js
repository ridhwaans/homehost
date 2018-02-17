'use strict';

/**
 * Base class for all the requests
 */
class Request {
  
  /**
   * Construct the basis of request
   * @param {string} method - HTTP or HTTPS
   * @param {string} path - Path to the endpoint
   * @param {number} timeout - Timeout in milliseconds
   * @param {boolean} ensureHttps - If true, always use HTTPS 
   */
  constructor(method, path, timeout, ensureHttps) {
    this.method = method;
    this.path = path;
    this.timeout = timeout;
    this.ensureHttps = ensureHttps;
  }
}

exports.Request = Request