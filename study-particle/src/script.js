import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import testVertexShader from "../src/test/vertex.glsl";
import testFragmentShader from "../src/test/fragment.glsl";

const gui = new GUI();

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// const textureLoader = new THREE.TextureLoader();

// const BoxGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5,);
const planeGeometry = new THREE.PlaneGeometry(2, 2, 10, 10);

// const EdgesGeometry = new THREE.EdgesGeometry(BoxGeometry);

// const line = new THREE.LineSegments(
//   EdgesGeometry,
//   new THREE.LineBasicMaterial({ color: "red" })
// );

const materiall = new THREE.ShaderMaterial({
  vertexShader: testVertexShader,
  fragmentShader: testFragmentShader,
  side: THREE.DoubleSide,
  // wireframe: true,
});

// const particlesMaterial = new THREE.PointsMaterial({
//   color: "red",
//   size: 0.2,
//   sizeAttenuation: true,
// });

// const point = new THREE.Points(planeGeometry, particlesMaterial);
// scene.add(point);

// const box = new THREE.Mesh(BoxGeometry, material);

function createBoxGrid() {
  // 카메라의 시야각을 이용해 보이는 영역 계산
  const fov = camera.fov * (Math.PI / 180);
  const height = 2 * Math.tan(fov / 2) * camera.position.z;
  const width = height * camera.aspect;

  // 그리드 그룹 생성
  const gridGroup = new THREE.Group();

  // 박스 크기와 간격 설정
  const boxSize = 0.2; // 박스 크기
  const gap = 0; // 박스 간격
  const totalSize = boxSize + gap;

  // 행과 열 개수 계산
  const cols = Math.ceil(width / totalSize);
  const rows = Math.ceil(height / totalSize);

  // 박스 지오메트리와 재질 생성
  const geometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
  const EdgesGeometry = new THREE.EdgesGeometry(geometry);
  // const material = new THREE.MeshBasicMaterial({
  //   color: 0x00805c,
  //   wireframe: true,
  //   transparent: true,
  //   opacity: 0.8,
  // });

  // 그리드의 시작 위치 계산 (왼쪽 상단)
  const startX = -(cols * totalSize) / 2;
  const startY = (rows * totalSize) / 2;

  // 박스 그리드 생성
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const box = new THREE.Mesh(geometry, materiall);
      box.customDepthMaterial = true;
      box.depthPacking = THREE.RGBADepthPacking;
      box.material.fragmentShader = testFragmentShader;
      box.transparent = false;

      // 박스 위치 설정
      box.position.x = startX + j * totalSize + boxSize / 2;
      box.position.y = startY - i * totalSize - boxSize / 2;
      box.position.z = 0;

      box.userData.originalPosition = {
        x: startX + j * totalSize + boxSize / 2,
        y: startY - i * totalSize - boxSize / 2,
        z: 0,
      };

      // 초기 위치 설정
      box.position.x = box.userData.originalPosition.x;
      box.position.y = box.userData.originalPosition.y;
      box.position.z = box.userData.originalPosition.z;

      gridGroup.add(box);
    }
  }

  return gridGroup;
}

/**
 * Environment
 */

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
  // createGrid();
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 4;
scene.add(camera);
// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  logarithmicDepthBuffer: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

function updateGrid() {
  // 기존 그리드 제거
  const existingGrid = scene.children.find((child) => child.isGroup);
  if (existingGrid) {
    scene.remove(existingGrid);
  }

  // 새 그리드 생성 및 추가
  const grid = createBoxGrid();
  scene.add(grid);
}

updateGrid();

let isScattering = false;
let animationStartTime = 0;
const ANIMATION_DURATION = 4000; // 2초

const boxTargets = new Map();

// 클릭 이벤트 리스너 추가
window.addEventListener("click", () => {
  isScattering = !isScattering;
  animationStartTime = Date.now();

  const grid = scene.children.find((child) => child.isGroup);
  if (grid && isScattering) {
    grid.children.forEach((box) => {
      boxTargets.set(box.id, {
        x: (Math.random() - 0.5) * 20,
        y: (Math.random() - 0.5) * 20,
        z: (Math.random() - 0.5) * 20,
        rotationX: Math.random() * Math.PI * 2,
        rotationY: Math.random() * Math.PI * 2,
      });
    });
  }
});

const tick = () => {
  // let elapsedTime = clock.getElapsedTime();

  // const animationDuration = 5
  const currentTime = Date.now();
  const elapsedTime = currentTime - animationStartTime;
  const progress = Math.min(elapsedTime / ANIMATION_DURATION, 1);

  const easedProgress = isScattering
    ? easeOutCubic(progress)
    : easeInCubic(progress);

  // 그리드의 모든 박스 업데이트
  const grid = scene.children.find((child) => child.isGroup);
  if (grid) {
    grid.children.forEach((box) => {
      if (isScattering) {
        const target = boxTargets.get(box.id);
        // 분산 효과

        if (target) {
          box.position.x =
            box.userData.originalPosition.x + target.x * easedProgress;
          box.position.y =
            box.userData.originalPosition.y + target.y * easedProgress;
          box.position.z =
            box.userData.originalPosition.z + target.z * easedProgress;

          box.rotation.x = target.rotationX * easedProgress;
          box.rotation.y = target.rotationY * easedProgress;

          // if (box.scale.x > 0) {
          //   box.scale.x -= easedProgress * 0.1;
          //   box.scale.y -= easedProgress * 0.1;
          //   box.scale.z -= easedProgress * 0.1;
          // } else {
          //   box.visible = false;
          // }
        }
        // box.position.x = box.userData.originalPosition.x + randomX * progress;
        // box.position.y = box.userData.originalPosition.y + randomY * progress;
        // box.position.z = box.userData.originalPosition.z + randomZ * progress;

        // box.rotation.x += 0.01;
        // box.rotation.y += 0.01;
      } else {
        // 원래 위치로 복귀
        const target = boxTargets.get(box.id);
        if (target) {
          box.position.x =
            box.userData.originalPosition.x + target.x * (1 - easedProgress);
          box.position.y =
            box.userData.originalPosition.y + target.y * (1 - easedProgress);
          box.position.z =
            box.userData.originalPosition.z + target.z * (1 - easedProgress);

          box.rotation.x = target.rotationX * (1 - easedProgress);
          box.rotation.y = target.rotationY * (1 - easedProgress);

          // if (box.scale.x < 1) {
          //   box.visible = true;
          //   box.scale.x += easedProgress * 0.1;
          //   box.scale.y += easedProgress * 0.1;
          //   box.scale.z += easedProgress * 0.1;
          // }
        }
      }
    });
  }

  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

function easeOutCubic(x) {
  return 1 - Math.pow(1 - x, 0.5);
}

function easeInCubic(x) {
  return x * x * x;
}
