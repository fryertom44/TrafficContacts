function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    $model = arguments[0] ? arguments[0].$model : null;
    var $ = this, exports = {}, __defers = {};
    $.__views.employeeDetailWindow = Ti.UI.createWindow({
        backgroundColor: "white",
        barColor: "#000",
        id: "employeeDetailWindow",
        title: "Employee"
    });
    $.addTopLevelView($.__views.employeeDetailWindow);
    $.__views.__alloyId17 = Ti.UI.createTableViewSection({
        id: "__alloyId17"
    });
    var __alloyId18 = [];
    __alloyId18.push($.__views.__alloyId17);
    $.__views.__alloyId19 = Ti.UI.createTableViewRow({
        height: 44,
        id: "__alloyId19"
    });
    $.__views.__alloyId17.add($.__views.__alloyId19);
    $.__views.__alloyId20 = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#000",
        font: {
            fontSize: 17,
            fontFamily: "Helvetica Neue",
            fontWeight: "bold"
        },
        left: 22,
        textAlign: "left",
        text: "Name:",
        id: "__alloyId20"
    });
    $.__views.__alloyId19.add($.__views.__alloyId20);
    $.__views.contactName = Ti.UI.createTextField({
        left: 100,
        right: 22,
        textAlign: "right",
        editable: !1,
        color: "#496197",
        hintText: "Name",
        id: "contactName"
    });
    $.__views.__alloyId19.add($.__views.contactName);
    $.__views.__alloyId21 = Ti.UI.createTableViewRow({
        height: 44,
        id: "__alloyId21"
    });
    $.__views.__alloyId17.add($.__views.__alloyId21);
    $.__views.__alloyId22 = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#000",
        font: {
            fontSize: 17,
            fontFamily: "Helvetica Neue",
            fontWeight: "bold"
        },
        left: 22,
        textAlign: "left",
        text: "Job Title:",
        id: "__alloyId22"
    });
    $.__views.__alloyId21.add($.__views.__alloyId22);
    $.__views.contactJobTitle = Ti.UI.createTextField({
        left: 100,
        right: 22,
        textAlign: "right",
        editable: !1,
        color: "#496197",
        hintText: "Job Title",
        id: "contactJobTitle"
    });
    $.__views.__alloyId21.add($.__views.contactJobTitle);
    $.__views.__alloyId23 = Ti.UI.createTableViewRow({
        height: 44,
        id: "__alloyId23"
    });
    $.__views.__alloyId17.add($.__views.__alloyId23);
    $.__views.__alloyId24 = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#000",
        font: {
            fontSize: 17,
            fontFamily: "Helvetica Neue",
            fontWeight: "bold"
        },
        left: 22,
        textAlign: "left",
        text: "Phone:",
        id: "__alloyId24"
    });
    $.__views.__alloyId23.add($.__views.__alloyId24);
    $.__views.contactPhone = Ti.UI.createTextField({
        left: 100,
        right: 22,
        textAlign: "right",
        editable: !1,
        color: "#496197",
        hintText: "Phone",
        id: "contactPhone"
    });
    $.__views.__alloyId23.add($.__views.contactPhone);
    $.__views.__alloyId25 = Ti.UI.createTableViewRow({
        height: 44,
        id: "__alloyId25"
    });
    $.__views.__alloyId17.add($.__views.__alloyId25);
    $.__views.__alloyId26 = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#000",
        font: {
            fontSize: 17,
            fontFamily: "Helvetica Neue",
            fontWeight: "bold"
        },
        left: 22,
        textAlign: "left",
        text: "Mobile:",
        id: "__alloyId26"
    });
    $.__views.__alloyId25.add($.__views.__alloyId26);
    $.__views.contactMobile = Ti.UI.createTextField({
        left: 100,
        right: 22,
        textAlign: "right",
        editable: !1,
        color: "#496197",
        hintText: "Mobile",
        id: "contactMobile"
    });
    $.__views.__alloyId25.add($.__views.contactMobile);
    $.__views.__alloyId27 = Ti.UI.createTableViewRow({
        height: 44,
        id: "__alloyId27"
    });
    $.__views.__alloyId17.add($.__views.__alloyId27);
    $.__views.__alloyId28 = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#000",
        font: {
            fontSize: 17,
            fontFamily: "Helvetica Neue",
            fontWeight: "bold"
        },
        left: 22,
        textAlign: "left",
        text: "Email:",
        id: "__alloyId28"
    });
    $.__views.__alloyId27.add($.__views.__alloyId28);
    $.__views.contactEmail = Ti.UI.createTextField({
        left: 100,
        right: 22,
        textAlign: "right",
        editable: !1,
        color: "#496197",
        hintText: "Email",
        id: "contactEmail"
    });
    $.__views.__alloyId27.add($.__views.contactEmail);
    $.__views.__alloyId29 = Ti.UI.createTableViewSection({
        headerTitle: "Location",
        id: "__alloyId29"
    });
    __alloyId18.push($.__views.__alloyId29);
    $.__views.addressRow = Ti.UI.createTableViewRow({
        height: 140,
        id: "addressRow"
    });
    $.__views.__alloyId29.add($.__views.addressRow);
    $.__views.addressText = Ti.UI.createTextArea({
        backgroundColor: "transparent",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        editable: !1,
        minimumFontSize: 8,
        font: {
            fontSize: 17
        },
        id: "addressText",
        hintText: "Address"
    });
    $.__views.addressRow.add($.__views.addressText);
    $.__views.__alloyId30 = Ti.UI.createTableViewRow({
        height: 44,
        id: "__alloyId30"
    });
    $.__views.__alloyId29.add($.__views.__alloyId30);
    $.__views.showMapButton = Ti.UI.createButton({
        height: Ti.UI.SIZE,
        left: 22,
        right: 22,
        style: Ti.UI.iPhone.SystemButtonStyle.PLAIN,
        color: "#496197",
        textAlign: "center",
        title: "Show Map",
        id: "showMapButton"
    });
    $.__views.__alloyId30.add($.__views.showMapButton);
    $.__views.__alloyId16 = Ti.UI.createTableView({
        style: Ti.UI.iPhone.TableViewStyle.GROUPED,
        data: __alloyId18,
        id: "__alloyId16"
    });
    $.__views.employeeDetailWindow.add($.__views.__alloyId16);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    $.parentController = args.parentView;
    var employee = args.employee, address = employee.getAddress();
    address && $.addressText.setValue(address.getPrintableAddress("\n"));
    if (employee && employee.attributes.personalDetails) {
        $.contactName.setValue(employee.attributes.personalDetails.firstName + " " + employee.attributes.personalDetails.lastName);
        $.contactJobTitle.setValue(employee.attributes.jobTitle);
        $.contactPhone.setValue(employee.attributes.personalDetails.workPhone);
        $.contactMobile.setValue(employee.attributes.personalDetails.mobilePhone);
        $.contactEmail.setValue(employee.attributes.personalDetails.emailAddress);
    }
    $.showMapButton.addEventListener("click", function() {
        var mapController = Alloy.createController("mapDetail", {
            address: address
        });
        Alloy.Globals.parent.open(mapController.getView());
    });
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, $model;

module.exports = Controller;