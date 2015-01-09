module DoughLand {
    export class MouseState {
        private isLeftPressed: boolean;
        private isMouseMoved: boolean;
        private isDragging: boolean;

        public getIsDragging() {
            if (this.isLeftPressed && this.isMouseMoved) {
                return true;
            } else {
                return false;
            }
        }

        public setIsLeftPressed(isLeftPressed: boolean): void {
            this.isLeftPressed = isLeftPressed;
        }

        public setIsMouseMoved(isMouseMoved: boolean): void {
            this.isMouseMoved = isMouseMoved;
        }
    }
}