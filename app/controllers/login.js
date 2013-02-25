$.username.value = Ti.App.Properties.getString('username');
$.password.value = Ti.App.Properties.getString('password');

$.loginButton.addEventListener('click', function() {
    Alloy.Collections.User = Alloy.createCollection('user'); 
    Alloy.Collections.User.fetch({
        queryParams : {
            filter : "emailAddress|EQ|\"" + $.username.value + "\""
        },
        processData : true,
        headers : {
            Authorization : Alloy.Globals.authHeader($.username.value, $.password.value),
        },
        success : function(collection, response) { 
            Ti.API.debug('Login success!!!!!');
            console.log(response);
            var userFound = false;

            Alloy.Collections.User.map(function(user) {
                // The client argument is an individual model object in the collection
                if (user.attributes.employeeDetails.personalDetails.emailAddress == $.username.value) {
                    userFound = true;
                    Ti.App.Properties.setString('username', $.username.value);
                    Ti.App.Properties.setString('password', $.password.value);
                }
            });
            if (userFound) {
                var homeController = Alloy.createController('home');
                var homeView = homeController.getView();
                homeView.open();
            };
        },
        error : function(collection, response) {
            Ti.API.debug('Login failure');
            Ti.UI.createAlertDialog({
                title : 'Login failure',
                message : 'Check username and API key and try again.'
            }).show();
            console.log(response);
        }
    });
});
