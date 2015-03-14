var client = require('cloud/client/client.js');
var product = require('cloud/product/product.js');
var invoice = require('cloud/invoice/invoice.js');

var Response = {
	ParametersEmpty: 'Please provide complete details',
	InternalServerError: 'Oops! Some error occurred! Please try again',
	NotFound: 'Requested resource not found!',
	LoginError: 'Some error in current session!',
	SaveSuccess: 'Resource saved successfully!',
	UpdateSuccess: 'Resource updated successfully!',
	DeleteSuccess: 'Resource deleted successfully!'
};

/*-----------------------------------------------CLIENT-----------------------------------------------*/

Parse.Cloud.define('saveClient', function(req, res) {
	if(!req.params.id || req.params.id == 0) {
		client.save({
			name: req.params.name,
			address1: req.params.address1,
			address2: req.params.address2,
			address3: req.params.address3,
			city: req.params.city,
			success: function(message) {
				res.success(message);
			},
			error: function(error) {
				res.error(error);
			}
		});
	} else {
		client.update({
			id: req.params.id,
			name: req.params.name,
			address1: req.params.address1,
			address2: req.params.address2,
			address3: req.params.address3,
			city: req.params.city,
			success: function(message) {
				res.success(message);
			},
			error: function(error) {
				res.error(error);
			}
		});
	}
});

Parse.Cloud.beforeSave('Client', function(req, res) {
	var client = req.object;
	var currentUser = client.get('lastUpdatedBy');
	if(currentUser) {
		var tags;
		var name = client.get('name');
		var city = client.get('city');
		tags = '#' + name + '#' + city;
		client.set('tags', tags);
		res.success();
	} else {
		res.error(Response.LoginError);
	}
});

/*-----------------------------------------------PRODUCT-----------------------------------------------*/

Parse.Cloud.define('saveProduct', function(req, res) {
	if(!req.params.id || req.params.id == 0) {
		product.save({
			name: req.params.name,
			description: req.params.description,
			rate: req.params.rate,
			uom: req.params.uom,
			city: req.params.city,
			taxable: req.params.taxable,
			success: function(message) {
				res.success(message);
			},
			error: function(error) {
				res.error(error);
			}
		});
	} else {
		product.update({
			id: req.params.id,
			name: req.params.name,
			description: req.params.description,
			rate: req.params.rate,
			uom: req.params.uom,
			city: req.params.city,
			taxable: req.params.taxable,
			success: function(message) {
				res.success(message);
			},
			error: function(error) {
				res.error(error);
			}
		});
	}
});

Parse.Cloud.beforeSave('Product', function(req, res) {
	var product = req.object;
	var currentUser = product.get('lastUpdatedBy');
	if(currentUser) {
		var tags;
		var name = product.get('name');
		tags = '#' + name;
		product.set('tags', tags);
		res.success();
	} else {
		res.error(Response.LoginError);
	}
});

/*-----------------------------------------------INVOICE-----------------------------------------------*/

Parse.Cloud.define('saveInvoice', function(req, res) {

	if(!req.params.id || req.params.id == 0) {
		invoice.save({
			clientId: req.params.clientId,
			challanNo: req.params.challanNo,
			challanDate: req.params.challanDate,
			orderNo: req.params.orderNo,
			orderDate: req.params.orderDate,
			invoiceNo: req.params.invoiceNo,
			invoiceDate: req.params.invoiceDate,
			grossAmount: req.params.grossAmount,
			grossNonVatAmount: req.params.grossNonVatAmount,
			packagingAndForwarding: req.params.packagingAndForwarding,
			taxType: req.params.taxType,
			taxPercentage: req.params.taxPercentage,
			taxAmount: req.params.taxAmount,
			transportType: req.params.transportType,
			transportAmount: req.params.transportAmount,
			netAmount: req.params.netAmount,
			netAmountInWords: req.params.netAmountInWords,

			success: function(message) {
				res.success(message);
			},
			error: function(error) {
				res.error(error);
			}
		});
	} else {
		invoice.update({
			id: req.params.id,
			clientId: req.params.clientId,
			challanNo: req.params.challanNo,
			challanDate: req.params.challanDate,
			orderNo: req.params.orderNo,
			orderDate: req.params.orderDate,
			invoiceNo: req.params.invoiceNo,
			invoiceDate: req.params.invoiceDate,
			grossAmount: req.params.grossAmount,
			grossNonVatAmount: req.params.grossNonVatAmount,
			packagingAndForwarding: req.params.packagingAndForwarding,
			taxType: req.params.taxType,
			taxPercentage: req.params.taxPercentage,
			taxAmount: req.params.taxAmount,
			transportType: req.params.transportType,
			transportPercentage: req.params.transportPercentage,
			transportAmount: req.params.transportAmount,
			netAmount: req.params.netAmount,
			amountWords: req.params.amountWords,

			success: function(message) {
				res.success(message);
			},
			error: function(error) {
				res.error(error);
			}
		});
	}
});