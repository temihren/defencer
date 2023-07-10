export const randomInRange = (min: number, max: number) =>
    Math.random() * (max - min) + min;

export const generateId = () => {
    const currentTime = new Date();
    return (
        (currentTime.getMilliseconds() * 60) +
        (currentTime.getSeconds() * 60)
    );
}