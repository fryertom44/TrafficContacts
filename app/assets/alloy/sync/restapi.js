/**
 * Rest API Adapter for Titanium Alloy
 * @author Mads Møller
 * @version 1.0.3
 * Copyright Napp ApS
 * www.napp.dk
 */

function S4() {
	return ((1 + Math.random()) * 65536 | 0).toString(16).substring(1);
}

function guid() {
	return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
}

function InitAdapter(config) {
	return {};
}

function apiCall(_options, _callback) {
		//TESTING TF
			Ti.API.debug('TF test. Show header: ' + _options.headers);

	Ti.API.debug("[REST API] apiCall ", _options);
	var xhr = Ti.Network.createHTTPClient({
		timeout : 5000
	});

	//Prepare the request
	xhr.open(_options.type, _options.url);

	xhr.onload = function() {
		Ti.API.debug("TF TEST - loaded OK");
		_callback({
			success : true,
			responseText : xhr.responseText || null,
			responseData : xhr.responseData || null
		});
	};

	//Handle error
	xhr.onerror = function() {
		Ti.API.debug("TF TEST - error attempting to load URL");
		_callback({
			success : false,
			responseText : xhr.responseText
		});
		Ti.API.error('[REST API] apiCall ERROR: ' + xhr.responseText)
	}









		//TESTING TF
var user = "fryertom@gmail.com";
	  var pass = "MR6gFeqG585J5SVZ7Lnv128wHhT2EBgjl5C7F2i2";
	  var token = user.concat(":", pass);
	  // xhr.setRequestHeader('Authorization', ("Basic ".concat(Ti.Utils.base64encode(token))));
	  xhr.setRequestHeader('Authorization', "Basic ZnJ5ZXJ0b21AZ21haWwuY29tOk1SNmdGZXFHNTg1SjVTVlo3TG52MTI4d0hoVDJFQmdqbDVDN0YyaTI=");



	for (var header in _options.headers) {
		//TESTING TF
		Ti.API.debug('TF test. Show header: ' + _options.headers[header]);
		xhr.setRequestHeader(header, _options.headers[header]);
	}








	if (_options.beforeSend) {
		_options.beforeSend(xhr);
	}

	Ti.API.debug("[REST API] Content-type ", _options.headers['Content-type']);
	xhr.send(_options.data || null);
}

