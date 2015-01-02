/*global $, commentFactory, console */

function ajaxAddMessage(name, email, comment, xPos, zPos, ip, callback) {
    var jsonString = '{"name":"' + name + '","email":"' + email + '","comment":"' + comment + '","xPos":' + xPos + ',"zPos":' + zPos + ',"ip":"' + ip + '"}';
    $.ajax({
        url: "/messages/add",
        type: "post",
        data: jsonString,
        contentType: 'application/json',
        success: function (res) {
            callback();
        }
    });
}

function ajaxGetMessages() {
    $.ajax({
        url: "/messages/get",
        type: "get",
        contentType: 'application/json',
        success: function (res) {
            for (var i = 0; i < res.length; i++) {
                var comment = commentFactory.newInstance(new THREE.Vector3(res[i].xPos, 5, res[i].zPos), res[i].username, res[i].email, res[i].comment, res[i].ip);
                commentObjects.push(comment.physObject);
                commentsDictionary[comment.physObject.uuid] = comment;
            }

        }
    });
}

function scaleDownAnimation(object, callback) {
    object.animate({
        height: '0px',
        width: '0px',
        opacity: 0
    }, 500, callback);
}

function scaleUpAnimation(object, newWidth, newHeight, callback) {
    object.animate({
        height: newHeight,
        width: newWidth,
        opacity: 1
    }, 500, callback);
}

$("#comment-close").click(function () {
    scaleDownAnimation($(this).parent().parent(), function () {
        console.log("closed");
    });
});

$("#comment-submit").click(function () {
    scaleDownAnimation($(this).parent().parent(), function () {
        ajaxAddMessage($("#comment-name").val(), $("#comment-email").val(), $("#comment-text").val(), commentPosition.x, commentPosition.z, userIP, function () {
            var comment = commentFactory.newInstance(new THREE.Vector3(commentPosition.x, 5, commentPosition.z), $("#comment-name").val(), $("#comment-email").val(), $("#comment-text").val(), userIP);
            commentObjects.push(comment.physObject);
            commentsDictionary[comment.physObject.uuid] = comment;
            ableToComment = false;
        });
    });
});

function displayComment(comment) {
    console.log(comment.comment);
}

