/*globals $, THREE, PhysicsModel */

function Comment(scene, loader, modelPath, material, meshPosition, physObject, physOffset, name, email, comment, userIP) {
    "use strict";
    if (arguments.length < 11) {
        return;
    }
    PhysicsModel.apply(this, arguments);
    this.name = name;
    this.email = email;
    this.comment = comment;
    this.userIP = userIP;

    this.particleMaterial = new THREE.SpriteCanvasMaterial({
        color: 0x000000,
        program: function (context) {
            context.beginPath();
            context.arc(0, 0, 0.5, 0, PI2, true);
            context.fill();
        }
    });
}

Comment.prototype = new PhysicsModel();
Comment.prototype.constructor = Comment;
Comment.prototype.placeAt = function (x, z) {
};