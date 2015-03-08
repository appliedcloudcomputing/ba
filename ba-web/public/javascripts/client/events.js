$(document).ready(function() {

	console.log('INSIDE SCRIPT');

	//VARIABLES FOR FILTER
	var skipCount = 0;	
	var defaultFilterQuery = "";
	var defaultLimit = 15;		

	//KEYUP EVENT FOR ORGANIZATION SEARCH BAR
	$("#search").keyup(function(e) {
		console.log('KEY PRESSED');
		var regex = /[a-zA-Z0-9\b]/;
		var inp = String.fromCharCode(e.keyCode);
		var filterQuery = $(e.currentTarget).val();
		if(regex.test(inp)) {			
			if(!filterQuery || filterQuery.length >= 3) {				
				appendClientList(filterQuery);
			}
		}
	});	


	//APPENDING LISTING
	if(window.location.pathname == "/client/") {
		appendClientList();
	}

	function appendClientList(filterQuery){
		console.log("----------------------------AJAX CALLED--------------------------------- ");
		$.ajax({
			type: "GET",
			url:  "/client/search?filterQuery=" + filterQuery,
			success: function (data) {
				console.log("EVENT JS DATA : "+ JSON.stringify(data));
				$("#client-list-box").empty();
				for(var i = 0; i < $(data).size() ; i++) {	
					console.log("Names : "+ $(data)[i].name);					
					$("#client-list-box").append("<tr><td>" + $(data)[i].name + "</td><td class="center">" + $(data)[i].address1 +"</td><td class="center">" + $(data)[i].address2 +"</td><td class="center">" + $(data)[i].city +"</td></tr>");
				}
				//$.unblockUI();
			},
			error: function(jqXHR, textStatus, errorthrown) {
				//$.unblockUI();				  	
				$("#client-list-box").empty();
				console.log("EVENT JS ERROR THROWN: "+errorthrown);
			}
		});
	}
});