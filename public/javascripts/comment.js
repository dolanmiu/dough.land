/*global $, commentFactory, console */

function ajaxAddMessage(name, email, comment, xPos, zPos, ip, callback) {
    var jsonString = '{"name":"' + name + '","email":"' + email + '","comment":"' + comment + '","xPos":' + xPos + ',"zPos":' + zPos + ',"ip":"' + ip + '"}';
    $.ajax({
        url: "/messages/add",
        type: "post",
        data: jsonString,
        contentType: 'application/json',
        success: function (res) {
            callback();
        }
    });
}

function ajaxGetMessages() {
    $.ajax({
        url: "/messages/get",
        type: "get",
        contentType: 'application/json',
        success: function (res) {
            for (var i = 0; i < res.length; i++) {
                //var comment = new Comment(scene, res[i].name, res[i].email, res[i].comment, userIP);
                var comment = commentFactory.newInstance(new THREE.Vector3(res[i].xPos, 5, res[i].zPos), res[i].name, res[i].email, res[i].comment, userIP); 
                //comment.placeAt(res[i].xPos, res[i].zPos);
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
        ajaxAddMessage($("#comment-name").val(), $("#comment-email").val(), $("#comment-text").val(), commentPosition.x, commentPosition.z, userIP, function () {
            //var comment = new Comment(scene, res[i].name, res[i].email, res[i].comment, userIP);
            
            comment.placeAt(res[i].xPos, res[i].zPos);
        });
    });
});

ajaxGetMessages();