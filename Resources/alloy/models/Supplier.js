exports.definition = {
    config: {
        columns: {
            id: "int",
            name: "string"
        },
        adapter: {
            type: "id:int",
            collection_name: "supplier"
        }
    },
    extendModel: function(Model) {
        _.extend(Model.prototype, {});
        return Model;
    },
    extendCollection: function(Collection) {
        _.extend(Collection.prototype, {});
        return Collection;
    }
};

var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

model = Alloy.M("supplier", exports.definition, []);

collection = Alloy.C("supplier", exports.definition, model);

exports.Model = model;

exports.Collection = collection;