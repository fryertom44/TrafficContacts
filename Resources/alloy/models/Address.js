exports.definition = {
    config: {
        adapter: {
            type: "restapi2",
            collection_name: "address",
            idAttribute: "id"
        },
        columns: {
            id: "int"
        }
    },
    extendModel: function(Model) {
        _.extend(Model.prototype, {
            url: function() {
                return "https://api.sohnar.com/TrafficLiteServer/openapi/crm/client/address/" + this.id;
            },
            parse: function(_resp, xhr) {
                return _resp.resultList;
            }
        });
        return Model;
    },
    extendCollection: function(Collection) {
        _.extend(Collection.prototype, {
            url: function() {
                return "https://api.sohnar.com/TrafficLiteServer/openapi/crm/client/address/";
            },
            parse: function(_resp, xhr) {
                return _resp.resultList;
            }
        });
        return Collection;
    }
};

var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

model = Alloy.M("address", exports.definition, []);

collection = Alloy.C("address", exports.definition, model);

exports.Model = model;

exports.Collection = collection;