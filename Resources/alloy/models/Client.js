exports.definition = {
    config: {
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
                return _resp;
            },
            getAddresses: function() {
                return this._addresses;
            },
            setAddresses: function(addresses) {
                this._addresses = addresses;
            },
            getContacts: function() {
                return this._contacts;
            },
            setContacts: function(contacts) {
                this._contacts = contacts;
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
                return _resp.resultList;
            }
        });
        return Collection;
    }
};

var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

model = Alloy.M("client", exports.definition, []);

collection = Alloy.C("client", exports.definition, model);

exports.Model = model;

exports.Collection = collection;