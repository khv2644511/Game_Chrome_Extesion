import * as THREE from 'three';
import gsap from 'gsap';
import { cm1, cm2 } from './common';
import { Box } from './Box';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Sky } from 'three/addons/objects/Sky.js';
import { Water } from 'three/addons/objects/Water.js';
import { GUI } from 'dat.gui';
import { Floor } from './Floor';
import { Stone } from './Stone';

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
  // renderer.outputEncoding = THREE.sRGBEncoding; // 색상 출력 설정

  // renderer.setClearColor('#0x00ff00'); // 배경색 설정
  // renderer.setClearAlpha(0.2); // 0-1

  // cm1.scene.background = new THREE.Color(cm2.backgroundColor);

  //   scene.background = new THREE.Color('blue');

  // Camera
  // const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 20000);
  // camera.position.set(-50, 60, 350);
  camera.position.set(-40, 30, 200);

  // Light
  // const light = new THREE.DirectionalLight(0xffffff, 1);
  // light.position.z = 10;
  // cm1.scene.add(light);
  const ambientLight = new THREE.AmbientLight(cm2.lightColor, 2);
  cm1.scene.add(ambientLight);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // 반사 재질 생성
  // const box = new Box({ name: 'bar', x: 0, y: 0, z: 0 });

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

  // 물체만들기

  const stoneUnitSize = 10; // 스톤 하나의 크기
  const numberOfstone = 10; // 스톤 개수

  // 스톤
  let stoneTypeNumber = 0; // 0 or 1
  let stoneTypes = [];
  const stoneZ = [];
  for (let i = 0; i < numberOfstone; i++) {
    stoneZ.push(-(i * stoneUnitSize * 2 - stoneUnitSize * 9));
  }
  // console.log(stoneZ);

  for (let i = 0; i < numberOfstone; i++) {
    stoneTypeNumber = Math.round(Math.random()); // 반올림으로 0 or 1이 나오도록
    switch (stoneTypeNumber) {
      case 0:
        stoneTypes = ['normal', 'strong'];
        break;
      case 1:
        stoneTypes = ['strong', 'normal'];
        break;
    }
    //   console.log(stoneTypes);

    const textureLoader = new THREE.TextureLoader();
    const stoneTexture = textureLoader.load('/textures/stone/Stylized_Rocks_002_basecolor.jpg'); // 별 이미지 로드

    const stone1 = new Stone({
      step: i + 1,
      name: `stone-${stoneTypes[0]}`,
      x: -10,
      y: 1,
      z: stoneZ[i],
      type: stoneTypes[0],
      cannonMaterial: cm1.stonetMaterial,
      map: stoneTexture,
    });

    const stone2 = new Stone({
      step: i + 1,
      name: `stone-${stoneTypes[1]}`,
      x: 10,
      y: 1,
      z: stoneZ[i],
      type: stoneTypes[1],
      cannonMaterial: cm1.stonetMaterial,
      map: stoneTexture,
    });

    // objects.push(stone1, stone2);
  }

  // 바닥
  const floor1 = new Floor({
    name: 'floor',
    x: 0,
    y: 0,
    z: -stoneUnitSize * 12 - stoneUnitSize / 2,
    // z: -100,
  });

  const floor2 = new Floor({
    name: 'floor',
    x: 0,
    y: 0,
    z: stoneUnitSize * 12 + stoneUnitSize / 2,
    // z: 100,
  });

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
