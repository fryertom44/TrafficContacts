exports.definition = {
	
	config: {
		"columns": {
			"id":"int",
			"name":"string"
		},
		"adapter": {
			"type": "id:int",
			"collection_name": "supplier"
		}
	},		

	extendModel: function(Model) {		
		_.extend(Model.prototype, {
						
			// extended functions go here

		}); // end extend
		
		return Model;
	},
	
	
	extendCollection: function(Collection) {		
		_.extend(Collection.prototype, {
			
			// extended functions go here			
			
		}); // end extend
		
		return Collection;
	}
		
}

