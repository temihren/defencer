import {BULLET_SIZE, BULLET_SPEED} from "./constants";
import {ctx, canvas} from "./init";
import {centerOfPlayer, currentPlayerPosition} from "./main";
import {type IPlayer, type IBullet} from "./types.d";
import { drawRect } from "./utils";

export class PlayerInstance {
    constructor({color, size}: IPlayer) {
        this.size = size;
        this.color = color || 'black';
    }

    size = {x: 0, y: 0};
    color = 'black';

    render() {
        ctx.fillStyle = this.color;
        ctx.fillRect(
            centerOfPlayer.x,
            centerOfPlayer.y,
            this.size.x,
            this.size.y,
        );
    }
}

export class Bullet {
    constructor({initialPosition, target, id, color, origin}: IBullet) {
        this.initialPosition = initialPosition;
        this.position = initialPosition;
        this.target = target;
        this.id = id;
        this.color = color;
        this.origin = origin;

        this.vector = Math.atan2(
            target.y - initialPosition.y,
            target.x - initialPosition.x,
        );
    }

    size = {x: BULLET_SIZE, y: BULLET_SIZE};
    initialPosition = {x: 0, y: 0};
    position = {x: 0, y: 0};
    target = {x: 0, y: 0};
    id = 0;
    distances = [0, 0];
    vector = 0;
    color = '';
    origin = '';

    draw() {
        this.position.x += Math.cos(this.vector) * BULLET_SPEED;
        this.position.y += Math.sin(this.vector) * BULLET_SPEED;

        drawRect(
            this.position.x,
            this.position.y,
            this.size.x,
            this.size.y,
            this.color,
        );
    }

    render({onDestroy}: {onDestroy: Function}) {
        this.draw();

        if (
            (this.position.x - currentPlayerPosition.x) > canvas.width ||
            (this.position.y - currentPlayerPosition.y) > canvas.height ||
            (this.position.x - currentPlayerPosition.x) < 0 ||
            (this.position.y - currentPlayerPosition.y) < 0
        ) {
            onDestroy(this.id);
        }
    }
}