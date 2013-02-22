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
    var __alloyId31 = [];
    $.__views.mapView = Ti.Map.createView({
        mapType: Ti.Map.STANDARD_TYPE,
        animate: !0,
        regionFit: !0,
        userLocation: !1,
        annotations: __alloyId31,
        ns: Ti.Map,
        id: "mapView"
    });
    $.__views.mapWindow.add($.__views.mapView);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {}, addr = "SW1A 2AA, London, United Kingdom";
    Titanium.Geolocation.forwardGeocoder(addr, function(evt) {
        $.mapView.setRegion({
            latitude: evt.latitude,
            longitude: evt.longitude,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1
        });
        var objLocationAnnotation = Titanium.Map.createAnnotation({
            latitude: evt.latitude,
            longitude: evt.longitude,
            pincolor: Ti.Map.ANNOTATION_RED,
            animate: !0
        });
        $.mapView.addAnnotation(objLocationAnnotation);
    });
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, $model;

module.exports = Controller;