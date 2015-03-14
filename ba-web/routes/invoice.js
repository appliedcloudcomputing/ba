var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
	console.log("Rendering invoice save page...");
	var currentUser = req.session.user ? JSON.parse(req.session.user) : null;	
	if (currentUser) {
		res.render('invoice', { title: 'Invoice'});
	} else {
		res.redirect('/login');
	}
});


router.post('/save', function(req, res) {
	console.log('Saving Invoice...');
	var currentUser = req.session.user ? JSON.parse(req.session.user) : null;
	if(currentUser) {
		var data = {'id': req.body.id,
					'name':req.body.clientName,
					'description':req.body.description, 
					'rate':req.body.rate, 
					'uom':req.body.uom};

		Parse.Cloud.run('saveProduct', data, {
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