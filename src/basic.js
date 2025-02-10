import * as THREE from 'three';

export default function basic() {
  // console.log(THREE);
  const canvas = document.querySelector('#three-canvas');

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  //   console.log(window.devicePixelRatio); //1
  renderer.setPixelRatio(window.devicePixelRatio);

  //   renderer.setClearColor(0x00ff00);
  renderer.setClearColor('#0x00ff00'); // 배경색 설정
  renderer.setClearAlpha(0.2); // 0-1

  //캔버스 고해상도 이미지 표현하기
  // 100픽셀짜리 이미지를 표현할 때 200픽셀을 사용함

  const scene = new THREE.Scene();
  //   scene.background = new THREE.Color('blue');

  // 가장 자주 사용되는 원근 카메라, PerspectiveCamera
  //   THREE.PerspectiveCamera(fov=시야각, aspect=가로세로 비율= 너비/높이 , near=가까운정도, far=먼정도)
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  // const camera = new THREE.OrthographicCamera(left, right, top, bottom, near, far);
  //   const camera = new THREE.OrthographicCamera(
  //     -(window.innerWidth / window.innerHeight),
  //     window.innerWidth / window.innerHeight,
  //     1,
  //     -1,
  //     0.1,
  //     1000
  //   );
  // 카메라의 위치를 조정하지 않으면, default는 0,0,0임
  //   camera.position.x = 1;
  camera.position.y = 2;
  camera.position.z = 5;
  camera.lookAt(0, 0, 0);
  // 줌아웃 하고 싶을 때
  camera.zoom = 0.5; // default 1
  camera.updateProjectionMatrix();
  scene.add(camera);

  // Light
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.z = 10;
  scene.add(light);

  // Mesh
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({
    // color: 0xff000,
    // color: '#0xff000',
    color: 'red',
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // 그리기
  const clock = new THREE.Clock();
  function draw() {
    const delta = clock.getDelta();
    console.log(delta);
    // console.log(clock.getElapsedTime()); // 기기 성능에 상관없이 동일한 시간경과를 나타냄
    // const time = clock.getElapsedTime();
    // 각도는 Radian을 사용
    // 360도는 2파이
    // mesh.rotation.y += 0.1;
    // mesh.rotation.y += THREE.MathUtils.degToRad(1); // 1도씩 회전
    // mesh.rotation.y = time;
    // mesh.rotation.y += 0.1;
    mesh.rotation.y += delta;
    renderer.render(scene, camera);

    // requestAnimationFrame(draw);
    renderer.setAnimationLoop(draw); // vr 같은걸 만들 때는 꼭 이걸로 사용해야함
  }

  function setSize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    // updateProjectionMatrix => 카메라 투영에 관련된 값에 변화가 있을 경우 실행해야 함
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }
  // 이벤트
  window.addEventListener('resize', setSize);

  draw();
}
