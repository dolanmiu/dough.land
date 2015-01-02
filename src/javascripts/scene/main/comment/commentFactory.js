/*globals $, THREE, Physijs, Comment */
function CommentFactory(scene, loader) {
    "use strict";
    this.scene = scene;
    this.loader = loader;
}

CommentFactory.prototype.newInstance = function (meshPosition, name, email, comment, userIP) {
    "use strict";
    var material, commentObj, physObject, physMaterial;

    material = new THREE.MeshPhongMaterial({
        map: THREE.ImageUtils.loadTexture('models/parcel.png'),
        specularMap: THREE.ImageUtils.loadTexture('models/parcelspecular.png'),
        specular: new THREE.Color('grey'),
        bumpMap: THREE.ImageUtils.loadTexture('models/parcelspecular.png'),
        bumpScale: 1
    });
    
    physMaterial = Physijs.createMaterial( // Physijs material
        new THREE.MeshLambertMaterial({ // Three.js material
            color: 0xeeeeee
        }),
        0.4, // friction
        0.8 // restitution
    );

    physObject = new Physijs.BoxMesh( // Physijs mesh
        new THREE.BoxGeometry(25, 25, 25, 10, 10), // Three.js geometry
        physMaterial,
        1 // weight, 0 is for zero gravity
    );
    physObject.rotation.y = Math.random() * 2 * Math.PI;
    commentObj = new Comment(this.scene, this.loader, 'models/parcel.js', material, meshPosition, new THREE.Vector3(5, 5, 5), physObject, new THREE.Vector3(0, 0, 0), name, email, comment, userIP);
    return commentObj;
};