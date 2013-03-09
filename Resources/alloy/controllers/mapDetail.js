function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    $model = arguments[0] ? arguments[0].$model : null;
    var $ = this, exports = {}, __defers = {};
    $.__views.mapWindow = Ti.UI.createWindow({
        backgroundColor: "#fff",
        barColor: "#000",
        title: "Location",
        id: "mapWindow"
    });
    $.addTopLevelView($.__views.mapWindow);
    var __alloyId51 = [];
    $.__views.mapView = Ti.Map.createView({
        mapType: Ti.Map.STANDARD_TYPE,
        animate: !0,
        regionFit: !0,
        userLocation: !1,
        annotations: __alloyId51,
        ns: Ti.Map,
        id: "mapView"
    });
    $.__views.mapWindow.add($.__views.mapView);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {}, address = args.address;
    xhr = Titanium.Network.createHTTPClient();
    var query = "";
    address && (query = address.getPrintableAddress(","));
    xhr.open("GET", "http://maps.googleapis.com/maps/geo?output=json&q=" + query);
    xhr.onload = function() {
        var json = JSON.parse(this.responseText);
        Ti.API.info(json);
        var theLong = json.Placemark[0].Point.coordinates[0], theLat = json.Placemark[0].Point.coordinates[1];
        $.mapView.setRegion({
            latitude: theLat,
            latitudeDelta: "1",
            longitude: theLong,
            longitudeDelta: "1"
        });
        var clientAnnotation = Titanium.Map.createAnnotation({
            title: Alloy.Models.User.getSelectedClient().attributes.name,
            subtitle: address.getPrintableAddress("\n", !0),
            latitude: theLat,
            longitude: theLong,
            pincolor: Ti.Map.ANNOTATION_RED,
            animate: !0
        });
        $.mapView.addAnnotation(clientAnnotation);
        $.mapview.selectAnnotation(clientAnnotation);
        $.mapView.userLocation = !0;
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