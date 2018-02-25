/*eslint-disable no-console*/
// import { hardReset } from '../utilities/reset';
import { ActionTypes } from '../constants';

function RefreshError() {
	this.number = 500;
	this.name = 'RefreshError';
	this.message = 'Faliure to refresh access token';
	this.stack = (new Error()).stack;
}

RefreshError.prototype = Object.create(Error.prototype);
RefreshError.prototype.constructor = RefreshError;

function Api() {

	// The value for globalUri should be set before using Reesource.fetch
	var _globalUri = 'http://localhost:4000/';
	var _refreshCallbacks = [];
	var _refreshInProgress = false;
	var _accessToken = '8d6ce5eadf14a253a48ac6c851295fe19d1ae189';
	var _refreshToken = '';
	var _scope = 'public read:user write:user read:portfolio write:portfolio read:affiliate write:affiliate offline notifications';
	var _store = null;

	function _queryStringFromObject(api, data) {
		var queryString = Object.keys(data)
			.map(function (key) {
				return key + '=' + encodeURIComponent(data[key]);
			})
			.join('&');

		queryString = (api && queryString) ? '?' + queryString : (queryString ? queryString : '');

		return api ? (_globalUri + api + queryString) : queryString;
	}

	function _queryUri(api) {
		return _globalUri + api;
	}


	function _defaultOptions(endPoint, options) {
		var defaultOptions = options || {};
		defaultOptions.api = endPoint;
		defaultOptions.method = defaultOptions.method || 'get';
		defaultOptions.data = defaultOptions.data || {};
		return defaultOptions;
	}

	/**
	* Convenience method for fetch requests
	* @param {Object} options 
	* @return {Object} promise
	*/
	function _fetch(options) {
		if (!_globalUri) throw new Error('Please set a global uri via setGlobalUri.');
		var params = {
			method: '',
			headers: {
				'Accept': 'application/vnd.localhost.v2',
			}
		};

		params.method = options.method;
		if (options.type === 'json') {
			params.headers['Content-Type'] = 'application/json';
		}

		if (options.authorization) {
			params.headers['Authorization'] = 'Bearer ' + _accessToken;
		}

		if (options.api) {
			switch (options.method) {
				case 'post':
				case 'put':
				case 'delete':
					params.method = options.method;
					if (options.type !== 'json') {
						params.headers['Content-Type'] = 'application/x-www-form-urlencoded';
						params.body = _queryStringFromObject(null, options.data);
					} else {
						params.body = JSON.stringify(options.data);
					}
					return fetch(_queryUri(options.api), params);
				default:    //should serve for get
					return fetch(_queryStringFromObject(options.api, options.data), {
						method: params.method, headers: params.headers
					});
			}
		} else {
			console.log('Please atleast provide an api endpoint for fetch to work.');
		}
	}

	function _filterResponse(response) {
		try {
			if (
				(response.headers.get('content-type') === 'application/json')
				&& (response.statusText !== 'No Content')
			) {
				return response.json();
			} else {
				return response;
			}
		} catch (e) {
			return response;
		}
	}

	function _tokenExpired(response) {
		if (_refreshToken) {
			switch (response.status) {
				case 401:
				case 403:
					return true;
				default:
					return false;
			}
		} else {
			return false;
		}
	}

	function _tokenRefreshFlow(options) {
		var _newPromise = new Promise(function (resolve, reject) {
			_refreshCallbacks.push(function (success) {
				if (success) {
					return _fetch(options)
						.then(function (response) {
							return resolve(response.json());
						}).catch(function (err) {
							return reject(err);
						});
				} else {
					// hardReset();
					return reject(new RefreshError());
				}
			});
		});
		_refresh();
		return _newPromise;
	}

	/**
	 * Do not expect any return value from this method
	 * It is only suppose to refresh the token and
	 * execute the waiting callbacks.
	 * @returns do not expect even though there is a returning promise
	 */
	function _refresh() {
		if (!_refreshInProgress) {
			_refreshInProgress = true;
			var options = _defaultOptions('oauth/token', {
				data: {
					refresh_token: _refreshToken,
					grant_type: 'refresh_token',
					client_id: '90989a0528ad4b238480f1ac0f5855e5',
					scope: _scope
				}
			});
			options.type = 'urlencoded';
			options.method = 'post';
			return _fetch(options)
				.then(function (result) {
					if (result.ok) {
						_filterResponse(result)
							.then(function (result) {
								_accessToken = result.access_token;
								_refreshToken = result.refresh_token;
								if (_store && _store.dispatch) {
									// redux store needs updated auth tokens
									_store.dispatch({
										type: ActionTypes.REAUTH,
										payLoad: result
									});
								}
								// callbacks will be successful
								var promiseList =
									_refreshCallbacks.map(function (cb) {
										return cb(true);
									});
								return Promise
									.all(promiseList)
									.then(function () {
										_refreshCallbacks = [];
										_refreshInProgress = false;
										return Promise.resolve(true);
									}).catch(function () {
										_refreshCallbacks = [];
										_refreshInProgress = false;
										return Promise.reject(false);
									});
							});
					} else {
						//cannot sucessfully do callbacks
						_refreshCallbacks.map(function (cb) {
							return cb(false);
						});
					}
				});
		}
	}

	return {
		isAuthenticated: function () {
			return (_accessToken && _refreshToken);
		},

		setAccessToken: function (token) {
			console.log('accessTokenSet:', token);
			_accessToken = token;
		},

		setRefreshToken: function (token) {
			console.log('refreshTokenSet:', token);
			_refreshToken = token;
		},

		getAccessToken: function () {
			return _accessToken;
		},

		getRefreshToken: function () {
			return _refreshToken;
		},

		setStore: function (store) {
			_store = store;
		},

		/**
		 * GlobalUri setter method for fetch requests
		 * @return {string} uri 
		 */
		setGlobalUri: function (uri) {
			_globalUri = uri;
		},

		/**
		 * 
		 * 
		 * @param {string} endPoint string
		 * @param {object} options object
		 * @return {Object} promise
		 */
		getHTML: function (endPoint, options) {
			options = _defaultOptions(endPoint, options);
			return _fetch(options)
				.then(function (result) {
					return (
						_tokenExpired(result) ?
							_tokenRefreshFlow(options)
							: (result.ok ? result.text() : result)
					);
				});
		},

		/**
		 * send get request of type JSON
		 * 
		 * @param {string} endPoint string
		 * @param {object} options object
		 * @return {Object} promise
		*/
		getJSON: function (endPoint, options) {
			options = _defaultOptions(endPoint, options);
			options.type = 'json';
			return _fetch(options)
				.then(function (result) {
					return (
						_tokenExpired(result) ?
							_tokenRefreshFlow(options)
							: (result.ok ? result.json() : result)
					);
				});
		},

		/**
		 * send post request of type JSON
		 * 
		 * @param {string} endPoint string
		 * @param {object} options object
		 * @return {Object} promise
		 */
		postJSON: function (endPoint, options) {
			options = _defaultOptions(endPoint, options);
			options.type = 'json';
			options.method = 'post';
			return _fetch(options)
				.then(function (result) {
					return (
						_tokenExpired(result) ?
							_tokenRefreshFlow(options)
							: _filterResponse(result)
					);
				});
		},

		/**
		 * send delete request of type JSON
		 * 
		 * @param {string} endPoint string
		 * @param {object} options object
		 * @return {Object} promise
		 */
		deleteJSON: function (endPoint, options) {
			options = _defaultOptions(endPoint, options);
			options.type = 'json';
			options.method = 'delete';
			return _fetch(options)
				.then(function (result) {
					return (
						_tokenExpired(result) ?
							_tokenRefreshFlow(options)
							: (result.ok ? _filterResponse(result) : result)
					);
				});
		},

		/**
		 * send post request of type form
		 * 
		 * @param {string} endPoint string
		 * @param {object} options object
		 * @return {Object} promise
		 */
		postForm: function (endPoint, options) {
			options = _defaultOptions(endPoint, options);
			options.type = 'urlencoded';
			options.method = 'post';
			return _fetch(options)
				.then(function (result) {
					return (
						_tokenExpired(result) ?
							_tokenRefreshFlow(options)
							// : (result.ok ? _sendJson(result) : result)
							: _filterResponse(result)
					);
				});
		},

		/**
		 * send delete request of type form
		 * 
		 * @param {string} endPoint string
		 * @param {object} options object
		 * @return {Object} promise
		 */
		deleteForm: function (endPoint, options) {
			options = _defaultOptions(endPoint, options);
			options.type = 'urlencoded';
			options.method = 'delete';
			return _fetch(options)
				.then(function (result) {
					return (
						_tokenExpired(result) ?
							_tokenRefreshFlow(options)
							: _filterResponse(result)
					);
				});
		}
	};
}

export default Api();
