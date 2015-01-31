var express = require('express');
var router = express.Router();

router.get('/save', function(req, res) {
	console.log("Rendering clients save page...");
	var currentUser = req.session.user ? JSON.parse(req.session.user) : null;	
	if (currentUser) {	
		res.render('client', { title: 'Client'});
	} else {
		res.redirect('/login');
	}
});

router.post('/save', function(req, res) {
	console.log("Saving client...");
	var currentUser = req.session.user ? JSON.parse(req.session.user) : null;
	if(currentUser) {
		var data = {"id": req.body.id,
					"name":req.body.name,
					"address1":req.body.address1, 
					"address2":req.body.address2, 
					"address3":req.body.address3,
					"city":req.body.city};

		Parse.Cloud.run("saveClient", data, {
			success: function(message) {
				var response = {
					message: message,
					status: 200
				}
				res.end(JSON.stringify(response));
			},
			error: function(error) {
				var response = {
					message: error.message,
					status: error.code
				}
				res.end(JSON.stringify(response));
			}
		});
	} else {
		res.redirect('/login');
	} 
});

module.exports = router;