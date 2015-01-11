var client = require('cloud/client/client.js');

var Response = {
	ParametersEmpty: "Please provide complete details",
	InternalServerError: "Oops! Some error occurred! Please try again",
	NotFound: "Requested resource not found!",
	LoginError: "Some error in current session!",
	SaveSuccess: "Resource saved successfully!",
	UpdateSuccess: "Resource updated successfully!",
	DeleteSuccess: "Resource deleted successfully!"
};

Parse.Cloud.define("saveClient", function(req, res) {
	if(!req.params.id || req.params.id == 0) {
		client.save({
			name: req.params.name,
			address1: req.params.address1,
			address2: req.params.address2,
			address3: req.params.address3,
			city: req.params.city,
			success: function(message) {
				res.success(message);
			},
			error: function(error) {
				res.error(error);
			}
		});
	} else {
		client.update({
			id: req.params.id,
			name: req.params.name,
			address1: req.params.address1,
			address2: req.params.address2,
			address3: req.params.address3,
			city: req.params.city,
			success: function(message) {
				res.success(message);
			},
			error: function(error) {
				res.error(error);
			}
		});
	}
});
