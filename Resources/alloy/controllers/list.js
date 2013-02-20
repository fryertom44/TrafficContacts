function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    $model = arguments[0] ? arguments[0].$model : null;
    var $ = this, exports = {}, __defers = {};
    $.__views.list = A$(Ti.UI.createTableView({
        id: "list"
    }), "TableView", null);
    $.addTopLevelView($.__views.list);
    exports.destroy = function() {};
    _.extend($, $.__views);
    sendAuthentication = function(xhr) {
        var user = "fryertom@gmail.com", pass = "MR6gFeqG585J5SVZ7Lnv128wHhT2EBgjl5C7F2i2", token = user.concat(":", pass);
        xhr.setRequestHeader("Authorization", "Basic ".concat(Ti.Utils.base64encode(token)));
    };
    Alloy.Collections.Client = Alloy.createCollection("client");
    Alloy.Collections.Client.fetch({
        headers: {
            Authorization: "Basic ZnJ5ZXJ0b21AZ21haWwuY29tOk1SNmdGZXFHNTg1SjVTVlo3TG52MTI4d0hoVDJFQmdqbDVDN0YyaTI="
        },
        success: function(collection, response) {
            Ti.API.debug("Clients list loaded!!!!!");
            console.log(response);
            debugger;
            var data = [];
            Alloy.Collections.Client.map(function(client) {
                var clientName = client.get("name"), row = Ti.UI.createTableViewRow({
                    title: clientName
                });
                data.push(row);
            });
            $.list.setData(data);
        },
        error: function(collection, response) {
            Ti.API.debug("Loading Clients list failed");
            console.log(response);
        }
    });
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, A$ = Alloy.A, $model;

module.exports = Controller;