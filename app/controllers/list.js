
sendAuthentication = function (xhr) {
  var user = "fryertom@gmail.com";
  var pass = "MR6gFeqG585J5SVZ7Lnv128wHhT2EBgjl5C7F2i2";
  var token = user.concat(":", pass);
  xhr.setRequestHeader('Authorization', ("Basic ".concat(Ti.Utils.base64encode(token))));
}

Alloy.Collections.Client = Alloy.createCollection('client');
Alloy.Collections.Client.fetch({
	headers: {
		 Authorization: "Basic ZnJ5ZXJ0b21AZ21haWwuY29tOk1SNmdGZXFHNTg1SjVTVlo3TG52MTI4d0hoVDJFQmdqbDVDN0YyaTI="
		// Authorization: function () {
	  		// var user = "fryertom@gmail.com";
	  		// var pass = "MR6gFeqG585J5SVZ7Lnv128wHhT2EBgjl5C7F2i2";
	  		// var token = user.concat(":", pass);
	  		// return "Basic ".concat(Ti.Utils.base64encode(token));
		// }
	},
	success: function (collection, response) {
		Ti.API.debug('Clients list loaded!!!!!');
    	console.log(response);
    	debugger;

		var data = [];
		Alloy.Collections.Client.map(function(client) {
	    // The book argument is an individual model object in the collection
	    var clientName = client.get('name');
	    var row = Ti.UI.createTableViewRow({"title":clientName});
	    data.push(row);
		});
		// TableView object in the view with id = 'list'
		$.list.setData(data);
  	},
  	error: function (collection, response) {
		Ti.API.debug('Loading Clients list failed');
    	console.log(response);
  	}
});
