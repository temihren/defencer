import throttle from 'lodash.throttle';
import { Types } from "ably";
import * as Ably from "ably/promises";
import {canvas, ctx} from './init';
import {PlayerInstance, EnemyInstance, Bullet} from './units';
import {randomInRange, generateId} from './utils';
import {ENEMIES_SPAWN_RATE, FIRE_RATE, TIME_SCALE} from './constants';
import './style.css';

(async () => {
  console.log('what');
  
  const optionalClientId = "optionalClientId"; 
  // When not provided in authUrl, a default will be used.
  const connection = new Ably.Realtime.Promise({ authUrl: `/.netlify/functions
  //ably-token-request?clientId=${optionalClientId}` });
  const channel = connection.channels.get("some-channel-name");

  await channel.subscribe((msg: Types.Message) => {
      console.log("Ably message received", msg);
      document.getElementById("response").innerHTML += "<br />" + JSON.stringify(msg);
  });

  channel.publish("hello-world-message", { message: "Hello world!" });
})();

export const player1 = new PlayerInstance({
  position: {x: 100, y: canvas.height - 110},
  size: {x: 100, y: 100},
});

export let enemies: {instance: EnemyInstance, id: number}[] = [];
export const killEnemy = (enemyId: number) => {
  enemies = enemies.filter(e => e.id !== enemyId);
};
let bullets: {instance: Bullet, id: number}[] = [];

const buttonsPressed: {[key: string]: boolean} = {};
const mousePosition = {x: 0, y: 0};

setInterval(() => {
  if (enemies.length < 10) {
    const newEnemy = new EnemyInstance({
      position: {
        x: randomInRange(0, (canvas.width - 100)),
        y: randomInRange(0, (canvas.height - 100))},
      size: {x: 100, y: 100},
    });
    enemies.push({id: generateId(), instance: newEnemy});
  }

}, (1000 / ENEMIES_SPAWN_RATE));

let jumpsCount = 0;
const onKeyDown = (e: KeyboardEvent) => {
  buttonsPressed[e.key] = true;

  if (e.key === ' ') {
    if (jumpsCount < 1) {
      jumpsCount += 1;
      player1.velocity.y = -20;
    }
  }
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
      x: (player1.position.x + (player1.size.x / 2)),
      y: (player1.position.y + (player1.size.y / 2)),
    },
    target: {x: mousePosition.x, y: mousePosition.y},
    color: 'black',
    origin: 'player',
  });
}, (1000 / FIRE_RATE), {trailing: false} );

const processActiveKeys = () => {
  const xVel = player1.velocity.x * TIME_SCALE;
  if (buttonsPressed.d) {
    player1.velocity.x = 10;
  }
  if (buttonsPressed.a) {
    player1.velocity.x = -10;
  }

  if (!buttonsPressed.a && !buttonsPressed.d) {
    if (xVel > 0 && xVel !== 0) {
      player1.velocity.x = 0;
    }
    if (xVel < 0 && xVel !== 0) {
      player1.velocity.x = 0;
    }
  }

  if ((player1.position.y + player1.size.y) >= (canvas.height - 20) && jumpsCount > 0) {
    jumpsCount = 0;
  }

  if (buttonsPressed.mainMouse) shoot();
};

const runAGame = () => {
  ctx.clearRect(0, 0, 5000, 5000);

  if (bullets.length > 0) bullets.forEach((bullet) => {
    bullet.instance.render({
      onDestroy: (id: number) => {
        bullets = bullets.filter(b => b.id !== id);
      }
    })
  });

  enemies.forEach(enemy => enemy.instance.render());

  player1.render();

  processActiveKeys();

  requestAnimationFrame(runAGame);
}

runAGame();
