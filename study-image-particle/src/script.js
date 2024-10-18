import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

const gui = new GUI();

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

const textureLoader = new THREE.TextureLoader();
const doorColorTexture = textureLoader.load("/textures/door/wlp.png");
// const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
// const doorAmbientOcclusionTexture = textureLoader.load(
//   "/textures/door/ambientOcclusion.jpg"
// );
// const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");
// const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
// const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
// const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg");
// const matcapTexture = textureLoader.load("/textures/matcaps/8.png");
// const gradientTexture = textureLoader.load("/textures/matcaps/3.png");

doorColorTexture.colorSpace = THREE.SRGBColorSpace;
// doorAlphaTexture.colorSpace = THREE.SRGBColorSpace;
// doorAmbientOcclusionTexture.colorSpace = THREE.SRGBColorSpace;
// doorHeightTexture.colorSpace = THREE.SRGBColorSpace;
// doorMetalnessTexture.colorSpace = THREE.SRGBColorSpace;
// doorNormalTexture.colorSpace = THREE.SRGBColorSpace;
// doorRoughnessTexture.colorSpace = THREE.SRGBColorSpace;

// matcapTexture.colorSpace = THREE.SRGBColorSpace;
// gradientTexture.colorSpace = THREE.SRGBColorSpace;

// doorColorTexture.generateMipmaps = false;
// doorColorTexture.minFilter = THREE.NearestFilter;

const particlesMaterial = new THREE.PointsMaterial();
particlesMaterial.size = 0.01;
particlesMaterial.sizeAttenuation = true;
particlesMaterial.map = doorColorTexture;
particlesMaterial.transparent = true;
particlesMaterial.depthWrite = false;

// gui.add(material, "metalness").min(0).max(1).step(0.001);

// gui.add(material, "roughness").min(0).max(1).step(0.001);

const planeGeometry = new THREE.PlaneGeometry(1, 1, 300, 300);
const planeGeometry2 = new THREE.PlaneGeometry(1, 1, 300, 300);

const count = planeGeometry.attributes.position.count;

const originalPositions = new Float32Array(
  planeGeometry2.attributes.position.array
);
const randomPositions = new Float32Array(count * 3);

for (let i = 0; i < count; i++) {
  const i3 = i * 3;
  randomPositions[i3] = (Math.random() - 0.5) * 10;
  randomPositions[i3 + 1] = (Math.random() - 0.5) * 10;
  randomPositions[i3 + 2] = (Math.random() - 0.5) * 10;
}
// for (let i = 0; i < count; i++) {
//   const i3 = i * 3;
//   planeGeometry.attributes.position.array[i3 + 0] = (Math.random() - 0.5) * 10;
//   planeGeometry.attributes.position.array[i3 + 1] = (Math.random() - 0.5) * 10;
//   planeGeometry.attributes.position.array[i3 + 2] = (Math.random() - 0.5) * 10;
//   // const z = planeGeometry.attributes.position.array[i3 + 1];
//   // planeGeometry.attributes.position.array[i3 + 1] += Math.random();
// }

const plane = new THREE.Points(planeGeometry, particlesMaterial);

scene.add(plane);

/**
 * Lights
 */

// const ambientLight = new THREE.AmbientLight(0xffffff, 1);
// scene.add(ambientLight);

// const pointLight = new THREE.PointLight(0xffffff, 30);
// pointLight.position.x = 2;
// pointLight.position.y = 3;
// pointLight.position.z = 4;
// scene.add(pointLight);
// const directionalLight = new THREE.DirectionalLight(0x00ff00, 0.5);
// directionalLight.position.set(1, 1, 0);
// scene.add(directionalLight);

/**
 * Environment
 */

const rgbeLoader = new RGBELoader();
rgbeLoader.load("/textures/environmentMap/2k.hdr", (environmentMap) => {
  environmentMap.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = environmentMap;
  scene.environment = environmentMap;
});

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

let isAnimating = true;
let lerpFactor = 0;

const tick = () => {
  let elapsedTime = clock.getElapsedTime();

  const animationDuration = 5;

  // 현재 애니메이션 진행 상태 (0에서 1 사이)
  const animationProgress =
    (elapsedTime % animationDuration) / animationDuration;

  if (isAnimating) {
    // clock2.stop();
    // 애니메이션 주기 (초)

    // 사인 함수를 사용하여 부드러운 전환 효과 생성
    lerpFactor =
      (Math.sin(animationProgress * Math.PI * 2 - Math.PI / 2) + 1) / 2;
    console.log("lerpFactor", lerpFactor);
    let allParticlesInOriginalPosition = true;

    for (let i = 0; i < count * 3; i++) {
      const newPosition = THREE.MathUtils.lerp(
        randomPositions[i],
        originalPositions[i],
        lerpFactor
      );
      planeGeometry.attributes.position.array[i] = newPosition;

      // 모든 입자가 원래 위치로 돌아왔는지 확인
      // if (Math.abs(newPosition - originalPositions[i]) > 0.001) {
      //   allParticlesInOriginalPosition = false;
      // }
    }

    planeGeometry.attributes.position.needsUpdate = true;

    // 모든 입자가 원래 위치로 돌아왔다면 애니메이션 중지
    // if (allParticlesInOriginalPosition) {
    //   console.log("animationProgress", animationProgress);
    //   clock2.start();
    //   clock.stop();
    //   isAnimating = false;
    // }
  }

  // for (let i = 0; i < count; i++) {
  //   const i3 = i * 3;
  //   planeGeometry.attributes.position.array[i3] += x[i3];
  //   planeGeometry.attributes.position.array[i3 + 1] += x[i3 + 1];
  //   planeGeometry.attributes.position.array[i3 + 2] += x[i3 + 2];
  //   // const x = planeGeometry.attributes.position.array[i3];
  //   // planeGeometry.attributes.position.array[i3 + 2] = Math.sin(elapsedTime + x);
  // }
  // planeGeometry.attributes.position.needsUpdate = true;
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
