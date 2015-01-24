var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {	
	res.render('login', { title: 'Login'});
}); 

router.post('/', function(req, res) {
	var username = req.body.username;
	var password = req.body.password;

	Parse.User.logIn(username, password, { 
		success: function(user) {
			if(user) {
				console.log("User logged in");
				req.session.user = JSON.stringify(user);
				res.redirect('/client/save');
			} else {
				res.render('login', { 
					title: 'Login', 
					message: Response.InvalidLogin
				}); 
			}						
		},
		error: function(user, error) {
			res.render('login', { 
				title: 'Login', 
				message: Response.InvalidLogin
			});   
		}
	}); 
});

module.exports = router;