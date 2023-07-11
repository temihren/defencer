import { ctx } from "./init";
import { currentPlayerPosition } from "./main";

export const randomInRange = (min: number, max: number) =>
    Math.random() * (max - min) + min;

export const generateId = () => {
    const currentTime = new Date();
    return (
        (currentTime.getMilliseconds() * 60) +
        (currentTime.getSeconds() * 60)
    );
}

export const drawRect = (
    xPos: number,
    yPos: number,
    xSize: number,
    ySize: number,
    color?: string,
) => {
    let xPosition = xPos - currentPlayerPosition.x;
    if (xPosition < currentPlayerPosition.x) {
        xPosition = currentPlayerPosition.x - xPos;
    }

    let yPosition = yPos - currentPlayerPosition.y;
    if (yPosition < currentPlayerPosition.y) {
        yPosition = currentPlayerPosition.y - yPos;
    }

    ctx.fillStyle = color || 'black';
    ctx.fillRect(
        xPos - currentPlayerPosition.x,
        yPos - currentPlayerPosition.y,
        xSize, ySize,
    );
};
