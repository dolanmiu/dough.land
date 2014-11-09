/*globals $, THREE */

function MeshModel(scene, loader, modelPath, material, position, scale) {
    "use strict";
    if (arguments.length < 6) {
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
        mesh.scale.set(scale.x, scale.y, scale.z);
        
        self.meshAdded();
    });

}

MeshModel.prototype.meshAdded = function () {

};