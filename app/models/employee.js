exports.definition = {
	config: {
		adapter: {
			type: "restapi2",
			collection_name: "employee"
		}
	},		
	extendModel: function(Model) {		
		_.extend(Model.prototype, {
			// extended functions and properties go here
            url : function() {
                return "https://api.sohnar.com/TrafficLiteServer/openapi/crm/employee/" + this.id;
            },
            parse : function(_resp, xhr) {
                return _resp;
            },
            getAddress : function () {
              return this._address;
            },
            setAddress : function (address) {
              this._address = address;
            }
		});
		
		return Model;
	},
	extendCollection: function(Collection) {		
		_.extend(Collection.prototype, {
			// extended functions and properties go here
            url : function() {
                return "https://api.sohnar.com/TrafficLiteServer/openapi/crm/employee";
            },
            parse : function(_resp, xhr) {
                return _resp.resultList;
            },
		});
		
		return Collection;
	}
}

