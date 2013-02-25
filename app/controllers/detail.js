var args = arguments[0] || {};
//
// this is setting the view elements of the row view
// which is found in views/row.xml based on the arguments
// passed into the controller
//
$.parentController = args.parentTab;
var client = args.data.attributes;

//Set the form fields

if (client) {
    $.companyName.setValue(client.name);
    $.industryType.setValue(client.industryType);
    $.website.setValue(client.website);

    if (client.primaryLocation) {
        $.addressText.setValue(function() {
            var addressArray = [client.primaryLocation.address.addressName, client.primaryLocation.address.lineOne, client.primaryLocation.address.lineTwo, client.primaryLocation.address.lineThree, client.primaryLocation.address.city, client.primaryLocation.address.postCode, client.primaryLocation.address.country.printableName];
            var addressAsText;
            for (var i = 0, j = addressArray.length; i < j; i++) {
                if (addressArray[i])
                    addressAsText.concat(addressAsText, addressArray[i] + '\n');
            };
            return addressAsText;
        });
    };

    if (client.primaryContact && client.primaryContact.personalDetails) {
        $.contactName.setValue(client.primaryContact.personalDetails.firstName + ' ' + client.primaryContact.personalDetails.lastName);
        $.contactJobTitle.setValue(client.primaryContact.jobTitle);
        $.contactPhone.setValue(client.primaryContact.personalDetails.workPhone);
        $.contactMobile.setValue(client.primaryContact.personalDetails.mobilePhone);
        $.companyEmail.setValue(client.primaryContact.personalDetails.emailAddress);
    };
}

// display the map
$.showMapButton.addEventListener('click', function(_e) {
    var mapController = Alloy.createController('MapDetail', {
        locationTitle : client.name,
        addressName : client.primaryLocation.address.addressName,
        addressLineOne : client.primaryLocation.address.lineOne,
        addressLineTwo : client.primaryLocation.address.lineTwo,
        addressLineThree : client.primaryLocation.address.lineThree,
        city : client.primaryLocation.address.city,
        postcode : client.primaryLocation.address.postCode,
        country : client.primaryLocation.address.country.printableName,
    });
    args.parentTab.open(mapController.getView());
});

