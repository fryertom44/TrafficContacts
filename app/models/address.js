exports.definition = {
    config : {
        adapter : {
            type : "restapi2",
            collection_name : "address",
            "idAttribute" : "id",
        },
        "columns" : {
            "id" : "int",
        },
    },
    extendModel : function(Model) {
        _.extend(Model.prototype, {
            // extended functions and properties go here
            url : function() {
                return "https://api.sohnar.com/TrafficLiteServer/openapi/crm/client/address/" + this.id;
            },
            parse : function(_resp, xhr) {
                // return the resultList attributes
                return _resp;
            },
            getPrintableAddress : function(separator, showAddressName) {
                // var addressArray = [this.attributes.name, this.attributes.address.lineOne, this.attributes.address.lineTwo, this.attributes.address.lineThree, this.attributes.address.city, this.attributes.address.postCode, this.attributes.address.country.printableName];
                var addressArray = [];
                if (showAddressName)
                    addressArray.push(this.attributes.name);
                    
                addressArray.push(this.attributes.address.lineOne);
                addressArray.push(this.attributes.address.lineTwo);
                addressArray.push(this.attributes.address.lineThree);
                addressArray.push(this.attributes.address.city);
                addressArray.push(this.attributes.address.postCode);
                addressArray.push(this.attributes.address.country.printableName);
                var addressAsText = "";
                for (var i = 0, j = addressArray.length; i < j; i++) {
                    if (addressArray[i])
                        addressAsText += (addressArray[i] + separator);
                };
                return addressAsText;
            }
        });

        return Model;
    },
    extendCollection : function(Collection) {
        _.extend(Collection.prototype, {
            // extended functions and properties go here
            url : function() {

                return "https://api.sohnar.com/TrafficLiteServer/openapi/crm/client/" + this.parentCRMEntryId + "/locations/";
            },
            parse : function(_resp, xhr) {
                // return the resultList attributes
                return _resp;
            }
        });

        return Collection;
    }
}

