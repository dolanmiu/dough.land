/*globals $, console */
var userIP;

function ajaxCheckIP(ip) {
    var jsonString = '{"ip":"' + ip + '"}';
    $.ajax({
        url: "/ip/check",
        type: "post",
        data: jsonString,
        contentType: 'application/json',
        success: function (res) {
            console.log(res);
        }
    });
}

$.getJSON("http://www.telize.com/jsonip?callback=?", function (json) {
    userIP = json.ip;
    ajaxCheckIP(json.ip);
});