import { geo, mat, cm1 } from './common';
import { Mesh } from 'three';
import { Stuff } from './Stuff';

// Stuff의 subClass
export class Floor extends Stuff {
  constructor(info) {
    super(info); // 부모(Stuff)의 생성자 호출

    this.geometry = geo.floor;
    this.material = mat.floor;

    this.width = this.geometry.parameters.width;
    this.height = this.geometry.parameters.height;
    this.depth = this.geometry.parameters.depth;

    this.mesh = new Mesh(this.geometry, this.material);
    this.mesh.position.set(this.x, this.y, this.z);
    // this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;

    cm1.scene.add(this.mesh);

    this.setCannonBody();
  }
}
