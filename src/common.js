import { BoxGeometry, MeshBasicMaterial, MeshPhongMaterial, Scene, SphereGeometry } from 'three';
import { FontLoader, GLTFLoader } from 'three/examples/jsm/Addons.js';
import { World, Material } from 'cannon-es';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import HelvetikerFont from 'three/examples/fonts/helvetiker_regular.typeface.json';

const loader = new FontLoader();

// three.js 에서 생성되는 object
export const cm1 = {
  scene: new Scene(),

  gltfLoader: new GLTFLoader(),
  mixer: undefined,

  // cannon
  world: new World(),
  defaultMaterial: new Material('default'),
  glasstMaterial: new Material('glass'),
  playerMaterial: new Material('player'),

  // text
  loader: loader,
  font: loader.parse(HelvetikerFont),
};

// 색상이나 상태값
export const cm2 = {
  step: 0,
  backgroundColor: '#3e1322',
  lightColor: '#ffe9ac',
  lightOffColor: '#222',
  pillarColor: '#071d28',
  floorColor: '#111',
  barColor: '#441c1d',
  glassColor: '#9fdfff',
};

export const geo = {
  pillar: new BoxGeometry(5, 10, 5),
  floor: new BoxGeometry(200, 1, 200),
  bar: new BoxGeometry(0.1, 0.3, 1.2 * 21),
  sideLight: new SphereGeometry(0.1, 6, 6),
  glass: new BoxGeometry(1.2, 0.05, 1.2),
  text: new TextGeometry('YOU WIN !', {
    font: cm1.font,
    size: 0.5,
    height: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  }),
};

export const mat = {
  pillar: new MeshPhongMaterial({
    color: cm2.pillarColor,
  }),
  floor: new MeshPhongMaterial({ color: cm2.floorColor }),
  bar: new MeshPhongMaterial({ color: cm2.barColor }),
  sideLight: new MeshPhongMaterial({ color: cm2.lightColor }),
  glass1: new MeshPhongMaterial({
    color: cm2.glassColor,
    transparent: true,
    opacity: 0.1, // 완전 불투명: 1
  }),
  glass2: new MeshPhongMaterial({
    color: cm2.glassColor,
    transparent: true,
    // 테스트 할 때 0.5로
    opacity: 0.5, // 완전 불투명: 1
  }),
  text: new MeshBasicMaterial(),
};

const normalSound = new Audio();
normalSound.src = '/sounds/Crash.mp3';
const strongSound = new Audio();
strongSound.src = '/sounds/Wood Hit Metal Crash.mp3';
export const sounds = {
  normal: normalSound,
  strong: strongSound,
};
