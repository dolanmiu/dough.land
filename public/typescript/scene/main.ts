/// <reference path='../app.ts' />
module DoughLand {
    export class Main {
        private static mouseVector: THREE.Vector3;
        private static raycaster: THREE.Raycaster;
        private static objects: Array<THREE.Object3D>;
        public static scene: Physijs.Scene;
        public static camera: THREE.PerspectiveCamera;
        public static renderer: THREE.WebGLRenderer;
        public static controls: THREE.OrbitControls;
        private static ableToComment: boolean;
        private static commentModal: CommentModal;
        private static mouseState: MouseState;


        private static createFloor(scene: THREE.Scene, meshCreator: MeshCreator): void {
            var floorFactory = new FloorFactory(meshCreator);
            floorFactory.newInstance(new THREE.Vector3(0, -375, 0), mesh => {
                scene.add(mesh);
                this.objects = new Array<THREE.Object3D>();
                Main.objects.push(mesh);
            });
        }

        private static createDMObject(scene: THREE.Scene, loader: THREE.JSONLoader): void {
            var dmFactory = new DMFactory(scene, loader);
            dmFactory.newInstance();
        }

        private static createLights(scene: THREE.Scene): void {
            var alight = new THREE.AmbientLight(0xffffff); // soft white light
            scene.add(alight);

            var light = new THREE.DirectionalLight(0x7A7A7A);
            light.position.set(-100, 200, 100);
            light.castShadow = true;
            light.shadowBias = 0.0001;
            light.shadowDarkness = 0.2;
            light.shadowMapWidth = 4096; // default is 512
            light.shadowMapHeight = 4096; // default is 512
            light.onlyShadow = true;
            scene.add(light);
            //var light2 = new THREE.PointLight(new THREE.Color("rgb(255,15,255)"), 4);
            //light2.position.set(0, 200, 0);
            //scene.add(light2);
        }

        private static createOrbitalControls(camera: THREE.Camera, domElement: HTMLElement): THREE.OrbitControls {
            var controls = new THREE.OrbitControls(camera, domElement);
            controls.maxPolarAngle = Math.PI * 5 / 12;
            controls.minPolarAngle = Math.PI * 3 / 12;
            controls.minDistance = 200;
            controls.maxDistance = 300;
            return controls;
        }

        private static addListeners(renderer: THREE.Renderer, camera: THREE.PerspectiveCamera): void {
            window.addEventListener('resize', function () {
                var WIDTH = window.innerWidth,
                    HEIGHT = window.innerHeight;
                renderer.setSize(WIDTH, HEIGHT);
                camera.aspect = WIDTH / HEIGHT;
                camera.updateProjectionMatrix();
            });


            renderer.domElement.addEventListener('mouseup', (event) => {
                event.preventDefault();
                var intersects = Main.raycaster.intersectObjects(Main.objects);

                if (intersects.length > 0 && this.mouseState.getIsDragging() == false) {
                    //intersects[0].object.material.color.setHex(Math.random() * 0xffffff);
                    CommentTracker.setCurrentCommentPosition(intersects[0].point);
                    if (this.ableToComment == true) {
                        this.commentModal.open(ableToComment => {
                            console.log('modal closed!!');
                            this.ableToComment = ableToComment;
                        });
                    }
                }
                this.mouseState.setIsMouseMoved(false);
                this.mouseState.setIsLeftPressed(false);
            }, false);

            renderer.domElement.addEventListener('mousedown', (event) => {
                this.mouseState.setIsLeftPressed(true);
                this.mouseState.setIsMouseMoved(false);
            }, false);

            renderer.domElement.addEventListener('mousemove', (event) => {
                this.mouseState.setIsMouseMoved(true);
                Main.mouseVector.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1, 0.5);
                Main.mouseVector.unproject(camera);
                Main.raycaster.set(camera.position, Main.mouseVector.sub(camera.position).normalize());
                var intersects = Main.raycaster.intersectObjects(CommentTracker.getCommentObjects());

                if (intersects.length > 0) {
                    var currentObject = intersects[0].object;
                    var comment = CommentTracker.getComment(currentObject.uuid);
                    $("#comment-details").css("visibility", "visible");
                    $("#comment-details").css("left", event.clientX - 140);
                    $("#comment-details").css("top", event.clientY - 165);
                    $("#comment-details").html(comment.getComment() + '<p align="right"> - ' + comment.getName() + "</p>");
                } else {
                    $("#comment-details").css("visibility", "hidden");
                }
            }, false);
        }

        /*private static animate() {
            requestAnimationFrame(() => this.animate);
            // Render the scene.
            this.renderer.render(this.scene, this.camera);
            this.controls.update();
            //console.log(camera.position);
        }*/

        public static initSky(): void {
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
        }

        public static main(): void {
            Physijs.scripts.ammo = '/js/ammo.js';
            Physijs.scripts.worker = '/js/physijs_worker.js';
            console.log('finished loading physijs');

            var loader = new THREE.JSONLoader();

            this.scene = new Physijs.Scene();
            this.scene.setGravity(new THREE.Vector3(0, -50, 0)); // set gravity
            this.scene.addEventListener('update', () => {
                this.scene.simulate(undefined, 2);
            });

            var WIDTH = window.innerWidth,
                HEIGHT = window.innerHeight;

            this.renderer = new THREE.WebGLRenderer({
                antialias: true
            });

            this.renderer.setSize(WIDTH, HEIGHT);
            this.renderer.shadowMapEnabled = true;
            this.renderer.shadowMapType = THREE.PCFSoftShadowMap;
            this.renderer.setClearColor(0xFFFFFF, 1);

            $("#main").html(this.renderer.domElement);
            //document.body.appendChild(renderer.domElement);

            this.camera = new THREE.PerspectiveCamera(100, WIDTH / HEIGHT, 0.1, 20000);
            this.camera.position.set(0, 66, 248);
            this.scene.add(this.camera);
            var meshCreator = new MeshCreator(loader);
            Main.createFloor(this.scene, meshCreator);
            Main.createDMObject(this.scene, loader);
            Main.createLights(this.scene);
            this.controls = Main.createOrbitalControls(this.camera, this.renderer.domElement);

            this.mouseVector = new THREE.Vector3();
            this.raycaster = new THREE.Raycaster();

            var commentFactory = new CommentFactory(meshCreator);
            var commentDataService = new CommentDataService(this.scene, commentFactory);
            commentDataService.ajaxGetMessages();
            var authentication = new Authentication();
            authentication.authenticate(res => {
                this.ableToComment = res;
            });

            this.scene.simulate();

            Main.addListeners(this.renderer, this.camera);

            //this.scene.fog = new THREE.Fog(0xffffff, 1, 100);

            this.commentModal = new CommentModal(commentDataService, authentication);
            this.mouseState = new MouseState();
            //this.initSky();
        }
    }
}

window.onload = () => {
    DoughLand.Main.main();
    (function gameloop() {

        // stats.update();
        DoughLand.Main.renderer.render(DoughLand.Main.scene, DoughLand.Main.camera);
        DoughLand.Main.controls.update();
        window.requestAnimationFrame(gameloop);
    })();
};