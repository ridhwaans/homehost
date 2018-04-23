'use strict';
const rqs = require("./request");
/**
 * Finds a TV show given an ID
 * https://developers.themoviedb.org/3/tv/get-tv-details
 */
class TVShow extends rqs.Request {
  /**
   * Construct the request
   * @param {string} tv_id
   */
  constructor(tv_id) {
    super('GET', `/tv/${tv_id}`, 10000, false);
    this.tv_id = tv_id;
  }

  /**
   * Get body parameters
   * @return {Object} The values of body parameters (name of parameter: value of the parameter)
   */
  bodyParameters() {
    let params = {};

    params.tv_id = this.tv_id;

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

exports.TVShow = TVShow