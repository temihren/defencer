const init = () => {
    const canvasElement = document.createElement('canvas');
    canvasElement.width = window.innerWidth;
    canvasElement.height = window.innerHeight + 1;

    document.body.append(canvasElement);
    
    return canvasElement;
};

export const canvas = init();
export const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
