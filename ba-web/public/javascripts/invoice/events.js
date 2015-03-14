var productTable;

$(document).ready(function() {
	var isProductLoaded = false;
  	var rowAdded = false;

  	productTable = $('table#myTable').dataTable({
	  'bFilter': false,
	  'bInfo': false,
	  'bPaginate': false,
	});

	addRow();

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

var clientsData = {};
function populateClients() {
	$.ajax({
		type: "GET",
		url:  "/product/list",
		success: function (data) {
			for(var i = 0; i < $(data).size(); i++) {
				var _clientData = {
					'address1': data[i].address1,
					'address2': data[i].address2,
					'address3': data[i].address3,
					'city': data[i].city
				}
				clientsData[data[i].id] = data[i].
			}
			
		},
		error: function(jqXHR, textStatus, errorthrown) {
			console.log("EVENT JS ERROR THROWN: "+errorthrown);
		}
	});
}

var count = 0;
function addRow() {
	var productTaxable = {};
	$.ajax({
		type: "GET",
		url:  "/product/list",
		success: function (data) {
			rowAdded = true;
			isProductLoaded = true;
			var seletedProductId;

			var htmlArray = [];
			htmlArray.push('<option value="" selected="selected">Select Product</option>');
			for(var i = 0; i < $(data).size(); i++) {
				productTaxable[data[i].id] = data[i].taxable;
				htmlArray.push('<option value="' + data[i].id + '">' + data[i].name + '</option>');
			}
			var htmlString = htmlArray.join("");

			$('table#myTable').dataTable().fnAddData([
			  '<select required="required" id="selectProduct_' + count + '">' + htmlString + '</select>',
			  '<input type="text" style="width: 300px;" id="description_' + count + '" value="0" name="description_' + count + '">',
			  '<input type="text" style="width: 50px;" id="quantity_' + count + '" value="0" name="quantity_' + count + '">',
			  '<input type="text" style="width: 50px;" id="rate_' + count + '" value="0" name="rate_' + count + '">',
			  '<input type="text" style="width: 100px;" id="vat_amount_' + count + '" value="0" name="vat_amount_' + count + '">',
			  '<input type="text" style="width: 100px;" id="non_vat_amount_' + count + '" value="0" name="non_vat_amount_' + count + '">']);

			//var row = productTable.fnGetNodes(rowIndex);

			$('#selectProduct_' + count).on('change', function() {
				seletedProductId = $(this).val();
				var taxable = productTaxable[seletedProductId];
				if(taxable) {
					$('#non_vat_amount_' + count).attr('disabled', true);
					$('#vat_amount_' + count).attr('disabled', false);
				} else {
					$('#vat_amount_' + count).attr('disabled', true);
					$('#non_vat_amount_' + count).attr('disabled', false);
				}
			});

			$('#quantity_' + count).on('input', function(event) {
				console.log('INSIDE KEYPRESS QUANTITY');
				var quantity = $(this).val();
				var rate = $('#rate_' + count).val();
				var totalAmount = quantity * rate;
				if($('#non_vat_amount_' + count).attr('disabled')) {
					$('#vat_amount_' + count).val(totalAmount);
					$('#non_vat_amount_' + count).val("0");
				} else if($('#vat_amount_' + count).attr('disabled')) {
					$('#non_vat_amount_' + count).val(totalAmount);
					$('#vat_amount_' + count).val("0");
				}
			});

			$('#rate_' + count).on('input', function(event) {
				var quantity = $('#quantity_' + count).val();
				var rate = $(this).val();
				var totalAmount = quantity * rate;
				if($('#non_vat_amount_' + count).attr('disabled')) {
					$('#vat_amount_' + count).val(totalAmount);
					$('#non_vat_amount_' + count).val("0");
				} else if($('#vat_amount_' + count).attr('disabled')) {
					$('#non_vat_amount_' + count).val(totalAmount);
					$('#vat_amount_' + count).val("0");
				}
			});
		},
		error: function(jqXHR, textStatus, errorthrown) {
			console.log("EVENT JS ERROR THROWN: "+errorthrown);
		}
	});
	count++;
}

function deleteRow () {
if (count != 1) {
	var row_index = $('#myTable').find('tr');
	//alert('Current Index'+ row_index);
	$("table#myTable").dataTable().fnDeleteRow(count - 1);

	count--;
}
}