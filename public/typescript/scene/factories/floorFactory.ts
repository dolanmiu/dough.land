module DoughLand {
    export class FloorFactory {
        private meshCreator: MeshCreator;

        constructor(meshCreator: MeshCreator) {
            this.meshCreator = meshCreator;
        }

        public newInstance(meshPosition: THREE.Vector3, callback: (mesh: THREE.Mesh) => void): void {
            var material = Physijs.createMaterial(
                new THREE.MeshLambertMaterial({
                    map: THREE.ImageUtils.loadTexture('models/boxFloor.png')
                }),
                0.4,
                0.8
                );

            this.meshCreator.createPhysiMesh('models/boxfloor.js', material, meshPosition, new THREE.Vector3(50, 50, 50), 0, mesh => {
                callback(mesh);
            });
            //return new PhysicsModel(this.scene, this.loader, "models/boxFloor.js", floorMaterial, new THREE.Vector3(0, 0, 0), new THREE.Vector3(50, 50, 50), phyfloor, new THREE.Vector3(0, -375, 0));
        }
    }
}