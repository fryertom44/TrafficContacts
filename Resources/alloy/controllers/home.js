function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    $model = arguments[0] ? arguments[0].$model : null;
    var $ = this, exports = {}, __defers = {};
    $.__views.home = Ti.UI.createTabGroup({
        id: "home"
    });
    $.__views.__alloyId27 = Alloy.createController("clients", {
        id: "__alloyId27"
    });
    $.__views.home.addTab($.__views.__alloyId27.getViewEx({
        recurse: !0
    }));
    $.__views.__alloyId28 = Ti.UI.createWindow({
        backgroundColor: "#fff",
        barColor: "#000",
        title: "Suppliers",
        id: "__alloyId28"
    });
    $.__views.__alloyId29 = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#000",
        font: {
            fontSize: 20,
            fontFamily: "Helvetica Neue"
        },
        textAlign: "center",
        text: "I am Window 2",
        id: "__alloyId29"
    });
    $.__views.__alloyId28.add($.__views.__alloyId29);
    $.__views.suppliersTab = Ti.UI.createTab({
        window: $.__views.__alloyId28,
        id: "suppliersTab",
        title: "Suppliers",
        icon: "KS_nav_views.png"
    });
    $.__views.home.addTab($.__views.suppliersTab);
    $.__views.__alloyId30 = Alloy.createController("mapDetail", {
        id: "__alloyId30"
    });
    $.__views.myLocationTab = Ti.UI.createTab({
        window: $.__views.__alloyId30.getViewEx({
            recurse: !0
        }),
        id: "myLocationTab",
        title: "My Location",
        icon: "KS_nav_views.png"
    });
    $.__views.home.addTab($.__views.myLocationTab);
    $.__views.__alloyId31 = Ti.UI.createWindow({
        backgroundColor: "#fff",
        barColor: "#000",
        title: "Settings",
        id: "__alloyId31"
    });
    $.__views.__alloyId32 = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#000",
        font: {
            fontSize: 20,
            fontFamily: "Helvetica Neue"
        },
        textAlign: "center",
        text: "Settings go here",
        id: "__alloyId32"
    });
    $.__views.__alloyId31.add($.__views.__alloyId32);
    $.__views.settingsTab = Ti.UI.createTab({
        window: $.__views.__alloyId31,
        id: "settingsTab",
        title: "Settings",
        icon: "KS_nav_views.png"
    });
    $.__views.home.addTab($.__views.settingsTab);
    $.addTopLevelView($.__views.home);
    exports.destroy = function() {};
    _.extend($, $.__views);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, $model;

module.exports = Controller;