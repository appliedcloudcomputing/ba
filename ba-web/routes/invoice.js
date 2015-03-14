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

module.exports = router;