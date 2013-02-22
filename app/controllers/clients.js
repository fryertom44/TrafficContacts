sendAuthentication = function(xhr) {
	var user = "fryertom@gmail.com";
	var pass = "MR6gFeqG585J5SVZ7Lnv128wHhT2EBgjl5C7F2i2";
	var token = user.concat(":", pass);
	xhr.setRequestHeader('Authorization', ("Basic ".concat(Ti.Utils.base64encode(token))));
}

Alloy.Collections.Client = Alloy.createCollection('client');
Alloy.Collections.Client.fetch({
	headers : {
		Authorization : "Basic ZnJ5ZXJ0b21AZ21haWwuY29tOk1SNmdGZXFHNTg1SjVTVlo3TG52MTI4d0hoVDJFQmdqbDVDN0YyaTI="
		// Authorization: function () {
		// var user = "fryertom@gmail.com";
		// var pass = "MR6gFeqG585J5SVZ7Lnv128wHhT2EBgjl5C7F2i2";
		// var token = user.concat(":", pass);
		// return "Basic ".concat(Ti.Utils.base64encode(token));
		// }
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
	    
	   	// var anotherRow = Ti.UI.createTableViewRow({className: 'clientRow'});
	   	// anotherRow.title = "Test Row";
		// anotherRow.model = client;
	    // data.push(anotherRow);
		});
		
		// TableView object in the view with id = 'list'
		$.list.setData(data);
	},
	error : function(collection, response) {
		Ti.API.debug('Loading Clients list failed');
		//TODO: put an alert here
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

