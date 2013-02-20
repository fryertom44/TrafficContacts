var Alloy = require("alloy"), _ = Alloy._, Backbone = Alloy.Backbone;

Alloy.Globals.authHeader = function() {
    var user = "fryertom@gmail.com", pass = "MR6gFeqG585J5SVZ7Lnv128wHhT2EBgjl5C7F2i2", token = user.concat(":", pass);
    return "Basic ".concat(Ti.Utils.base64encode(token));
};

Alloy.createController("index");