module DoughLand {
    export class MeshCreator {
        private loader: THREE.JSONLoader;

        constructor(loader: THREE.JSONLoader) {
            this.loader = loader;
        }

        public createMesh(modelPath: string, material: THREE.Material, position: THREE.Vector3, scale: THREE.Vector3, callback:(mesh: THREE.Mesh) => void): void {
            this.loader.load(modelPath, (geometry: THREE.Geometry) => {
                var mesh = new THREE.Mesh(geometry, material);
                mesh.position.set(position.x, position.y, position.z);
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                mesh.scale.set(scale.x, scale.y, scale.z);
                callback(mesh);
            });
        }

        public createPhysiMesh(modelPath: string, material: THREE.Material, position: THREE.Vector3, scale: THREE.Vector3, mass: number, callback: (mesh: THREE.Mesh) => void): void {
            this.loader.load(modelPath, (geometry: THREE.Geometry) => {
                var mesh = new Physijs.BoxMesh(geometry, material, mass);
                mesh.position.set(position.x, position.y, position.z);
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                mesh.scale.set(scale.x, scale.y, scale.z);
                callback(mesh);
            });
        }

        /*public tiePhysiMesh(mesh: THREE.Mesh, physObject: Physijs.Mesh, physOffset: THREE.Vector3): void {
            physObject.position.set(meshPosition.x + physOffset.x, meshPosition.y + physOffset.y, meshPosition.z + physOffset.z);
            physObject.material.visible = false;
            physObject.add(this.mesh);
            this.mesh.position.set(this.mesh.position.x - physObject.position.x, this.mesh.position.y - physObject.position.y, mesh.position.z - physObject.position.z);
        }*/
    }
} 