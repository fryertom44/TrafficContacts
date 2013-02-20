function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    $model = arguments[0] ? arguments[0].$model : null;
    var $ = this, exports = {}, __defers = {};
    $.__views.detail = A$(Ti.UI.createView({
        backgroundColor: "white",
        id: "detail"
    }), "View", null);
    $.addTopLevelView($.__views.detail);
    $.__views.__alloyId1 = A$(Ti.UI.createTableViewSection({
        headerTitle: "Title",
        id: "__alloyId1"
    }), "TableViewSection", null);
    var __alloyId2 = [];
    __alloyId2.push($.__views.__alloyId1);
    $.__views.__alloyId3 = A$(Ti.UI.createTableViewRow({
        id: "__alloyId3"
    }), "TableViewRow", $.__views.__alloyId1);
    $.__views.__alloyId1.add($.__views.__alloyId3);
    $.__views.title = A$(Ti.UI.createTextField({
        hintText: "Title",
        id: "title"
    }), "TextField", $.__views.__alloyId3);
    $.__views.__alloyId3.add($.__views.title);
    $.__views.__alloyId4 = A$(Ti.UI.createTableViewSection({
        headerTitle: "Location",
        id: "__alloyId4"
    }), "TableViewSection", null);
    __alloyId2.push($.__views.__alloyId4);
    $.__views.__alloyId5 = A$(Ti.UI.createTableViewRow({
        id: "__alloyId5"
    }), "TableViewRow", $.__views.__alloyId4);
    $.__views.__alloyId4.add($.__views.__alloyId5);
    $.__views.location = A$(Ti.UI.createTextField({
        hintText: "Location",
        id: "location"
    }), "TextField", $.__views.__alloyId5);
    $.__views.__alloyId5.add($.__views.location);
    $.__views.__alloyId6 = A$(Ti.UI.createTableViewSection({
        headerTitle: "Notes",
        id: "__alloyId6"
    }), "TableViewSection", null);
    __alloyId2.push($.__views.__alloyId6);
    $.__views.__alloyId7 = A$(Ti.UI.createTableViewRow({
        id: "__alloyId7"
    }), "TableViewRow", $.__views.__alloyId6);
    $.__views.__alloyId6.add($.__views.__alloyId7);
    $.__views.__alloyId8 = A$(Ti.UI.createTextArea({
        hintText: "Notes",
        id: "__alloyId8"
    }), "TextArea", $.__views.__alloyId7);
    $.__views.__alloyId7.add($.__views.__alloyId8);
    $.__views.__alloyId0 = A$(Ti.UI.createTableView({
        style: Ti.UI.iPhone.TableViewStyle.GROUPED,
        data: __alloyId2,
        id: "__alloyId0"
    }), "TableView", $.__views.detail);
    $.__views.detail.add($.__views.__alloyId0);
    exports.destroy = function() {};
    _.extend($, $.__views);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, A$ = Alloy.A, $model;

module.exports = Controller;