'use strict';
const rqs = require("./request");
/**
 * Finds a TV season given an ID
 * https://developers.themoviedb.org/3/tv-seasons/get-tv-season-details
 */
class TVSeason extends rqs.Request {
  /**
   * Construct the request
   * @param {string} tv_id
   * @param {string} season_number
   */
  constructor(tv_id, season_number) {
    super('GET', `/tv/${tv_id}/season/${season_number}`, 10000, false);
    this.tv_id = tv_id;
    this.season_number = season_number;
  }

  /**
   * Get body parameters
   * @return {Object} The values of body parameters (name of parameter: value of the parameter)
   */
  bodyParameters() {
    let params = {};

    params.tv_id = this.tv_id;
    params.season_number = this.season_number;

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

exports.TVSeason = TVSeason