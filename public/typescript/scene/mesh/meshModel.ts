module DoughLand {
    export class MeshModel {
        protected scene: THREE.Scene;
        protected loader: THREE.Loader;
        protected mesh: THREE.Mesh;

        constructor(scene: THREE.Scene, loader: THREE.JSONLoader, modelPath: string, material: THREE.Material, position: THREE.Vector3, scale: THREE.Vector3) {
            loader.load(modelPath, (geometry: THREE.Geometry) => {
                this.mesh = new THREE.Mesh(geometry, material);
                this.mesh.position.set(position.x, position.y, position.z);
                scene.add(this.mesh);
                this.mesh.castShadow = true;
                this.mesh.receiveShadow = true;
                this.mesh.scale.set(scale.x, scale.y, scale.z);

                this.meshAdded();
            });
        }

        protected meshAdded(): void {

        }
    }
}