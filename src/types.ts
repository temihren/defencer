export interface IBody {
    position: {x: number, y: number};
    size: {x: number, y: number};
    velocity?: {x: number, y: number};
}

export interface IPlayer extends IBody {
    color?: string;
}

export interface IEnemy extends IBody {
    color?: string;
}

export interface IBullet {
    initialPosition: {x: number, y: number};
    target: {x: number, y: number};
    id: number;
}