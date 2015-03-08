$(document).ready(function() {

	//VARIABLES FOR PDF GENERATION
    var _html = getPageHTML();
    var doc = new jsPDF();
    var specialElementHandlers = {
		'#editor': function (element, renderer) {
			return true;
		}
	};

    //GETS PAGE HTML
    function getPageHTML() {
        return "<!DOCTYPE html><html>" + $("html").html() + "</html>";
    }

    function downloadPageAsPdf() {
		doc.fromHTML(_html, 15, 15, {
	        'width': 170,
	            'elementHandlers': specialElementHandlers
	    });
	    doc.save('invoice.pdf');
    }
});