// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};

//Global singleton model, used for storing user details and also the current selection
Alloy.Models.User = Alloy.createModel('user');

Alloy.Globals.authHeader = function(user, apiKey){
    
//"fryertom@gmail.com";
	var user = user || Ti.App.Properties.getString('username');
//"MR6gFeqG585J5SVZ7Lnv128wHhT2EBgjl5C7F2i2";
	var pass = apiKey || Ti.App.Properties.getString('password')
	var token = user.concat(":", pass);
	var auth = "Basic ".concat(Ti.Utils.base64encode(token));
    return auth.replace(/[\n\r]/g, '');
}