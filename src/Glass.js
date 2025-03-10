import { geo, mat, cm1, sounds } from './common';
import { Mesh } from 'three';
import { Stuff } from './Stuff';

// Stuff의 subClass
export class Glass extends Stuff {
  constructor(info) {
    super(info); // 부모(Stuff)의 생성자 호출

    this.type = info.type;
    this.step = info.step;

    this.geometry = geo.glass;
    switch (this.type) {
      case 'normal':
        this.material = mat.glass1;
        this.mass = 1;
        break;
      case 'strong':
        this.material = mat.glass2;
        this.mass = 0;
        break;
    }

    this.width = this.geometry.parameters.width;
    this.height = this.geometry.parameters.height;
    this.depth = this.geometry.parameters.depth;

    this.mesh = new Mesh(this.geometry, this.material);
    this.mesh.position.set(this.x, this.y, this.z);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.mesh.name = this.name;
    this.mesh.step = this.step;
    this.mesh.type = this.type;

    cm1.scene.add(this.mesh);

    this.setCannonBody();

    // console.log(this.cannonBody);
    this.cannonBody.addEventListener('collide', playSound);

    const sound = sounds[this.type];
    function playSound(e) {
      // 클릭 or 인터랙션 후에 음악 파일 재생 가능
      // sound.play();
      // play() 최초로 실행이 됨 -> play() failed because the user didn't interact with the document first. https://goo.gl/xX8pDD

      const strength = e.contact.getImpactVelocityAlongNormal();

      if (strength > 5) {
        sound.currentTime = 0; // 바로 재생되도록
        sound.play();
        console.log(strength);
      }
    }
  }
}
