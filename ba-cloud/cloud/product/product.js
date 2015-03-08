var Product = Parse.Object.extend('Product');

var Response = {
	ParametersEmpty: 'Please provide complete details',
	InternalServerError: 'Oops! Some error occurred! Please try again',
	NotFound: 'Requested resource not found!',
	LoginError: 'Some error in current session!',
	SaveSuccess: 'Resource saved successfully!',
	UpdateSuccess: 'Resource updated successfully!',
	DeleteSuccess: 'Resource deleted successfully!'
};

exports.save = function(params) {
	if(!params || !params.name || !params.description || !params.rate || !params.uom) {
		params.error(Response.ParametersEmpty);
	} else {
		var currentUser = Parse.User.current();
		if(!currentUser)
			params.error(Response.LoginError);

		//SAVING PRODUCT
		var product = new Product();
		product.set('name', params.name);
		product.set('description', params.description);
		product.set('rate', params.rate);
		product.set('uom', params.uom);
		product.set('lastUpdatedBy', currentUser);

		product.save(null, {
			success: function(product) {
				params.success(Response.SaveSuccess);
			},
			error: function(product, error) {
				console.log('ERROR IN SAVING PRODUCT : ' + error.message);
				params.error(Response.InternalServerError);
			}
 		});
	}
};

exports.update = function(params) {
	if(!params || !params.id || !params.name || !params.description || !params.rate || !params.uom) {
		params.error(Response.ParametersEmpty);
	} else {
		var currentUser = Parse.User.current();
		if(!currentUser)
			params.error(Response.LoginError);

		var productQuery = new Parse.Query(Product);
		productQuery.get(params.id, {
			success: function(product) {
				if(product) {
					product.set('name', params.name);
					product.set('description', params.description);
					product.set('rate', params.rate);
					product.set('uom', params.uom);
					product.set('lastUpdatedBy', currentUser);
					product.save(null, {
						success: function(product) {
							params.success(Response.UpdateSuccess);
						},
						error: function(product, error) {
							console.log('ERROR IN UPDATING PRODUCT : ' + error.message);
							params.error(Response.InternalServerError);
						}
			 		});
				} else {
					params.error(Response.NotFound);
				}
			},
			error: function(error) {
				params.error(Response.InternalServerError);
			}
		});
	}
};
