module DoughLand {
    export class JQueryHelper {
        public static scaleDownAnimation(object: JQuery, callback: () => void): void {
            object.animate({
                height: '0px',
                width: '0px',
                opacity: 0
            }, 500, callback);
        }

        public static scaleUpAnimation(object: JQuery, newWidth: number, newHeight: number, callback: () => void): void {
            object.animate({
                height: newHeight,
                width: newWidth,
                opacity: 1
            }, 500, callback);
        }
    }
} 