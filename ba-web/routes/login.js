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
			console.log("Inside success");
			if(user) {
				console.log("User logged in");
				res.redirect('/client/'); 
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