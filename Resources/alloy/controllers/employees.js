function Controller() {
    function getLocations() {
        Alloy.Collections.Address = Alloy.createCollection("address");
        Alloy.Collections.Address.fetch({
            url: "https://api.sohnar.com/TrafficLiteServer/openapi/crm/client/" + client.attributes.id + "/locations",
            headers: {
                Authorization: Alloy.Globals.authHeader()
            },
            success: function(collection, response) {
                Ti.API.debug("Address success!!!!!");
                console.log(response);
                getEmployees();
            },
            error: function(collection, response) {
                Ti.API.debug("Address failure");
                Ti.UI.createAlertDialog({
                    title: "Address failure",
                    message: "Error"
                }).show();
                console.log(response);
            }
        });
    }
    function getEmployees() {
        Alloy.Collections.Employee = Alloy.createCollection("employee");
        Alloy.Collections.Employee.fetch({
            headers: {
                Authorization: Alloy.Globals.authHeader()
            },
            queryParams: {
                type: "CLIENT"
            },
            success: function(collection, response) {
                Ti.API.debug("Employees list loaded!!!!!");
                console.log(response);
                populateTable();
            },
            error: function(collection, response) {
                Ti.API.debug("Loading Employees list failed");
                Ti.UI.createAlertDialog({
                    title: "Loading employees failed",
                    message: "Check network connection and try again."
                }).show();
                console.log(response);
            }
        });
    }
    function populateTable() {
        var data = [];
        Alloy.Collections.Address.map(function(location) {
            var sectionTitle = location.attributes.name || location.attributes.address.lineOne, section = Ti.UI.createTableViewSection({
                headerTitle: sectionTitle
            });
            data.push(section);
            Alloy.Collections.Employee.map(function(employee) {
                var firstName = employee.attributes.personalDetails.firstName, arg = {
                    title: employee.attributes.personalDetails.firstName + " " + employee.attributes.personalDetails.lastName,
                    data: employee
                };
                if (employee.attributes.ownerAliasId == location.attributes.id) {
                    employee.setAddress(location);
                    var row = Alloy.createController("row", arg).getView();
                    data.push(row);
                }
            });
        });
        $.list.setData(data);
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    $model = arguments[0] ? arguments[0].$model : null;
    var $ = this, exports = {}, __defers = {};
    $.__views.employeesWindow = Ti.UI.createWindow({
        backgroundColor: "white",
        barColor: "#000",
        id: "employeesWindow",
        title: "Contacts"
    });
    $.addTopLevelView($.__views.employeesWindow);
    $.__views.list = Ti.UI.createTableView({
        id: "list"
    });
    $.__views.employeesWindow.add($.__views.list);
    $.__views.list.headerPullView = undefined;
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {}, client = args.client;
    getLocations();
    $.list.addEventListener("click", function(_e) {
        var employeeSelected = Alloy.Collections.Employee.get(_e.row.id);
        Alloy.Models.User.setSelectedEmployee(employeeSelected);
        var employeeDetailController = Alloy.createController("employeeDetail", {
            parentView: $.parentController,
            employee: employeeSelected
        });
        Alloy.Globals.parent.open(employeeDetailController.getView());
    });
    __defers["$.__views.__alloyId33!click!refreshItems"] && $.__views.__alloyId33.addEventListener("click", refreshItems);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, $model;

module.exports = Controller;