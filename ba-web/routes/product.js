var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
	console.log('Rendering products list page...');
	var currentUser = req.session.user ? JSON.parse(req.session.user) : null;	
	if (currentUser) {	
		res.render('product_list', { title: 'Product'});
	} else {
		res.redirect('/');
	}
});

router.get('/save', function(req, res) {
	console.log('Rendering products save page...');
	var currentUser = req.session.user ? JSON.parse(req.session.user) : null;	
	if (currentUser) {	
		res.render('product', { title: 'Product'});
	} else {
		res.redirect('/');
	}
});


router.get('/list',function(req,res){

	var currentUser = req.session.user ? JSON.parse(req.session.user) : null;	
	if (currentUser) {	
		var _products = [];
		var Product = Parse.Object.extend('Product');
		var productQuery = new Parse.Query(Product);
		productQuery.find({
			success:function(products){
				if(products) {
					console.log("Found Any Product");
					for(var i = 0; i < products.length; i++) {
						var response = {};
						response.name = products[i].get('name');
						response.id = products[i].id;
						response.taxable = products[i].get('taxable');
						_products.push(response);
					}
					res.writeHead(200, { "Content-Type": "application/json" });
					res.end(JSON.stringify(_products));
				} else {
					console.log("No Product Found");
				}
			},
			error:function(products,error){
				console.log("Get Product Error : "+ error.code + ", Message: "+ error.message);
			}
		});
	} else {
		res.redirect('/');
	}
});

router.post('/save', function(req, res) {
	console.log('Saving product...');
	var currentUser = req.session.user ? JSON.parse(req.session.user) : null;
	if(currentUser) {
		var data = {'id': req.body.id,
					'name':req.body.name,
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

router.get('/search', function(req, res) {
	console.log('INSIDE SEARCH');
	var currentUser = req.session.user ? JSON.parse(req.session.user) : null;
	var filterQuery = req.query.filterQuery ? req.query.filterQuery.toLowerCase().trim() : null;
	var skipCount = req.query.skipCount ? req.query.skipCount.trim() : '0';
	var limit = req.query.limit ? req.query.limit.trim() : '0';

	if (currentUser) {
		var Product = Parse.Object.extend('Product');
		var productQuery = new Parse.Query(Product);
		productQuery.descending('createdAt');
		if(filterQuery)
			productQuery.contains('tags', filterQuery);
		productQuery.skip(skipCount);
		productQuery.limit(limit);
		productQuery.find({
			success: function(products) {
				if(products){
					var _products = [];
					for (var i = 0; i < products.length; i++) {
						_productJson = {};
						_productJson.name = products[i].get('name') ? products[i].get('name') : '';
						_productJson.description = products[i].get('description') ? products[i].get('description') : '';
						_productJson.rate = products[i].get('rate') ? products[i].get('rate') : '';
						_productJson.uom = products[i].get('uom') ? products[i].get('uom') : '';
						_productJson.taxable = products[i].get('taxable') ? products[i].get('taxable') : '';
						_products.push(_productJson);
					};
					res.writeHead(200, { 'Content-Type': 'application/json' });
					res.end(JSON.stringify(_products));
				}
			},
			error: function(products, error) {
				res.end(JSON.stringify({}));
			}
		});
	} else {
		res.end(JSON.stringify({}));
	}
});

module.exports = router;