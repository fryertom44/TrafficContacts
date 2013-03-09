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
                return _resp;
            },
            getPrintableAddress: function(separator, showAddressName) {
                var addressArray = [];
                showAddressName && addressArray.push(this.attributes.name);
                addressArray.push(this.attributes.address.lineOne);
                addressArray.push(this.attributes.address.lineTwo);
                addressArray.push(this.attributes.address.lineThree);
                addressArray.push(this.attributes.address.city);
                addressArray.push(this.attributes.address.postCode);
                addressArray.push(this.attributes.address.country.printableName);
                var addressAsText = "";
                for (var i = 0, j = addressArray.length; i < j; i++) addressArray[i] && (addressAsText += addressArray[i] + separator);
                return addressAsText;
            }
        });
        return Model;
    },
    extendCollection: function(Collection) {
        _.extend(Collection.prototype, {
            url: function() {
                return "https://api.sohnar.com/TrafficLiteServer/openapi/crm/client/" + this.parentCRMEntryId + "/locations/";
            },
            parse: function(_resp, xhr) {
                return _resp;
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