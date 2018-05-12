'use strict';

const jsSHA = require('jssha');
const rp = require('request-promise');
const rp_errors = require('request-promise/errors');

const errors = require('./errors');
const requests = require('./requests');

const BATCH_MAX_SIZE = 10000;
 /**
  * Client for sending requests to tmdb and getting replies
  */
class ApiClient {
  constructor (baseUri, apiKey, alwaysUseHttps, options) {
    this.apiKey = apiKey;
    this.alwaysUseHttps = alwaysUseHttps;
    this.baseUri = baseUri || {};
    this.options = options || {};
  }

  /**
   * @param {Request} request - Request to be sent
   * @param {Object} callback - Optional callback (send returns Promise if omitted) 
   */
  send(request, delay, callback) {
    let options = this._buildRequestOptions(request);

    return rp(options)
     .then(this._parseResponse)
     .delay(delay)
     .then((response)=> {
        return new Promise( (resolve) => {
          if (callback) { return callback(null, response); }
          return resolve(response);
        });
      })
      .catch(rp_errors.StatusCodeError,((error) => {
          throw new errors.ResponseError(request, error.statusCode, error.message);
        }
      ))
      .catch(rp_errors.RequestError,((error) => {
          if(error.cause.code === 'ETIMEDOUT' || error.cause.code === 'ESOCKETTIMEDOUT')
            throw new errors.TimeoutError(request, error);
          throw error;
        }
      ))
      .catch((error) => {
        if (callback) {return callback(error)};
        throw error;
      });
  }

  _buildRequestOptions(request) {
    let protocol = (request.ensureHttps || this.alwaysUseHttps) ? 'https' : 'http';
    let reqUrl = request.path + this._encodeRequestQueryParams(request);
    let headers = {'Accept': 'application/json',
                  'Content-Type': 'application/json'};

    if (this.apiKey) {
      switch (this.baseUri) {
        case 'api.themoviedb.org/3':
          reqUrl += (reqUrl.indexOf('?') == -1 ? '?' : '&' ) + 'api_key=' + this.apiKey;
          break;
        case 'api.spotify.com/v1':
          headers['Authorization'] = 'Bearer ' + this.apiKey;
          break;
      }
    }

    let url = protocol + '://' + this.baseUri + reqUrl
    let options = {
      method: request.method,
      uri: url,
      headers: headers,
      timeout: request.timeout,
      resolveWithFullResponse: true,
      json: true
    };
    // if (request.bodyParameters()) 
    //   options.body = request.bodyParameters();

    console.log('url: ' + options.uri)
    //console.log('options: ' + JSON.stringify(options))
    return options;
  }

  _encodeRequestQueryParams(request) {
    let res = ''
    let queryParams = request.queryParameters();
    let paramPairs = [];
    for (let d in queryParams)
      paramPairs.push(this._rfc3986EncodeURIComponent(d) + '=' + this._formatQueryParameterValue(queryParams[d]));
    res += paramPairs.join('&');
    if (res.length > 0) {
      res = '?' + res;
    }
    return res;
  }

  //https://stackoverflow.com/questions/18251399/why-doesnt-encodeuricomponent-encode-single-quotes-apostrophes
  _rfc3986EncodeURIComponent (str) {  
    return encodeURIComponent(str).replace(/[!'()*]/g, escape);  
  }

  _formatQueryParameterValue(value) {
    if (value instanceof Array) {
      return value.map((v) => this._rfc3986EncodeURIComponent(v.toString())).join(',');
    }
    return this._rfc3986EncodeURIComponent(value.toString());
  }

  _parseResponse(response) {
      return new Promise(
        function (resolve, reject) {
          resolve(response.body);
        }
      );
    }
}

exports.ApiClient = ApiClient