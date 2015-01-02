module DoughLand {
    export class JQueryBinder {

        constructor(commentDataService: CommentDataService, authenticator: Authentication, commentFactory: CommentFactory) {
            $("#comment-close").click(function () {
                JQueryHelper.scaleDownAnimation($(this).parent().parent(), function () {
                    console.log("closed");
                });
            });


            $("#comment-submit").click(function () {
                JQueryHelper.scaleDownAnimation($(this).parent().parent(), function () {
                    var userData = new UserData($("#comment-name").val(), $("#comment-email").val(), $("#comment-text").val(), authenticator.getIP());
                    commentDataService.ajaxAddMessage(userData, CommentTracker.getCurrentCommentPosition().x, CommentTracker.getCurrentCommentPosition().z);
                });
            });
        }
    }
}