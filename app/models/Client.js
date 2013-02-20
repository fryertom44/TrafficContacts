exports.definition = {	
	config: {
		"URL": "https://api.sohnar.com/TrafficLiteServer/openapi/crm/client",
		// "URL":"https://public-api.wordpress.com/rest/v1/freshly-pressed/",
		"adapter": {
			"type": "restapi2",
			"collection_name": "client",
			"idAttribute": "id",
		},
		"columns": {
		"id":"int",
		"name":"string"
		},
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
            url : function() {
                return "https://api.sohnar.com/TrafficLiteServer/openapi/crm/client/" + this.id;
            },
            parse : function(_resp, xhr) { debugger;
	            return _resp;
            }
		});
		return Model;
	},
	
	extendCollection: function(Collection) {
		_.extend(Collection.prototype, {		
            url : function () {
             return "https://api.sohnar.com/TrafficLiteServer/openapi/crm/client";
            },
            parse : function(_resp, xhr) { debugger;
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