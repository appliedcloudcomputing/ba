$body = $("body");

$(document).ready(function() {
    console.log("INSIDE FORM.JS");

    //HIDING ERROR AND SUCCESS DIVS ON PAGE LOAD
    //$("div.error-box").hide();
    $("div#message").hide();

    //FORM SUBMUIT FUNCTION
	$("form").on("submit", function(e) {
        console.log("INSIDE SUBMIT");
        e.preventDefault();
        var _data = $(e.currentTarget).serializeObject();
        var valid = $(e.currentTarget).valid();   
        if(valid) {
            $.ajax({
                type: e.currentTarget.method,
                url: e.currentTarget.action,
                data: JSON.stringify(_data),
                success: function(data) {
                    console.log("SUCCESS FORM");
                    if(data) {
                        if(data.status == 200) {
                            if($(e.currentTarget).data().uri)
                                console.log("CURRENT URI: " + $(e.currentTarget).data().uri);
                                window.location=$(e.currentTarget).data().uri;
                            else {
                                $(e.currentTarget).find("div#message p").html(data.message);
                                $(e.currentTarget).find("div#message").show();
                                $(window).scrollTop($('div#message').offset().top);
                            }
                        } else {                  
                            $(e.currentTarget).find("div#message p").html(data.message);
                            $(e.currentTarget).find("div#message").show();
                            $(window).scrollTop($('div#message').offset().top);
                        } 
                    }
                },
                error: function(xhr, textStatus, errorThrown) {
                    $(e.currentTarget).find("div#message p").html(xhr.responseText);
                    $(e.currentTarget).find("div#message").show();
                    $(window).scrollTop($('div#message').offset().top);
                },
                dataType: "json",
                contentType: "application/json"
            });
        }
	});
});