function InitAdapter(config) {
    return {};
}

function apiCall(_options, _callback) {
    var xhr = Ti.Network.createHTTPClient({
        timeout: 5000
    });
    xhr.open(_options.type, _options.url);
    xhr.onload = function() {
        _callback({
            success: !0,
            responseText: xhr.responseText || null,
            responseData: xhr.responseData || null
        });
    };
    xhr.onerror = function() {
        _callback({
            success: !1,
            responseText: xhr.responseText
        });
        Ti.API.error("[REST API] apiCall ERROR: " + xhr.responseText);
    };
    for (var header in _options.headers) xhr.setRequestHeader(header, _options.headers[header]);
    _options.beforeSend && _options.beforeSend(xhr);
    xhr.send(_options.data || null);
}

function Sync(method, model, opts) {
    var methodMap = {
        create: "POST",
        read: "GET",
        update: "PUT",
        "delete": "DELETE"
    }, type = methodMap[method], params = _.extend({}, opts);
    params.type = type;
    params.headers = params.headers || {};
    if (!params.url) {
        params.url = model.url();
        if (!params.url) {
            Ti.API.error("[REST API] ERROR: NO BASE URL");
            return;
        }
    }
    if (Alloy.Backbone.emulateJSON) {
        params.contentType = "application/x-www-form-urlencoded";
        params.processData = !0;
        params.data = params.data ? {
            model: params.data
        } : {};
    }
    if (Alloy.Backbone.emulateHTTP) if (type === "PUT" || type === "DELETE") {
        Alloy.Backbone.emulateJSON && (params.data._method = type);
        params.type = "POST";
        params.beforeSend = function(xhr) {
            params.headers["X-HTTP-Method-Override"] = type;
        };
    }
    params.headers["Content-Type"] = "application/json";
    params.headers.Accept = "application/json";
    switch (method) {
      case "delete":
        if (!model.id) {
            params.error(null, "MISSING MODEL ID");
            Ti.API.error("[REST API] ERROR: MISSING MODEL ID");
            return;
        }
        params.url = params.url + "/" + model.id;
        apiCall(params, function(_response) {
            if (_response.success) {
                var data = JSON.parse(_response.responseText);
                params.success(null, _response.responseText);
                model.trigger("fetch");
            } else {
                params.error(JSON.parse(_response.responseText), _response.responseText);
                Ti.API.error("SYNC ERROR: " + _response.responseText);
            }
        });
        break;
      case "create":
        params.data = JSON.stringify(model.toJSON());
        apiCall(params, function(_response) {
            if (_response.success) {
                var data = JSON.parse(_response.responseText);
                data.id == undefined && (data.id = guid());
                params.success(data, JSON.stringify(data));
                model.trigger("fetch");
            } else {
                params.error(JSON.parse(_response.responseText), _response.responseText);
                Ti.API.error("[REST API] ERROR: " + _response.responseText);
            }
        });
        break;
      case "update":
        if (!model.id) {
            params.error(null, "MISSING MODEL ID");
            Ti.API.error("[REST API] ERROR: MISSING MODEL ID");
            return;
        }
        params.url = params.url + "/" + model.id;
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
      case "read":
        apiCall(params, function(_response) {
            if (_response.success) {
                var data = JSON.parse(_response.responseText);
                params.success(data, _response.responseText);
            } else {
                params.error(JSON.parse(_response.responseText), _response.responseText);
                Ti.API.error("[REST API] ERROR: " + _response.responseText);
            }
        });
    }
}

var _ = require("alloy/underscore")._;

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