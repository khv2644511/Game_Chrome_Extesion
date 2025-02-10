import { Sky } from 'three/addons/objects/Sky.js';
import { cm1 } from './common';
import { GUI } from 'dat.gui';
import * as THREE from 'three';

// Sky
export default function initSky() {
  const sky = new Sky();
  sky.scale.setScalar(450000);

  const phi = THREE.MathUtils.degToRad(90);
  const theta = THREE.MathUtils.degToRad(180);
  const sunPosition = new THREE.Vector3().setFromSphericalCoords(1, phi, theta);
  sky.material.uniforms.sunPosition.value = sunPosition;

  // Sky Material의 Uniform 설정
  const skyUniforms = sky.material.uniforms;
  skyUniforms['turbidity'].value = 2.3;
  skyUniforms['rayleigh'].value = 2;
  skyUniforms['mieCoefficient'].value = 0.005;
  skyUniforms['mieDirectionalG'].value = 0.8;

  // dat.gui 설정
  const gui = new GUI();
  const skyParams = {
    turbidity: 10,
    rayleigh: 2,
    mieCoefficient: 0.005,
    mieDirectionalG: 0.8,
    elevation: 90,
    azimuth: 180,
  };

  gui.add(skyParams, 'turbidity', 0, 20, 0.1).onChange((value) => {
    skyUniforms['turbidity'].value = value;
  });

  gui.add(skyParams, 'rayleigh', 0, 4, 0.1).onChange((value) => {
    skyUniforms['rayleigh'].value = value;
  });

  gui.add(skyParams, 'mieCoefficient', 0, 0.1, 0.001).onChange((value) => {
    skyUniforms['mieCoefficient'].value = value;
  });

  gui.add(skyParams, 'mieDirectionalG', 0, 1, 0.01).onChange((value) => {
    skyUniforms['mieDirectionalG'].value = value;
  });

  cm1.scene.add(sky);
}
