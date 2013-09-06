////dev url http://mobile311-dev.sfgov.org
var args = arguments[0] || {};
var lat = args.latitude;
var lon = args.longitude;
var picfilename = "";
var picfileurl = "";
var twiturl = "";
var val0 = "";
var val1 = "";
$.lbl.text = "";
var val2 = "";
$.lbl1.text = "";
var tickets = Alloy.Collections.ticket;
var actind = Alloy.createController('actind');

$.button.addEventListener('click', function() {
	$.dialog.show();
});

$.button1.addEventListener('click', function() {
	$.dialog1.show();
});

$.dialog.addEventListener('click', function(e) {
	if (e.index === 0)
		val1 = 'Light_Burnt_Out';
	if (e.index === 1)
		val1 = 'Light_Flickering_On_Off';
	if (e.index === 2)
		val1 = 'Light_Dim';
	if (e.index === 3)
		val1 = 'Light_On_all_the_time';
	if (e.index === 4)
		val1 = 'Pullbox_Wires_Exposed';
	if (e.index === 5)
		val1 = 'Other_Request_Light_Shield';
	if (e.index === 6)
		val1 = 'Other_Request_New_Streetlight';
	if (e.index === 7)
		val1 = 'Other';
	if (e.index === 0)
		val0 = 'Light Burnt Out';
	if (e.index === 1)
		val0 = 'Light Flickering On';
	if (e.index === 2)
		val0 = 'Light Dim';
	if (e.index === 3)
		val0 = 'Light Always On';
	if (e.index === 4)
		val0 = 'Electrical Wires Exposed';
	if (e.index === 5)
		val0 = 'Request Light Shield';
	if (e.index === 6)
		val0 = 'Request New Streetlight';
	if (e.index === 7)
		val0 = 'Other';
	$.lbl.text = 'You selected: ' + val0;
});

$.dialog1.addEventListener('click', function(e) {
	if (e.index === 0)
		val2 = 'Concrete';
	if (e.index === 1)
		val2 = 'Metal';
	if (e.index === 2)
		val2 = 'Wooden';
	if (e.index === 3)
		val2 = 'Unknown';
	$.lbl1.text = 'You selected: ' + val2;
});

$.cancel.addEventListener('click', function() {

	if (picfilename != null && picfilename != 'undefined' && picfilename != "") {
		var file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, picfilename);
		if (file.exists()) {
			file.deleteFile();
		}
	}
	setTimeout(function(e) {
		Titanium.Media.vibrate();
		$.dialog5.title = "Action canceled";
		$.dialog5.show();
		setTimeout(function() {
			$.dialog5.hide();
		}, 1000);
	}, 1000);
	picfilename = "";
	$.newTicket.close();
});

function doValidation(oktoopen) {

	oktoopen = "false";
	if ($.area.value === "Enter Description" || $.area.value.length < 1) {
		Titanium.Media.vibrate();
		$.dialog5.title = "Description is Required";
		$.dialog5.show();
		setTimeout(function() {
			$.dialog5.hide();
		}, 1500);
	} else
		oktoopen = "true";

	if ((val1 === null || val1 === "Select Request Type" || val1 === "") && oktoopen === "true") {
		Titanium.Media.vibrate();
		$.dialog5.title = "Please Select Request Type";
		$.dialog5.show();
		setTimeout(function() {
			$.dialog5.hide();
		}, 1500);
		oktoopen = false;
	}

	if ((val2 === null || val2 === "Select Pole Type" || val2 === "") && oktoopen === "true") {
		Titanium.Media.vibrate();
		$.dialog5.title = "Please Select Pole Type";
		$.dialog5.show();
		setTimeout(function() {
			$.dialog5.hide();
		}, 1500);
		oktoopen = false;
	}

	return oktoopen;
};

$.save.addEventListener('click', function(e) {

	if (Titanium.Network.online === false) {
		Titanium.Media.vibrate();
		setTimeout(function(e) {
			alert("No Network Available");
		}, 1000);
		picfilename = "";
		$.newTicket.close();
	} else {
		$.cancel.hide();
		e.source.hide();
		var oktoopen = "false";

		function renderXML() {
			var ArrayOfStreetlight = this.responseXML.documentElement;
			var light = ArrayOfStreetlight.getElementsByTagName("Streetlight");
			if (light.length > 1) {
				try {
					var item = light.item(0);
					var distance = item.getElementsByTagName("distance").item(0).text;
					if (parseFloat(distance) <= 0.015) {
						oktoopen = doValidation(oktoopen);
						if (oktoopen === "true") {
							var queue = "";
							if (val2 === "Wooden") {
								queue = "No";
							} else {
								queue = "Yes";
							}
							saveit(lat + "&" + lon + "&" + $.area.value + "&" + val1 + "&" + val2 + "&" + queue);
						} else {
							$.cancel.show();
							e.source.show();
						}

					} else {
						oktoopen = doValidation(oktoopen);
						if (oktoopen === "true") {
							var queue = "";
							if (val2 === "Wooden")
								queue = "No";
							else
								queue = "Yes";
							saveit(lat + "&" + lon + "&" + $.area.value + "&" + val1 + "&" + val2 + "&" + queue);

						} else {
							$.cancel.show();
							e.source.show();
						}
					}
				} catch (err) {
					alert("Your location is outside of San Francisco Boundaries");
					$.cancel.show();
					e.source.show();

				}

			} else {
				alert('Error communicating with 311 Server. Please try again later');
			}
		};

		function errorMessage() {
			alert('Error communicating with 311 Server. Please try again later');
		};

		var xhr = Titanium.Network.createHTTPClient({
			onload : renderXML,
			onerror : errorMessage,
			timeout : 15000
		});

		var url = "THIS IS URL TO MY WEB SERVICE -- READ README file. You do not need this ONE -- It just pills list of StreetLights from internal SFPUC DB";
		xhr.open("GET", url);
		xhr.send();

	}

});

