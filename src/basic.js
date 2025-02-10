import * as THREE from 'three';

export default function basic() {
  // console.log(THREE);
  const canvas = document.querySelector('#three-canvas');

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();

  // 가장 자주 사용되는 원근 카메라, PerspectiveCamera
  // THREE.PerspectiveCamera(fov=시야각, aspect=가로세로 비율= 너비/높이 , near=가까운정도, far=먼정도)
  // const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  // const camera = new THREE.OrthographicCamera(left, right, top, bottom, near, far);
  const camera = new THREE.OrthographicCamera(
    -(window.innerWidth / window.innerHeight),
    window.innerWidth / window.innerHeight,
    1,
    -1,
    0.1,
    1000
  );
  // 카메라의 위치를 조정하지 않으면, default는 0,0,0임
  camera.position.x = 1;
  camera.position.y = 2;
  camera.position.z = 5;
  camera.lookAt(0, 0, 0);
  // 줌아웃 하고 싶을 때
  camera.zoom = 0.5; // default 1
  camera.updateProjectionMatrix();
  scene.add(camera);

  // Mesh
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({
    // color: 0xff000,
    // color: '#0xff000',
    color: 'red',
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // 그리기
  renderer.render(scene, camera);
}
