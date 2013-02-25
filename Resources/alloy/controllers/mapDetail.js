function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    $model = arguments[0] ? arguments[0].$model : null;
    var $ = this, exports = {}, __defers = {};
    $.__views.mapWindow = Ti.UI.createWindow({
        title: "Location",
        barColor: "#000",
        backgroundColor: "#fff",
        id: "mapWindow"
    });
    $.addTopLevelView($.__views.mapWindow);
    var __alloyId44 = [];
    $.__views.mapView = Ti.Map.createView({
        mapType: Ti.Map.STANDARD_TYPE,
        animate: !0,
        regionFit: !0,
        userLocation: !1,
        annotations: __alloyId44,
        ns: Ti.Map,
        id: "mapView"
    });
    $.__views.mapWindow.add($.__views.mapView);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {}, myLocation = Titanium.Geolocation.getCurrentPosition(function(e) {
        if (e.error) {
            alert("error " + JSON.stringify(e.error));
            return;
        }
        var current_longitude = e.coords.longitude, current_latitude = e.coords.latitude, current_altitude = e.coords.altitude, current_heading = e.coords.heading, current_accuracy = e.coords.accuracy, current_speed = e.coords.speed, current_timestamp = e.coords.timestamp, current_altitudeAccuracy = e.coords.altitudeAccuracy, thisLocation = Titanium.Map.createAnnotation({
            animate: !0,
            title: "Current Location",
            pincolor: Titanium.Map.ANNOTATION_GREEN,
            latitude: parseFloat(current_latitude),
            longitude: parseFloat(current_longitude)
        });
        return thisLocation;
    });
    xhr = Titanium.Network.createHTTPClient();
    var query = args.addressLineOne + "," + args.addressLineTwo + "," + args.addressLineThree + "," + args.city + "," + args.postcode + "," + args.country;
    xhr.open("GET", "http://maps.googleapis.com/maps/geo?output=json&q=" + query);
    xhr.onload = function() {
        var json = JSON.parse(this.responseText);
        Ti.API.info(json);
        debugger;
        var theLong = json.Placemark[0].Point.coordinates[0], theLat = json.Placemark[0].Point.coordinates[1];
        $.mapView.setRegion({
            latitude: theLat,
            latitudeDelta: "1",
            longitude: theLong,
            longitudeDelta: "1"
        });
        var clientAnnotation = Titanium.Map.createAnnotation({
            title: args.locationTitle,
            subtitle: args.addressName,
            latitude: theLat,
            longitude: theLong,
            pincolor: Ti.Map.ANNOTATION_RED,
            animate: !0
        });
        $.mapView.addAnnotation(clientAnnotation);
        myLocation && $.mapView.addAnnotation(myLocation);
        $.mapview.selectAnnotation(clientAnnotation);
        $.mapView.setRegionFit(!0);
    };
    xhr.onerror = function() {
        Ti.UI.createAlertDialog({
            title: "Geolocation Error",
            message: xhr.responseText
        }).show();
        Ti.API.error("[FORWARDGEOLOCATOR] ERROR: " + xhr.responseText);
    };
    xhr.send();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, $model;

module.exports = Controller;