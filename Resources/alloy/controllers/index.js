function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    $model = arguments[0] ? arguments[0].$model : null;
    var $ = this, exports = {}, __defers = {};
    $.__views.index = Ti.UI.createTabGroup({
        id: "index"
    });
    $.__views.__alloyId28 = Alloy.createController("clients", {
        id: "__alloyId28"
    });
    $.__views.index.addTab($.__views.__alloyId28.getViewEx({
        recurse: !0
    }));
    $.__views.__alloyId29 = Ti.UI.createWindow({
        backgroundColor: "#fff",
        barColor: "#000",
        title: "Suppliers",
        id: "__alloyId29"
    });
    $.__views.__alloyId30 = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#000",
        font: {
            fontSize: 20,
            fontFamily: "Helvetica Neue"
        },
        textAlign: "center",
        text: "I am Window 2",
        id: "__alloyId30"
    });
    $.__views.__alloyId29.add($.__views.__alloyId30);
    $.__views.suppliersTab = Ti.UI.createTab({
        window: $.__views.__alloyId29,
        id: "suppliersTab",
        title: "Suppliers",
        icon: "KS_nav_views.png"
    });
    $.__views.index.addTab($.__views.suppliersTab);
    $.addTopLevelView($.__views.index);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.index.open();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, $model;

module.exports = Controller;