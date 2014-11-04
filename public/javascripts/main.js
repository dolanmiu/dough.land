/*global $, THREE, console*/
// Set up the scene, camera, and renderer as global variables.
var scene, camera, dmModel, dampingValue, light, circle, commentPosition, commentFactory;
$(function () {
    "use strict";
    var renderer, controls, projector, objects;
    objects = [];

    function loadModel() {
        var loader = new THREE.JSONLoader();
        /*var material = new THREE.MeshLambertMaterial({
                color: 0xFFFFFF
            });*/

        //var material = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('models/FitMario_BodyA.png') } );
        var texture = THREE.ImageUtils.loadTexture('models/baked.png');
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.LinearMipMapLinearFilter;
        var material = new THREE.MeshLambertMaterial({
            map: texture
        });

        var floorMaterial = new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('models/boxFloor.png')
        });

        dmModel = new MeshModel(scene, loader, "models/dm.js", material, new THREE.Vector3(0, 0, 0));

        var physMaterial = Physijs.createMaterial( // Physijs material
            new THREE.MeshBasicMaterial({ // Three.js material
                color: 0xeeeeee
            }),
            .4, // friction
            .8 // restitution
        );
        var phyfloor = new Physijs.BoxMesh( // Physijs mesh
            new THREE.BoxGeometry(15, 15, 15, 10, 10), // Three.js geometry
            physMaterial,
            0 // weight, 0 is for zero gravity
        );
        var physObject = new PhysicsModel(scene, loader, "models/boxFloor.js", floorMaterial, new THREE.Vector3(0, 0, 0), phyfloor, new THREE.Vector3(0, -7.5, 0));
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
            if (ableToComment === true) {
                scaleUpAnimation($("#comment"), 600, 600, function () {});
            }
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
        //var sky = new SkyBox(scene, document.getElementById('sky-vertex').textContent, document.getElementById('sky-fragment').textContent);
        /*var geometry = new THREE.SphereGeometry(3000, 60, 40);
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
        scene.add(skyBox);*/
    }

    // Sets up the scene.
    function init() {
        Physijs.scripts.worker = '/javascripts/physijs/physijs_worker.js';
        Physijs.scripts.ammo = '/javascripts/ammo.js';
        // Create the scene and set the scene size.
        scene = new Physijs.Scene();
        scene.setGravity(new THREE.Vector3(0, -50, 0)); // set gravity
        scene.addEventListener('update', function () {
            scene.simulate(undefined, 2);
        });

        projector = new THREE.Projector();

        var WIDTH = window.innerWidth,
            HEIGHT = window.innerHeight;

        // Create a renderer and add it to the DOM.
        renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        renderer.setSize(WIDTH, HEIGHT);
        renderer.shadowMapEnabled = true;
        renderer.shadowMapType = THREE.PCFSoftShadowMap;
        $("#main").html(renderer.domElement);
        //document.body.appendChild(renderer.domElement);

        // Create a camera, zoom it out from the model a bit, and add it to the scene.
        camera = new THREE.PerspectiveCamera(100, WIDTH / HEIGHT, 0.1, 20000);
        camera.position.set(0, 100, 212);
        scene.add(camera);

        addListeners();

        // Set the background color of the scene.
        renderer.setClearColor(0xFFFFFF, 1);
        var alight = new THREE.AmbientLight(0xFFFFFF); // soft white light
        scene.add(alight);
        // Create a light, set its position, and add it to the scene.
        light = new THREE.DirectionalLight(0xffffff);
        light.position.set(-100, 200, 100);
        light.castShadow = true;
        light.shadowBias = 0.0001;
        light.shadowDarkness = 0.1;
        light.shadowMapWidth = 4096; // default is 512
        light.shadowMapHeight = 4096; // default is 512
        light.onlyShadow = true;
        scene.add(light);

        //var modelTexture = THREE.ImageUtils.loadTexture('models/baked.png', false, loadModel);
        loadModel();
        controls = new THREE.OrbitControls(camera, renderer.domElement);

        dampingValue = 0;

        circle = loadLine(10);

        //plane.rotation.x = degreeToRadians(-90);
        var particles = new Particles(scene);
        commentFactory = new CommentFactory(scene, new THREE.JSONLoader());

        setInterval(function () {}, 600);
        scene.simulate();

    }

    function damp() {
        dampingValue = dampingValue * 0.8;
    }

    function animate() {
        requestAnimationFrame(animate);
        // Render the scene.
        renderer.render(scene, camera);
        controls.update();
        //dmModel.mesh.scale.set(1 + dampingValue, 1 + dampingValue, 1 + dampingValue);
        damp();
        //console.log(camera.position);
    }

    init();
    animate();
});