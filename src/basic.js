import * as THREE from 'three';
import gsap from 'gsap';
import { cm1, cm2 } from './common';
import { Box } from './Box';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default function basic() {
  // console.log(THREE);

  // Renderer
  const canvas = document.querySelector('#three-canvas');
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
  renderer.shadowMap.enabled = true; // 그림자 사용
  renderer.shadowMap.type = THREE.PCFShadowMap; // 그림자 부드럽게

  // renderer.setClearColor('#0x00ff00'); // 배경색 설정
  // renderer.setClearAlpha(0.2); // 0-1

  // cm1.scene.background = new THREE.Color(cm2.backgroundColor);

  //   scene.background = new THREE.Color('blue');

  // 가장 자주 사용되는 원근 카메라, PerspectiveCamera
  //   THREE.PerspectiveCamera(fov=시야각, aspect=가로세로 비율= 너비/높이 , near=가까운정도, far=먼정도)
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  camera.position.x = -4;
  camera.position.y = 3;
  camera.position.z = 3;

  // Light
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.z = 10;
  cm1.scene.add(light);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // 반사 재질 생성
  const box = new Box({ name: 'bar', x: 0, y: 0, z: 0 });

  // const geometry = new THREE.BoxGeometry(1, 1, 1);
  // const chromeMaterial = new THREE.MeshLambertMaterial({
  //   color: 0xffffff,
  //   envMap: cubeRenderTarget.texture,
  // });

  // 그리기
  const clock = new THREE.Clock();

  function draw() {
    const delta = clock.getDelta();

    renderer.render(cm1.scene, camera);
    renderer.setAnimationLoop(draw); // vr 같은걸 만들 때는 꼭 이걸로 사용해야함
  }

  function setSize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    // updateProjectionMatrix => 카메라 투영에 관련된 값에 변화가 있을 경우 실행해야 함
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(cm1.scene, camera);
  }
  // 이벤트
  window.addEventListener('resize', setSize);

  draw();
}
