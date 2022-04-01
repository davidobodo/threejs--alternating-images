import * as THREE from "three";
import fragment from "./shaders/fragment.glsl";
import vertex from "./shaders/vertex.glsl";
import imgCans from "./img/t.png";
import imgImposter from "./img/t1.webp";
import imgMask from "./img/mask.jpeg";
import gsap from "gsap";

let orbitControls = require("three-orbit-controls")(THREE);
export default class Sketch {
    constructor() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        // this.renderer.setAnimationLoop(animation); // Not sure why this wasnt used
        document.getElementById("container").appendChild(this.renderer.domElement);

        this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 3000);
        this.camera.position.z = 1000;
        this.scene = new THREE.Scene();
        this.time = 0;
        this.move = 0;

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.point = new THREE.Vector2();

        this.textures = [new THREE.TextureLoader().load(imgCans), new THREE.TextureLoader().load(imgImposter)];
        this.mask = new THREE.TextureLoader().load(imgMask);
        // this.controls = new orbitControls(this.camera, this.renderer.domElement);
        this.addMesh();
        this.render();
        this.mouseEffects();
    }

    mouseEffects() {
        this.test = new THREE.Mesh(new THREE.PlaneBufferGeometry(2000, 2000), new THREE.MeshBasicMaterial());

        window.addEventListener("mousedown", (e) => {
            gsap.to(this.material.uniforms.mousePressed, {
                duration: 0.5,
                value: 1
            });
        });

        window.addEventListener("mouseup", (e) => {
            gsap.to(this.material.uniforms.mousePressed, {
                duration: 0.5,
                value: 0
            });
        });

        window.addEventListener("mousewheel", (e) => {
            this.move += e.wheelDeltaY / 1000;
        });

        window.addEventListener(
            "mousemove",
            (e) => {
                this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
                this.mouse.y = (e.clientY / window.innerHeight) * 2 - 1;

                this.raycaster.setFromCamera(this.mouse, this.camera);

                const intersects = this.raycaster.intersectObjects([this.test]);
                console.log(intersects[0].point);

                this.point.x = intersects[0].point.x;
                this.point.y = intersects[0].point.y;
            },
            false
        );
    }

    addMesh() {
        // this.geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
        this.geometry = new THREE.PlaneBufferGeometry(1000, 1000, 10, 10); //Lets use a plane instead of a box geometry
        this.geometry = new THREE.BufferGeometry();
        let baseAmount = 512;
        let number = baseAmount * baseAmount;

        this.positions = new THREE.BufferAttribute(new Float32Array(number * 3), 3);
        this.coordinates = new THREE.BufferAttribute(new Float32Array(number * 3), 3);
        this.speeds = new THREE.BufferAttribute(new Float32Array(number), 1);
        this.offset = new THREE.BufferAttribute(new Float32Array(number), 1);
        this.direction = new THREE.BufferAttribute(new Float32Array(number), 1);
        this.press = new THREE.BufferAttribute(new Float32Array(number), 1);

        function rand(a, b) {
            return a + (b - a) * Math.random();
        }

        let index = 0;
        for (let i = 0; i < baseAmount; i++) {
            let posX = i - baseAmount / 2; //Used to center the particles
            for (let j = 0; j < baseAmount; j++) {
                this.positions.setXYZ(index, posX * 2, j - baseAmount / 2, 0); //Number of particles, x position, y position, z position
                this.coordinates.setXYZ(index, i, j, 0);
                this.offset.setX(index, rand(-1000, 1000)); // Using 1000 cause the camera is at 1000
                this.speeds.setX(index, rand(0.4, 1));
                this.direction.setX(index, Math.random() > 0.5 ? 1 : -1);
                this.press.setX(index, rand(0.4, 1));
                index++;
            }
        }

        //Add the positions to the geometry
        this.geometry.setAttribute("position", this.positions);
        this.geometry.setAttribute("aCoordinates", this.coordinates);
        this.geometry.setAttribute("aOffset", this.offset);
        this.geometry.setAttribute("aSpeed", this.speeds);
        this.geometry.setAttribute("aDirection", this.direction);
        this.geometry.setAttribute("aPress", this.press);

        // this.material = new THREE.MeshNormalMaterial({ side: THREE.DoubleSide });
        this.material = new THREE.ShaderMaterial({
            fragmentShader: fragment,
            vertexShader: vertex,
            uniforms: {
                progress: {
                    type: "f",
                    value: 0
                },
                imgCans: {
                    type: "t",
                    value: this.textures[0]
                },
                imgImposter: {
                    type: "t",
                    value: this.textures[1]
                },
                imgMask: {
                    type: "t",
                    value: this.mask
                },
                mouse: {
                    type: "v2",
                    value: null
                },
                mousePressed: {
                    type: "f",
                    value: 0
                },
                move: {
                    type: "f",
                    value: 0
                },
                time: {
                    type: "f",
                    value: 0
                }
            },
            side: THREE.DoubleSide,
            transparent: true,
            depthTest: false,
            depthWrite: false
        });
        this.mesh = new THREE.Points(this.geometry, this.material);
        this.scene.add(this.mesh);
    }

    render() {
        this.time++;
        // this.mesh.rotation.x += 0.01;
        // this.mesh.rotation.y += 0.02;
        // console.log(this.time);
        this.material.uniforms.time.value = this.time;
        this.material.uniforms.move.value = this.move;
        this.material.uniforms.mouse.value = this.point;
        this.renderer.render(this.scene, this.camera);

        window.requestAnimationFrame(this.render.bind(this));
    }
}

new Sketch();
