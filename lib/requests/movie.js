'use strict';
const rqs = require("./request");
/**
 * Finds a movie given an ID
 */
class Movie extends rqs.Request {
/**
   * Construct the request
   * @param {string} external_id - ID of the item properties of which are to be obtained.
   */
  constructor(external_id) {
    super('GET', `/movie/${external_id}`, 10000, false);
    this.external_id = external_id;
  }

  /**
   * Get body parameters
   * @return {Object} The values of body parameters (name of parameter: value of the parameter)
   */
  bodyParameters() {
    let params = {};

    params.external_id = this.external_id;

    return params;
  }

  /**
   * Get query parameters
   * @return {Object} The values of query parameters (name of parameter: value of the parameter)
   */
  queryParameters() {
    let params = {};
    return params;
  }
}

exports.Movie = Movie