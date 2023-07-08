export interface IPlayer {
    position: {x: number, y: number};
    size: {x: number, y: number};
    velocity?: {x: number, y: number};
}

export interface ITurret {
    position: {x: number, y: number};
    size: {x: number, y: number};
    velocity?: {x: number, y: number};
}