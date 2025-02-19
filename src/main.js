import './style.css';
import basic from './basic';
import { gameStart } from './gameManager';
// import init from './textureImageLoader';
// import init from './test';
// import init from './webgpu_backdrop_water';
// import init from './webgpu_water';

let title = '';
let message = '디바이스 GPU를 확인해주세요!';
function routeIfLost(title) {
  const body = document.querySelector('body');
  const nav = `<a href="/">Home</a>`;
  const routes = {
    '': `<h1>${title}</h1>
          <p>${message}</p>`,
  };

  const render = (path) => {
    body.innerHTML = routes[path.replace(/^#\//, '')] ?? `<h1>404</h1>${nav}`;
    body.style.minHeight = '100vh';
    body.style.display = 'flex';
    body.style.flexDirection = 'column';
    body.style.justifyContent = 'center';
    body.style.alignItems = 'center';
  };
  window.onhashchange = (evt) => render(window.location.hash);
  render(window.location.hash);
}

async function init() {
  // 디바이스 파괴 테스트 코드
  let simulatedLoss = false;
  async function simulateDeviceLoss() {
    simulatedLoss = true;
    device.destroy();
  }

  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) {
    console.log('GPU 사용 불가');
    title = '가능한 경우 그래픽 가속 사용 메뉴를 활성화 해주세요';
    routeIfLost(title);
    return;
  }
  const device = await adapter.requestDevice();
  device.lost.then((info) => {
    if (info.reason == 'unknown' || simulatedLoss) {
      simulatedLoss = false; // 테스트
      title = 'GPU 장치가 손실되었거나 찾을 수 없습니다.🥹';
      routeIfLost(title);
    } else {
      title = 'GPU 장치가 파괴되었습니다.🥹';
      routeIfLost(title);
    }
  });
  //   simulateDeviceLoss();

  if (device && adapter) {
    gameStart();
    basic();
  }
}
init();
