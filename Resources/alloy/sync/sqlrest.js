function Migrator(config, transactionDb) {
    this.db = transactionDb;
    this.dbname = config.adapter.db_name;
    this.table = config.adapter.collection_name;
    this.idAttribute = config.adapter.idAttribute;
    this.column = function(name) {
        var parts = name.split(/\s+/), type = parts[0];
        switch (type.toLowerCase()) {
          case "string":
          case "varchar":
          case "date":
          case "datetime":
            Ti.API.warn("\"" + type + "\" is not a valid sqlite field, using TEXT instead");
          case "text":
            type = "TEXT";
            break;
          case "int":
          case "tinyint":
          case "smallint":
          case "bigint":
          case "boolean":
            Ti.API.warn("\"" + type + "\" is not a valid sqlite field, using INTEGER instead");
          case "integer":
            type = "INTEGER";
            break;
          case "double":
          case "float":
          case "decimal":
          case "number":
            Ti.API.warn("\"" + name + "\" is not a valid sqlite field, using REAL instead");
          case "real":
            type = "REAL";
            break;
          case "blob":
            type = "BLOB";
            break;
          case "null":
            type = "NULL";
            break;
          default:
            type = "TEXT";
        }
        parts[0] = type;
        return parts.join(" ");
    };
    this.createTable = function(config) {
        var columns = [], found = !1;
        for (var k in config.columns) {
            k === this.idAttribute && (found = !0);
            columns.push(k + " " + this.column(config.columns[k]));
        }
        !found && this.idAttribute === ALLOY_ID_DEFAULT && columns.push(ALLOY_ID_DEFAULT + " TEXT");
        var sql = "CREATE TABLE IF NOT EXISTS " + this.table + " ( " + columns.join(",") + ")";
        this.db.execute(sql);
    };
    this.dropTable = function(config) {
        this.db.execute("DROP TABLE IF EXISTS " + this.table);
    };
    this.insertRow = function(columnValues) {
        var columns = [], values = [], qs = [], found = !1;
        for (var key in columnValues) {
            key === this.idAttribute && (found = !0);
            columns.push(key);
            values.push(columnValues[key]);
            qs.push("?");
        }
        if (!found && this.idAttribute === ALLOY_ID_DEFAULT) {
            columns.push(this.idAttribute);
            values.push(util.guid());
            qs.push("?");
        }
        this.db.execute("INSERT INTO " + this.table + " (" + columns.join(",") + ") VALUES (" + qs.join(",") + ");", values);
    };
    this.deleteRow = function(columns) {
        var sql = "DELETE FROM " + this.table, keys = _.keys(columns), len = keys.length, conditions = [], values = [];
        len && (sql += " WHERE ");
        for (var i = 0; i < len; i++) {
            conditions.push(keys[i] + " = ?");
            values.push(columns[keys[i]]);
        }
        sql += conditions.join(" AND ");
        this.db.execute(sql, values);
    };
}

