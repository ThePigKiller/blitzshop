import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls';
import { CSG } from 'three-csg-ts';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('background'),
});

const controls = new OrbitControls(camera, renderer.domElement);

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize( window.innerWidth, window.innerHeight );
camera.position.setZ(25);
camera.position.setY(6);

function initLight() {
    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set( 100, 200, 0);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    spotLight.shadow.camera.near = 500;
    spotLight.shadow.camera.far = 4000;
    spotLight.shadow.camera.fov = 30;
    scene.add(spotLight);
}

function drawGround() {
    const groundTexture = new THREE.TextureLoader().load('./assets/floor.jpeg');
    const ground = new THREE.Mesh(
        new THREE.PlaneGeometry( 100, 75, 1, 1),
        new THREE.MeshStandardMaterial( {map: groundTexture})
    );
    ground.rotation.x = -1.5;
    scene.add(ground);
}

function initShelf() {
    const caseSize = 4;
    const innerCaseSize = 3.5;
    const groundTexture = new THREE.TextureLoader().load('./assets/wood.jpeg');

    function createShelfCase() {
        const box = new THREE.Mesh(
            new THREE.BoxGeometry(caseSize, caseSize, caseSize),
            new THREE.MeshStandardMaterial({map: groundTexture})
        );
        const negativeBox = new THREE.Mesh(
            new THREE.BoxGeometry(innerCaseSize, innerCaseSize, caseSize),
            new THREE.MeshStandardMaterial({map: groundTexture})
        );

        box.updateMatrix();
        negativeBox.updateMatrix();
        return CSG.subtract(box, negativeBox);
    }

    for (let i = 0; i < 4; i++) {
        for (let ii = 0; ii < 4; ii++) {
            let shelfCase = createShelfCase();

            let xPosition = ii * caseSize;
            let yPosition = (i * caseSize) + (caseSize / 2);

            shelfCase.position.setX(xPosition);
            shelfCase.position.setY(yPosition);

            const spotLight = new THREE.SpotLight(0x1F0353, 12, caseSize + 2);
            spotLight.position.set(xPosition + (caseSize / 2), yPosition + (caseSize / 2), 0);

            spotLight.castShadow = true;

            spotLight.shadow.mapSize.width = caseSize;
            spotLight.shadow.mapSize.height = caseSize;

            spotLight.shadow.camera.near = 0.1;
            spotLight.shadow.camera.far = 4000;

            scene.add(spotLight);
            scene.add(shelfCase);
        }
    }
}

function animate() {
    requestAnimationFrame(animate);

    controls.update();

    renderer.render(scene,camera);
}

drawGround();
initLight();
initShelf();
window.onload = animate;