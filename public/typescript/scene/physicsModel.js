var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path='../definitions/physijs/physijs.d.ts' />
var DoughLand;
(function (DoughLand) {
    var PhysicsModel = (function (_super) {
        __extends(PhysicsModel, _super);
        function PhysicsModel(scene, loader, modelPath, material, meshPosition, meshScale, physObject, physOffset) {
            _super.call(this, scene, loader, modelPath, material, meshPosition, meshScale);
            this.physObject = physObject;
            this.physObject.position.set(meshPosition.x + physOffset.x, meshPosition.y + physOffset.y, meshPosition.z + physOffset.z);
            this.physObject.material.visible = false;
            scene.add(this.physObject);
        }
        PhysicsModel.prototype.meshAdded = function () {
            this.physObject.add(this.mesh);
            this.mesh.position.set(this.mesh.position.x - this.physObject.position.x, this.mesh.position.y - this.physObject.position.y, this.mesh.position.z - this.physObject.position.z);
        };
        return PhysicsModel;
    })(DoughLand.MeshModel);
    DoughLand.PhysicsModel = PhysicsModel;
})(DoughLand || (DoughLand = {}));
//# sourceMappingURL=physicsModel.js.map