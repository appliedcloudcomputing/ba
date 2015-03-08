$(document).ready(function() {

	var skipCount = 0;
	var defaultFilterQuery = "";
	var defaultLimit = 15;
	var productSearchUrl = "/product/search";
	var scrolledToTop = false;

	//KEYUP EVENT FOR ORGANIZATION SEARCH BAR
	$("#search").keyup(function(e) {
		var regex = /[a-zA-Z0-9\b]/;
		var inp = String.fromCharCode(e.keyCode);
		var filterQuery = $(e.currentTarget).val();
		if(regex.test(inp)) {			
			if(!filterQuery || filterQuery === "" || filterQuery.length >= 3) {				
				appendProductList(filterQuery, skipCount, false);
			}
		}
	});	

	//APPENDING LISTING
	if(window.location.pathname == "/product/") {
		appendProductList(defaultFilterQuery, skipCount, false);
	}

	//PAGE SCOLL FUNCTION TO LOAD USER LIST ON SCROLLING
	$(window).scroll(function () {
		if ($(window).scrollTop() == $(document).height() - $(window).height()) {
			if(scrolledToTop)
				skipCount = 0;
			scrolledToTop = false;
			skipCount += defaultLimit;
			var filterQuery = $("#search").val();
			appendProductList(filterQuery, skipCount, true);
		} else if($(window).scrollTop() == 0) {
			scrolledToTop = true;
			
			var filterQuery = $("#search").val();
			appendProductList(filterQuery, 0, false);
		}
	});

	function appendProductList(filterQuery, skipCount, append) {
		console.log('INSIDE PRODUCT APPEND LIST');
		var regex = new RegExp("^[-\sa-z0-9A-Z]+$");
		if (!filterQuery || regex.test(filterQuery)) {
			$.ajax({
				type: "GET",
				url:  productSearchUrl,
				data: {filterQuery: filterQuery, skipCount: skipCount, limit: defaultLimit},
				success: function (data) {
					if(!append) 
						$("#product-list-box").empty();
						
					for(var i = 0; i < $(data).size() ; i++) {	
						var productHtml = "<tr><td>" + $(data)[i].name + "</td><td class='center'>" + $(data)[i].description + "</td><td class='center'>" + $(data)[i].rate + "</td><td class='center'>" + $(data)[i].uom + "</td><td class='center'>" + $(data)[i].taxable + "</td></tr>";				
						$(productHtml).hide().appendTo("#product-list-box").fadeIn(1000);
					}
				},
				error: function(jqXHR, textStatus, errorthrown) {				  	
					$("#product-list-box").empty();
					console.log("EVENT JS ERROR THROWN: "+errorthrown);
				}
			});
		}
	}
});