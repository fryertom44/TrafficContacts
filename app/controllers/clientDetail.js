var args = arguments[0] || {};
//
// this is setting the view elements of the row view
// which is found in views/row.xml based on the arguments
// passed into the controller
//
// $.parentController = args.parentView;
// $.parentController = args.parentView;

var client = Alloy.Models.User.getSelectedClient();

String.prototype.toTitleCase = function() {
    var i, str, lowers, uppers;
    str = this.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });

    // Certain minor words should be left lowercase unless
    // they are the first or last words in the string
    lowers = ['A', 'An', 'The', 'And', 'But', 'Or', 'For', 'Nor', 'As', 'At', 'By', 'For', 'From', 'In', 'Into', 'Near', 'Of', 'On', 'To', 'With'];
    for ( i = 0; i < lowers.length; i++)
        str = str.replace(new RegExp('\\s' + lowers[i] + '\\s', 'g'), function(txt) {
            return txt.toLowerCase();
        });

    // Certain words such as initialisms or acronyms should be left uppercase
    uppers = ['Id'];
    for ( i = 0; i < uppers.length; i++)
        str = str.replace(new RegExp('\\b' + uppers[i] + '\\b', 'g'), uppers[i].toUpperCase());

    return str;
}
//Set the form fields

if (client) {
    $.companyName.setValue(client.attributes.name);
    $.industryType.setValue(client.attributes.industryType.replace(/[_]/g, ' ').toTitleCase());
    $.website.setValue(client.attributes.website);

}
//Button click handlers
$.employeesButton.addEventListener("click", function() { 
    var employeesController = Alloy.createController("employees", {
        parentView : $.parentController,
        client : client,
    });
    // $.parentController.open(employeesController.getView());
    Alloy.Globals.parent.open(employeesController.getView());
});
