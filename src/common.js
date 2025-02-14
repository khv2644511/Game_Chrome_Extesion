import { BoxGeometry, MeshBasicMaterial, MeshPhongMaterial, Scene, SphereGeometry, PlaneGeometry } from 'three';
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
  stonetMaterial: new Material('stone'),
  playerMaterial: new Material('player'),

  // text
  loader: loader,
  font: loader.parse(HelvetikerFont),
};

// 색상이나 상태값
export const cm2 = {
  step: 0,
  backgroundColor: '#3e1322',
  // backgroundWhiteColor: '#3e1322',
  lightColor: '#ffe9ac',
  lightOffColor: '#222',
  pillarColor: '#071d28',
  floorColor: '#D3D3D3',
  // floorColor: 'red',
  barColor: '#441c1d',
  glassColor: '#9fdfff',
  stoneColor: '#696969',
  waterColor: '0x001e0f',
  sunColor: '0xffffff',
};

export const geo = {
  pillar: new BoxGeometry(5, 10, 5),
  floor: new BoxGeometry(50, 2, 50),
  bar: new BoxGeometry(0.1, 0.3, 1.2 * 21),
  box: new BoxGeometry(1, 1, 1),
  sideLight: new SphereGeometry(0.1, 6, 6),
  glass: new BoxGeometry(12, 0.05, 12),
  stone: new BoxGeometry(12, 2, 12),
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
  floor: new MeshPhongMaterial({ color: cm2.floorColor, map: undefined }),
  bar: new MeshPhongMaterial({ color: cm2.barColor }),
  box: new MeshPhongMaterial({ color: cm2.pillarColor }),
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
  stone1: new MeshPhongMaterial({
    color: cm2.stoneColor,
    transparent: true,
    opacity: 0.3, // 완전 불투명: 1
  }),
  stone2: new MeshPhongMaterial({
    color: cm2.stoneColor,
    transparent: true,
    // 테스트 할 때 0.5로
    opacity: 0.8, // 완전 불투명: 1
  }),
  text: new MeshBasicMaterial(),
};
export const backgroundSound = new Audio();
backgroundSound.src = '/sounds/Water Running By.mp3';
const normalSound = new Audio();
normalSound.src = '/sounds/sink.mp3';
const strongSound = new Audio();
strongSound.src = '/sounds/walkOnRocks.mp3';
export const sounds = {
  normal: normalSound,
  strong: strongSound,
};
