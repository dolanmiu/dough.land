/*globals $, THREE */

function MeshModel(scene, loader, modelPath, material, position) {
    "use strict";
    if (arguments.length < 5) {
        return;
    }
    this.scene = scene;
    this.loader = loader;

    var self = this;
    loader.load(modelPath, function (geometry) {
        var mesh = new THREE.Mesh(geometry, material);
        self.mesh = mesh;
        mesh.position.set(position.x, position.y, position.z);
        scene.add(mesh);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        self.meshAdded();
        mesh.scale.set(50,50,50);
    });
    
}

MeshModel.prototype.meshAdded = function () {
    
};