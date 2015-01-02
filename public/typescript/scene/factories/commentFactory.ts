module DoughLand {
    export class CommentFactory {
        private meshCreator: MeshCreator;

        constructor(meshCreator: MeshCreator) {
            this.meshCreator = meshCreator;
        }

        public newInstance(meshPosition: THREE.Vector3, callback: (mesh: THREE.Mesh) => void): void {
            var material = Physijs.createMaterial(
                new THREE.MeshLambertMaterial({
                    map: THREE.ImageUtils.loadTexture('models/parcel.png')
                }),
                0.4,
                0.8
                );
            this.meshCreator.createPhysiMesh('models/parcel.js', material, meshPosition, new THREE.Vector3(5, 5, 5), 1, mesh => {
                mesh.rotation.y = Math.random() * 2 * Math.PI;
                callback(mesh);
            });
        }
    }
}