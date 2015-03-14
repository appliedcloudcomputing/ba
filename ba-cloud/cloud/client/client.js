var Client = Parse.Object.extend('Client');

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
	if(!params || !params.name || !params.address1 || !params.address2 || !params.address3 || !params.city) {
		params.error(Response.ParametersEmpty);
	} else {
		var currentUser = Parse.User.current();
		if(!currentUser)
			params.error(Response.LoginError);

		//SAVING CLIENT
		var client = new Client();
		client.set('name', params.name);
		client.set('address1', params.address1);
		client.set('address2', params.address2);
		client.set('address3', params.address3);
		client.set('city', params.city);
		client.set('lastUpdatedBy', currentUser);

		client.save(null, {
			success: function(client) {
				params.success(Response.SaveSuccess);
			},
			error: function(client, error) {
				console.log('ERROR IN SAVING CLIENT : ' + error.message);
				params.error(Response.InternalServerError);
			}
 		});
	}
};

exports.update = function(params) {
	if(!params || !params.id || !params.name || !params.address1 || !params.address2 || !params.address3 || !params.city) {
		params.error(Response.ParametersEmpty);
	} else {
		var currentUser = Parse.User.current();
		if(!currentUser)
			params.error(Response.LoginError);

		var clientQuery = new Parse.Query(Client);
		clientQuery.get(params.id, {
			success: function(client) {
				if(client) {
					client.set('name', params.name);
					client.set('address1', params.address1);
					client.set('address2', params.address2);
					client.set('address3', params.address3);
					client.set('city', params.city);
					client.set('lastUpdatedBy', currentUser);
					client.save(null, {
						success: function(client) {
							params.success(Response.UpdateSuccess);
						},
						error: function(client, error) {
							console.log('ERROR IN UPDATING CLIENT : ' + error.message);
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