ajaxGetMessages();
/*global $, THREE, console*/
// Set up the scene, camera, and renderer as global variables.
var scene, camera, dmModel, dampingValue, circle, commentPosition, commentFactory, commentObjects, commentsDictionary;
$(function () {
    "use strict";
    var renderer, controls, objects, mouseVector, raycaster;
    objects = [];
    commentObjects = [];
    commentsDictionary = {};

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

        dmModel = new MeshModel(scene, loader, "models/dm.js", material, new THREE.Vector3(0, 0, 0), new THREE.Vector3(50, 50, 50));

        var physMaterial = Physijs.createMaterial( // Physijs material
            new THREE.MeshBasicMaterial({ // Three.js material
                color: 0xeeeeee
            }),
            .4, // friction
            .8 // restitution
        );
        var phyfloor = new Physijs.BoxMesh( // Physijs mesh
            new THREE.BoxGeometry(750, 750, 750, 10, 10), // Three.js geometry
            physMaterial,
            0 // weight, 0 is for zero gravity
        );
        var physObject = new PhysicsModel(scene, loader, "models/boxFloor.js", floorMaterial, new THREE.Vector3(0, 0, 0), new THREE.Vector3(50, 50, 50), phyfloor, new THREE.Vector3(0, -375, 0));
        objects.push(phyfloor);
    }

    function onDocumentMouseDown(event) {
        event.preventDefault();
        var intersects = raycaster.intersectObjects(objects);

        if (intersects.length > 0) {
            //intersects[0].object.material.color.setHex(Math.random() * 0xffffff);
            commentPosition = intersects[0].point;
            //if (ableToComment === true) {
                scaleUpAnimation($("#comment"), 600, 600, function () {});
            //}
        }
    }

    function onDocumentMouseMove(event) {
        mouseVector.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1, 0.5);
        mouseVector.unproject(camera);
        raycaster.set(camera.position, mouseVector.sub(camera.position).normalize());
        var intersects = raycaster.intersectObjects(commentObjects);

        if (intersects.length > 0) {
            var currentObject = intersects[0].object;
            var comment = commentsDictionary[currentObject.uuid];
            $("#comment-details").css("visibility", "visible");
            $("#comment-details").css("left", event.clientX - 140);
            $("#comment-details").css("top", event.clientY - 165);
            $("#comment-details").html(comment.comment + '<p align="right"> - ' + comment.name + "</p>");
        } else {
            $("#comment-details").css("visibility", "hidden");
        }
    }

    function addListeners() {
        window.addEventListener('resize', function () {
            var WIDTH = window.innerWidth,
                HEIGHT = window.innerHeight;
            renderer.setSize(WIDTH, HEIGHT);
            camera.aspect = WIDTH / HEIGHT;
            camera.updateProjectionMatrix();
        });
        renderer.domElement.addEventListener('mousedown', onDocumentMouseDown, false);
        renderer.domElement.addEventListener('mousemove', onDocumentMouseMove, false);
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

    function createLights() {
        var alight, light;

        alight = new THREE.AmbientLight(0xffffff); // soft white light
        scene.add(alight);

        light = new THREE.DirectionalLight(0x7A7A7A);
        light.position.set(-100, 200, 100);
        light.castShadow = true;
        light.shadowBias = 0.0001;
        light.shadowDarkness = 0.2;
        light.shadowMapWidth = 4096; // default is 512
        light.shadowMapHeight = 4096; // default is 512
        light.onlyShadow = true;
        scene.add(light);
        var light2 = new THREE.PointLight(new THREE.Color("rgb(255,15,255)"), 4);
        //light2.position.set(0, 200, 0);
        //scene.add(light2);
    }

    // Sets up the scene.
    function init() {
        Physijs.scripts.worker = '/js/physijs_worker.js';
        Physijs.scripts.ammo = '/js/ammo.js';
        // Create the scene and set the scene size.
        scene = new Physijs.Scene();
        scene.setGravity(new THREE.Vector3(0, -50, 0)); // set gravity
        scene.addEventListener('update', function () {
            scene.simulate(undefined, 2);
        });

        var WIDTH = window.innerWidth,
            HEIGHT = window.innerHeight;

        // Create a renderer and add it to the DOM.
        renderer = new THREE.WebGLRenderer({
            antialias: true
        });

        renderer.setSize(WIDTH, HEIGHT);
        renderer.shadowMapEnabled = true;
        renderer.shadowMapType = THREE.PCFSoftShadowMap;
        renderer.setClearColor(0xFFFFFF, 1);

        $("#main").html(renderer.domElement);
        //document.body.appendChild(renderer.domElement);

        // Create a camera, zoom it out from the model a bit, and add it to the scene.
        camera = new THREE.PerspectiveCamera(100, WIDTH / HEIGHT, 0.1, 20000);
        camera.position.set(0, 100, 212);
        scene.add(camera);

        addListeners();
        createLights();

        mouseVector = new THREE.Vector3();
        raycaster = new THREE.Raycaster();

        //var modelTexture = THREE.ImageUtils.loadTexture('models/baked.png', false, loadModel);
        loadModel();
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.maxPolarAngle = Math.PI * 5 / 12;
        controls.minPolarAngle = Math.PI * 1 / 12;
        controls.minDistance = 200;
        controls.maxDistance = Infinity;

        dampingValue = 0;
        //var particles = new Particles(scene);
        commentFactory = new CommentFactory(scene, new THREE.JSONLoader());

        setInterval(function () {}, 600);
        scene.simulate();
        scene.fog = THREE.Fog(0xffffff, 1, 100);
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
        //damp();
        //console.log(camera.position);
    }

    init();
    animate();
});
/*globals $, console */
var userIP, ableToComment;

function ajaxCheckIP(ip) {
    var jsonString = '{"ip":"' + ip + '"}';
    $.ajax({
        url: "/ip/check",
        type: "post",
        data: jsonString,
        contentType: 'application/json',
        success: function (res) {
            ableToComment = !res;
        }
    });
}

$.getJSON("http://www.telize.com/jsonip?callback=?", function (json) {
    userIP = json.ip;
    ajaxCheckIP(json.ip);
});
function degreeToRadians(degree) {
    return degree * (Math.PI / 180);
}
/*globals $, THREE */

function MeshModel(scene, loader, modelPath, material, position, scale) {
    "use strict";
    if (arguments.length < 6) {
        return;
    }
    this.scene = scene;
    this.loader = loader;

    var self = this;
    loader.load(modelPath, function (geometry) {
        var mesh = new THREE.Mesh(geometry, material);
        self.mesh = mesh;
        mesh.position.set(position.x, position.y, position.z);
        scene.add(mesh);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.scale.set(scale.x, scale.y, scale.z);
        
        self.meshAdded();
    });

}

MeshModel.prototype.meshAdded = function () {

};
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
/*globals $, THREE */

function PhysicsModel(scene, loader, modelPath, material, meshPosition, meshScale, physObject, physOffset) {
    "use strict";
    if (arguments.length < 8) {
        return;
    }
    MeshModel.apply(this, arguments);
    this.physObject = physObject;
    this.physObject.position.set(meshPosition.x + physOffset.x, meshPosition.y + physOffset.y, meshPosition.z + physOffset.z);

    this.physObject.material.visible = false;
    scene.add(this.physObject);
}

PhysicsModel.prototype = new MeshModel();
PhysicsModel.prototype.constructor = PhysicsModel;
PhysicsModel.prototype.meshAdded = function () {
    this.physObject.add(this.mesh);
    this.mesh.position.set(this.mesh.position.x - this.physObject.position.x, this.mesh.position.y - this.physObject.position.y, this.mesh.position.z - this.physObject.position.z);
};
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
/*globals $, THREE, PhysicsModel */

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
Comment.prototype.placeAt = function (x, z) {};
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