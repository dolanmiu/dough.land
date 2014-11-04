/*globals $, THREE */

function Particles(scene) {
    "use strict";
    // create the particle variables
    var particleCount = 1800,
        particles = new THREE.Geometry(),
        pMaterial = new THREE.ParticleBasicMaterial({
            color: 0xFFFFFF,
            size: 20,
            map: THREE.ImageUtils.loadTexture(
                "images/particle.png"
            ),
            blending: THREE.AdditiveBlending,
            transparent: true
        });

    // now create the individual particles
    for (var p = 0; p < particleCount; p++) {

        // create a particle with random
        // position values, -250 -> 250
        var pX = Math.random() * 500 - 250,
            pY = Math.random() * 500 - 250,
            pZ = Math.random() * 500 - 250,
            particle = new THREE.Vector3(pX, pY, pZ);

        // add it to the geometry
        particles.vertices.push(particle);
    }

    // create the particle system
    var particleSystem = new THREE.ParticleSystem(
        particles,
        pMaterial);

    particleSystem.sortParticles = true;
    // add it to the scene
    scene.add(particleSystem);
}

Particles.prototype = {
    constrcutor: Particles
};