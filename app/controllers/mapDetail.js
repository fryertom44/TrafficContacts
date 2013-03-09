var args = arguments[0] || {};

var address = args.address;

// var addr = 'SW1A 2AA, London, United Kingdom';
// Titanium.Geolocation.forwardGeocoder(addr, function(evt) {
// $.mapView.setRegion({
// latitude : evt.latitude,
// longitude : evt.longitude,
// latitudeDelta : 0.1,
// longitudeDelta : 0.1
// });
// var objLocationAnnotation = Titanium.Map.createAnnotation({
// latitude : evt.latitude,
// longitude : evt.longitude,
// // image: 'appcelerator_small.png'
// pincolor : Ti.Map.ANNOTATION_RED,
// animate : true
// });
// $.mapView.addAnnotation(objLocationAnnotation);
//
// });

// var myLocation = Titanium.Geolocation.getCurrentPosition(function(e) {
// if (e.error) {
// alert('error ' + JSON.stringify(e.error))
// return;
// }
//
// var current_longitude = e.coords.longitude;
// var current_latitude = e.coords.latitude;
// var current_altitude = e.coords.altitude;
// var current_heading = e.coords.heading;
// var current_accuracy = e.coords.accuracy;
// var current_speed = e.coords.speed;
// var current_timestamp = e.coords.timestamp;
// var current_altitudeAccuracy = e.coords.altitudeAccuracy;
//
// var thisLocation = Titanium.Map.createAnnotation({
// animate : true,
// title : "Current Location",
// pincolor : Titanium.Map.ANNOTATION_GREEN,
// latitude : parseFloat(current_latitude),
// longitude : parseFloat(current_longitude),
// });
// return thisLocation;
// });

xhr = Titanium.Network.createHTTPClient();

var query = "";
if (address) {
    query = address.getPrintableAddress(",");
}

// or whatever you want to forward geocode
xhr.open('GET', 'http://maps.googleapis.com/maps/geo?output=json&q=' + query);

xhr.onload = function() {
    var json = JSON.parse(this.responseText);
    Ti.API.info(json);

    var theLong = json.Placemark[0].Point.coordinates[0];
    var theLat = json.Placemark[0].Point.coordinates[1];

    $.mapView.setRegion({
        latitude : theLat,
        latitudeDelta : "1",
        longitude : theLong,
        longitudeDelta : "1"
    });

    var clientAnnotation = Titanium.Map.createAnnotation({
        title : Alloy.Models.User.getSelectedClient().attributes.name,
        subtitle : address.getPrintableAddress("\n",true),
        latitude : theLat,
        longitude : theLong,
        // image: 'appcelerator_small.png'
        pincolor : Ti.Map.ANNOTATION_RED,
        animate : true
    });
    $.mapView.addAnnotation(clientAnnotation);

    // if (myLocation) {
    // $.mapView.addAnnotation(myLocation);
    // };
    //
    $.mapview.selectAnnotation(clientAnnotation);
    $.mapView.userLocation = true;
    $.mapView.setRegionFit(true);

};

//Handle error
xhr.onerror = function() {
    Ti.UI.createAlertDialog({
        title : 'Geolocation Error',
        message : xhr.responseText
    }).show();
    Ti.API.error('[FORWARDGEOLOCATOR] ERROR: ' + xhr.responseText);
}
xhr.send();

// var ann = Ti.Map.createAnnotation({
// // latitude : args.model.get("capturedLat"),
// // longitude : args.model.get("capturedLong"),
// // title : args.model.get("name"),
// subtitle : ('busted'),
// pincolor : Ti.Map.ANNOTATION_RED,
// animate : true
// });
//
// $.mapView.addAnnotation(ann);

// $.mapView.setRegion({
// // latitude : args.model.get("capturedLat"),
// // longitude : args.model.get("capturedLong"),
// latitudeDelta : 0.1,
// longitudeDelta : 0.1
// });

// error : function() {
// Ti.UI.createAlertDialog({
// title : 'Loading clients failed',
// message : 'Check network connection and try again.'
// }).show();
// console.log(response);
// }