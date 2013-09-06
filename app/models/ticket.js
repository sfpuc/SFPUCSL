exports.definition = {
	config : {
		columns : {
			"num" : "int",
			"request" : "string",
			"token" : "string",
			"lat" : "string",
			"lon" : "string",
			"request_type" : "string",
			"pole_type" : "string",
			"status" : "string",
			"address" : "string",
			"desc" : "text",
			"url" : "string",
			"pngurl" : "string"
		},
		adapter : {
			type : "sql",
			collection_name : "ticket"
		}
	},
	extendModel : function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
		});

		return Model;
	},
	extendCollection : function(Collection) {
		_.extend(Collection.prototype, {
			// Implement the comparator method,
			// which is used to sort the collection
			comparator : function(ticket) {
				return ticket.get('num');
			}
		});
		// end extend
		return Collection;
	}
};
