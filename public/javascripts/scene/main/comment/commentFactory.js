/*globals $, THREE, Physijs, Comment */
function CommentFactory(scene, loader) {
    "use strict";
    this.scene = scene;
    this.loader = loader;
}

CommentFactory.prototype.newInstance = function (meshPosition, name, email, comment, userIP) {
    "use strict";
    var material, comment, physObject;

    material = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('models/baked.png')
    });

    var physMaterial = Physijs.createMaterial( // Physijs material
        new THREE.MeshLambertMaterial({ // Three.js material
            color: 0xeeeeee
        }),
        0.4, // friction
        0.8 // restitution
    );

    physObject = new Physijs.BoxMesh( // Physijs mesh
        new THREE.BoxGeometry(1, 1, 1, 10, 10), // Three.js geometry
        physMaterial,
        1 // weight, 0 is for zero gravity
    );

    comment = new Comment(this.scene, this.loader, 'models/dm.js', material, meshPosition, physObject, new THREE.Vector3(0, 0, 0), name, email, comment, userIP);
    return comment;
};