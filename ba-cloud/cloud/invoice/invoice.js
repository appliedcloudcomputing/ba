var Invoice = Parse.Object.extend("Invoice");

var Response = {
	ParametersEmpty: "Please provide complete details",
	InternalServerError: "Oops! Some error occurred! Please try again",
	NotFound: "Requested resource not found!",
	LoginError: "Some error in current session!",
	SaveSuccess: "Resource saved successfully!",
	UpdateSuccess: "Resource updated successfully!",
	DeleteSuccess: "Resource deleted successfully!"
};


exports.save = function(params) {
	if(!params || !params.client || !params.challanNo || !params.challanDate || !params.orderNo || !params.orderDate 
		|| !params.invoiceNo || !params.invoiceDate || !params.grossAmount || !params.grossNonVatAmount 
		|| !params.packagingAndForwarding || !params.taxType || !params.taxPercentage || !params.transportType 
		|| !params.transportPercentage || !params.netAmount || !params.netAmountInWords) {
		params.error(Response.ParametersEmpty);
	} else {
		var currentUser = Parse.User.current();
		if(!currentUser)
			params.error(Response.LoginError);

		//SAVING Invoice
		var invoice = new Invoice();
		invoice.set("client", params.client); // CREATE POINTER
		invoice.set("challanNo", params.challanNo);
		invoice.set("challanDate", params.challanDate);
		invoice.set("orderNo", params.orderNo);
		invoice.set("orderDate",params.orderDate);
		invoice.set("invoiceNo",params.invoiceNo);
		invoice.set("invoiceDate",params.invoiceDate);
		invoice.set("grossAmount",params.grossAmount);
		invoice.set("grossNonVatAmount",params.grossNonVatAmount);
		invoice.set("packagingAndForwarding",params.packagingAndForwarding);
		invoice.set("taxType",params.taxType);
		invoice.set("taxPercentage",params.taxPercentage);
		invoice.set("transportType",params.transportType);
		invoice.set("transportPercentage",params.transportPercentage);
		invoice.set("netAmount",params.netAmount);
		invoice.set("netAmountInWords",params.netAmountInWords);
		invoice.save(null, {
			success: function(invoice) {
				params.success(Response.SaveSuccess);
			},
			error: function(invoice, error) {
				console.log("ERROR IN SAVING INVOICE : " + error.message);
				params.error(Response.InternalServerError);
			}
 		});
	}
};
