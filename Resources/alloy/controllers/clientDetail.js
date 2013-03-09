function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    $model = arguments[0] ? arguments[0].$model : null;
    var $ = this, exports = {}, __defers = {};
    $.__views.clientWindow = Ti.UI.createWindow({
        backgroundColor: "white",
        barColor: "#000",
        id: "clientWindow",
        title: "Detail"
    });
    $.addTopLevelView($.__views.clientWindow);
    $.__views.__alloyId1 = Ti.UI.createTableViewSection({
        id: "__alloyId1"
    });
    var __alloyId2 = [];
    __alloyId2.push($.__views.__alloyId1);
    $.__views.__alloyId3 = Ti.UI.createTableViewRow({
        height: 44,
        id: "__alloyId3"
    });
    $.__views.__alloyId1.add($.__views.__alloyId3);
    $.__views.__alloyId4 = Ti.UI.createLabel({
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
        id: "__alloyId4"
    });
    $.__views.__alloyId3.add($.__views.__alloyId4);
    $.__views.companyName = Ti.UI.createTextField({
        left: 100,
        right: 22,
        textAlign: "right",
        editable: !1,
        color: "#496197",
        hintText: "Name",
        id: "companyName"
    });
    $.__views.__alloyId3.add($.__views.companyName);
    $.__views.__alloyId5 = Ti.UI.createTableViewRow({
        height: 44,
        id: "__alloyId5"
    });
    $.__views.__alloyId1.add($.__views.__alloyId5);
    $.__views.__alloyId6 = Ti.UI.createLabel({
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
        id: "__alloyId6"
    });
    $.__views.__alloyId5.add($.__views.__alloyId6);
    $.__views.website = Ti.UI.createTextField({
        left: 100,
        right: 22,
        textAlign: "right",
        editable: !1,
        color: "#496197",
        hintText: "Website",
        id: "website"
    });
    $.__views.__alloyId5.add($.__views.website);
    $.__views.__alloyId7 = Ti.UI.createTableViewRow({
        height: 44,
        id: "__alloyId7"
    });
    $.__views.__alloyId1.add($.__views.__alloyId7);
    $.__views.__alloyId8 = Ti.UI.createLabel({
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
        id: "__alloyId8"
    });
    $.__views.__alloyId7.add($.__views.__alloyId8);
    $.__views.industryType = Ti.UI.createTextField({
        left: 100,
        right: 22,
        textAlign: "right",
        editable: !1,
        color: "#496197",
        hintText: "Industry Type",
        id: "industryType"
    });
    $.__views.__alloyId7.add($.__views.industryType);
    $.__views.__alloyId9 = Ti.UI.createTableViewSection({
        headerTitle: "More Information",
        id: "__alloyId9"
    });
    __alloyId2.push($.__views.__alloyId9);
    $.__views.__alloyId10 = Ti.UI.createTableViewRow({
        height: 44,
        hasChild: "true",
        id: "__alloyId10"
    });
    $.__views.__alloyId9.add($.__views.__alloyId10);
    $.__views.employeesButton = Ti.UI.createButton({
        height: Ti.UI.SIZE,
        left: 22,
        right: 22,
        style: Ti.UI.iPhone.SystemButtonStyle.PLAIN,
        color: "#496197",
        textAlign: "center",
        title: "Locations and Employees",
        id: "employeesButton"
    });
    $.__views.__alloyId10.add($.__views.employeesButton);
    $.__views.__alloyId11 = Ti.UI.createTableViewRow({
        height: 44,
        hasChild: "true",
        id: "__alloyId11"
    });
    $.__views.__alloyId9.add($.__views.__alloyId11);
    $.__views.jobsButton = Ti.UI.createButton({
        height: Ti.UI.SIZE,
        left: 22,
        right: 22,
        style: Ti.UI.iPhone.SystemButtonStyle.PLAIN,
        color: "#496197",
        textAlign: "center",
        title: "Jobs",
        id: "jobsButton"
    });
    $.__views.__alloyId11.add($.__views.jobsButton);
    $.__views.__alloyId12 = Ti.UI.createTableViewRow({
        height: 44,
        hasChild: "true",
        id: "__alloyId12"
    });
    $.__views.__alloyId9.add($.__views.__alloyId12);
    $.__views.quotesButton = Ti.UI.createButton({
        height: Ti.UI.SIZE,
        left: 22,
        right: 22,
        style: Ti.UI.iPhone.SystemButtonStyle.PLAIN,
        color: "#496197",
        textAlign: "center",
        title: "Quotes",
        id: "quotesButton"
    });
    $.__views.__alloyId12.add($.__views.quotesButton);
    $.__views.__alloyId0 = Ti.UI.createTableView({
        style: Ti.UI.iPhone.TableViewStyle.GROUPED,
        data: __alloyId2,
        id: "__alloyId0"
    });
    $.__views.clientWindow.add($.__views.__alloyId0);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {}, client = Alloy.Models.User.getSelectedClient();
    String.prototype.toTitleCase = function() {
        var i, str, lowers, uppers;
        str = this.replace(/\w\S*/g, function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
        lowers = [ "A", "An", "The", "And", "But", "Or", "For", "Nor", "As", "At", "By", "For", "From", "In", "Into", "Near", "Of", "On", "To", "With" ];
        for (i = 0; i < lowers.length; i++) str = str.replace(new RegExp("\\s" + lowers[i] + "\\s", "g"), function(txt) {
            return txt.toLowerCase();
        });
        uppers = [ "Id" ];
        for (i = 0; i < uppers.length; i++) str = str.replace(new RegExp("\\b" + uppers[i] + "\\b", "g"), uppers[i].toUpperCase());
        return str;
    };
    if (client) {
        $.companyName.setValue(client.attributes.name);
        $.industryType.setValue(client.attributes.industryType.replace(/[_]/g, " ").toTitleCase());
        $.website.setValue(client.attributes.website);
    }
    $.employeesButton.addEventListener("click", function() {
        var employeesController = Alloy.createController("employees", {
            parentView: $.parentController,
            client: client
        });
        Alloy.Globals.parent.open(employeesController.getView());
    });
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, $model;

module.exports = Controller;