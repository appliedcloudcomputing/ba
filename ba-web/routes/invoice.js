var express = require('express');
var router = express.Router();

router.get('/save', function(req, res) {
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
					'clientId':req.body.clientName,
					'challanNo':req.body.challanNo, 
					'challanDate':req.body.challanDate, 
					'orderNo':req.body.orderNo,
					'orderDate':req.body.orderDate,
					'invoiceNo':req.body.invoiceNo,
					'invoiceDate':req.body.invoiceDate,
					'grossAmount':req.body.grossAmount,
					'grossNonVatAmount':req.body.grossNonVatAmount,
					'subTotal':req.body.subTotal,
					'packagingAndForwarding':req.body.packagingAndForwarding,
					'subTotal2':req.body.subTotal2,
					'taxType':req.body.taxType,
					'taxPercentage':req.body.taxPercentage,
					'taxAmount':req.body.taxAmount,
					'transportType':req.body.transportType,
					'transportAmount':req.body.transportAmount,
					'netAmount':req.body.netAmount,
					'netAmountInWords':req.body.netAmountInWords		,
					 };

		Parse.Cloud.run('saveInvoice', data, {
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
		var Invoice = Parse.Object.extend('Invoice');
		var invoiceQuery = new Parse.Query(Invoice);
		invoiceQuery.descending('createdAt');
		if(filterQuery)
			invoiceQuery.contains('tags', filterQuery);
		invoiceQuery.skip(skipCount);
		invoiceQuery.limit(limit);
		invoiceQuery.find({
			success: function(invoices) {
				if(invoices){
					var _invoices = [];
					for (var i = 0; i < invoices.length; i++) {
						_invoiceJson = {};
						_invoiceJson.name = _invoices[i].get('name') ? _invoices[i].get('name') : '';
						_invoiceJson.invoiceNo = _invoices[i].get('invoiceNo') ? _invoices[i].get('invoiceNo') : '';
						_invoiceJson.orderNo = _invoices[i].get('orderNo') ? _invoices[i].get('orderNo') : '';
						_invoiceJson.challanNo = _invoices[i].get('challanNo') ? _invoices[i].get('challanNo') : '';
						_invoiceJson.netAmount = _invoices[i].get('netAmount') ? _invoices[i].get('netAmount') : '';
						_invoices.push(_invoiceJson);
					};
					res.writeHead(200, { 'Content-Type': 'application/json' });
					res.end(JSON.stringify(_invoices));
				}
			},
			error: function(invoices, error) {
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
		var _invoices = [];
		var Invoice = Parse.Object.extend('Invoice');
		var invoiceQuery = new Parse.Query(Invoice);
		invoiceQuery.find({
			success:function(invoices) {
				if(invoices) {
					console.log('INVOICES LENGTH: ' + invoices.length);
					for(var i = 0; i < invoices.length; i++) {
						var response = {};
						console.log('CLIENT NAME: ' + invoices[i].get('name'));
						console.log('INVOICE NO: ' + invoices[i].get('invoiceNo'));
						response.id = invoices[i].id;
						response.name = invoices[i].get('name');
						response.invoiceNo = invoices[i].get('invoiceNo');
						response.orderNo = invoices[i].get('orderNo');
						response.challanNo = invoices[i].get('challanNo');
						response.netAmount = invoices[i].get('netAmount');
						_invoices.push(response);
					}
					res.writeHead(200, { "Content-Type": "application/json" });
					res.end(JSON.stringify(invoices));
				} else {
					console.log("No Invoices Found");
				}
			},
			error:function(invoices ,error){
				console.log("Get Invoices Error : "+ error.code + ", Message: "+ error.message);
			}
		});
	} else {
		res.redirect('/');
	}
});

module.exports = router;