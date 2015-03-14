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

module.exports = router;