import { geo, mat, cm1 } from './common';
import { Mesh } from 'three';
import { Stuff } from './Stuff';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/Addons.js';
import HelvetikerFont from 'three/examples/fonts/helvetiker_regular.typeface.json';

// Stuff의 subClass
export class Text extends Stuff {
  constructor(info) {
    super(info); // 부모(Stuff)의 생성자 호출

    const loader = new FontLoader();
    const font = loader.parse(HelvetikerFont);

    const textGeometry = new TextGeometry('YOU WIN !', {
      font,
      size: 4,
      height: 0.2,
      depth: 0,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 5,
    });

    this.geometry = textGeometry;
    this.material = mat.textMaterial;

    // this.width = this.geometry.parameters.width;
    // this.height = this.geometry.parameters.height;
    // this.depth = this.geometry.parameters.depth;

    this.mesh = new Mesh(this.geometry, this.material);
    this.mesh.position.set(this.x, this.y, this.z);
    this.mesh.rotation.set(this.rotationX, this.rotationY, this.rotationZ);

    // this.mesh.castShadow = true;
    // this.mesh.receiveShadow = true;

    cm1.scene.add(this.mesh);

    // this.setCannonBody();
  }
}
