function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    $model = arguments[0] ? arguments[0].$model : null;
    var $ = this, exports = {}, __defers = {};
    $.__views.index = A$(Ti.UI.createTabGroup({
        id: "index"
    }), "TabGroup", null);
    $.__views.__alloyId11 = A$(Ti.UI.createWindow({
        backgroundColor: "#fff",
        title: "Clients",
        id: "__alloyId11"
    }), "Window", null);
    $.__views.__alloyId12 = A$(Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#000",
        font: {
            fontSize: 20,
            fontFamily: "Helvetica Neue"
        },
        textAlign: "center",
        text: "I am Window 1",
        id: "__alloyId12"
    }), "Label", $.__views.__alloyId11);
    $.__views.__alloyId11.add($.__views.__alloyId12);
    $.__views.list = Alloy.createController("list", {
        id: "list"
    });
    $.__views.list.setParent($.__views.__alloyId11);
    $.__views.__alloyId10 = A$(Ti.UI.createTab({
        window: $.__views.__alloyId11,
        title: "Clients",
        icon: "KS_nav_ui.png",
        id: "__alloyId10"
    }), "Tab", null);
    $.__views.index.addTab($.__views.__alloyId10);
    $.__views.__alloyId14 = A$(Ti.UI.createWindow({
        backgroundColor: "#fff",
        title: "Suppliers",
        id: "__alloyId14"
    }), "Window", null);
    $.__views.__alloyId15 = A$(Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#000",
        font: {
            fontSize: 20,
            fontFamily: "Helvetica Neue"
        },
        textAlign: "center",
        text: "I am Window 2",
        id: "__alloyId15"
    }), "Label", $.__views.__alloyId14);
    $.__views.__alloyId14.add($.__views.__alloyId15);
    $.__views.__alloyId13 = A$(Ti.UI.createTab({
        window: $.__views.__alloyId14,
        title: "Suppliers",
        icon: "KS_nav_views.png",
        id: "__alloyId13"
    }), "Tab", null);
    $.__views.index.addTab($.__views.__alloyId13);
    $.addTopLevelView($.__views.index);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.index.open();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, A$ = Alloy.A, $model;

module.exports = Controller;