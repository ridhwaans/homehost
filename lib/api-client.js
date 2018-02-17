'use strict';

const jsSHA = require("jssha");
const rp = require('request-promise');
const rp_errors = require('request-promise/errors');

const api_errors = require('./errors');
const requests = require('./requests');

const BATCH_MAX_SIZE = 10000;
/**
  * Client for sending requests to tmdb and getting replies
  */
class ApiClient {
	constructor (databaseId, token, alwaysUseHttps, options) {
      this.databaseId = databaseId;
      this.token = token;
      this.alwaysUseHttps = alwaysUseHttps;
      this.baseUri = process.env.RAPI_URI || 'rapi.recombee.com';
      this.options = options || {};
  }

/**
   * Send the request to Recombee
   * @param {Request} request - Request to be sent
   * @param {Object} callback - Optional callback (send returns Promise if omitted) 
   */
  send(request, callback) {

  	let url = this._buildRequestUrl(request);
  	let options = {
        method: request.method,
        uri: url,
        headers: {'Accept': 'application/json',
                  'Content-Type': 'application/json'},
        timeout: request.timeout,
        resolveWithFullResponse: true,
        json: true
    };

    if (request.bodyParameters()) 
      options.body = request.bodyParameters();


	return rp(options)
       .then(this._parseResponse)
       .then((response)=> {
          return new Promise( (resolve) => {
            if (callback) { return callback(null, response); }
            return resolve(response);
          });
        })
        .catch(rp_errors.StatusCodeError,((error) => {
            throw new api_errors.ResponseError(request, error.statusCode, error.message);
          }
        ))
        .catch(rp_errors.RequestError,((error) => {
            if(error.cause.code === 'ETIMEDOUT' || error.cause.code === 'ESOCKETTIMEDOUT')
              throw new api_errors.TimeoutError(request, error);
            throw error;
          }
        ))
        .catch((error) => {
          if (callback) {return callback(error)};
          throw error;
        });
  }



	_buildRequestUrl(request) {
		let protocol = (request.ensureHttps || this.alwaysUseHttps) ? 'https' : 'http';
		let reqUrl = request.path + this._encodeRequestQueryParams(request);
		let signedUrl = this._signUrl(reqUrl);
		return protocol + '://' + this.baseUri + signedUrl;
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