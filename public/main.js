$(document).ready(function() {
    console.log("Ready");
    $("#doit").click(function() {
        console.log("Clicked");
        $.get("/scrape", function(res) {
            console.log("scraped:" + res);
            $("#articles").html($(res));
        });
    });
});