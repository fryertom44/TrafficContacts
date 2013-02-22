function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    $model = arguments[0] ? arguments[0].$model : null;
    var $ = this, exports = {}, __defers = {};
    $.clientDetail = Alloy.createModel("Client");
    $.__views.detailWindow = Ti.UI.createWindow({
        backgroundColor: "white",
        barColor: "#000",
        id: "detailWindow",
        title: "Detail"
    });
    $.addTopLevelView($.__views.detailWindow);
    $.__views.__alloyId4 = Ti.UI.createTableViewSection({
        id: "__alloyId4"
    });
    var __alloyId5 = [];
    __alloyId5.push($.__views.__alloyId4);
    $.__views.__alloyId6 = Ti.UI.createTableViewRow({
        height: 44,
        id: "__alloyId6"
    });
    $.__views.__alloyId4.add($.__views.__alloyId6);
    $.__views.__alloyId7 = Ti.UI.createLabel({
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
        id: "__alloyId7"
    });
    $.__views.__alloyId6.add($.__views.__alloyId7);
    $.__views.companyName = Ti.UI.createTextField({
        right: 22,
        textAlign: "right",
        editable: !1,
        color: "#496197",
        hintText: "Name",
        id: "companyName"
    });
    $.__views.__alloyId6.add($.__views.companyName);
    $.__views.__alloyId8 = Ti.UI.createTableViewRow({
        height: 44,
        id: "__alloyId8"
    });
    $.__views.__alloyId4.add($.__views.__alloyId8);
    $.__views.__alloyId9 = Ti.UI.createLabel({
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
        text: "Website:",
        id: "__alloyId9"
    });
    $.__views.__alloyId8.add($.__views.__alloyId9);
    $.__views.website = Ti.UI.createTextField({
        right: 22,
        textAlign: "right",
        editable: !1,
        color: "#496197",
        hintText: "Website",
        id: "website"
    });
    $.__views.__alloyId8.add($.__views.website);
    $.__views.__alloyId10 = Ti.UI.createTableViewRow({
        height: 44,
        id: "__alloyId10"
    });
    $.__views.__alloyId4.add($.__views.__alloyId10);
    $.__views.__alloyId11 = Ti.UI.createLabel({
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
        text: "Industry:",
        id: "__alloyId11"
    });
    $.__views.__alloyId10.add($.__views.__alloyId11);
    $.__views.industryType = Ti.UI.createTextField({
        right: 22,
        textAlign: "right",
        editable: !1,
        color: "#496197",
        hintText: "Industry Type",
        id: "industryType"
    });
    $.__views.__alloyId10.add($.__views.industryType);
    $.__views.__alloyId12 = Ti.UI.createTableViewSection({
        headerTitle: "Location",
        id: "__alloyId12"
    });
    __alloyId5.push($.__views.__alloyId12);
    $.__views.addressRow = Ti.UI.createTableViewRow({
        height: 140,
        id: "addressRow"
    });
    $.__views.__alloyId12.add($.__views.addressRow);
    $.__views.addressText = Ti.UI.createTextArea({
        backgroundColor: "transparent",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        editable: !1,
        id: "addressText",
        hintText: "Address"
    });
    $.__views.addressRow.add($.__views.addressText);
    $.__views.__alloyId13 = Ti.UI.createTableViewRow({
        height: 44,
        id: "__alloyId13"
    });
    $.__views.__alloyId12.add($.__views.__alloyId13);
    $.__views.showMapButton = Ti.UI.createButton({
        height: Ti.UI.SIZE,
        width: Ti.UI.SIZE,
        left: 0,
        right: 0,
        style: Ti.UI.iPhone.SystemButtonStyle.PLAIN,
        textAlign: "center",
        title: "Show Map",
        id: "showMapButton"
    });
    $.__views.__alloyId13.add($.__views.showMapButton);
    $.__views.__alloyId14 = Ti.UI.createTableViewSection({
        headerTitle: "Primary Contact",
        id: "__alloyId14"
    });
    __alloyId5.push($.__views.__alloyId14);
    $.__views.__alloyId15 = Ti.UI.createTableViewRow({
        height: 44,
        id: "__alloyId15"
    });
    $.__views.__alloyId14.add($.__views.__alloyId15);
    $.__views.__alloyId16 = Ti.UI.createLabel({
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
        id: "__alloyId16"
    });
    $.__views.__alloyId15.add($.__views.__alloyId16);
    $.__views.contactName = Ti.UI.createTextField({
        right: 22,
        textAlign: "right",
        editable: !1,
        color: "#496197",
        hintText: "Name",
        id: "contactName"
    });
    $.__views.__alloyId15.add($.__views.contactName);
    $.__views.__alloyId17 = Ti.UI.createTableViewRow({
        height: 44,
        id: "__alloyId17"
    });
    $.__views.__alloyId14.add($.__views.__alloyId17);
    $.__views.__alloyId18 = Ti.UI.createLabel({
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
        id: "__alloyId18"
    });
    $.__views.__alloyId17.add($.__views.__alloyId18);
    $.__views.contactJobTitle = Ti.UI.createTextField({
        right: 22,
        textAlign: "right",
        editable: !1,
        color: "#496197",
        hintText: "Job Title",
        id: "contactJobTitle"
    });
    $.__views.__alloyId17.add($.__views.contactJobTitle);
    $.__views.__alloyId19 = Ti.UI.createTableViewRow({
        height: 44,
        id: "__alloyId19"
    });
    $.__views.__alloyId14.add($.__views.__alloyId19);
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
        text: "Phone:",
        id: "__alloyId20"
    });
    $.__views.__alloyId19.add($.__views.__alloyId20);
    $.__views.contactPhone = Ti.UI.createTextField({
        right: 22,
        textAlign: "right",
        editable: !1,
        color: "#496197",
        hintText: "Phone",
        id: "contactPhone"
    });
    $.__views.__alloyId19.add($.__views.contactPhone);
    $.__views.__alloyId21 = Ti.UI.createTableViewRow({
        height: 44,
        id: "__alloyId21"
    });
    $.__views.__alloyId14.add($.__views.__alloyId21);
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
        text: "Mobile:",
        id: "__alloyId22"
    });
    $.__views.__alloyId21.add($.__views.__alloyId22);
    $.__views.contactMobile = Ti.UI.createTextField({
        right: 22,
        textAlign: "right",
        editable: !1,
        color: "#496197",
        hintText: "Mobile",
        id: "contactMobile"
    });
    $.__views.__alloyId21.add($.__views.contactMobile);
    $.__views.__alloyId23 = Ti.UI.createTableViewRow({
        height: 44,
        id: "__alloyId23"
    });
    $.__views.__alloyId14.add($.__views.__alloyId23);
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
        text: "Email:",
        id: "__alloyId24"
    });
    $.__views.__alloyId23.add($.__views.__alloyId24);
    $.__views.contactEmail = Ti.UI.createTextField({
        right: 22,
        textAlign: "right",
        editable: !1,
        color: "#496197",
        hintText: "Email",
        id: "contactEmail"
    });
    $.__views.__alloyId23.add($.__views.contactEmail);
    $.__views.__alloyId25 = Ti.UI.createTableViewSection({
        headerTitle: "Notes",
        id: "__alloyId25"
    });
    __alloyId5.push($.__views.__alloyId25);
    $.__views.notesRow = Ti.UI.createTableViewRow({
        height: 44,
        id: "notesRow"
    });
    $.__views.__alloyId25.add($.__views.notesRow);
    $.__views.__alloyId26 = Ti.UI.createTextArea({
        backgroundColor: "transparent",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        editable: !1,
        hintText: "Notes",
        id: "__alloyId26"
    });
    $.__views.notesRow.add($.__views.__alloyId26);
    $.__views.__alloyId3 = Ti.UI.createTableView({
        style: Ti.UI.iPhone.TableViewStyle.GROUPED,
        data: __alloyId5,
        id: "__alloyId3"
    });
    $.__views.detailWindow.add($.__views.__alloyId3);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    $.parentController = args.parentTab;
    var client = args.data.attributes;
    debugger;
    if (client) {
        $.companyName.setValue(client.name);
        $.industryType.setValue(client.industryType);
        $.website.setValue(client.website);
        client.primaryLocation && $.addressText.setValue(function() {
            var addressArray = [ client.primaryLocation.address.addressName, client.primaryLocation.address.lineOne, client.primaryLocation.address.lineTwo, client.primaryLocation.address.lineThree, client.primaryLocation.address.city, client.primaryLocation.address.postCode, client.primaryLocation.address.country.printableName ], addressAsText;
            for (var i = 0, j = addressArray.length; i < j; i++) addressArray[i] && addressAsText.concat(addressAsText, addressArray[i] + "\n");
            return addressAsText;
        });
        if (client.primaryContact && client.primaryContact.personalDetails) {
            $.contactName.setValue(client.primaryContact.personalDetails.firstName + " " + client.primaryContact.personalDetails.lastName);
            $.contactJobTitle.setValue(client.primaryContact.jobTitle);
            $.contactPhone.setValue(client.primaryContact.personalDetails.workPhone);
            $.contactMobile.setValue(client.primaryContact.personalDetails.mobilePhone);
            $.companyEmail.setValue(client.primaryContact.personalDetails.emailAddress);
        }
    }
    $.showMapButton.addEventListener("click", function(_e) {
        var mapController = Alloy.createController("MapDetail");
        args.parentTab.open(mapController.getView());
    });
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, $model;

module.exports = Controller;