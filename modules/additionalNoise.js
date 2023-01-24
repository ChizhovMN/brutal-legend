export default function additionalNoise(src) {
    const audio = new Audio();
    audio.src = src;
    audio.volume = 0.2;
    audio.play();
}