function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    $model = arguments[0] ? arguments[0].$model : null;
    var $ = this, exports = {}, __defers = {};
    $.__views.loginWindow = Ti.UI.createWindow({
        barColor: "#000",
        backgroundGradient: {
            type: "radial",
            startPoint: {
                x: "50%",
                y: "50%"
            },
            endPoint: {
                x: "70%",
                y: "70%"
            },
            colors: [ "#699F21", "#94C138" ],
            startRadius: "90%",
            endRadius: 0,
            backfillStart: !0
        },
        id: "loginWindow",
        title: "Login"
    });
    $.addTopLevelView($.__views.loginWindow);
    $.__views.__alloyId43 = Ti.UI.createTableViewSection({
        id: "__alloyId43"
    });
    var __alloyId44 = [];
    __alloyId44.push($.__views.__alloyId43);
    $.__views.__alloyId45 = Ti.UI.createTableViewRow({
        height: 44,
        backgroundColor: "#FFF",
        id: "__alloyId45"
    });
    $.__views.__alloyId43.add($.__views.__alloyId45);
    $.__views.__alloyId46 = Ti.UI.createLabel({
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
        text: "Username:",
        id: "__alloyId46"
    });
    $.__views.__alloyId45.add($.__views.__alloyId46);
    $.__views.username = Ti.UI.createTextField({
        left: 120,
        right: 22,
        textAlign: "left",
        editable: !0,
        color: "#000",
        hintText: "me@example.com",
        id: "username"
    });
    $.__views.__alloyId45.add($.__views.username);
    $.__views.__alloyId47 = Ti.UI.createTableViewRow({
        height: 44,
        backgroundColor: "#FFF",
        id: "__alloyId47"
    });
    $.__views.__alloyId43.add($.__views.__alloyId47);
    $.__views.__alloyId48 = Ti.UI.createLabel({
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
        text: "API Key:",
        id: "__alloyId48"
    });
    $.__views.__alloyId47.add($.__views.__alloyId48);
    $.__views.password = Ti.UI.createTextField({
        left: 120,
        right: 22,
        textAlign: "left",
        editable: !0,
        color: "#000",
        hintText: "API Key",
        id: "password",
        passwordMask: "true"
    });
    $.__views.__alloyId47.add($.__views.password);
    $.__views.__alloyId49 = Ti.UI.createTableViewSection({
        id: "__alloyId49"
    });
    __alloyId44.push($.__views.__alloyId49);
    $.__views.__alloyId50 = Ti.UI.createTableViewRow({
        height: 44,
        backgroundColor: "#FFF",
        id: "__alloyId50"
    });
    $.__views.__alloyId49.add($.__views.__alloyId50);
    $.__views.loginButton = Ti.UI.createButton({
        height: Ti.UI.SIZE,
        left: 22,
        right: 22,
        style: Ti.UI.iPhone.SystemButtonStyle.PLAIN,
        color: "#496197",
        textAlign: "center",
        title: "Login",
        id: "loginButton"
    });
    $.__views.__alloyId50.add($.__views.loginButton);
    $.__views.__alloyId41 = Ti.UI.createTableView({
        backgroundColor: "transparent",
        style: Ti.UI.iPhone.TableViewStyle.GROUPED,
        data: __alloyId44,
        id: "__alloyId41"
    });
    $.__views.loginWindow.add($.__views.__alloyId41);
    $.__views.logo = Ti.UI.createImageView({
        height: 200,
        image: "whiteLogo160.png",
        id: "logo"
    });
    $.__views.__alloyId41.headerView = $.__views.logo;
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.username.value = Ti.App.Properties.getString("username");
    $.password.value = Ti.App.Properties.getString("password");
    $.loginButton.addEventListener("click", function() {
        Alloy.Collections.User = Alloy.createCollection("user");
        Alloy.Collections.User.fetch({
            queryParams: {
                filter: "emailAddress|EQ|\"" + $.username.value + "\""
            },
            processData: !0,
            headers: {
                Authorization: Alloy.Globals.authHeader($.username.value, $.password.value)
            },
            success: function(collection, response) {
                Ti.API.debug("Login success!!!!!");
                console.log(response);
                var userFound = !1;
                Alloy.Collections.User.map(function(user) {
                    if (user.attributes.employeeDetails.personalDetails.emailAddress == $.username.value) {
                        userFound = !0;
                        Ti.App.Properties.setString("username", $.username.value);
                        Ti.App.Properties.setString("password", $.password.value);
                    }
                });
                if (userFound) {
                    var homeController = Alloy.createController("home"), homeView = homeController.getView();
                    homeView.open();
                }
            },
            error: function(collection, response) {
                Ti.API.debug("Login failure");
                Ti.UI.createAlertDialog({
                    title: "Login failure",
                    message: "Check username and API key and try again."
                }).show();
                console.log(response);
            }
        });
    });
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, $model;

module.exports = Controller;