var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DoughLand;
(function (DoughLand) {
    var Comment = (function (_super) {
        __extends(Comment, _super);
        function Comment(scene, loader, modelPath, material, meshPosition, meshScale, physObject, physOffset, name, email, comment, userIP) {
        }
        return Comment;
    })(DoughLand.PhysicsModel);
})(DoughLand || (DoughLand = {}));
function Comment(scene, loader, modelPath, material, meshPosition, meshScale, physObject, physOffset, name, email, comment, userIP) {
    "use strict";
    if (arguments.length < 12) {
        return;
    }
    PhysicsModel.apply(this, arguments);
    this.name = name;
    this.email = email;
    this.comment = comment;
    this.userIP = userIP;
    /*this.particleMaterial = new THREE.SpriteCanvasMaterial({
        color: 0x000000,
        program: function (context) {
            context.beginPath();
            context.arc(0, 0, 0.5, 0, Math.PI * 2, true);
            context.fill();
        }
    });*/
}
Comment.prototype = new PhysicsModel();
Comment.prototype.constructor = Comment;
Comment.prototype.placeAt = function (x, z) {
};
Comment.prototype.meshAddedBase = Comment.prototype.meshAdded;
Comment.prototype.meshAdded = function () {
    "use strict";
    this.meshAddedBase();
    var decalMaterial = new THREE.MeshPhongMaterial({
        specular: 0xffffff,
        shininess: 10,
        map: THREE.ImageUtils.loadTexture('images/splatter.png'),
        //normalMap: THREE.ImageUtils.loadTexture('assets/wrinkle-normal.jpg'),
        normalScale: new THREE.Vector2(0.15, 0.15),
        transparent: true,
        depthTest: true,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -4,
        wireframe: false
    });
    var scale = 1;
    var s = new THREE.Vector3(scale, scale, scale);
    var dir = new THREE.Vector3();
    dir.sub(camera.position);
    p = intersection.point;
    var m = new THREE.Matrix4();
    var c = dir.clone();
    c.negate();
    c.multiplyScalar(10);
    c.add(p);
    m.lookAt(p, c, up);
    m = m.extractRotation(m);
    dummy = new THREE.Object3D();
    dummy.rotation.setFromRotationMatrix(m);
    r.set(dummy.rotation.x, dummy.rotation.y, dummy.rotation.z);
    var m2 = new THREE.Mesh(new THREE.DecalGeometry(this.mesh, p, r, s, 0), decalMaterial);
    //decals.push(m);
    this.scene.add(m2);
};
//# sourceMappingURL=comment.js.map