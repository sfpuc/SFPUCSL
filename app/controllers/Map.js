var MapModule = require('ti.map');
Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_HIGH;
var lat = "";
var lon = "";

function translateErrorCode(code) {
	if (code == null) {
		return null;
	}
	switch (code) {
		case Ti.Geolocation.ERROR_LOCATION_UNKNOWN:
			return "Location unknown";
			break;
		case Ti.Geolocation.ERROR_DENIED:
			return "Access denied";
			break;
		case Ti.Geolocation.ERROR_NETWORK:
			return "Network error";
			break;
		case Ti.Geolocation.ERROR_HEADING_FAILURE:
			return "Failure to detect heading";
			break;
		case Ti.Geolocation.ERROR_REGION_MONITORING_DENIED:
			return "Region monitoring access denied";
			break;
		case Ti.Geolocation.ERROR_REGION_MONITORING_FAILURE:
			return "Region monitoring access failure";
			break;
		case Ti.Geolocation.ERROR_REGION_MONITORING_DELAYED:
			return "Region monitoring setup delayed";
			break;
		default:
			return code;
			break;
	}
}

var locationAdded = false;
var ann;
var locationCallback = function(e) {
	if (!e.success || e.error) {
		$.dialog.title = "error:" + JSON.stringify(e.error);
		$.dialog.show();
		setTimeout(function() {
			$.dialog.hide();
		}, 1500);
		return;
	}
	setTimeout(function() {
		$.mapview.annotations = [], $.mapview.setRegion({
			latitude : e.coords.latitude,
			longitude : e.coords.longitude,
			latitudeDelta : 0.01,
			longitudeDelta : 0.01
		});
		ann = MapModule.createAnnotation({
			latitude : e.coords.latitude,
			longitude : e.coords.longitude,
			pincolor : MapModule.ANNOTATION_RED,
			title : 'Drag and Drop Red Pin And Click on',
			subtitle : 'Report a Problem Button To Open Request',
			animate : true,
			draggable : true
		});
		$.mapview.addAnnotation(ann);
		$.mapview.selectAnnotation(ann);
		$.mapview.userlocation = true;

	}, 2000);

	locationAdded = true;

};

Titanium.Geolocation.addEventListener('location', locationCallback);

if (Titanium.Platform.name == 'android') {
	//  as the destroy handler will remove the listener, only set the pause handler to remove if you need battery savings
	Ti.Android.currentActivity.addEventListener('pause', function(e) {
		Ti.API.info("pause event received");
		if (locationAdded) {
			Ti.API.info("removing location callback on pause");
			Titanium.Geolocation.removeEventListener('location', locationCallback);
			locationAdded = false;
		}
	});
	Ti.Android.currentActivity.addEventListener('destroy', function(e) {
		Ti.API.info("destroy event received");
		if (locationAdded) {
			Ti.API.info("removing location callback on destroy");
			Titanium.Geolocation.removeEventListener('location', locationCallback);
			locationAdded = false;
		}
	});
	Ti.Android.currentActivity.addEventListener('resume', function(e) {
		Ti.API.info("resume event received");
		if (!locationAdded && locationCallback) {
			Ti.API.info("adding location callback on resume");
			Titanium.Geolocation.addEventListener('location', locationCallback);
			locationAdded = true;
		}
	});

}

$.mapview.addEventListener('pinchangedragstate', function(e) {
	$.mapview.selectAnnotation(ann);
	lat = e.annotation.latitude;
	lon = e.annotation.longitude;

});

$.mapview.addEventListener('click', function(e) {
	$.mapview.selectAnnotation(ann);

});

$.mapview.addEventListener('focus', function(e) {
	$.mapview.selectAnnotation(ann);

});

$.mapview.addEventListener('blur', function(e) {
	$.mapview.selectAnnotation(ann);

});
$.mapview.addEventListener('regionchanged', function(e) {
	$.mapview.selectAnnotation(ann);

});

$.mapview.addEventListener('complete', function(e) {
	$.mapview.selectAnnotation(ann);

});

$.addproblem.addEventListener("click", function() {
	if (Titanium.Network.online === false) {
		Titanium.Media.vibrate();
		$.dialog.title = "No Network Available";
		$.dialog.show();
		setTimeout(function() {
			$.dialog.hide();
		}, 1500);

	} else if (lat === null || lat === 'undefined' || lat === '') {
		Titanium.Media.vibrate();
		$.dialog.title = "You need to Select a Location";
		$.dialog.show();
		setTimeout(function() {
			$.dialog.hide();
		}, 1500);

	} else {
		var newTicket = Alloy.createController('Ticket', {
			latitude : lat,
			longitude : lon
		});
		Alloy.Globals.tabGroup.activeTab.open(newTicket.getView());
	}
});
