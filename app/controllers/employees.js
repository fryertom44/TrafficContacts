var args = arguments[0] || {};
//
// this is setting the view elements of the row view
// which is found in views/row.xml based on the arguments
// passed into the controller
//
// $.parentController = args.parentView;
var client = args.client;

getLocations();

function getLocations() {
    Alloy.Collections.Address = Alloy.createCollection('address');
    Alloy.Collections.Address.fetch({
        url : 'https://api.sohnar.com/TrafficLiteServer/openapi/crm/client/' + client.attributes.id + '/locations',
        headers : {
            Authorization : Alloy.Globals.authHeader(),
        },
        success : function(collection, response) { 
            Ti.API.debug('Address success!!!!!');
            console.log(response);
            getEmployees();
        },
        error : function(collection, response) {
            Ti.API.debug('Address failure');
            Ti.UI.createAlertDialog({
                title : 'Address failure',
                message : 'Error'
            }).show();
            console.log(response);
        }
    });
}

function getEmployees() {
    Alloy.Collections.Employee = Alloy.createCollection('employee');
    Alloy.Collections.Employee.fetch({
        headers : {
            Authorization : Alloy.Globals.authHeader(),
        },
        queryParams : {
            type : "CLIENT"
        },
        success : function(collection, response) {
            Ti.API.debug('Employees list loaded!!!!!');
            console.log(response);
            populateTable();
        },
        error : function(collection, response) {
            Ti.API.debug('Loading Employees list failed');
            Ti.UI.createAlertDialog({
                title : 'Loading employees failed',
                message : 'Check network connection and try again.'
            }).show();
            console.log(response);
        }
    });
}

function populateTable() {
    var data = [];

    Alloy.Collections.Address.map(function(location) { 
        var sectionTitle = location.attributes.name || location.attributes.address.lineOne;
        var section = Ti.UI.createTableViewSection({
            headerTitle : sectionTitle
        });
        data.push(section);

        Alloy.Collections.Employee.map(function(employee) {
            // The client argument is an individual model object in the collection
            var firstName = employee.attributes.personalDetails.firstName;
            var arg = {
                title : employee.attributes.personalDetails.firstName + ' ' + employee.attributes.personalDetails.lastName,
                data : employee
            };
            if (employee.attributes.ownerAliasId == location.attributes.id) {
                employee.setAddress(location);
                var row = Alloy.createController('row', arg).getView();
                data.push(row);
            };
        });
    });

    // TableView object in the view with id = 'list'
    $.list.setData(data);
}

//
// EVENT LISTENERS
//
$.list.addEventListener('click', function(_e) {
    var employeeSelected = Alloy.Collections.Employee.get(_e.row.id);
    
    Alloy.Models.User.setSelectedEmployee(employeeSelected);
    var employeeDetailController = Alloy.createController('employeeDetail', {
        parentView : $.parentController,
        employee : employeeSelected
    });
    Alloy.Globals.parent.open(employeeDetailController.getView());
});
