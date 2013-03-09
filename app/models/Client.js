exports.definition = {
    config : {
        // "URL": "https://api.sohnar.com/TrafficLiteServer/openapi/crm/client",
        "adapter" : {
            "type" : "restapi2",
            "collection_name" : "client",
            "idAttribute" : "id",
        },
        "columns" : {
            "id" : "int",
            "name" : "string"
        },
    },
    extendModel : function(Model) {
        _.extend(Model.prototype, {
            url : function() {
                return "https://api.sohnar.com/TrafficLiteServer/openapi/crm/client/" + this.id;
            },
            parse : function(_resp, xhr) {
                return _resp;
            },
            getAddresses : function() {
                return this._addresses;
            },
            setAddresses : function(addresses) {
                this._addresses = addresses;
            },
            getContacts : function() {
                return this._contacts;
            },
            setContacts : function(contacts) {
                this._contacts = contacts;
            }
            // fetchLocations : function() {
            // xhr = Titanium.Network.createHTTPClient();
            // xhr.open('GET', 'https://api.sohnar.com/TrafficLiteServer/openapi/crm/client/' + this.id + '/locations');
            //
            // xhr.setRequestHeader("Authorization", Alloy.Globals.authHeader());
            // xhr.setRequestHeader("Content-Type", 'application/json');
            // xhr.setRequestHeader("Accept", "application/json");
            //
            // xhr.onload = function() {
            // var json = JSON.parse(this.responseText);
            // Ti.API.info(json);
            // this.locations = json;
            // };
            //
            // //Handle error
            // xhr.onerror = function() {
            // Ti.UI.createAlertDialog({
            // title : 'Loading Client Locations Error',
            // message : xhr.responseText
            // }).show();
            // Ti.API.error('[CLIENT MODEL] ERROR: ' + xhr.responseText);
            // };
            // xhr.send();
            // }
        });
        return Model;
    },
    extendCollection : function(Collection) {
        _.extend(Collection.prototype, {
            url : function() {
                return "https://api.sohnar.com/TrafficLiteServer/openapi/crm/client";
            },
            parse : function(_resp, xhr) {
                // return the resultList attributes
                return _resp.resultList;
            }
            // sort by reverse name (last added first)
            // comparator: function(a, b) {
            // var clientA = a.get('name');
            // var clientB = b.get('name');
            //
            // if (clientA < clientB)
            // return -1;
            // if (clientA > clientB)
            // return 1;
            // return 0;
            // }
        });
        return Collection;
    }
}