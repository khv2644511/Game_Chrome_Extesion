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
import { Player } from './Player';
import * as TWEEN from 'three/addons/libs/tween.module.js';
import * as CANNON from 'cannon-es';

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
  renderer.outputEncoding = THREE.sRGBEncoding; // 색상 출력 설정

  // renderer.setClearColor('#0x00ff00'); // 배경색 설정
  // renderer.setClearAlpha(0.2); // 0-1

  // Camera
  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 20000);
  const camera2 = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 1, 20000);
  camera.position.set(-40, 30, 200);

  camera2.lookAt(0, 1, 0);
  cm1.scene.add(camera, camera2);

  // const helper = new THREE.CameraHelper(camera2);
  // cm1.scene.add(helper);

  // Light
  const ambientLight = new THREE.AmbientLight(cm2.lightColor, 2);
  cm1.scene.add(ambientLight);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 5;
  controls.maxDistance = 800;
  controls.enableDamping = true;

  // 물리 엔진
  cm1.world.gravity.set(0, -50, 0);
  cm1.world.broadphase = new CANNON.SAPBroadphase(cm1.world); // 성능 향상(가장 많이 쓰임)

  const defaultContactMaterial = new CANNON.ContactMaterial(cm1.defaultMaterial, cm1.defaultMaterial, {
    friction: 0.3, // 마찰
    restitution: 0.2, // 반발
  });

  const stoneDefaultContactMaterial = new CANNON.ContactMaterial(cm1.stonetMaterial, cm1.defaultMaterial, {
    friction: 1,
    restitution: 0,
  });

  const playerStoneContactMaterial = new CANNON.ContactMaterial(cm1.playerMaterial, cm1.stonetMaterial, {
    friction: 1,
    restitution: 0,
  });

  cm1.world.defaultContactMaterial = defaultContactMaterial;
  cm1.world.addContactMaterial(stoneDefaultContactMaterial);
  cm1.world.addContactMaterial(playerStoneContactMaterial);

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
  const objects = []; // 물리엔진 적용할 메쉬들

  // 스톤
  let stone1, stone2;
  let stoneTypeNumber = 0; // 0 or 1
  let stoneTypes = [];
  const stoneZ = [];
  const stones = [];
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

    stone1 = new Stone({
      step: i + 1,
      name: `stone-${stoneTypes[0]}`,
      x: -10,
      y: 1,
      z: stoneZ[i],
      type: stoneTypes[0],
      cannonMaterial: cm1.stonetMaterial,
      map: stoneTexture,
    });

    stone2 = new Stone({
      step: i + 1,
      name: `stone-${stoneTypes[1]}`,
      x: 10,
      y: 1,
      z: stoneZ[i],
      type: stoneTypes[1],
      cannonMaterial: cm1.stonetMaterial,
      map: stoneTexture,
    });

    objects.push(stone1, stone2);
    stones.push(stone1, stone2);
  }

  // 바닥
  const floor1 = new Floor({
    name: 'floor',
    x: 0,
    y: 1,
    z: -stoneUnitSize * 12 - stoneUnitSize / 2,
    cannonMaterial: cm1.defaultMaterial,
    mass: 0,
  });

  const floor2 = new Floor({
    name: 'floor',
    x: 0,
    y: 1,
    z: stoneUnitSize * 12 + stoneUnitSize / 2,
    cannonMaterial: cm1.defaultMaterial,
    mass: 0,
  });

  // 플레이어
  const player = new Player({
    name: 'player',
    x: 0,
    // y: 6,
    y: 20,
    z: 120,
    rotationY: Math.PI, // 180도
    cannonMaterial: cm1.playerMaterial,
    mass: 30, // 무게
  });
  objects.push(player);

  // Raycaster
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let intersectObject;
  let intersectObjectName;
  function checkIntersects() {
    raycaster.setFromCamera(mouse, camera);

    //   console.log(cm1.scene.children);
    const intersects = raycaster.intersectObjects(cm1.scene.children);
    for (const item of intersects) {
      // console.log('item', item);
      // console.log(item.object);
      // intersectObject = item.object;
      // intersectObjectName = item.object.name;
      // console.log(intersectObjectName);

      // console.log(item.object.step); // 클릭했을 때 스텝
      checkClickedObject(item.object);
      break; // raycater에 처음 맞은 메쉬만 체크하기 위해 break
    }
  }

  let fail = false;
  let jumping = false; // 반복클릭으로 점프 제어, jump한 상태 -> true, 착지 -> false
  let onReplay = false;
  let win = false; // 승리

  function checkClickedObject(mesh) {
    // console.log(mesh.name.indexOf('stone')); // 없으면 -1, 있으면 시작 index
    // stone 클릭했을 때

    // if (jumping || fail) return;

    if (mesh.name.indexOf('stone') >= 0) {
      if (mesh.step - 1 === cm2.step) {
        // 현재 스텝과 유리 mesh가 1차이가 날 때만 움직이도록
        player.actions[2].stop();
        player.actions[2].play(); // jump glb animation

        jumping = true;

        cm2.step++; // 현재 스텝
        console.log(cm2.step);

        console.log('player', player);

        switch (mesh.type) {
          case 'normal':
            console.log('normal');
            setTimeout(() => {
              fail = true;

              player.actions[0].stop(); // default animation stop
              player.actions[1].play(); // fell animation
              setTimeout(() => {
                player.cannonBody.position.y = 0;
                const stones_normal = stones.filter((stone) => stone.type === 'normal');
                stones_normal[cm2.step - 1].cannonBody.position.y = -10;

                setTimeout(() => {
                  onReplay = true; // camera2 사용
                  player.cannonBody.position.y = 9;
                }, 500);

                setTimeout(() => {
                  tween(false); // 줌아웃

                  // player 바다 떠내려가게
                  gsap.to(player.cannonBody.position, {
                    duration: 8,
                    x: -800,
                    y: -1,
                  });
                }, 2000);

                setTimeout(() => {
                  onReplay = false;
                }, 1000);
              }, 100);
            }, 500);
            break;
          case 'strong':
            break;
        }

        // 캐논바디를 움직이게
        gsap.to(player.cannonBody.position, {
          duration: 1,
          x: mesh.position.x,
          z: stoneZ[cm2.step - 1],
        });

        gsap.to(player.cannonBody.position, {
          duration: 0.4,
          y: 13, // 점프 높이
        });
      }
    }
  }

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

    TWEEN.update();
    controls.update();

    if (cm1.mixer) cm1.mixer.update(delta);

    cm1.world.step(1 / 60, delta, 3);

    water.material.uniforms['time'].value += 1.0 / 60.0;

    // 물리엔진, cannonBody위치를 mesh들이 따라가도록 설정
    objects.forEach((item) => {
      if (item.cannonBody) {
        if (item.name === 'player') {
          // console.log(item.modelMesh);
          if (item.modelMesh) {
            item.modelMesh.position.copy(item.cannonBody.position);
            if (fail) {
              item.modelMesh.quaternion.copy(item.cannonBody.quaternion);
            }
            // 회전 -> 넘어지는 설정
            item.modelMesh.quaternion.copy(item.cannonBody.quaternion); // 회전 -> 넘어지는 설정
          }
          item.modelMesh.position.y += 5;

          // 0에 수렴하도록 해서 이동속도 멈추기
          // player.cannonBody.velocity.x *= 0.98;
          // player.cannonBody.velocity.y *= 0.98;
          // player.cannonBody.velocity.z *= 0.98;
          // player.cannonBody.angularVelocity.x *= 0.98;
          // player.cannonBody.angularVelocity.y *= 0.98;
          // player.cannonBody.angularVelocity.z *= 0.98;
        } else {
          item.mesh.position.copy(item.cannonBody.position);
          item.mesh.quaternion.copy(item.cannonBody.quaternion);

          if (item.modelMesh) {
            item.modelMesh.position.copy(item.cannonBody.position);
            item.modelMesh.quaternion.copy(item.cannonBody.quaternion);
          }
        }
      }
    });

    controls.update();

    if (!onReplay) {
      renderer.render(cm1.scene, camera);
    } else {
      renderer.render(cm1.scene, camera2);
      camera2.position.x = player.cannonBody.position.x;
      camera2.position.z = player.cannonBody.position.z;
    }

    // renderer.render(cm1.scene, camera);

    renderer.setAnimationLoop(draw); // vr 같은걸 만들 때는 꼭 이걸로 사용해야함
  }

  function setSize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix(); //=> 카메라 투영에 관련된 값에 변화가 있을 경우 실행해야 함
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(cm1.scene, camera);
  }

  function tween(inout) {
    // in - true, out - false

    let desiredDistance = inout ? controls.minDistance : controls.maxDistance;

    let dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    dir.negate();
    let dist = controls.getDistance();

    new TWEEN.Tween({ val: dist })
      .to({ val: desiredDistance }, 1000)
      // .to({ val: desiredDistance }, 1000)
      .onUpdate((val) => {
        camera.position.copy(controls.target).addScaledVector(dir, val.val);
      })
      .start();
  }

  // 이벤트
  window.addEventListener('resize', setSize);
  canvas.addEventListener('click', (e) => {
    // if (preventDragClick.mouseMoved) return;
    mouse.x = (e.clientX / canvas.clientWidth) * 2 - 1;
    mouse.y = -((e.clientY / canvas.clientHeight) * 2 - 1);
    // console.log(mouse);
    checkIntersects();
  });

  draw();
}
