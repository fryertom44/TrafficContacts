exports.definition = {
	config: {
		adapter: {
			type: "restapi2",
			collection_name: "user",
            idAttribute: "id",
        },
        "columns": {
            "id":"int",
        },
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
            url : function() {
                return "https://api.sohnar.com/TrafficLiteServer/openapi/staff/employee/" + this.id;
            },
            parse : function(_resp, xhr) {
                return _resp;
            }
		});
		
		return Model;
	},
	extendCollection: function(Collection) {		
		_.extend(Collection.prototype, {
			// extended functions and properties go here
            url : function() {   
                return "https://api.sohnar.com/TrafficLiteServer/openapi/staff/employee/";
            },
            parse : function(_resp, xhr) {
                return _resp.resultList;
            }
		});
		
		return Collection;
	}
}

