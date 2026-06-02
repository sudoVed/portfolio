import bgSrc from "../assets/bg.mp3";
import hoverSrc from "../assets/button-hover.mp3";
import wallSrc from "../assets/dice-hitting-wall.mp3";
import failSrc from "../assets/fail.mp3";
import successSrc from "../assets/success.mp3";
import glassSrc from "../assets/glass-break.mp3";
import wooshSrc from "../assets/woosh.mp3";
import woosh2Src from "../assets/woosh2.mp3";

export { hoverSrc, failSrc, successSrc, glassSrc };

export function playOnce(src, volume = 1, startTime = 0) {
  const a = new Audio(src);
  a.volume = volume;
  if (startTime) a.currentTime = startTime;
  a.play().catch(() => {});
}

export function playWoosh(volume) { playOnce(wooshSrc, volume, 0.4); }
export function playWoosh2(volume) { playOnce(woosh2Src, volume, 0.1); }
export function playWall() { playOnce(wallSrc, 0.5); }

let bgAudio = null;
export function startBg() {
  if (!bgAudio) {
    bgAudio = new Audio(bgSrc);
    bgAudio.loop = true;
    bgAudio.volume = 0.18;
  }
  if (bgAudio.paused) bgAudio.play().catch(() => {});
}

export function stopAllAudio() {
  if (bgAudio) {
    bgAudio.pause();
    bgAudio = null;
  }
}

document.addEventListener("visibilitychange", () => {
  if (!bgAudio) return;
  if (document.hidden) {
    bgAudio.pause();
  } else {
    bgAudio.play().catch(() => {});
  }
});

// Prime browser cache for all audio on page load
[bgSrc, hoverSrc, wallSrc, failSrc, successSrc, glassSrc, wooshSrc, woosh2Src].forEach(src => {
  const a = new Audio();
  a.preload = "auto";
  a.src = src;
});