function saveit(ticdata) {

	var xhr = Titanium.Network.createHTTPClient();
	xhr.onerror = function(e) {
		actind.getView().open({
			modal : true
		});
		threeoneone(ticdata);
	};

	xhr.onload = function(e) {
		parsedData = JSON.parse(this.responseText);
		var id = parsedData.id;
		twiturl = "http://twitpic.com/" + id;
		threeoneone(ticdata);
	};

	xhr.onsendstream = function(e) {

		actind.getView().open({
			modal : true
		});

	};

	xhr.open('POST', 'http://api.twitpic.com/1/uploadAndPost.json');

	if (picfilename === null || picfilename === "") {
		actind.getView().open({
			modal : true
		});
		threeoneone(ticdata);

	} else {

		f1 = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, picfilename);

		var ImageFactory = require('ti.imagefactory');
		var i1 = ImageFactory.imageAsResized(f1.read(), {
			width : '300',
			height : '300'
		});

		xhr.send({
			key : 'your key',
			consumer_token : 'your',
			consumer_secret : 'your',
			oauth_token : 'your',
			oauth_secret : 'your',
			message : picfilename,
			media : i1
		});
	}

}

$.img.addEventListener("click", function(e) {
	Titanium.Media.showCamera({
		success : function(event) {
			try {
				var cropRect = event.cropRect;
				var image = event.media;
				var cropRect = event.cropRect;
				var image = event.media;
				tickets.fetch();
				var num;
				num = tickets.length + 1;
				var fnum;
				picfilename = num.toString() + ".png";
				var f = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, picfilename);
				f.write(image);
				picfileurl = f.nativePath;

			} catch (err) {
				alert("Error Communicating with a Camere");
			}

		},
		cancel : function() {

		},
		error : function(error) {
			var a = Titanium.UI.createAlertDialog({
				title : 'Camera'
			});
			if (error.code == Titanium.Media.NO_CAMERA)
				a.setMessage('Device does not have video recording capabilities');
			else
				a.setMessage('Unexpected error: ' + error.code);
			a.show();
		},
		allowEditing : true
	});

});

function threeoneone(ticdata) {
	var word = ticdata.split("&");
	function renderXML() {
		var service_requests = this.responseXML.documentElement;
		var tour = service_requests.getElementsByTagName("request");
		if (tour.length === 1) {
			var item = tour.item(0);
			var token = item.getElementsByTagName("token").item(0).text;
			Titanium.Media.vibrate();
			var light = "";
			if (word[5] === 'Yes') {
				light = "(More likely to be a City light)";
			}
			if (word[5] === 'No') {
				light = "(More likely to be a PGE light)";
			}

			setTimeout(function(e) {
				$.dialog5.title = "";
				$.dialog5.message = "Request submitted to SF311 " + light;
				$.dialog5.show();
				setTimeout(function() {
					$.dialog5.hide();
				}, 3000);
			}, 3000);

			tickets.fetch();
			var data = {
				"num" : tickets.length + 1,
				"token" : token,
				"lat" : word[0],
				"lon" : word[1],
				"request_type" : word[3],
				"pole_type" : word[4],
				"status" : "pending",
				"address" : "pending",
				"request" : "pending",
				"desc" : word[2],
				"url" : twiturl,
				"pngurl" : picfileurl
			};

			var ticket = Alloy.createModel("ticket", data);
			tickets.add(ticket);
			ticket.save();
			picfilename = "";
			twiturl = "";
			actind.getView().close();
			$.newTicket.close();
		} else
			alert('Error communicating with 311 Server. Please try again later');
	}

	function errorMessage() {
		alert('Error communicating with 311 Server. Please try again later');
	}

	var xhr1 = Titanium.Network.createHTTPClient({
		onload : renderXML,
		onerror : errorMessage,
		timeout : 50000
	});
	//dev url
	var url = "THIS IS URL TO MY WEB SERVICE -- READ README file. You can POST to 311 using Titanium APIs";

	xhr1.open("GET", url);
	xhr1.send();

}

