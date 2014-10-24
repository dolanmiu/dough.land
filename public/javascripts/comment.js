/*global $, console */

function ajaxAddMessage(name, email, comment, xPos, zPos) {
    var jsonString = '{"name":"' + name + '","email":"' + email + '","comment":"' + comment + '","xPos":' + xPos + ',"zPos":' + zPos + '}';
    console.log(jsonString);
    $.ajax({
        url: "/addmessage",
        type: "post",
        data: jsonString,
        contentType: 'application/json',
        success: function (res) {}
    });
}

function ajaxGetMessages() {
    $.ajax({
        url: "/getmessages",
        type: "get",
        contentType: 'application/json',
        success: function (res) {
            //console.log(res);
            for (var i = 0; i < res.length; i++) {
                addCommentObject(res[i].name, res[i].email, res[i].comment, res[i].xPos, res[i].zPos);
            }
            
        }
    });
}

function scaleDownAnimation(object, callback) {
    object.animate({
        height: '0px',
        width: '0px',
        opacity: 0
    }, 500, callback);
}

function scaleUpAnimation(object, newWidth, newHeight, callback) {
    object.animate({
        height: newHeight,
        width: newWidth,
        opacity: 1
    }, 500, callback);
}

$("#comment-close").click(function () {
    scaleDownAnimation($(this).parent().parent(), function () {
        console.log("closed");
    });
});

$("#comment-submit").click(function () {
    scaleDownAnimation($(this).parent().parent(), function () {
        ajaxAddMessage("dolan", "dolan_miu@hotmail.com", $("#comment-text").val(), commentPosition.x, commentPosition.z);
        addCommentObject("dolan", "dolan_miu@hotmail.com", $("#comment-text").val(), commentPosition.x, commentPosition.z);
    });
});

ajaxGetMessages();