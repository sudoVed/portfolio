import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { createContext, SourceTextModule, SyntheticModule } from "node:vm";

// Load the real audio module with browser/audio doubles and MP3 URL imports.
async function setup({ deferredDecode = false } = {}) {
  const document = Object.assign(new EventTarget(), {
    hidden: false,
    hasFocus: () => true,
  });
  const window = new EventTarget();
  const contexts = [];
  const decodes = [];
  class AudioContext {
    state = "suspended";
    currentTime = 0;
    destination = {};
    sources = [];
    constructor() { contexts.push(this); }
    resume() { this.state = "running"; return Promise.resolve(); }
    suspend() { this.state = "suspended"; return Promise.resolve(); }
    decodeAudioData() {
      return deferredDecode ? new Promise(resolve => decodes.push(resolve)) : Promise.resolve({});
    }
    createGain() {
      return {
        gain: { value: 0, setValueAtTime() {}, linearRampToValueAtTime() {}, cancelScheduledValues() {} },
        connect() {}, disconnect() {},
      };
    }
    createBufferSource() {
      const source = { connect() {}, start() { source.started = true; }, stop() { source.stopped = true; } };
      this.sources.push(source);
      return source;
    }
    advance(seconds) { if (this.state === "running") this.currentTime += seconds; }
  }
  const context = createContext({ document, window, AudioContext, setTimeout,
    fetch: async () => ({ arrayBuffer: async () => new ArrayBuffer(8) }),
  });
  const module = new SourceTextModule(await readFile(new URL("./audio.js", import.meta.url), "utf8"), { context });
  await module.link(src => new SyntheticModule(["default"], function () {
    this.setExport("default", src);
  }, { context }));
  await module.evaluate();
  return { audio: module.namespace, document, window, contexts, decodes };
}

test("switching windows pauses the audio clock and resumes the same background source", async () => {
  const { audio, window, contexts } = await setup();
  await audio.startBg();
  const ctx = contexts[0];
  ctx.advance(12);
  window.dispatchEvent(new Event("blur"));
  assert.equal(ctx.state, "suspended");
  ctx.advance(30);
  assert.equal(ctx.currentTime, 12);
  window.dispatchEvent(new Event("focus"));
  assert.equal(ctx.state, "running");
  assert.equal(ctx.sources.length, 1);
  ctx.advance(1);
  assert.equal(ctx.currentTime, 13);
});

test("both visibility and window focus must be restored before audio resumes", async () => {
  const { audio, document, window, contexts } = await setup();
  await audio.startBg();
  document.hidden = true;
  document.dispatchEvent(new Event("visibilitychange"));
  assert.equal(contexts[0].state, "suspended");
  window.dispatchEvent(new Event("focus"));
  assert.equal(contexts[0].state, "suspended");
  window.dispatchEvent(new Event("blur"));
  document.hidden = false;
  document.dispatchEvent(new Event("visibilitychange"));
  assert.equal(contexts[0].state, "suspended");
  window.dispatchEvent(new Event("focus"));
  assert.equal(contexts[0].state, "running");
});

test("background decoding that finishes after blur cannot make the page audible", async () => {
  const { audio, window, contexts, decodes } = await setup({ deferredDecode: true });
  const loading = audio.startBg();
  await new Promise(setImmediate);
  window.dispatchEvent(new Event("blur"));
  decodes.shift()({});
  await loading;
  assert.equal(contexts[0].state, "suspended");
  window.dispatchEvent(new Event("focus"));
  assert.equal(contexts[0].state, "running");
  assert.equal(contexts[0].sources.length, 1);
});

test("effects requested or decoded while unfocused do not play or wake audio", async () => {
  const { audio, window, contexts, decodes } = await setup({ deferredDecode: true });
  const effect = audio.playOnce(audio.hoverSrc);
  await new Promise(setImmediate);
  window.dispatchEvent(new Event("blur"));
  decodes.shift()({});
  await effect;
  await audio.playOnce(audio.hoverSrc);
  assert.equal(contexts[0].state, "suspended");
  assert.equal(contexts[0].sources.length, 0);
});

test("stopping a pending background start cancels it and allows a fresh start", async () => {
  const { audio, contexts, decodes } = await setup({ deferredDecode: true });
  const oldStart = audio.startBg();
  await new Promise(setImmediate);
  audio.stopAllAudio();
  const newStart = audio.startBg();
  await new Promise(setImmediate);
  decodes[0]({});
  await oldStart;
  assert.equal(contexts[0].sources.length, 0);
  decodes[1]({});
  await newStart;
  assert.equal(contexts[0].sources.length, 1);
  await audio.startBg();
  assert.equal(contexts[0].sources.length, 1);
});
