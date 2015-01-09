module DoughLand {
    export class CommentModal {
        private commentDataService: CommentDataService;
        private authenticator: Authentication;


        constructor(commentDataService: CommentDataService, authenticator: Authentication) {
            this.commentDataService = commentDataService;
            this.authenticator = authenticator;
        }

        public open(callback: (ableToComment: boolean) => void): void {
            JQueryHelper.scaleUpAnimation($("#comment"), 600, 600, function () { });
            $("#comment-submit").unbind();
            $("#comment-close").unbind();

            $("#comment-submit").click(function () {
                JQueryHelper.scaleDownAnimation($("#comment"), function () {
                    var userData = new UserData($("#comment-name").val(), $("#comment-email").val(), $("#comment-text").val(), this.authenticator.getIP());
                    this.commentDataService.ajaxAddMessage(userData, CommentTracker.getCurrentCommentPosition().x, CommentTracker.getCurrentCommentPosition().z);
                    callback(false);
                });
            });

            $("#comment-close").click(function () {
                JQueryHelper.scaleDownAnimation($("#comment"), function () {
                });
            });
        }
    }
}