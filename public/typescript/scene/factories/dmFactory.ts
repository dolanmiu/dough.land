module DoughLand {
    export class DMFactory {
        private scene: THREE.Scene;
        private loader: THREE.JSONLoader;

        constructor(scene: THREE.Scene, loader: THREE.JSONLoader) {
            this.scene = scene;
            this.loader = loader;
        }

        public newInstance(): void {
            var texture = THREE.ImageUtils.loadTexture('models/baked.png');
            texture.magFilter = THREE.NearestFilter;
            texture.minFilter = THREE.LinearMipMapLinearFilter;

            var material = new THREE.MeshLambertMaterial({
                map: texture
            });

            var meshCreator = new MeshCreator(this.loader);
            meshCreator.createMesh("models/dm.js", material, new THREE.Vector3(0, 0, 0), new THREE.Vector3(50, 50, 50), mesh => {
                this.scene.add(mesh);
            });

            //return new MeshModel(this.scene, this.loader, "models/dm.js", material, new THREE.Vector3(0, 0, 0), new THREE.Vector3(50, 50, 50));
        }
    }
} 