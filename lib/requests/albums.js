'use strict';
const rqs = require("./request");
/**
 * Finds several albums given a list of IDs
 * https://developer.spotify.com/web-api/console/get-several-albums/
 */
class Albums extends rqs.Request {
  /**
   * Construct the request
   * @param {string} external_ids - IDs of the item properties of which are to be obtained.
   */
  constructor(external_ids) {
    super('GET', `/albums/${external_ids}`, 10000, false);
    this.external_ids = external_ids;
  }

  /**
   * Get body parameters
   * @return {Object} The values of body parameters (name of parameter: value of the parameter)
   */
  bodyParameters() {
    let params = {};

    params.external_ids = this.external_ids;

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

exports.Albums = Albums