function apiCall(_options, _callback) {
    if (Ti.Network.online && _.isUndefined(_options.localOnly)) {
        var xhr = Ti.Network.createHTTPClient({
            timeout: _options.timeout || 5000
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
            Ti.API.error("[SQL REST API] apiCall ERROR: " + xhr.responseText);
        };
        for (var header in _options.headers) {
            Ti.API.debug("TF test. Show header: " + _options.headers[header]);
            xhr.setRequestHeader(header, _options.headers[header]);
        }
        _options.beforeSend && _options.beforeSend(xhr);
        xhr.send(_options.data || null);
    } else {
        _callback({
            success: !1,
            responseText: ""
        });
        Ti.API.debug("[SQL REST API] apiCall: Offline / Local Mode");
    }
}

function Sync(model, method, opts) {
    function createSQL(data) {
        var attrObj = {};
        if (DEBUG) {
            Ti.API.debug("[SQL REST API] createSQL data:");
            Ti.API.debug(data);
        }
        data ? attrObj = data : _.isUndefined(model.models) ? attrObj = model.toJSON() : Ti.API.error("[SQL REST API] Its a collection - error !");
        if (!attrObj[model.idAttribute]) if (model.idAttribute === ALLOY_ID_DEFAULT) {
            attrObj.id = util.guid();
            attrObj[model.idAttribute] = model.id;
        } else attrObj[model.idAttribute] = null;
        var names = [], values = [], q = [];
        for (var k in columns) {
            names.push(k);
            _.isObject(attrObj[k]) ? values.push(JSON.stringify(attrObj[k])) : values.push(attrObj[k]);
            q.push("?");
        }
        var sqlInsert = "INSERT INTO " + table + " (" + names.join(",") + ") VALUES (" + q.join(",") + ");";
        db = Ti.Database.open(dbName);
        db.execute("BEGIN;");
        db.execute(sqlInsert, values);
        if (model.id === null) {
            var sqlId = "SELECT last_insert_rowid();", rs = db.execute(sqlId);
            if (rs.isValidRow()) {
                model.id = rs.field(0);
                attrObj[model.idAttribute] = model.id;
            } else Ti.API.warn("Unable to get ID from database for model: " + model.toJSON());
        }
        db.execute("COMMIT;");
        db.close();
        return attrObj;
    }
    function readSQL() {
        DEBUG && Ti.API.debug("[SQL REST API] readSQL");
        var sql = opts.query || "SELECT * FROM " + table;
        db = Ti.Database.open(dbName);
        if (opts.query) var rs = db.execute(opts.query.sql, opts.query.params); else {
            var sql = _buildQuery(table, opts.data || opts);
            DEBUG && Ti.API.debug("[SQL REST API] SQL QUERY: " + sql);
            var rs = db.execute(sql);
        }
        var len = 0, values = [];
        while (rs.isValidRow()) {
            var o = {}, fc = 0;
            fc = _.isFunction(rs.fieldCount) ? rs.fieldCount() : rs.fieldCount;
            _.times(fc, function(c) {
                var fn = rs.fieldName(c);
                o[fn] = rs.fieldByName(fn);
            });
            values.push(o);
            var m = new model.config.Model(o);
            model.models.push(m);
            len++;
            rs.next();
        }
        rs.close();
        db.close();
        model.length = len;
        DEBUG && Ti.API.debug("readSQL length: " + len);
        return len === 1 ? resp = values[0] : resp = values;
    }
    function updateSQL(data) {
        var attrObj = {};
        if (DEBUG) {
            Ti.API.debug("updateSQL data:");
            Ti.API.debug(data);
        }
        data ? attrObj = data : _.isUndefined(model.models) ? attrObj = model.toJSON() : Ti.API.error("Its a collection - error!");
        var names = [], values = [], q = [];
        for (var k in columns) {
            names.push(k + "=?");
            _.isObject(attrObj[k]) ? values.push(JSON.stringify(attrObj[k])) : values.push(attrObj[k]);
            q.push("?");
        }
        var sql = "UPDATE " + table + " SET " + names.join(",") + " WHERE " + model.idAttribute + "=?";
        values.push(attrObj[model.idAttribute]);
        db = Ti.Database.open(dbName);
        db.execute(sql, values);
        db.close();
        return attrObj;
    }
    function deleteSQL(id) {
        var sql = "DELETE FROM " + table + " WHERE " + model.idAttribute + "=?";
        db = Ti.Database.open(dbName);
        db.execute(sql, id || model.id);
        db.close();
        model.id = null;
        return model.toJSON();
    }
    function sqlCurrentModels() {
        var sql = "SELECT " + model.idAttribute + " FROM " + table;
        db = Ti.Database.open(dbName);
        var rs = db.execute(sql), output = [];
        while (rs.isValidRow()) {
            output.push(rs.fieldByName(model.idAttribute));
            rs.next();
        }
        rs.close();
        db.close();
        return output;
    }
    function sqlFindItem(_id) {
        var sql = "SELECT " + model.idAttribute + " FROM " + table + " WHERE " + model.idAttribute + "=?";
        db = Ti.Database.open(dbName);
        var rs = db.execute(sql, _id), output = [];
        while (rs.isValidRow()) {
            output.push(rs.fieldByName(model.idAttribute));
            rs.next();
        }
        rs.close();
        db.close();
        return output;
    }
    var table = model.config.adapter.collection_name, columns = model.config.columns, dbName = model.config.adapter.db_name || ALLOY_DB_DEFAULT, resp = null, db;
    model.idAttribute = model.config.adapter.idAttribute;
    var DEBUG = model.config.debug, methodMap = {
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
            Ti.API.error("[SQL REST API] ERROR: NO BASE URL");
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
    DEBUG && Ti.API.debug("[SQL REST API] REST METHOD: " + method);
    switch (method) {
      case "create":
        params.data = JSON.stringify(model.toJSON());
        if (DEBUG) {
            Ti.API.info("[SQL REST API] options: ");
            Ti.API.info(params);
        }
        apiCall(params, function(_response) {
            if (_response.success) {
                var data = JSON.parse(_response.responseText);
                resp = createSQL(data);
                _.isFunction(params.success) && params.success(resp);
            } else {
                resp = createSQL();
                _.isFunction(params.error) && params.error(resp);
            }
        });
        break;
      case "read":
        model.id && (params.url = params.url + "/" + model.id);
        params.urlparams && (params.url += "?" + encodeData(params.urlparams));
        if (DEBUG) {
            Ti.API.info("[SQL REST API] options: ");
            Ti.API.info(params);
        }
        apiCall(params, function(_response) {
            if (_response.success) {
                var data = JSON.parse(_response.responseText), currentModels = sqlCurrentModels();
                for (var i in data) data[i].is_deleted ? deleteSQL(data[i][model.idAttribute]) : _.indexOf(currentModels, Number(data[i][model.idAttribute])) != -1 ? updateSQL(data[i]) : createSQL(data[i]);
                resp = readSQL();
                _.isFunction(params.success) && params.success(resp);
                model.trigger("fetch");
            } else {
                resp = readSQL();
                _.isFunction(params.error) && params.error(resp);
            }
        });
        break;
      case "update":
        if (!model.id) {
            params.error(null, "MISSING MODEL ID");
            Ti.API.error("[SQL REST API] ERROR: MISSING MODEL ID");
            return;
        }
        params.url = params.url + "/" + model.id;
        params.data = JSON.stringify(model.toJSON());
        if (DEBUG) {
            Ti.API.info("[SQL REST API] options: ");
            Ti.API.info(params);
        }
        apiCall(params, function(_response) {
            if (_response.success) {
                var data = JSON.parse(_response.responseText), currentModels = sqlCurrentModels();
                _.indexOf(currentModels, Number(data[model.idAttribute])) != -1 ? resp = updateSQL(data) : resp = createSQL(data);
                _.isFunction(params.success) && params.success(resp);
            } else {
                var currentModels = sqlCurrentModels();
                _.indexOf(currentModels, Number(model.id)) != -1 ? resp = updateSQL() : resp = createSQL();
                _.isFunction(params.error) && params.error(resp);
            }
        });
        break;
      case "delete":
        if (!model.id) {
            params.error(null, "MISSING MODEL ID");
            Ti.API.error("[SQL REST API] ERROR: MISSING MODEL ID");
            return;
        }
        params.url = params.url + "/" + model.id;
        if (DEBUG) {
            Ti.API.info("[SQL REST API] options: ");
            Ti.API.info(params);
        }
        apiCall(params, function(_response) {
            if (_response.success) {
                var data = JSON.parse(_response.responseText);
                resp = deleteSQL();
                _.isFunction(params.success) && params.success(resp);
            } else {
                resp = deleteSQL();
                _.isFunction(params.error) && params.error(resp);
            }
        });
    }
}

function _valueType(value) {
    return typeof value == "string" ? "'" + value + "'" : typeof value == "boolean" ? value ? 1 : 0 : value;
}

function _buildQuery(table, opts) {
    var sql = "SELECT * ";
    if (opts.select) {
        sql = "SELECT ";
        typeof opts.select == "array" ? sql += opts.select.join(", ") : sql += opts.select;
    }
    sql += "FROM " + table;
    if (opts.where) {
        var where;
        if (typeof opts.where == "object") {
            where = [];
            _.each(opts.where, function(v, f) {
                where.push(f + " = " + _valueType(v));
            });
            where = where.join(" AND ");
        } else typeof opts.where == "array" ? where = opts.where.join(" AND ") : where = opts.where;
        sql += " WHERE " + where;
    } else sql += " WHERE 1=1";
    if (opts.orderBy) {
        var order;
        typeof opts.orderBy == "array" ? order = opts.orderBy.join(", ") : order = opts.orderBy;
        sql += " ORDER BY " + order;
    }
    if (opts.limit) {
        sql += " LIMIT " + opts.limit;
        opts.offset && (sql += " OFFSET " + opts.offset);
    }
    opts.union && (sql += " UNION " + _buildQuery(opts.union));
    opts.unionAll && (sql += " UNION ALL " + _buildQuery(opts.unionAll));
    opts.intersect && (sql += " INTERSECT " + _buildQuery(opts.intersect));
    opts.except && (sql += " EXCEPT " + _buildQuery(opts.EXCEPT));
    if (opts.like) {
        var like;
        if (typeof opts.like == "object") {
            like = [];
            _.each(opts.like, function(value, f) {
                like.push(f + " LIKE \"%" + value + "%\"");
            });
            like = like.join(" AND ");
            sql += " AND " + like;
        }
    }
    if (opts.likeor) {
        var likeor;
        if (typeof opts.likeor == "object") {
            likeor = [];
            _.each(opts.likeor, function(value, f) {
                likeor.push(f + " LIKE \"%" + value + "%\"");
            });
            likeor = likeor.join(" OR ");
            sql += " AND " + likeor;
        }
    }
    return sql;
}

function GetMigrationFor(dbname, table) {
    var mid = null, db = Ti.Database.open(dbname);
    db.execute("CREATE TABLE IF NOT EXISTS migrations (latest TEXT, model TEXT);");
    var rs = db.execute("SELECT latest FROM migrations where model = ?;", table);
    if (rs.isValidRow()) var mid = rs.field(0) + "";
    rs.close();
    db.close();
    return mid;
}

function Migrate(Model) {
    var migrations = Model.migrations || [], lastMigration = {};
    migrations.length && migrations[migrations.length - 1](lastMigration);
    var config = Model.prototype.config;
    config.adapter.db_name || (config.adapter.db_name = ALLOY_DB_DEFAULT);
    var migrator = new Migrator(config), targetNumber = typeof config.adapter.migration == "undefined" || config.adapter.migration === null ? lastMigration.id : config.adapter.migration;
    if (typeof targetNumber == "undefined" || targetNumber === null) {
        var tmpDb = Ti.Database.open(config.adapter.db_name);
        migrator.db = tmpDb;
        migrator.createTable(config);
        tmpDb.close();
        return;
    }
    targetNumber += "";
    var currentNumber = GetMigrationFor(config.adapter.db_name, config.adapter.collection_name), direction;
    if (currentNumber === targetNumber) return;
    if (currentNumber && currentNumber > targetNumber) {
        direction = 0;
        migrations.reverse();
    } else direction = 1;
    db = Ti.Database.open(config.adapter.db_name);
    migrator.db = db;
    db.execute("BEGIN;");
    if (migrations.length) for (var i = 0; i < migrations.length; i++) {
        var migration = migrations[i], context = {};
        migration(context);
        if (direction) {
            if (context.id > targetNumber) break;
            if (context.id <= currentNumber) continue;
        } else {
            if (context.id <= targetNumber) break;
            if (context.id > currentNumber) continue;
        }
        var funcName = direction ? "up" : "down";
        _.isFunction(context[funcName]) && context[funcName](migrator);
    } else migrator.createTable(config);
    db.execute("DELETE FROM migrations where model = ?", config.adapter.collection_name);
    db.execute("INSERT INTO migrations VALUES (?,?)", targetNumber, config.adapter.collection_name);
    db.execute("COMMIT;");
    db.close();
    migrator.db = null;
}

function installDatabase(config) {
    var dbFile = config.adapter.db_file, table = config.adapter.collection_name, rx = /^([\/]{0,1})([^\/]+)\.[^\/]+$/, match = dbFile.match(rx);
    if (match === null) throw "Invalid sql database filename \"" + dbFile + "\"";
    var dbName = config.adapter.db_name = match[2];
    Ti.API.debug("Installing sql database \"" + dbFile + "\" with name \"" + dbName + "\"");
    var db = Ti.Database.install(dbFile, dbName), rs = db.execute("pragma table_info(\"" + table + "\");"), columns = {};
    while (rs.isValidRow()) {
        var cName = rs.fieldByName("name"), cType = rs.fieldByName("type");
        columns[cName] = cType;
        cName === ALLOY_ID_DEFAULT && !config.adapter.idAttribute && (config.adapter.idAttribute = ALLOY_ID_DEFAULT);
        rs.next();
    }
    config.columns = columns;
    rs.close();
    if (config.adapter.idAttribute) {
        if (!_.contains(_.keys(config.columns), config.adapter.idAttribute)) throw "config.adapter.idAttribute \"" + config.adapter.idAttribute + "\" not found in list of columns for table \"" + table + "\"\n" + "columns: [" + _.keys(config.columns).join(",") + "]";
    } else {
        Ti.API.info("No config.adapter.idAttribute specified for table \"" + table + "\"");
        Ti.API.info("Adding \"" + ALLOY_ID_DEFAULT + "\" to uniquely identify rows");
        db.execute("ALTER TABLE " + table + " ADD " + ALLOY_ID_DEFAULT + " TEXT;");
        config.columns[ALLOY_ID_DEFAULT] = "TEXT";
        config.adapter.idAttribute = ALLOY_ID_DEFAULT;
    }
    db.close();
}

var _ = require("alloy/underscore")._, util = require("alloy/sync/util"), Alloy = require("alloy"), Backbone = Alloy.Backbone, ALLOY_DB_DEFAULT = "_alloy_", ALLOY_ID_DEFAULT = "alloy_id", cache = {
    config: {},
    Model: {},
    URL: null
}, encodeData = function(obj) {
    var str = [];
    for (var p in obj) str.push(Ti.Network.encodeURIComponent(p) + "=" + Ti.Network.encodeURIComponent(obj[p]));
    return str.join("&");
};

module.exports.beforeModelCreate = function(config, name) {
    if (cache.config[name]) return cache.config[name];
    if (Ti.Platform.osname === "mobileweb" || typeof Ti.Database == "undefined") throw "No support for Titanium.Database in MobileWeb environment.";
    config.adapter.db_file && installDatabase(config);
    if (!config.adapter.idAttribute) {
        Ti.API.info("No config.adapter.idAttribute specified for table \"" + config.adapter.collection_name + "\"");
        Ti.API.info("Adding \"" + ALLOY_ID_DEFAULT + "\" to uniquely identify rows");
        config.columns[ALLOY_ID_DEFAULT] = "TEXT";
        config.adapter.idAttribute = ALLOY_ID_DEFAULT;
    }
    cache.config[name] = config;
    return config;
};

module.exports.afterModelCreate = function(Model, name) {
    if (cache.Model[name]) return cache.Model[name];
    Model || (Model = {});
    Model.prototype.config.Model = Model;
    Model.prototype.idAttribute = Model.prototype.config.adapter.idAttribute;
    Migrate(Model);
    cache.Model[name] = Model;
    return Model;
};

module.exports.sync = Sync;