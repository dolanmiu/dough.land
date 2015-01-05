module DoughLand {
    export class JQueryBinder {

        constructor(commentDataService: CommentDataService, authenticator: Authentication, commentFactory: CommentFactory) {
            $("#comment-close").click(function () {
                JQueryHelper.scaleDownAnimation($("#comment"), function () {
                    console.log("closed");
                });
            });


            $("#comment-submit").click(function () {
                JQueryHelper.scaleDownAnimation($("#comment").parent(), function () {
                    var userData = new UserData($("#comment-name").val(), $("#comment-email").val(), $("#comment-text").val(), authenticator.getIP());
                    commentDataService.ajaxAddMessage(userData, CommentTracker.getCurrentCommentPosition().x, CommentTracker.getCurrentCommentPosition().z);
                });
            });
        }
    }
}