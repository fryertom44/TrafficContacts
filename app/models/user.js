exports.definition = {
	config: {
		adapter: {
			type: "restapi2",
			collection_name: "user",
            idAttribute: "id",
        },
        "columns": {
            "id":"int",
        }
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
            url : function() {
                return "https://api.sohnar.com/TrafficLiteServer/openapi/staff/employee/" + this.id;
            },
            parse : function(_resp, xhr) {
                return _resp;
            },
            getSelectedClient: function() {
                return this._selectedClient;
            },  
            setSelectedClient: function(client) {
                this._selectedClient = client;  
            },  
            getSelectedEmployee: function() {
                return this._selectedEmployee;
            },  
            setSelectedEmployee: function(employee) {
                this._selectedEmployee = employee;  
            },  
            getSelectedTab: function() {
                return this._selectedTab;
            },  
            setSelectedTab: function(tab) {
                this._selectedTab = tab;  
            },  
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

