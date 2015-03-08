$(document).ready(function() {

	var skipCount = 0;
	var defaultFilterQuery = "";
	var defaultLimit = 15;
	var clientSearchUrl = "/client/search";
	var scrolledToTop = false;

	//KEYUP EVENT FOR ORGANIZATION SEARCH BAR
	$("#search").keyup(function(e) {
		var regex = /[a-zA-Z0-9\b]/;
		var inp = String.fromCharCode(e.keyCode);
		var filterQuery = $(e.currentTarget).val();
		if(regex.test(inp)) {			
			if(!filterQuery || filterQuery === "" || filterQuery.length >= 3) {				
				appendClientList(filterQuery, skipCount, false);
			}
		}
	});	

	//APPENDING LISTING
	if(window.location.pathname == "/client/") {
		appendClientList(defaultFilterQuery, skipCount, false);
	}

	//PAGE SCOLL FUNCTION TO LOAD USER LIST ON SCROLLING
	$(window).scroll(function () {

		if ($(window).scrollTop() == $(document).height() - $(window).height()) {
			if(scrolledToTop)
				skipCount = 0;
			scrolledToTop = false;
			skipCount += defaultLimit;
			var filterQuery = $("#search").val();
			appendClientList(filterQuery, skipCount, true);
		} else if($(window).scrollTop() == 0) {
			scrolledToTop = true;
			var filterQuery = $("#search").val();
			appendClientList(filterQuery, 0, false);
		}
	});

	function appendClientList(filterQuery, skipCount, append) {
		var regex = new RegExp("^[-\sa-z0-9A-Z]+$");
		if (!filterQuery || regex.test(filterQuery)) {
			$.ajax({
				type: "GET",
				url:  clientSearchUrl,
				data: {filterQuery: filterQuery, skipCount: skipCount, limit: defaultLimit},
				success: function (data) {
					if(!append) 
						$("#client-list-box").empty();
						
					for(var i = 0; i < $(data).size() ; i++) {	
						var clientHtml = "<tr><td>" + $(data)[i].name + "</td><td class='center'>" + $(data)[i].address1 +"</td><td class='center'>" + $(data)[i].address2 +"</td><td class='center'>" + $(data)[i].city +"</td></tr>";				
						$(clientHtml).hide().appendTo("#client-list-box").fadeIn(1000);
					}
				},
				error: function(jqXHR, textStatus, errorthrown) {				  	
					$("#client-list-box").empty();
					console.log("EVENT JS ERROR THROWN: "+errorthrown);
				}
			});
		}
	}
});