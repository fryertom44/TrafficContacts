function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    $model = arguments[0] ? arguments[0].$model : null;
    var $ = this, exports = {}, __defers = {};
    $.__views.rowView = Ti.UI.createTableViewRow({
        hasDetail: !0,
        id: "rowView"
    });
    $.addTopLevelView($.__views.rowView);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    if (args.data) {
        $.rowView.title = args.data.get("name") || "";
        $.rowView.id = args.data.get("id") || "";
    }
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, $model;

module.exports = Controller;