var args = arguments[0] || {};

var addr = 'SW1A 2AA, London, United Kingdom';

Titanium.Geolocation.forwardGeocoder(addr, function(evt) {
	$.mapView.setRegion({
		latitude : evt.latitude,
		longitude : evt.longitude,
		latitudeDelta : 0.1,
		longitudeDelta : 0.1
	});
	var objLocationAnnotation = Titanium.Map.createAnnotation({
		latitude : evt.latitude,
		longitude : evt.longitude,
		// image: 'appcelerator_small.png'
		pincolor : Ti.Map.ANNOTATION_RED,
		animate : true
	});
	$.mapView.addAnnotation(objLocationAnnotation);
});

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

