module DoughLand {
    export class CommentDataService {
        private commentFactory: CommentFactory;
        private scene: THREE.Scene;

        constructor(scene: THREE.Scene, commentFactory: CommentFactory) {
            this.commentFactory = commentFactory;
            this.scene = scene;
        }

        public ajaxAddMessage(userData: UserData, xPos: number, zPos: number): void {
            var jsonString = '{"name":"' + userData.getName() + '","email":"' + userData.getEmail() + '","comment":"' + userData.getComment() + '","xPos":' + xPos + ',"zPos":' + zPos + ',"ip":"' + userData.getUserIP() + '"}';
            $.ajax({
                url: "/messages/add",
                type: "post",
                data: jsonString,
                contentType: 'application/json',
            })
                .done(data => {
                    this.addComment(userData.getName(), userData.getEmail(), userData.getComment(), userData.getUserIP(), xPos, zPos);
                });
        }

        public ajaxGetMessages(): void {
            $.ajax({
                url: "/messages/get",
                type: "get",
                contentType: 'application/json'
            })
                .done(data => {
                    for (var i = 0; i < data.length; i++) {
                        this.addComment(data[i].username, data[i].email, data[i].comment, data[i].ip, data[i].xPos, data[i].zPos);
                    }
                });
        }

        private addComment(username: string, email: string, comment: string, ip: string, xPos: number, zPos: number): void {
            var userData = new UserData(username, email, comment, ip);
            this.commentFactory.newInstance(new THREE.Vector3(xPos, 10, zPos), mesh => {
                CommentTracker.addCommentData(mesh.uuid, userData);
                CommentTracker.addCommentObject(mesh);
                this.scene.add(mesh);
            });
        }
    }
}