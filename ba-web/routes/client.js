var express = require('express');
var router = express.Router();

router.get('/save', function(req, res) {	
	res.render('client', { title: 'Client'});
});

router.post('/save', function(req, res) {
	console.log("INSIDE POST");
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
				res.send(500, error.message);
			}
		});
	} else {
		res.redirect('/login');
	} 
});

module.exports = router;