var Product = Parse.Object.extend("Product");

var Response = {
	ParametersEmpty: "Please provide complete details",
	InternalServerError: "Oops! Some error occurred! Please try again",
	NotFound: "Requested resource not found!",
	LoginError: "Some error in current session!",
	SaveSuccess: "Resource saved successfully!",
	UpdateSuccess: "Resource updated successfully!",
	DeleteSuccess: "Resource deleted successfully!"
};