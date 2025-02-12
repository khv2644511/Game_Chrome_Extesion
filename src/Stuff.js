import { Body, Box, Vec3 } from 'cannon-es';
import { cm1 } from './common';

export class Stuff {
  // info 기본값
  constructor(info = {}) {
    this.name = info.name || '';
    this.x = info.x || 0;
    this.y = info.y || 0;
    this.z = info.z || 0;

    this.rotationX = info.rotationX || 0;
    this.rotationY = info.rotationY || 0;
    this.rotationZ = info.rotationZ || 0;

    this.mass = info.mass || 0; // for test => mass: 1

    this.cannonMaterial = info.cannonMaterial || cm1.defaultMaterial;
  }

  setCannonBody(info = {}) {
    const material = this.cannonMaterial;
    const shape = new Box(new Vec3(this.width / 2, this.height / 2, this.depth / 2));
    // console.log('material', material);

    this.cannonBody = new Body({
      mass: this.mass,
      position: new Vec3(this.x, this.y, this.z),
      shape,
      material,
    });

    // cannonBody도 일분이 캐릭터 Mesh의 회전값을 동일하게
    this.cannonBody.quaternion.setFromAxisAngle(
      //
      new Vec3(0, 1, 0), //
      this.rotationY
    );

    // console.log('Created CannonBody:', this.cannonBody); // 🔹 Debugging line

    cm1.world.addBody(this.cannonBody);
  }
}
