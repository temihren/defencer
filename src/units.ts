import {BULLET_SIZE, BULLET_SPEED, ENEMIES_SHOOTING_RATE, GRAVITY, TIME_SCALE} from "./constants";
import {ctx, canvas} from "./init";
import {createBullet, enemies, killEnemy, player1} from "./main";
import {IBody, IPlayer, IEnemy, IBullet} from "./types";

export class BodyInstance {
    constructor({position, size, velocity}: IBody) {
        this.position = position;
        this.size = size;
        if (velocity) this.velocity = velocity;
    }

    size = {x: 0, y: 0};
    velocity = {x: 0, y: 0};
    position = {x: 0, y: 0};

    draw() {
        const xVel =  this.velocity.x * TIME_SCALE;
        const yVel =  this.velocity.y * TIME_SCALE;
        this.position.y += yVel;

        if (this.position.y + this.size.y + yVel >= canvas.height) {
            this.velocity.y = 0;
        } else {
            this.velocity.y += GRAVITY * TIME_SCALE;
        }

        if (
            (this.position.x + xVel) >= 0 &&
            ((this.position.x + this.size.x) + xVel) <= canvas.width
        ) {
            this.position.x += xVel;
        } else {
            this.velocity.x = 0;
        }

        ctx.fillRect(
            this.position.x,
            this.position.y,
            this.size.x,
            this.size.y,
        );
    }
}

class StaticBodyInstance {
    constructor({position, size}: IBody) {
        this.position = position;
        this.size = size;
    }

    size = {x: 0, y: 0};
    position = {x: 0, y: 0};

    draw() {
        ctx.fillRect(
            this.position.x,
            this.position.y,
            this.size.x,
            this.size.y,
        );
    }
}

export class PlayerInstance extends BodyInstance {
    constructor({color, ...props}: IPlayer) {
        super(props);
    }

    render() {
        ctx.fillStyle = 'black';
        this.draw();
    }
}

export class EnemyInstance extends StaticBodyInstance {
    constructor({color, ...props}: IEnemy) {
        super(props);
        this.timer = 0;
    }

    timer: 0;

    render() {
        if (this.timer > (60 / ENEMIES_SHOOTING_RATE)) {
            this.timer = 0;

            createBullet({
                initialPosition: {
                    x: this.position.x + (this.size.x / 2),
                    y: this.position.y + (this.size.y / 2),
                },
                target: {
                    x: player1.position.x,
                    y: player1.position.y,
                },
                color: 'red',
                origin: 'enemy',
            });
        }
        this.timer += 1;

        ctx.fillStyle = 'red';
        this.draw();
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

        ctx.fillStyle = this.color;
        ctx.fillRect(
            this.position.x,
            this.position.y,
            this.size.x,
            this.size.y,
        );
    }

    render({onDestroy}: {onDestroy: Function}) {
        this.draw();
        
        enemies.forEach(({instance, id}) => {
            if (
                this.origin === 'player' &&
                this.position.x >= instance.position.x &&
                this.position.x <= (instance.position.x + instance.size.x) &&
                this.position.y >= instance.position.y &&
                this.position.y <= (instance.position.y + instance.size.y)
            ) {
                onDestroy(this.id);
                killEnemy(id);
            }
        });

        if (
            this.position.x > canvas.width ||
            this.position.y > canvas.height ||
            this.position.x < 0 ||
            this.position.y < 0
        ) {
            onDestroy(this.id);
        }
    }
}