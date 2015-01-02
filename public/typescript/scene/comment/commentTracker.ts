module DoughLand {
    export class CommentTracker {
        private static commentDictionary: { [uuid: string]: UserData; } = {};
        private static commentObjects: Array<THREE.Mesh> = new Array<THREE.Mesh>();
        private static currentCommentPosition: THREE.Vector3;

        public static addCommentData(uuid: string, commentData: UserData): void {
            this.commentDictionary[uuid] = commentData;
        }

        public static getComment(uuid: string): UserData {
            return this.commentDictionary[uuid];
        }

        public static getCommentObjects(): Array<THREE.Mesh> {
            return this.commentObjects;
        }

        public static addCommentObject(mesh: THREE.Mesh): void {
            this.commentObjects.push(mesh);
        }

        public static setCurrentCommentPosition(commentPos: THREE.Vector3): void {
            this.currentCommentPosition = commentPos;
        }

        public static getCurrentCommentPosition(): THREE.Vector3 {
            return this.currentCommentPosition;
        }
    }
} 