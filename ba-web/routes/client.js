var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
	console.log('Rendering clients list page...');
	var currentUser = req.session.user ? JSON.parse(req.session.user) : null;	
	if (currentUser) {
		res.render('client_list', { title: 'Client'});
	} else {
		res.redirect('/login');
	}
});

router.get('/save', function(req, res) {
	console.log('Rendering clients save page...');
	var currentUser = req.session.user ? JSON.parse(req.session.user) : null;	
	if (currentUser) {	
		res.render('client', { title: 'Client'});
	} else {
		res.redirect('/login');
	}
});

router.post('/save', function(req, res) {
	console.log('Saving client...');
	var currentUser = req.session.user ? JSON.parse(req.session.user) : null;
	if(currentUser) {
		var data = {'id': req.body.id,
					'name':req.body.name,
					'address1':req.body.address1, 
					'address2':req.body.address2, 
					'address3':req.body.address3,
					'city':req.body.city};

		Parse.Cloud.run('saveClient', data, {
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


router.get('/search', function(req, res) {
	var currentUser = req.session.user ? JSON.parse(req.session.user) : null;
	var filterQuery = req.query.filterQuery ? req.query.filterQuery.toLowerCase().trim() : null;
	var skipCount = req.query.skipCount ? req.query.skipCount.trim() : '0';
	var limit = req.query.limit ? req.query.limit.trim() : '0';

	if (currentUser) {
		var Client = Parse.Object.extend('Client');
		var clientQuery = new Parse.Query(Client);
		clientQuery.descending('createdAt');
		if(filterQuery)
			clientQuery.contains('tags', filterQuery);
		clientQuery.skip(skipCount);
		clientQuery.limit(limit);
		clientQuery.find({
			success: function(clients) {
				if(clients){
					var _clients = [];
					for (var i = 0; i < clients.length; i++) {
						_clientJson = {};
						_clientJson.name = clients[i].get('name') ? clients[i].get('name') : '';
						_clientJson.address1 = clients[i].get('address1') ? clients[i].get('address1') : '';
						_clientJson.address2 = clients[i].get('address2') ? clients[i].get('address2') : '';
						_clientJson.city = clients[i].get('city') ? clients[i].get('city') : '';
						_clients.push(_clientJson);
					};
					res.writeHead(200, { 'Content-Type': 'application/json' });
					res.end(JSON.stringify(_clients));
				}
			},
			error: function(clients, error) {
				res.end(JSON.stringify({}));
			}
		});
	} else {
		res.end(JSON.stringify({}));
	}
});

router.get('/list',function(req,res){

	var currentUser = req.session.user ? JSON.parse(req.session.user) : null;	
	if (currentUser) {	
		var _clients = [];
		var Client = Parse.Object.extend('Client');
		var clientQuery = new Parse.Query(Client);
		clientQuery.find({
			success:function(clients) {
				if(clients) {
					console.log('CLIENTS LENGTH: ' + clients.length);
					for(var i = 0; i < clients.length; i++) {
						var response = {};
						console.log('CLIENTS: ' + clients[i].get('name'));
						console.log('address1: ' + clients[i].get('address1'));
						response.id = clients[i].id;
						response.name = clients[i].get('name');
						response.address1 = clients[i].get('address1');
						response.address2 = clients[i].get('address2');
						response.address3 = clients[i].get('address3');
						console.log("ADDRESS 3 :"+clients[i].get('address3'));
						response.city = clients[i].get('city');
						_clients.push(response);
					}
					res.writeHead(200, { "Content-Type": "application/json" });
					res.end(JSON.stringify(_clients));
				} else {
					console.log("No Clients Found");
				}
			},
			error:function(clients ,error){
				console.log("Get Clients Error : "+ error.code + ", Message: "+ error.message);
			}
		});
	} else {
		res.redirect('/');
	}
});

module.exports = router;