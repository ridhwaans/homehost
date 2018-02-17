'use strict';
const rqs = require("./request");
/**
 * Find given an ID (movies, TV shows and people)
 */
class Find extends rqs.Request {
/**
   * Construct the request
   * @param {string} external_id - ID of the item properties of which are to be obtained.
   */
  constructor(itemId) {
    super('GET', `/find/${external_id}`, 1000, false);
    this.external_id = external_id;
  }

  /**
   * Get body parameters
   * @return {Object} The values of body parameters (name of parameter: value of the parameter)
   */
  bodyParameters() {
    let params = {};

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

exports.Find = Find