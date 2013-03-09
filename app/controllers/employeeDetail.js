var args = arguments[0] || {};

$.parentController = args.parentView;
var employee = args.employee;
var address = employee.getAddress();

if (address) {
    $.addressText.setValue(address.getPrintableAddress('\n'));
};

if (employee && employee.attributes.personalDetails) {
    $.contactName.setValue(employee.attributes.personalDetails.firstName + ' ' + employee.attributes.personalDetails.lastName);
    $.contactJobTitle.setValue(employee.attributes.jobTitle);
    $.contactPhone.setValue(employee.attributes.personalDetails.workPhone);
    $.contactMobile.setValue(employee.attributes.personalDetails.mobilePhone);
    $.contactEmail.setValue(employee.attributes.personalDetails.emailAddress);
};

// display the map
$.showMapButton.addEventListener('click', function() { 
    var mapController = Alloy.createController('mapDetail',{
    address : address });
    Alloy.Globals.parent.open(mapController.getView());
}); 

