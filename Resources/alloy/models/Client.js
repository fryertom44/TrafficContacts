exports.definition = {
    config: {
        URL: "https://api.sohnar.com/TrafficLiteServer/openapi/crm/client",
        adapter: {
            type: "restapi2",
            collection_name: "client",
            idAttribute: "id"
        },
        columns: {
            id: "int",
            name: "string"
        }
    },
    extendModel: function(Model) {
        _.extend(Model.prototype, {
            url: function() {
                return "https://api.sohnar.com/TrafficLiteServer/openapi/crm/client/" + this.id;
            },
            parse: function(_resp, xhr) {
                debugger;
                return _resp;
            }
        });
        return Model;
    },
    extendCollection: function(Collection) {
        _.extend(Collection.prototype, {
            url: function() {
                return "https://api.sohnar.com/TrafficLiteServer/openapi/crm/client";
            },
            parse: function(_resp, xhr) {
                debugger;
                return _resp.resultList;
            }
        });
        return Collection;
    }
};

var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

model = Alloy.M("Client", exports.definition, []);

collection = Alloy.C("Client", exports.definition, model);

exports.Model = model;

exports.Collection = collection;