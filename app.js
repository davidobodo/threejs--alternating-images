import * as THREE from "three";
import fragment from "./shaders/fragment.glsl";
import vertex from "./shaders/vertex.glsl";

let orbitControls = require("three-orbit-controls")(THREE);
export default class Sketch {
    constructor() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        // this.renderer.setAnimationLoop(animation); // Not sure why this wasnt used
        document.getElementById("container").appendChild(this.renderer.domElement);

        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 3000);
        this.camera.position.z = 1000;
        this.scene = new THREE.Scene();
        this.time = 0;

        this.controls = new orbitControls(this.camera, this.renderer.domElement);
        this.addMesh();
        this.render();
    }

    addMesh() {
        // this.geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
        this.geometry = new THREE.PlaneBufferGeometry(1000, 1000, 10, 10); //Lets use a plane instead of a box geometry
        this.geometry = new THREE.BufferGeometry();
        let number = 512 * 512;

        this.positions = new THREE.BufferAttribute(new Float32Array(number * 3), 3);

        let index = 0;
        for (let i = 0; i < 512; i++) {
            let posX = i - 256; //Used to center the particles
            for (let j = 0; j < 512; j++) {
                this.positions.setXYZ(index, posX * 2, j - 256, 0); //Number of particles, x position, y position, z position
                index++;
            }
        }

        //Add the positions to the geometry
        this.geometry.setAttribute("position", this.positions);

        // this.material = new THREE.MeshNormalMaterial({ side: THREE.DoubleSide });
        this.material = new THREE.ShaderMaterial({
            fragmentShader: fragment,
            vertexShader: vertex,
            uniforms: {
                progress: {
                    type: "f",
                    value: 0
                }
            },
            side: THREE.DoubleSide
        });
        this.mesh = new THREE.Points(this.geometry, this.material);
        this.scene.add(this.mesh);
    }

    render() {
        this.time++;
        // this.mesh.rotation.x += 0.01;
        // this.mesh.rotation.y += 0.02;
        // console.log(this.time);
        this.renderer.render(this.scene, this.camera);

        window.requestAnimationFrame(this.render.bind(this));
    }
}

new Sketch();
