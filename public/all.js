var DoughLand;
(function (DoughLand) {
    var JQueryHelper = (function () {
        function JQueryHelper() {
        }
        JQueryHelper.scaleDownAnimation = function (object, callback) {
            object.animate({
                height: '0px',
                width: '0px',
                opacity: 0
            }, 500, callback);
        };
        JQueryHelper.scaleUpAnimation = function (object, newWidth, newHeight, callback) {
            object.animate({
                height: newHeight,
                width: newWidth,
                opacity: 1
            }, 500, callback);
        };
        return JQueryHelper;
    })();
    DoughLand.JQueryHelper = JQueryHelper;
})(DoughLand || (DoughLand = {}));
var DoughLand;
(function (DoughLand) {
    var CommentTracker = (function () {
        function CommentTracker() {
        }
        CommentTracker.addCommentData = function (uuid, commentData) {
            this.commentDictionary[uuid] = commentData;
        };
        CommentTracker.getComment = function (uuid) {
            return this.commentDictionary[uuid];
        };
        CommentTracker.getCommentObjects = function () {
            return this.commentObjects;
        };
        CommentTracker.addCommentObject = function (mesh) {
            this.commentObjects.push(mesh);
        };
        CommentTracker.setCurrentCommentPosition = function (commentPos) {
            this.currentCommentPosition = commentPos;
        };
        CommentTracker.getCurrentCommentPosition = function () {
            return this.currentCommentPosition;
        };
        CommentTracker.commentDictionary = {};
        CommentTracker.commentObjects = new Array();
        return CommentTracker;
    })();
    DoughLand.CommentTracker = CommentTracker;
})(DoughLand || (DoughLand = {}));
var DoughLand;
(function (DoughLand) {
    var UserData = (function () {
        function UserData(name, email, comment, userIP) {
            this.name = name;
            this.email = email;
            this.comment = comment;
            this.userIP = userIP;
        }
        UserData.prototype.getName = function () {
            return this.name;
        };
        UserData.prototype.getEmail = function () {
            return this.email;
        };
        UserData.prototype.getComment = function () {
            return this.comment;
        };
        UserData.prototype.getUserIP = function () {
            return this.userIP;
        };
        return UserData;
    })();
    DoughLand.UserData = UserData;
})(DoughLand || (DoughLand = {}));
var DoughLand;
(function (DoughLand) {
    var CommentModal = (function () {
        function CommentModal(commentDataService, authenticator) {
            this.commentDataService = commentDataService;
            this.authenticator = authenticator;
        }
        CommentModal.prototype.open = function (callback) {
            DoughLand.JQueryHelper.scaleUpAnimation($("#comment"), 600, 600, function () {
            });
            $("#comment-submit").unbind();
            $("#comment-close").unbind();
            $("#comment-submit").click(function () {
                DoughLand.JQueryHelper.scaleDownAnimation($("#comment"), function () {
                    var userData = new DoughLand.UserData($("#comment-name").val(), $("#comment-email").val(), $("#comment-text").val(), this.authenticator.getIP());
                    this.commentDataService.ajaxAddMessage(userData, DoughLand.CommentTracker.getCurrentCommentPosition().x, DoughLand.CommentTracker.getCurrentCommentPosition().z);
                    callback(false);
                });
            });
            $("#comment-close").click(function () {
                DoughLand.JQueryHelper.scaleDownAnimation($("#comment"), function () {
                });
            });
        };
        return CommentModal;
    })();
    DoughLand.CommentModal = CommentModal;
})(DoughLand || (DoughLand = {}));
var DoughLand;
(function (DoughLand) {
    var Authentication = (function () {
        function Authentication() {
            this.userIP = '';
            this.ableToComment = false;
        }
        Authentication.prototype.ajaxCheckIP = function (ip, callback) {
            var jsonString = '{"ip":"' + ip + '"}';
            $.ajax({
                url: "/ip/check",
                type: "post",
                data: jsonString,
                contentType: 'application/json'
            }).done(function (res) {
                callback(!res);
            });
        };
        Authentication.prototype.authenticate = function (callback) {
            var _this = this;
            $.getJSON("http://www.telize.com/jsonip?callback=?", function (json) {
                _this.userIP = json.ip;
                _this.ajaxCheckIP(json.ip, function (res) {
                    callback(res);
                });
            });
        };
        Authentication.prototype.getIP = function () {
            return this.userIP;
        };
        Authentication.prototype.getAbleToComment = function () {
            return this.ableToComment;
        };
        Authentication.prototype.setAbleToComment = function (able) {
            this.ableToComment = able;
        };
        return Authentication;
    })();
    DoughLand.Authentication = Authentication;
})(DoughLand || (DoughLand = {}));
var DoughLand;
(function (DoughLand) {
    var CommentDataService = (function () {
        function CommentDataService(scene, commentFactory) {
            this.commentFactory = commentFactory;
            this.scene = scene;
        }
        CommentDataService.prototype.ajaxAddMessage = function (userData, xPos, zPos) {
            var _this = this;
            var jsonString = '{"name":"' + userData.getName() + '","email":"' + userData.getEmail() + '","comment":"' + userData.getComment() + '","xPos":' + xPos + ',"zPos":' + zPos + ',"ip":"' + userData.getUserIP() + '"}';
            $.ajax({
                url: "/messages/add",
                type: "post",
                data: jsonString,
                contentType: 'application/json',
            }).done(function (data) {
                _this.addComment(userData.getName(), userData.getEmail(), userData.getComment(), userData.getUserIP(), xPos, zPos);
            });
        };
        CommentDataService.prototype.ajaxGetMessages = function () {
            var _this = this;
            $.ajax({
                url: "/messages/get",
                type: "get",
                contentType: 'application/json'
            }).done(function (data) {
                for (var i = 0; i < data.length; i++) {
                    _this.addComment(data[i].username, data[i].email, data[i].comment, data[i].ip, data[i].xPos, data[i].zPos);
                }
            });
        };
        CommentDataService.prototype.addComment = function (username, email, comment, ip, xPos, zPos) {
            var _this = this;
            var userData = new DoughLand.UserData(username, email, comment, ip);
            this.commentFactory.newInstance(new THREE.Vector3(xPos, 10, zPos), function (mesh) {
                DoughLand.CommentTracker.addCommentData(mesh.uuid, userData);
                DoughLand.CommentTracker.addCommentObject(mesh);
                _this.scene.add(mesh);
            });
        };
        return CommentDataService;
    })();
    DoughLand.CommentDataService = CommentDataService;
})(DoughLand || (DoughLand = {}));
var DoughLand;
(function (DoughLand) {
    var CommentFactory = (function () {
        function CommentFactory(meshCreator) {
            this.meshCreator = meshCreator;
        }
        CommentFactory.prototype.newInstance = function (meshPosition, callback) {
            var material = Physijs.createMaterial(new THREE.MeshLambertMaterial({
                map: THREE.ImageUtils.loadTexture('models/parcel.png')
            }), 0.4, 0.8);
            this.meshCreator.createPhysiMesh('models/parcel.js', material, meshPosition, new THREE.Vector3(5, 5, 5), 1, function (mesh) {
                mesh.rotation.y = Math.random() * 2 * Math.PI;
                callback(mesh);
            });
        };
        return CommentFactory;
    })();
    DoughLand.CommentFactory = CommentFactory;
})(DoughLand || (DoughLand = {}));
var DoughLand;
(function (DoughLand) {
    var DMFactory = (function () {
        function DMFactory(scene, loader) {
            this.scene = scene;
            this.loader = loader;
        }
        DMFactory.prototype.newInstance = function () {
            var _this = this;
            var texture = THREE.ImageUtils.loadTexture('models/baked.png');
            texture.magFilter = THREE.NearestFilter;
            texture.minFilter = THREE.LinearMipMapLinearFilter;
            var material = new THREE.MeshLambertMaterial({
                map: texture
            });
            var meshCreator = new DoughLand.MeshCreator(this.loader);
            meshCreator.createMesh("models/dm.js", material, new THREE.Vector3(0, 0, 0), new THREE.Vector3(50, 50, 50), function (mesh) {
                _this.scene.add(mesh);
            });
        };
        return DMFactory;
    })();
    DoughLand.DMFactory = DMFactory;
})(DoughLand || (DoughLand = {}));
var DoughLand;
(function (DoughLand) {
    var FloorFactory = (function () {
        function FloorFactory(meshCreator) {
            this.meshCreator = meshCreator;
        }
        FloorFactory.prototype.newInstance = function (meshPosition, callback) {
            var material = Physijs.createMaterial(new THREE.MeshLambertMaterial({
                map: THREE.ImageUtils.loadTexture('models/boxFloor.png')
            }), 0.4, 0.8);
            this.meshCreator.createPhysiMesh('models/boxfloor.js', material, meshPosition, new THREE.Vector3(50, 50, 50), 0, function (mesh) {
                callback(mesh);
            });
        };
        return FloorFactory;
    })();
    DoughLand.FloorFactory = FloorFactory;
})(DoughLand || (DoughLand = {}));
var DoughLand;
(function (DoughLand) {
    var MeshCreator = (function () {
        function MeshCreator(loader) {
            this.loader = loader;
        }
        MeshCreator.prototype.createMesh = function (modelPath, material, position, scale, callback) {
            this.loader.load(modelPath, function (geometry) {
                var mesh = new THREE.Mesh(geometry, material);
                mesh.position.set(position.x, position.y, position.z);
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                mesh.scale.set(scale.x, scale.y, scale.z);
                callback(mesh);
            });
        };
        MeshCreator.prototype.createPhysiMesh = function (modelPath, material, position, scale, mass, callback) {
            this.loader.load(modelPath, function (geometry) {
                var mesh = new Physijs.BoxMesh(geometry, material, mass);
                mesh.position.set(position.x, position.y, position.z);
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                mesh.scale.set(scale.x, scale.y, scale.z);
                callback(mesh);
            });
        };
        return MeshCreator;
    })();
    DoughLand.MeshCreator = MeshCreator;
})(DoughLand || (DoughLand = {}));
var DoughLand;
(function (DoughLand) {
    var Main = (function () {
        function Main() {
        }
        Main.createFloor = function (scene, meshCreator) {
            var _this = this;
            var floorFactory = new DoughLand.FloorFactory(meshCreator);
            floorFactory.newInstance(new THREE.Vector3(0, -375, 0), function (mesh) {
                scene.add(mesh);
                _this.objects = new Array();
                Main.objects.push(mesh);
            });
        };
        Main.createDMObject = function (scene, loader) {
            var dmFactory = new DoughLand.DMFactory(scene, loader);
            dmFactory.newInstance();
        };
        Main.createLights = function (scene) {
            var alight = new THREE.AmbientLight(0xffffff);
            scene.add(alight);
            var light = new THREE.DirectionalLight(0x7A7A7A);
            light.position.set(-100, 200, 100);
            light.castShadow = true;
            light.shadowBias = 0.0001;
            light.shadowDarkness = 0.2;
            light.shadowMapWidth = 4096;
            light.shadowMapHeight = 4096;
            light.onlyShadow = true;
            scene.add(light);
        };
        Main.createOrbitalControls = function (camera, domElement) {
            var controls = new THREE.OrbitControls(camera, domElement);
            controls.maxPolarAngle = Math.PI * 5 / 12;
            controls.minPolarAngle = Math.PI * 3 / 12;
            controls.minDistance = 200;
            controls.maxDistance = 300;
            return controls;
        };
        Main.addListeners = function (renderer, camera) {
            var _this = this;
            window.addEventListener('resize', function () {
                var WIDTH = window.innerWidth, HEIGHT = window.innerHeight;
                renderer.setSize(WIDTH, HEIGHT);
                camera.aspect = WIDTH / HEIGHT;
                camera.updateProjectionMatrix();
            });
            renderer.domElement.addEventListener('mouseup', function (event) {
                event.preventDefault();
                var intersects = Main.raycaster.intersectObjects(Main.objects);
                if (intersects.length > 0 && _this.mouseState.getIsDragging() == false) {
                    DoughLand.CommentTracker.setCurrentCommentPosition(intersects[0].point);
                    _this.commentModal.open(function (ableToComment) {
                        console.log('modal closed!!');
                        _this.ableToComment = ableToComment;
                    });
                }
                _this.mouseState.setIsMouseMoved(false);
                _this.mouseState.setIsLeftPressed(false);
            }, false);
            renderer.domElement.addEventListener('mousedown', function (event) {
                _this.mouseState.setIsLeftPressed(true);
                _this.mouseState.setIsMouseMoved(false);
            }, false);
            renderer.domElement.addEventListener('mousemove', function (event) {
                _this.mouseState.setIsMouseMoved(true);
                Main.mouseVector.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1, 0.5);
                Main.mouseVector.unproject(camera);
                Main.raycaster.set(camera.position, Main.mouseVector.sub(camera.position).normalize());
                var intersects = Main.raycaster.intersectObjects(DoughLand.CommentTracker.getCommentObjects());
                if (intersects.length > 0) {
                    var currentObject = intersects[0].object;
                    var comment = DoughLand.CommentTracker.getComment(currentObject.uuid);
                    $("#comment-details").css("visibility", "visible");
                    $("#comment-details").css("left", event.clientX - 140);
                    $("#comment-details").css("top", event.clientY - 165);
                    $("#comment-details").html(comment.getComment() + '<p align="right"> - ' + comment.getName() + "</p>");
                }
                else {
                    $("#comment-details").css("visibility", "hidden");
                }
            }, false);
        };
        Main.initSky = function () {
            var sphereGeometry = new THREE.SphereGeometry(3000, 60, 40);
            var uniforms = {
                texture: {
                    type: 't',
                    value: THREE.ImageUtils.loadTexture('images/highres.jpg')
                }
            };
            var material = new THREE.ShaderMaterial({
                uniforms: uniforms,
                vertexShader: document.getElementById('sky-vertex').textContent,
                fragmentShader: document.getElementById('sky-fragment').textContent
            });
            var skyBox = new THREE.Mesh(sphereGeometry, material);
            skyBox.scale.set(-1, 1, 1);
            skyBox.rotation.order = 'XYZ';
            skyBox.renderDepth = 1000.0;
            this.scene.add(skyBox);
        };
        Main.main = function () {
            var _this = this;
            Physijs.scripts.ammo = '/js/ammo.js';
            Physijs.scripts.worker = '/js/physijs_worker.js';
            console.log('finished loading physijs');
            var loader = new THREE.JSONLoader();
            this.scene = new Physijs.Scene();
            this.scene.setGravity(new THREE.Vector3(0, -50, 0));
            this.scene.addEventListener('update', function () {
                _this.scene.simulate(undefined, 2);
            });
            var WIDTH = window.innerWidth, HEIGHT = window.innerHeight;
            this.renderer = new THREE.WebGLRenderer({
                antialias: true
            });
            this.renderer.setSize(WIDTH, HEIGHT);
            this.renderer.shadowMapEnabled = true;
            this.renderer.shadowMapType = THREE.PCFSoftShadowMap;
            this.renderer.setClearColor(0xFFFFFF, 1);
            $("#main").html(this.renderer.domElement);
            this.camera = new THREE.PerspectiveCamera(100, WIDTH / HEIGHT, 0.1, 20000);
            this.camera.position.set(0, 66, 248);
            this.scene.add(this.camera);
            var meshCreator = new DoughLand.MeshCreator(loader);
            Main.createFloor(this.scene, meshCreator);
            Main.createDMObject(this.scene, loader);
            Main.createLights(this.scene);
            this.controls = Main.createOrbitalControls(this.camera, this.renderer.domElement);
            this.mouseVector = new THREE.Vector3();
            this.raycaster = new THREE.Raycaster();
            var commentFactory = new DoughLand.CommentFactory(meshCreator);
            var commentDataService = new DoughLand.CommentDataService(this.scene, commentFactory);
            commentDataService.ajaxGetMessages();
            var authentication = new DoughLand.Authentication();
            authentication.authenticate(function (res) {
                _this.ableToComment = res;
            });
            this.scene.simulate();
            Main.addListeners(this.renderer, this.camera);
            this.commentModal = new DoughLand.CommentModal(commentDataService, authentication);
            this.mouseState = new DoughLand.MouseState();
            this.initSky();
        };
        return Main;
    })();
    DoughLand.Main = Main;
})(DoughLand || (DoughLand = {}));
window.onload = function () {
    DoughLand.Main.main();
    (function gameloop() {
        DoughLand.Main.renderer.render(DoughLand.Main.scene, DoughLand.Main.camera);
        DoughLand.Main.controls.update();
        window.requestAnimationFrame(gameloop);
    })();
};
var DoughLand;
(function (DoughLand) {
    var MeshModel = (function () {
        function MeshModel(scene, loader, modelPath, material, position, scale) {
            var _this = this;
            loader.load(modelPath, function (geometry) {
                _this.mesh = new THREE.Mesh(geometry, material);
                _this.mesh.position.set(position.x, position.y, position.z);
                scene.add(_this.mesh);
                _this.mesh.castShadow = true;
                _this.mesh.receiveShadow = true;
                _this.mesh.scale.set(scale.x, scale.y, scale.z);
                _this.meshAdded();
            });
        }
        MeshModel.prototype.meshAdded = function () {
        };
        return MeshModel;
    })();
    DoughLand.MeshModel = MeshModel;
})(DoughLand || (DoughLand = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
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
        PhysicsModel.prototype.getMesh = function () {
            return this.physObject;
        };
        PhysicsModel.prototype.meshAdded = function () {
            this.physObject.add(this.mesh);
            this.mesh.position.set(this.mesh.position.x - this.physObject.position.x, this.mesh.position.y - this.physObject.position.y, this.mesh.position.z - this.physObject.position.z);
        };
        return PhysicsModel;
    })(DoughLand.MeshModel);
    DoughLand.PhysicsModel = PhysicsModel;
})(DoughLand || (DoughLand = {}));
var DoughLand;
(function (DoughLand) {
    var MouseState = (function () {
        function MouseState() {
        }
        MouseState.prototype.getIsDragging = function () {
            if (this.isLeftPressed && this.isMouseMoved) {
                return true;
            }
            else {
                return false;
            }
        };
        MouseState.prototype.setIsLeftPressed = function (isLeftPressed) {
            this.isLeftPressed = isLeftPressed;
        };
        MouseState.prototype.setIsMouseMoved = function (isMouseMoved) {
            this.isMouseMoved = isMouseMoved;
        };
        return MouseState;
    })();
    DoughLand.MouseState = MouseState;
})(DoughLand || (DoughLand = {}));
//# sourceMappingURL=all.js.map