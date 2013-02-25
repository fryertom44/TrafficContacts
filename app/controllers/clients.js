Alloy.Collections.Client = Alloy.createCollection('client');
Alloy.Collections.Client.fetch({
	headers : {
        Authorization : Alloy.Globals.authHeader(),
	},
    queryParams : {
    	order : "name"
    },
	success : function(collection, response) {
		Ti.API.debug('Clients list loaded!!!!!');
		console.log(response);

		var data = [];
		Alloy.Collections.Client.map(function(client) {
    	    // The client argument is an individual model object in the collection
            var arg = {
            	title: client.get('name'),
            	data: client
    	    };
    	    var row = Alloy.createController('row', arg).getView();
    	    // row.data = client;
    	    data.push(row);
		});
		
		// TableView object in the view with id = 'list'
		$.list.setData(data);
	},
	error : function(collection, response) {
		Ti.API.debug('Loading Clients list failed');
        Ti.UI.createAlertDialog({
            title : 'Loading clients failed',
            message : 'Check network connection and try again.'
        }).show();
		console.log(response);
	}
});

//
// EVENT LISTENERS
//
$.list.addEventListener('click', function(_e) {
	var clientSelected = Alloy.Collections.Client.get(_e.row.id);
 	var detailController = Alloy.createController('detail', {
		parentTab : $.clientsTab,
		data : clientSelected
	});
	$.clientsTab.open(detailController.getView());
});

