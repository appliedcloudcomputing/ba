var express = require('express');
var router = express.Router();

/* GET HOME PAGE */
router.get('/', function(req, res) {
	var currentUser;
	if(req.session) {	
		currentUser = req.session.user;
	}
	
	if (currentUser) {			
		res.redirect('/clients/');
	} else {
		res.redirect('/login/');
	}
});

module.exports = router;
