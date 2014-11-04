/*globals $, THREE */

function SkyBox(scene, imagePath, vertexShadrer, fragmentShader) {
    "use strict";
    var geometry, uniforms, material, skyBox;
    geometry = new THREE.SphereGeometry(3000, 60, 40);
    uniforms = {
        texture: {
            type: 't',
            value: THREE.ImageUtils.loadTexture(imagePath)
        }
    };

    material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShadrer,
        fragmentShader: fragmentShader
    });

    skyBox = new THREE.Mesh(geometry, material);
    skyBox.scale.set(-1, 1, 1);
    skyBox.eulerOrder = 'XZY';
    skyBox.renderDepth = 1000.0;
    scene.add(skyBox);
}

SkyBox.prototype = {
    constructor: SkyBox
};