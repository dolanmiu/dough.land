/*globals $, THREE */

function PhysicsModel(scene, loader, modelPath, material, meshPosition, physObject, physOffset) {
    "use strict";
    if (arguments.length < 7) {
        return;
    }
    MeshModel.apply(this, arguments);
    this.physObject = physObject;
    this.physObject.position.set(meshPosition.x + physOffset.x, meshPosition.y + physOffset.y, meshPosition.z + physOffset.z);

    this.physObject.material.visible = false;
    scene.add(this.physObject);
}

PhysicsModel.prototype = new MeshModel();
PhysicsModel.prototype.constructor = PhysicsModel;
PhysicsModel.prototype.meshAdded = function () {
    this.physObject.add(this.mesh);
    this.mesh.position.set(this.mesh.position.x - this.physObject.position.x, this.mesh.position.y - this.physObject.position.y, this.mesh.position.z - this.physObject.position.z);
};