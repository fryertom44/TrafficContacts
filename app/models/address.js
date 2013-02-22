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
				return _resp.resultList;
			}
		});

		return Model;
	},
	extendCollection : function(Collection) {
		_.extend(Collection.prototype, {
			// extended functions and properties go here
			url : function() {
				return "https://api.sohnar.com/TrafficLiteServer/openapi/crm/client/address/";
			},
			parse : function(_resp, xhr) {
				// return the resultList attributes
				return _resp.resultList;
			}
		});

		return Collection;
	}
}

