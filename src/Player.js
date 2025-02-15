import { geo, mat, cm1 } from './common';
import { AnimationMixer, BoxGeometry, Mesh, MeshBasicMaterial } from 'three';
import { Stuff } from './Stuff';

// Stuff의 subClass
export class Player extends Stuff {
  constructor(info) {
    super(info); // 부모(Stuff)의 생성자 호출

    // 정육면체로 한 이유 작성하기
    this.width = 0.5;
    this.height = 0.5;
    this.depth = 0.5;

    cm1.gltfLoader.load('/models/happy.glb', (glb) => {
      // console.log(glb);
      glb.scene.traverse((child) => {
        // console.log(child);
        if (child.isMesh) {
          child.castShadow = true;
        }
      });
      this.modelMesh = glb.scene.children[0];
      this.modelMesh.scale.set(4, 4, 4);
      this.modelMesh.position.set(this.x, this.y, this.z);
      this.modelMesh.rotation.set(this.rotationX, this.rotationY, this.rotationZ);
      this.modelMesh.castShadow = true; // 동작안함
      cm1.scene.add(this.modelMesh);

      //   console.log(glb.animations);

      this.modelMesh.animations = glb.animations;
      cm1.mixer = new AnimationMixer(this.modelMesh);
      this.actions = [];
      this.actions[0] = cm1.mixer.clipAction(this.modelMesh.animations[0]); // default
      this.actions[1] = cm1.mixer.clipAction(this.modelMesh.animations[1]); // fall
      this.actions[2] = cm1.mixer.clipAction(this.modelMesh.animations[2]); // jump
      this.actions[2].repetitions = 1; // 점프 한번만

      console.log(this.actions[0]);
      console.log(this.actions[1]);
      console.log(this.actions[2]);

      this.actions[0].play();

      this.setCannonBody();
    });

    // this.mesh = new Mesh(this.geometry, this.material);
    // this.mesh.position.set(this.x, this.y, this.z);
    // this.mesh.castShadow = true;
    // this.mesh.receiveShadow = true;
  }
}
