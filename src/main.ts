import './style.css';
import {canvas, ctx} from './init';
import {Player, Turret} from './units';

const player1 = new Player({
  position: {x: 20, y: 20},
  size: {x: 100, y: 100},
});

const turret1 = new Turret({
  position: {x: 500, y: canvas.height - 100},
  size: {x: 100, y: 100},
  velocity: {x: 0, y: 0},
});

const onKeyDown = (e: KeyboardEvent) => {
  if (e.key === ' ') {
    player1.velocity.y -= (player1.velocity.y + 5)
    turret1.velocity.y -= (turret1.velocity.y + 10)
  }
};

const onKeyUp = (e: KeyboardEvent) => {
  console.log(e.key);
};

document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);

const runAGame = () => {
  requestAnimationFrame(runAGame);

  ctx.clearRect(0, 0, 10000, 10000);

  player1.render();
  turret1.render();
}

runAGame();
