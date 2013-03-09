exports.definition = {
    config: {
        adapter: {
            type: "restapi2",
            collection_name: "employee"
        }
    },
    extendModel: function(Model) {
        _.extend(Model.prototype, {
            url: function() {
                return "https://api.sohnar.com/TrafficLiteServer/openapi/crm/employee/" + this.id;
            },
            parse: function(_resp, xhr) {
                return _resp;
            },
            getAddress: function() {
                return this._address;
            },
            setAddress: function(address) {
                this._address = address;
            }
        });
        return Model;
    },
    extendCollection: function(Collection) {
        _.extend(Collection.prototype, {
            url: function() {
                return "https://api.sohnar.com/TrafficLiteServer/openapi/crm/employee";
            },
            parse: function(_resp, xhr) {
                return _resp.resultList;
            }
        });
        return Collection;
    }
};

var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

model = Alloy.M("employee", exports.definition, []);

collection = Alloy.C("employee", exports.definition, model);

exports.Model = model;

exports.Collection = collection;