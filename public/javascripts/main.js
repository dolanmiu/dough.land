/*global $, THREE, console*/
// Set up the scene, camera, and renderer as global variables.
var scene, camera, mesh, dampingValue, light, circle, commentPosition;
$(function () {
    "use strict";
    var renderer, controls, projector, objects;
    objects = [];

    function degreeToRadians(degree) {
        return degree * (Math.PI / 180);
    }

    function loadModel() {
        var loader = new THREE.JSONLoader();
        loader.load("models/dm.js", function (geometry) {
            var material = new THREE.MeshLambertMaterial({
                color: 0xFFFFFF
            });

            //var material = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('models/FitMario_BodyA.png') } );
            //var material = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('models/baked.png') } );
            mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);

        });
    }

    function loadLine(radius) {
        var segments, material, geometry, circle;
        segments = 64;
        material = new THREE.LineBasicMaterial({
            color: 0x0000ff
        });
        geometry = new THREE.CircleGeometry(radius, segments);

        // Remove center vertex
        geometry.vertices.shift();
        circle = new THREE.Line(geometry, material);
        circle.rotation.x = degreeToRadians(90);
        circle.position.y = 0.5;
        scene.add(circle);
        return circle;
    }

    function onDocumentMouseDown(event) {
        event.preventDefault();

        var vector = new THREE.Vector3((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1, 0.5);
        projector.unprojectVector(vector, camera);

        var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());

        var intersects = raycaster.intersectObjects(objects);

        if (intersects.length > 0) {
            //intersects[0].object.material.color.setHex(Math.random() * 0xffffff);

            commentPosition = intersects[0].point;
            scaleUpAnimation($("#comment"), 600, 600, function () {

            });
        }
    }

    function addListeners() {
        // Create an event listener that resizes the renderer with the browser window.
        window.addEventListener('resize', function () {
            var WIDTH = window.innerWidth,
                HEIGHT = window.innerHeight;
            renderer.setSize(WIDTH, HEIGHT);
            camera.aspect = WIDTH / HEIGHT;
            camera.updateProjectionMatrix();
        });
        renderer.domElement.addEventListener('mousedown', onDocumentMouseDown, false);
    }

    function skybox() {
        var geometry = new THREE.SphereGeometry(3000, 60, 40);
        var uniforms = {
            texture: {
                type: 't',
                value: THREE.ImageUtils.loadTexture('images/skybox.jpg')
            }
        };

        var material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: document.getElementById('sky-vertex').textContent,
            fragmentShader: document.getElementById('sky-fragment').textContent
        });

        var skyBox = new THREE.Mesh(geometry, material);
        skyBox.scale.set(-1, 1, 1);
        skyBox.eulerOrder = 'XZY';
        skyBox.renderDepth = 1000.0;
        scene.add(skyBox);
    }

    // Sets up the scene.
    function init() {
        // Create the scene and set the scene size.
        scene = new THREE.Scene();
        projector = new THREE.Projector();

        var WIDTH = window.innerWidth,
            HEIGHT = window.innerHeight;

        // Create a renderer and add it to the DOM.
        renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        renderer.setSize(WIDTH, HEIGHT);
        $("#main").html(renderer.domElement);
        //document.body.appendChild(renderer.domElement);

        // Create a camera, zoom it out from the model a bit, and add it to the scene.
        camera = new THREE.PerspectiveCamera(100, WIDTH / HEIGHT, 0.1, 20000);
        camera.position.set(0, 2, 4.24);
        scene.add(camera);

        addListeners();

        // Set the background color of the scene.
        renderer.setClearColorHex(0xFFFFFF, 1);

        // Create a light, set its position, and add it to the scene.
        light = new THREE.PointLight(0xffffff);
        light.position.set(-100, 200, 100);
        scene.add(light);

        //var modelTexture = THREE.ImageUtils.loadTexture('models/baked.png', false, loadModel);
        loadModel();
        controls = new THREE.OrbitControls(camera, renderer.domElement);

        dampingValue = 0;
        skybox();
        circle = loadLine(10);

        var plane = new THREE.Mesh(new THREE.PlaneGeometry(300, 300), new THREE.MeshNormalMaterial());
        plane.overdraw = true;
        plane.rotation.x = degreeToRadians(-90);
        scene.add(plane);
        objects.push(plane);
        var particles = new Particles(scene);
    }

    function damp() {
        dampingValue = dampingValue * 0.8;
    }

    function animate() {
        requestAnimationFrame(animate);

        // Render the scene.
        renderer.render(scene, camera);
        controls.update();
        mesh.scale.set(1 + dampingValue, 1 + dampingValue, 1 + dampingValue);
        damp();
        //console.log(camera.position);
    }

    init();
    animate();
});

function addCommentObject(name, email, comment, x, z) {
    var particleMaterial = new THREE.SpriteCanvasMaterial({
        color: 0x000000,
        program: function (context) {
            context.beginPath();
            context.arc(0, 0, 0.5, 0, PI2, true);
            context.fill();
        }
    });

    var particle = new THREE.Sprite();
    particle.position.copy(new THREE.Vector3(x, 0, z));
    particle.scale.x = particle.scale.y = 1;
    scene.add(particle);
}