$.getJSON("http://www.telize.com/jsonip?callback=?",
    function (json) {
        alert(json);
    }
);

function ajaxAddIP(json) {
    $.ajax({
        url: "/ip/add",
        type: "post",
        data: json,
        contentType: 'application/json',
        success: function (res) {}
    }); 
}