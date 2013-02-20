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
    Ti.API.debug("TF test. Show header: " + _options.headers);
    Ti.API.debug("[REST API] apiCall ", _options);
    var xhr = Ti.Network.createHTTPClient({
        timeout: 5000
    });
    xhr.open(_options.type, _options.url);
    xhr.onload = function() {
        Ti.API.debug("TF TEST - loaded OK");
        _callback({
            success: !0,
            responseText: xhr.responseText || null,
            responseData: xhr.responseData || null
        });
    };
    xhr.onerror = function() {
        Ti.API.debug("TF TEST - error attempting to load URL");
        _callback({
            success: !1,
            responseText: xhr.responseText
        });
        Ti.API.error("[REST API] apiCall ERROR: " + xhr.responseText);
    };
    var user = "fryertom@gmail.com", pass = "MR6gFeqG585J5SVZ7Lnv128wHhT2EBgjl5C7F2i2", token = user.concat(":", pass);
    xhr.setRequestHeader("Authorization", "Basic ZnJ5ZXJ0b21AZ21haWwuY29tOk1SNmdGZXFHNTg1SjVTVlo3TG52MTI4d0hoVDJFQmdqbDVDN0YyaTI=");
    for (var header in _options.headers) {
        Ti.API.debug("TF test. Show header: " + _options.headers[header]);
        xhr.setRequestHeader(header, _options.headers[header]);
    }
    _options.beforeSend && _options.beforeSend(xhr);
    Ti.API.debug("[REST API] Content-type ", _options.headers["Content-type"]);
    xhr.send(_options.data || null);
}

function Sync(model, method, opts) {
    var methodMap = {
        create: "POST",
        read: "GET",
        update: "PUT",
        "delete": "DELETE"
    }, type = methodMap[method], params = _.extend({}, opts);
    params.type = type;
    params.headers = params.headers || {};
    if (!params.url) {
        params.url = model.config.URL || model.url();
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
    params.headers.Authorization = "Basic ZnJ5ZXJ0b21AZ21haWwuY29tOk1SNmdGZXFHNTg1SjVTVlo3TG52MTI4d0hoVDJFQmdqbDVDN0YyaTI=";
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
                Ti.API.debug("TF test - about to parse response...");
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
        model.id && (params.url = params.url + "/" + model.id);
        params.urlparams && (params.url += "?" + encodeData(params.urlparams));
        apiCall(params, function(_response) {
            if (_response.success) {
                var data = JSON.parse(_response.responseText), values = [];
                model.length = 0;
                for (var i in data) {
                    var item = {};
                    item = data[i];
                    item.id == undefined && (item.id = guid());
                    values.push(item);
                    model.length++;
                }
                params.success(model.length === 1 ? values[0] : values, _response.responseText);
                model.trigger("fetch");
            } else {
                params.error(JSON.parse(_response.responseText), _response.responseText);
                Ti.API.error("[REST API] ERROR: " + _response.responseText);
            }
        });
    }
}

var encodeData = function(obj) {
    var str = [];
    for (var p in obj) str.push(Ti.Network.encodeURIComponent(p) + "=" + Ti.Network.encodeURIComponent(obj[p]));
    return str.join("&");
}, _ = require("alloy/underscore")._, Alloy = require("alloy"), Backbone = Alloy.Backbone;

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