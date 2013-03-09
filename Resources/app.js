var Alloy = require("alloy"), _ = Alloy._, Backbone = Alloy.Backbone;

Alloy.Models.User = Alloy.createModel("user");

Alloy.Globals.authHeader = function(user, apiKey) {
    var user = user || Ti.App.Properties.getString("username"), pass = apiKey || Ti.App.Properties.getString("password"), token = user.concat(":", pass), auth = "Basic ".concat(Ti.Utils.base64encode(token));
    return auth.replace(/[\n\r]/g, "");
};

Alloy.createController("index");