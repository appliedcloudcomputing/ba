var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  	console.log('Rendering dashboar page...');
	var currentUser = req.session.user ? JSON.parse(req.session.user) : null;

	if (currentUser) {	
		res.redirect('/client/');
	} else {
		res.render('login', { title: 'Login' });
	}
});

module.exports = router;