function Sync(model, method, opts) {
	var methodMap = {
		'create' : 'POST',
		'read' : 'GET',
		'update' : 'PUT',
		'delete' : 'DELETE'
	};

	var type = methodMap[method];
	var params = _.extend({}, opts);
	params.type = type;

	//set default headers
	params.headers = params.headers || {};

	// We need to ensure that we have a base url.
	if (!params.url) {
		params.url = (model.config.URL || model.url());
		if (!params.url) {
			Ti.API.error("[REST API] ERROR: NO BASE URL");
			return;
		}
	}

	// For older servers, emulate JSON by encoding the request into an HTML-form.
	if (Alloy.Backbone.emulateJSON) {
		params.contentType = 'application/x-www-form-urlencoded';
		params.processData = true;
		params.data = params.data ? {
			model : params.data
		} : {};
	}

	// For older servers, emulate HTTP by mimicking the HTTP method with `_method`
	// And an `X-HTTP-Method-Override` header.
	if (Alloy.Backbone.emulateHTTP) {
		if (type === 'PUT' || type === 'DELETE') {
			if (Alloy.Backbone.emulateJSON)
				params.data._method = type;
			params.type = 'POST';
			params.beforeSend = function(xhr) {
				params.headers['X-HTTP-Method-Override'] = type
			};
		}
	}

	//json data transfers
	params.headers['Content-Type'] = 'application/json';
    params.headers['Accept'] = 'application/json';

	//TESTING TF
	params.headers['Authorization'] = "Basic ZnJ5ZXJ0b21AZ21haWwuY29tOk1SNmdGZXFHNTg1SjVTVlo3TG52MTI4d0hoVDJFQmdqbDVDN0YyaTI=";

	// params.headers['Authorization'] = function(xhr) {
		// var user = "fryertom@gmail.com";
		// var pass = "MR6gFeqG585J5SVZ7Lnv128wHhT2EBgjl5C7F2i2";
		// var token = user.concat(":", pass);
		// return "Basic ".concat(Ti.Utils.base64encode(token));
	// }
	switch(method) {

		case 'delete' :
			if (!model.id) {
				params.error(null, "MISSING MODEL ID");
				Ti.API.error("[REST API] ERROR: MISSING MODEL ID");
				return;
			}
			params.url = params.url + '/' + model.id;

			apiCall(params, function(_response) {
				if (_response.success) {
					Ti.API.debug("TF test - about to parse response...");
					var data = JSON.parse(_response.responseText);
					params.success(null, _response.responseText);
					model.trigger("fetch");
					// fire event
				} else {
					params.error(JSON.parse(_response.responseText), _response.responseText);
					Ti.API.error('SYNC ERROR: ' + _response.responseText)
				}
			});
			break;
		case 'create' :
			// convert to string for API call
			params.data = JSON.stringify(model.toJSON());

			apiCall(params, function(_response) {
				if (_response.success) {
					var data = JSON.parse(_response.responseText);
					//Rest API should return a new model id.
					if (data.id == undefined) {
						data.id = guid();
						//if not - create one
					}
					params.success(data, JSON.stringify(data));
					model.trigger("fetch");
					// fire event
				} else {
					params.error(JSON.parse(_response.responseText), _response.responseText);
					Ti.API.error('[REST API] ERROR: ' + _response.responseText)
				}
			});
			break;
		case 'update' :
			if (!model.id) {
				params.error(null, "MISSING MODEL ID");
				Ti.API.error("[REST API] ERROR: MISSING MODEL ID");
				return;
			}

			// setup the url & data
			params.url = params.url + '/' + model.id;
			params.data = JSON.stringify(model.toJSON());

			apiCall(params, function(_response) {
				if (_response.success) {
					var data = JSON.parse(_response.responseText);
					params.success(data, JSON.stringify(data));
					model.trigger("fetch");
				} else {
					params.error(JSON.parse(_response.responseText), _response.responseText);
					Ti.API.error("[REST API] ERROR: " + _response.responseText);
				}
			});
			break;

		case 'read':
			if (model.id) {
				params.url = params.url + '/' + model.id;
			}

			if (params.urlparams) {
				params.url += "?" + encodeData(params.urlparams);
			}

			apiCall(params, function(_response) {
				if (_response.success) {
					var data = JSON.parse(_response.responseText);
					var values = [];
					model.length = 0;
					for (var i in data) {
						var item = {};
						item = data[i];
						if (item.id == undefined) {
							item.id = guid();
						}
						values.push(item);
						model.length++;
					}

					params.success((model.length === 1) ? values[0] : values, _response.responseText);
					model.trigger("fetch");
				} else {
					params.error(JSON.parse(_response.responseText), _response.responseText);
					Ti.API.error('[REST API] ERROR: ' + _response.responseText)
				}
			})
			break;
	}

};

var encodeData = function(obj) {
	var str = [];
	for (var p in obj)
	str.push(Ti.Network.encodeURIComponent(p) + "=" + Ti.Network.encodeURIComponent(obj[p]));
	return str.join("&");
}
//we need underscore
var _ = require("alloy/underscore")._;

//until this issue is fixed: https://jira.appcelerator.org/browse/TIMOB-11752
var Alloy = require("alloy"), Backbone = Alloy.Backbone;

module.exports.sync = Sync;

module.exports.beforeModelCreate = function(config) {
	config = config || {};
	InitAdapter(config);
	return config;
};

module.exports.afterModelCreate = function(Model) {
	Model = Model || {};
	Model.prototype.config.Model = Model;
	return Model;
};
