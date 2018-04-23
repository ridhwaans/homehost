'use strict';
const rqs = require("./request");
/**
 * Finds a TV episode given an ID
 * https://developers.themoviedb.org/3/tv-episodes/get-tv-episode-details
 */
class TVEpisode extends rqs.Request {
  /**
   * Construct the request
   * @param {string} tv_id
   * @param {string} season_number
   * @param {string} episode_number
   */
  constructor(tv_id, season_number, episode_number) {
    super('GET', `/tv/${tv_id}/season/${season_number}/episode/${episode_number}`, 10000, false);
    this.tv_id = tv_id;
    this.season_number = season_number;
    this.episode_number = episode_number;
  }

  /**
   * Get body parameters
   * @return {Object} The values of body parameters (name of parameter: value of the parameter)
   */
  bodyParameters() {
    let params = {};

    params.tv_id = this.tv_id;
    params.season_number = this.season_number;
    params.episode_number = this.episode_number;
    
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

exports.TVEpisode = TVEpisode