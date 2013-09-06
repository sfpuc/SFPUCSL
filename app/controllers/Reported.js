////dev url http://mobile311-dev.sfgov.org
var tickets = Alloy.Collections.ticket;
tickets.fetch();
tickets.sort();
var jurid = "jurisdiction_id=sfgov.org";
var send;
if (tickets.length === 0)
	$.label.text = "You do not have any open requests";
else
	$.label.text = "Click on request to refresh and more information";

$.tableview.addEventListener("click", function(e) {
	$.label.text = "Click on request to refresh and more information";
	send = tickets.get(e.rowData.model);
	if (send.toJSON().request === 'pending' || send.toJSON().request === '') {
		var xhr = Titanium.Network.createHTTPClient({
			timeout : 5000
		});
		xhr.onload = function() {
			var service_requests = this.responseXML.documentElement;
			var request = service_requests.getElementsByTagName("request");
			if (request.length === 1) {
				var item = request.item(0);
				send.set("request", item.getElementsByTagName("service_request_id").item(0).text);
				send.save();
				tickets.fetch();
				refstaadd();
			}
		};

		xhr.onerror = function() {
			$.dialog5.message = "Error communicating with 311 Server. Please try later.";
			$.dialog5.show();
			setTimeout(function() {
				$.dialog5.hide();
			}, 1500);
		};
		var url = "http://Mobile311-dev.sfgov.org/open311/v2/tokens/";
		url = url + send.toJSON().token + ".xml?" + jurid;
		xhr.open("GET", url);
		xhr.send();
	} else if (send.toJSON().request != 'pending' && send.toJSON().request != '' && (send.toJSON().address === 'pending' || send.toJSON().status === 'pending'  )) {
		refstaadd();
	} else {
		var ReportedRow = Alloy.createController("ReportedRow", {
			parentTab : $.ReportedTab,
			data : send,
			"$model" : send
		});
		$.ReportedTab.open(ReportedRow.getView());
	}

	function refstaadd() {

		var xhr = Titanium.Network.createHTTPClient({
			timeout : 5000
		});

		xhr.onload = function() {
			var service_requests = this.responseXML.documentElement;
			var request = service_requests.getElementsByTagName("request");
			if (request.length === 1) {
				var item = request.item(0);
				send.set("status", item.getElementsByTagName("status").item(0).text);
				send.set("address", item.getElementsByTagName("address").item(0).text);
				send.save();
				tickets.fetch();

				var ReportedRow = Alloy.createController("ReportedRow", {
					parentTab : $.ReportedTab,
					data : send,
					"$model" : send
				});
				$.ReportedTab.open(ReportedRow.getView());
			}

		};

		xhr.onerror = function() {
			$.dialog5.message = "Error communicating with 311 Server. Please try later.";
			$.dialog5.show();
			setTimeout(function() {
				$.dialog5.hide();
			}, 1500);

		};

		var url = "http://Mobile311-dev.sfgov.org/open311/v2/requests/";
		url = url + send.toJSON().request + ".xml?" + jurid;
		xhr.open("GET", url);
		xhr.send();

	}

});
