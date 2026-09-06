import bgSrc from "../assets/bg.mp3";
import hoverSrc from "../assets/button-hover.mp3";
import wallSrc from "../assets/dice-hitting-wall.mp3";
import failSrc from "../assets/fail.mp3";
import successSrc from "../assets/success.mp3";
import glassSrc from "../assets/glass-break.mp3";
import wooshSrc from "../assets/woosh.mp3";
import woosh2Src from "../assets/woosh2.mp3";

export { hoverSrc, failSrc, successSrc, glassSrc };

let ctx = null;
let pageFocused = document.hasFocus();

function isAudioActive() {
  return pageFocused && !document.hidden;
}

function syncAudioFocus() {
  if (!ctx) return;
  // Suspend the audio clock too, so the track continues from the same position.
  if (isAudioActive()) ctx.resume();
  else ctx.suspend();
}

function getCtx() {
  if (!ctx) ctx = new AudioContext();
  syncAudioFocus();
  return ctx;
}

// Decoded AudioBuffer cache
const buffers = {};

// Raw ArrayBuffer cache (fetched at page load, decoded on first play)
const rawCache = {};

async function loadBuffer(src) {
  if (buffers[src]) return buffers[src];
  const ab = rawCache[src] ? rawCache[src] : await fetch(src).then(r => r.arrayBuffer());
  buffers[src] = await getCtx().decodeAudioData(ab.slice(0));
  return buffers[src];
}

function playBuffer(buffer, volume = 1, startOffset = 0, loop = false) {
  const ac = getCtx();
  const gain = ac.createGain();
  // Ramp from 0 to avoid click artifact on abrupt start
  gain.gain.setValueAtTime(0, ac.currentTime);
  gain.gain.linearRampToValueAtTime(volume, ac.currentTime + 0.008);
  gain.connect(ac.destination);
  const source = ac.createBufferSource();
  source.buffer = buffer;
  source.loop = loop;
  source.connect(gain);
  source.start(0, startOffset);
  return { source, gain };
}

export async function playOnce(src, volume = 1, startTime = 0) {
  if (!isAudioActive()) return;
  getCtx();
  const buf = await loadBuffer(src);
  if (!isAudioActive()) return;
  playBuffer(buf, volume, startTime);
}

export function playWoosh(volume) { playOnce(wooshSrc, volume, 0.4); }
export function playWoosh2(volume) { playOnce(woosh2Src, volume, 0.1); }
export function playWall() { playOnce(wallSrc, 0.5); }

let bgSource = null;
let bgGain = null;
let bgLoading = false;
let bgRequest = 0;

export async function startBg() {
  if (bgSource || bgLoading) return;
  bgLoading = true;
  const request = ++bgRequest;
  getCtx();
  try {
    const buf = await loadBuffer(bgSrc);
    if (request !== bgRequest) return;
    const ac = getCtx();
    bgGain = ac.createGain();
    bgGain.gain.value = 0.18;
    bgGain.connect(ac.destination);
    bgSource = ac.createBufferSource();
    bgSource.buffer = buf;
    bgSource.loop = true;
    bgSource.connect(bgGain);
    bgSource.start(0);
  } finally {
    if (request === bgRequest) bgLoading = false;
  }
}

const FADE = 0.04;

export function stopAllAudio() {
  ++bgRequest;
  bgLoading = false;
  if (!bgGain || !bgSource || !ctx) { bgSource = null; bgGain = null; return; }
  const src = bgSource;
  const gain = bgGain;
  bgSource = null;
  bgGain = null;
  gain.gain.cancelScheduledValues(0);
  gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0, ctx.currentTime + FADE);
  setTimeout(() => { try { src.stop(); } catch {} gain.disconnect(); }, FADE * 1000 + 10);
}

document.addEventListener("visibilitychange", syncAudioFocus);
window.addEventListener("blur", () => {
  pageFocused = false;
  syncAudioFocus();
});
window.addEventListener("focus", () => {
  pageFocused = true;
  syncAudioFocus();
});

// Pre-fetch raw bytes at page load to prime HTTP cache (no AudioContext needed)
[bgSrc, hoverSrc, wallSrc, failSrc, successSrc, glassSrc, wooshSrc, woosh2Src].forEach(src => {
  fetch(src).then(r => r.arrayBuffer()).then(ab => { rawCache[src] = ab; }).catch(() => {});
});
