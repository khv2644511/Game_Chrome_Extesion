import * as THREE from 'three';
import gsap from 'gsap';
import { cm1, cm2 } from './common';
import { Box } from './Box';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Sky } from 'three/addons/objects/Sky.js';
import { Water } from 'three/addons/objects/Water.js';
import { GUI } from 'dat.gui';

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

  // Camera
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  // const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 20000);

  camera.position.set(30, 30, 100);

  // Light
  // const light = new THREE.DirectionalLight(0xffffff, 1);
  // light.position.z = 10;
  // cm1.scene.add(light);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // 반사 재질 생성
  const box = new Box({ name: 'bar', x: 0, y: 0, z: 0 });

  // Water
  const waterGeometry = new THREE.PlaneGeometry(10000, 10000);

  const water = new Water(waterGeometry, {
    textureWidth: 512,
    textureHeight: 512,
    waterNormals: new THREE.TextureLoader().load('textures/waternormals.jpg', function (texture) {
      // 텍스처 x,y축 이동시 이미지 밀리는 현상보완
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    }),
    sunDirection: new THREE.Vector3(),
    sunColor: 0xffffff,
    waterColor: 0x001e0f,
    distortionScale: 3.7, // ??
    fog: cm1.scene.fog !== undefined,
  });

  water.rotation.x = -Math.PI / 2;

  cm1.scene.add(water);

  // console.log(water.material);

  // Sky
  const sky = new Sky();
  sky.scale.setScalar(10000); // sky.scale.set(10000, 10000, 10000);
  cm1.scene.add(sky);

  const skyUniforms = sky.material.uniforms;

  skyUniforms['turbidity'].value = 10;
  skyUniforms['rayleigh'].value = 2;
  skyUniforms['mieCoefficient'].value = 0.005;
  skyUniforms['mieDirectionalG'].value = 0.8;

  const parameters = {
    // turbidity: 10,
    // rayleigh: 2,
    // mieCoefficient: 0.005,
    // mieDirectionalG: 0.8,
    elevation: 0,
    azimuth: 180,
  };

  // SUn
  const sun = new THREE.Vector3();

  let renderTarget;
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  const sceneEnv = new THREE.Scene();

  function updateSun() {
    const phi = THREE.MathUtils.degToRad(90 - parameters.elevation);
    const theta = THREE.MathUtils.degToRad(parameters.azimuth);

    sun.setFromSphericalCoords(1, phi, theta);
    // sun.set(-2, 2, 2);
    console.log('sun', sun);
    console.log('sky.material.uniforms', sky.material.uniforms);

    sky.material.uniforms['sunPosition'].value.copy(sun);
    water.material.uniforms['sunDirection'].value.copy(sun).normalize();

    if (renderTarget !== undefined) renderTarget.dispose();

    sceneEnv.add(sky);
    renderTarget = pmremGenerator.fromScene(sceneEnv);
    cm1.scene.add(sky);

    cm1.scene.environment = renderTarget.texture;
  }

  updateSun();

  // GUI
  const gui = new GUI();

  const folderSky = gui.addFolder('Sky');
  folderSky.add(parameters, 'elevation', 0, 90, 0.1).onChange(updateSun);
  folderSky.add(parameters, 'azimuth', -180, 180, 0.1).onChange(updateSun);
  folderSky.open();

  const waterUniforms = water.material.uniforms;

  const folderWater = gui.addFolder('Water');
  folderWater.add(waterUniforms.distortionScale, 'value', 0, 8, 0.1).name('distortionScale');
  folderWater.add(waterUniforms.size, 'value', 0.1, 10, 0.1).name('size');
  folderWater.open();
  // sky_folder.add(skyParams, 'elevation', 40, 150, 1).onChange((value) => {
  //   const phi = THREE.MathUtils.degToRad(value);
  //   sun.setFromSphericalCoords(1, phi, THREE.MathUtils.degToRad(skyParams.azimuth));
  //   skyUniforms['sunPosition'].value.copy(sun);
  // });

  // sky_folder.add(skyParams, 'azimuth', 0, 360, 1).onChange((value) => {
  //   const theta = THREE.MathUtils.degToRad(value);
  //   sun.setFromSphericalCoords(1, THREE.MathUtils.degToRad(skyParams.elevation), theta);
  //   skyUniforms['sunPosition'].value.copy(sun);
  // });

  // 그리기
  const clock = new THREE.Clock();

  function draw() {
    const delta = clock.getDelta();

    water.material.uniforms['time'].value += 1.0 / 60.0;

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
