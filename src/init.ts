const init = () => {
    const canvasElement = document.createElement('canvas');
    document.body.append(canvasElement);
    canvasElement.width = document.body.clientWidth;
    canvasElement.height = document.body.clientHeight + 1;

    return canvasElement;
};

export const canvas = init();
export const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
