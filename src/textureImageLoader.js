import * as THREE from 'three';
import gsap from 'gsap';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import initSky from './initSky';
import { cm1 } from './common';

export default function basic() {
  // console.log(THREE);
  const canvas = document.querySelector('#three-canvas');

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  //   renderer.setClearColor('#0x00ff00'); // 배경색 설정
  //   renderer.setClearAlpha(0.2); // 0-1
  //   renderer.toneMapping = THREE.ACESFilmicToneMapping;
  //   renderer.toneMappingExposure = 0.5;

  //   const scene = new THREE.Scene();
  //   cm1.scene.background = new THREE.Color('blue');

  //   THREE.PerspectiveCamera(fov=시야각, aspect=가로세로 비율= 너비/높이 , near=가까운정도, far=먼정도)
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  //   camera.position.x = 1;
  camera.position.y = 2;
  camera.position.z = 5;
  camera.lookAt(0, 0, 0);
  // 줌아웃 하고 싶을 때
  camera.zoom = 0.5; // default 1
  camera.updateProjectionMatrix();
  cm1.scene.add(camera);

  // Light
  const light = new THREE.DirectionalLight(0xffffff, 15);
  light.position.z = 10;
  cm1.scene.add(light);

  // Sky
  initSky();

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);

  // Mesh
  const textureLoader = new THREE.TextureLoader();
  const floor = new THREE.Mesh(new THREE.BoxGeometry(10, 0.1, 10));
  textureLoader.load('http://dreamplan7.cafe24.com/canvas/img/floor1.jpg', function (texture) {
    floor.material = new THREE.MeshStandardMaterial({ map: texture });
    floor.material.map.repeat.x = 3;
    floor.material.map.repeat.y = 3;
    floor.material.map.wrapS = THREE.RepeatWrapping;
    floor.material.map.wrapT = THREE.RepeatWrapping;
  });

  cm1.scene.add(floor);

  // 그리기
  const clock = new THREE.Clock();
  function draw() {
    const delta = clock.getDelta();

    renderer.render(cm1.scene, camera);

    // requestAnimationFrame(draw);
    renderer.setAnimationLoop(draw); // vr 같은걸 만들 때는 꼭 이걸로 사용해야함
  }

  // gsap
  //   gsap.to();

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
