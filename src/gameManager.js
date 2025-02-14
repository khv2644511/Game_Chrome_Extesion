import { AudioListener, Audio, AudioLoader } from 'three';
import { cm1 } from './common';

// PauseGame() : 게임을 일시 정지하는 함수
// StopGame() : 게임을 완전히 종료하는 함수
// replay
export function gameStart() {
  const playButton = document.getElementById('play_button');
  const canvas = document.getElementById('three-canvas');
  playButton.innerHTML = 'Play';
  playButton.style.display = 'block';

  // 인터랙션이 있어야 백그라운드 음악 재생 가능
  playButton.addEventListener('click', () => {
    // 게임 플레이!
    canvas.style.pointerEvents = 'auto'; // canvas에 이벤트 활성화

    const listener = new AudioListener();
    cm1.scene.add(listener);
    const sound = new Audio(listener);
    const audioLoader = new AudioLoader();
    sound.autoplay = true;

    audioLoader.load('sounds/Water Running By.mp3', function (buffer) {
      sound.setBuffer(buffer);
      sound.setLoop(true);
      sound.setVolume(0.5);
      sound.play();
    });
    playButton.style.display = 'none';
  });
}

export function gameOver() {
  // fail
  const replayButton = document.getElementById('replay_button');
  replayButton.innerHTML = 'Replay';
  replayButton.style.display = 'block';

  replayButton.addEventListener('click', () => {
    location.reload();
    replayButton.style.display = 'none';
  });
}

export function gameSucceed() {
  // fail
  const replayButton = document.getElementById('replay_button');
  replayButton.innerHTML = 'replay';
  replayButton.style.display = 'block';

  replayButton.addEventListener('click', () => {
    location.reload();
    replayButton.style.display = 'none';
  });
}
