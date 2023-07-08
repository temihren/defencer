import {ctx, canvas} from "./init";
import { GRAVITY } from "./physics";
import { IPlayer, ITurret } from "./types";

export class Player {
    constructor({position, size, velocity}: IPlayer) {
        this.position = position;
        this.size = size;
        if (velocity) this.velocity = velocity;
    }

    size = {x: 0, y: 0};
    velocity = {x: 0, y: 0};
    position = {x: 0, y: 0};

    draw() {
        ctx.fillStyle = 'black';
        ctx.fillRect(
            this.position.x,
            this.position.y,
            this.size.x,
            this.size.y,
        );
    }

    render() {
        this.draw();
        this.position.y += this.velocity.y;

        if (this.position.y + this.size.y + this.velocity.y >= canvas.height) {
            this.velocity.y = 0;
        } else {
            this.velocity.y += GRAVITY;
        }
    }
}

export class Turret {
    constructor({position, size, velocity}: ITurret) {
        this.position = position;
        this.size = size;
        if (velocity) this.velocity = velocity;
    }

    size = {x: 0, y: 0};
    velocity = {x: 0, y: 0};
    position = {x: 0, y: 0};

    draw() {
        ctx.fillStyle = 'red';
        ctx.fillRect(
            this.position.x,
            this.position.y,
            this.size.x,
            this.size.y,
        );
    }

    render() {
        this.draw();
        this.position.y += this.velocity.y;

        if (this.position.y + this.size.y + this.velocity.y >= canvas.height) {
            this.velocity.y = 0;
        } else {
            this.velocity.y += GRAVITY;
        }
    }
}