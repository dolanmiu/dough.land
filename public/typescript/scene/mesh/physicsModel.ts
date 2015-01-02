///<reference path='meshModel.ts' />
module DoughLand {
    export class PhysicsModel extends MeshModel {
        private physObject: Physijs.Mesh;

        constructor(scene: THREE.Scene, loader: THREE.JSONLoader, modelPath: string, material: THREE.Material, meshPosition: THREE.Vector3, meshScale: THREE.Vector3, physObject: Physijs.Mesh, physOffset: THREE.Vector3) {
            super(scene, loader, modelPath, material, meshPosition, meshScale);

            this.physObject = physObject;
            this.physObject.position.set(meshPosition.x + physOffset.x, meshPosition.y + physOffset.y, meshPosition.z + physOffset.z);
            this.physObject.material.visible = false;
            scene.add(this.physObject);
        }

        public getMesh(): Physijs.Mesh {
            return this.physObject;
        }

        protected meshAdded(): void {
            this.physObject.add(this.mesh);
            this.mesh.position.set(this.mesh.position.x - this.physObject.position.x, this.mesh.position.y - this.physObject.position.y, this.mesh.position.z - this.physObject.position.z);
        }
    }
}