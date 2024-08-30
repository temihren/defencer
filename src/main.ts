import {throttle} from 'lodash';
import {canvas, ctx} from './init';
import {PlayerInstance, Bullet} from './units';
import {generateId, drawRect} from './utils';
import {FIRE_RATE} from './constants';
import './style.css';


export const centerOfPlayer = {x: (canvas.width / 2) - 16, y: (canvas.height / 2) - 16}
export const currentPlayerPosition = {x: (canvas.width / 2) - 16, y: (canvas.height / 2) - 16};

export const player1 = new PlayerInstance({
  position: currentPlayerPosition,
  size: {x: 32, y: 32},
  color: 'white',
});

let bullets: {instance: Bullet, id: number}[] = [];

const buttonsPressed: {[key: string]: boolean} = {};
const mousePosition = {x: 0, y: 0};

const onKeyDown = (e: KeyboardEvent) => {
  buttonsPressed[e.key] = true;
};

const onKeyUp = (e: KeyboardEvent) => {buttonsPressed[e.key] = false};

const onMouseDown = () => {buttonsPressed.mainMouse = true};
const onMouseUp = () => {buttonsPressed.mainMouse = false};
const onMouseMove = (e: MouseEvent) => {
  mousePosition.x = e.clientX;
  mousePosition.y = e.clientY;
};

document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);
canvas.addEventListener('mousedown', onMouseDown);
canvas.addEventListener('mouseup', onMouseUp);
canvas.addEventListener('mousemove', onMouseMove);

export const createBullet = ({initialPosition, target, color, origin}: any) => {
  const bullet1 = new Bullet({
    initialPosition: initialPosition,
    target: target,
    id: generateId(),
    color,
    origin,
  });

   bullets.push({instance: bullet1, id: generateId()});
};

const shoot = throttle(() => {
  createBullet({
    initialPosition: {
      x: (centerOfPlayer.x + currentPlayerPosition.x) + (player1.size.x / 2),
      y: (centerOfPlayer.y + currentPlayerPosition.y) + (player1.size.y / 2),
    },
    target: {
      x: mousePosition.x + currentPlayerPosition.x,
      y: mousePosition.y + currentPlayerPosition.y,
    },
    color: 'red',
    origin: 'player',
  });
}, (1000 / FIRE_RATE), {trailing: false} );

const processActiveKeys = () => {
  if (buttonsPressed.d || buttonsPressed.в) {
    currentPlayerPosition.x += 10;
  }
  if (buttonsPressed.a || buttonsPressed.ф) {
    currentPlayerPosition.x -= 10;
  }
  if (buttonsPressed.w || buttonsPressed.ц) {
    currentPlayerPosition.y -= 10;
  }
  if (buttonsPressed.s || buttonsPressed.ы) {
    currentPlayerPosition.y += 10;
  }

  if (buttonsPressed.mainMouse) shoot();
};

let frames: number = 0;
let msPrev = 0;
const msPerFrame = 1000 / 60;

function runAGame(currentTime: number) {
  window.requestAnimationFrame(runAGame);
  const msNow = currentTime;
  const msPassed = msNow - msPrev;
  if (msPassed < msPerFrame) return;

  const excessTime = msPassed % msPerFrame;
  msPrev = msNow - excessTime;

  ctx.clearRect(0, 0, 7000, 7000);
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, 7000, 7000);

  //Frame
  [...Array(60).keys()].forEach((x) => {
    [...Array(60).keys()].forEach((y) => {
      drawRect(
        (x*100),
        (y*100),
        10,
        10,
        'grey',
      );
    })
  });

  if (bullets.length > 0) bullets.forEach((bullet) => {
    bullet.instance.render({
      onDestroy: (id: number) => {
        bullets = bullets.filter(b => b.id !== id);
      }
    })
  });

  processActiveKeys();
  player1.render();

  frames++;
}

runAGame(0);
