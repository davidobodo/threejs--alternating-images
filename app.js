import * as THREE from "three";
import fragment from "./shaders/fragment.glsl";
import vertex from "./shaders/vertex.glsl";

export default class Sketch {
    constructor() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        // this.renderer.setAnimationLoop(animation); // Not sure why this wasnt used
        document.getElementById("container").appendChild(this.renderer.domElement);

        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 3000);
        this.camera.position.z = 1000;
        this.scene = new THREE.Scene();

        this.addMesh();
        this.time = 0;
        this.render();
    }

    addMesh() {
        // this.geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
        this.geometry = new THREE.PlaneBufferGeometry(1000, 1000, 10, 10); //Lets use a plane instead of a box geometry
        // this.geometry = new THREE.BufferGeometry();
        let number = 512 * 512;

        // this.positions =

        this.material = new THREE.MeshNormalMaterial({ side: THREE.DoubleSide });
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
        // this.mesh.rotation.x = this.time / 2000;
        this.mesh.rotation.x += 0.01;
        // this.mesh.rotation.y = this.time / 1000;
        this.mesh.rotation.y += 0.02;
        // console.log(this.time);
        this.renderer.render(this.scene, this.camera);

        window.requestAnimationFrame(this.render.bind(this));
    }
}

new Sketch();
