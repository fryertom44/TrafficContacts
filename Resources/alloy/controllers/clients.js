function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    $model = arguments[0] ? arguments[0].$model : null;
    var $ = this, exports = {}, __defers = {};
    $.__views.clientWindow = Ti.UI.createWindow({
        backgroundColor: "#fff",
        barColor: "#000",
        id: "clientWindow",
        title: "Clients"
    });
    $.__views.list = Ti.UI.createTableView({
        id: "list"
    });
    $.__views.clientWindow.add($.__views.list);
    $.__views.list.headerPullView = undefined;
    $.__views.clientsTab = Ti.UI.createTab({
        window: $.__views.clientWindow,
        id: "clientsTab",
        title: "Clients",
        icon: "KS_nav_ui.png"
    });
    $.addTopLevelView($.__views.clientsTab);
    exports.destroy = function() {};
    _.extend($, $.__views);
    Alloy.Collections.Client = Alloy.createCollection("client");
    Alloy.Collections.Client.fetch({
        headers: {
            Authorization: Alloy.Globals.authHeader()
        },
        queryParams: {
            order: "name"
        },
        success: function(collection, response) {
            Ti.API.debug("Clients list loaded!!!!!");
            console.log(response);
            var data = [];
            Alloy.Collections.Client.map(function(client) {
                var arg = {
                    title: client.get("name"),
                    data: client
                }, row = Alloy.createController("row", arg).getView();
                data.push(row);
            });
            $.list.setData(data);
        },
        error: function(collection, response) {
            Ti.API.debug("Loading Clients list failed");
            Ti.UI.createAlertDialog({
                title: "Loading clients failed",
                message: "Check network connection and try again."
            }).show();
            console.log(response);
        }
    });
    $.list.addEventListener("click", function(_e) {
        var clientSelected = Alloy.Collections.Client.get(_e.row.id);
        Alloy.Models.User.setSelectedClient(clientSelected);
        var detailController = Alloy.createController("clientDetail", {
            data: clientSelected
        });
        Alloy.Globals.parent = $.clientsTab;
        Alloy.Globals.parent.open(detailController.getView());
    });
    __defers["$.__views.__alloyId15!click!refreshItems"] && $.__views.__alloyId15.addEventListener("click", refreshItems);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, $model;

module.exports = Controller;