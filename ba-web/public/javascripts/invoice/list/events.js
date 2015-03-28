$(document).ready(function() {

	var skipCount = 0;
	var defaultFilterQuery = "";
	var defaultLimit = 15;
	var invoiceSearchUrl = "/invoice/search";
	var scrolledToTop = false;

	//KEYUP EVENT FOR ORGANIZATION SEARCH BAR
	$("#search").keyup(function(e) {
		var regex = /[a-zA-Z0-9\b]/;
		var inp = String.fromCharCode(e.keyCode);
		var filterQuery = $(e.currentTarget).val();
		if(regex.test(inp)) {			
			if(!filterQuery || filterQuery === "" || filterQuery.length >= 3) {				
				appendInvoiceList(filterQuery, skipCount, false);
			}
		}
	});	

	//APPENDING LISTING
	if(window.location.pathname == "/invoice/") {
		appendInvoiceList(defaultFilterQuery, skipCount, false);
	}

	//PAGE SCOLL FUNCTION TO LOAD USER LIST ON SCROLLING
	$(window).scroll(function () {

		if ($(window).scrollTop() == $(document).height() - $(window).height()) {
			if(scrolledToTop)
				skipCount = 0;
			scrolledToTop = false;
			skipCount += defaultLimit;
			var filterQuery = $("#search").val();
			appendInvoiceList(filterQuery, skipCount, true);
		} else if($(window).scrollTop() == 0) {
			scrolledToTop = true;
			var filterQuery = $("#search").val();
			appendInvoiceList(filterQuery, 0, false);
		}
	});

	function appendInvoiceList(filterQuery, skipCount, append) {
		var regex = new RegExp("^[-\sa-z0-9A-Z]+$");
		if (!filterQuery || regex.test(filterQuery)) {
			$.ajax({
				type: "GET",
				url:  invoiceSearchUrl,
				data: {filterQuery: filterQuery, skipCount: skipCount, limit: defaultLimit},
				success: function (data) {
					if(!append) 
						$("#invoice-list-box").empty();
						
					for(var i = 0; i < $(data).size() ; i++) {	
						var invoiceHtml = "<tr><td>" + $(data)[i].name + "</td><td class='center'>" + $(data)[i].invoiceNo +"</td><td class='center'>" + $(data)[i].challanNo +"</td><td class='center'>" + $(data)[i].orderNo +"</td><td class='center'>" + $(data)[i].netAmount +"</td></tr>";				
						$(invoiceHtml).hide().appendTo("#invoice-list-box").fadeIn(1000);
					}
				},
				error: function(jqXHR, textStatus, errorthrown) {				  	
					$("#invoice-list-box").empty();
					console.log("EVENT JS ERROR THROWN: "+errorthrown);
				}
			});
		}
	}
});