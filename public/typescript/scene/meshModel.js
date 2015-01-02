/// <reference path='../definitions/threejs/three.d.ts' />
var DoughLand;
(function (DoughLand) {
    var MeshModel = (function () {
        function MeshModel(scene, loader, modelPath, material, position, scale) {
            var _this = this;
            loader.load(modelPath, function (geometry) {
                var mesh = new THREE.Mesh(geometry, material);
                _this.mesh = mesh;
                mesh.position.set(position.x, position.y, position.z);
                _this.scene.add(_this.mesh);
                _this.mesh.castShadow = true;
                _this.mesh.receiveShadow = true;
                _this.mesh.scale.set(scale.x, scale.y, scale.z);
                _this.meshAdded();
            });
        }
        MeshModel.prototype.meshAdded = function () {
        };
        return MeshModel;
    })();
    DoughLand.MeshModel = MeshModel;
})(DoughLand || (DoughLand = {}));
//# sourceMappingURL=meshModel.js.map