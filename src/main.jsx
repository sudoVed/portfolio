import React from "react";
import { createRoot } from "react-dom/client";
import { ArrowUpRight, EnvelopeSimple, GithubLogo, LinkedinLogo } from "@phosphor-icons/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import "./styles.css";
import bgSrc from "../assets/bg.mp3";
import hoverSrc from "../assets/button-hover.mp3";
import wallSrc from "../assets/dice-hitting-wall.mp3";
import failSrc from "../assets/fail.mp3";
import glassSrc from "../assets/glass-break.mp3";
import hammerImg from "../assets/hammer.png";
import wooshSrc from "../assets/woosh.mp3";
import woosh2Src from "../assets/woosh2.mp3";

gsap.registerPlugin(ScrollTrigger);

function playOnce(src, volume = 1, startTime = 0) {
  const a = new Audio(src);
  a.volume = volume;
  if (startTime) a.currentTime = startTime;
  a.play().catch(() => {});
}

function playWoosh(volume) { playOnce(wooshSrc, volume, 0.4); }
function playWoosh2(volume) { playOnce(woosh2Src, volume, 0.1); }

function playWall() {
  playOnce(wallSrc, 0.5);
}

let bgAudio = null;
function startBg() {
  if (!bgAudio) {
    bgAudio = new Audio(bgSrc);
    bgAudio.loop = true;
    bgAudio.volume = 0.18;
  }
  if (bgAudio.paused) bgAudio.play().catch(() => {});
}

const mousePos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
window.addEventListener("mousemove", (e) => { mousePos.x = e.clientX; mousePos.y = e.clientY; }, { passive: true });

const skills = [
  {
    group: "Systems & Robotics",
    items: ["ROS2", "Autonomous Navigation", "Sensor Fusion", "Path Planning", "Embedded Systems"],
  },
  {
    group: "Machine Learning & AI",
    items: ["Reinforcement Learning", "Deep Learning", "PyTorch", "Neural Networks", "Reward Modeling"],
  },
  {
    group: "Software & Infrastructure",
    items: ["Full-Stack Development", "WebSockets", "Real-Time Systems", "Python", "C++", "JavaScript"],
  },
  {
    group: "Tools & Workflow",
    items: ["Git", "Linux", "Docker", "VS Code"],
  },
];

const projects = [
  {
    title: "Autonomous Mobile Robot",
    descriptor: "ROS2 navigation system for unstructured spaces.",
    body:
      "A fully autonomous mobile robot capable of real-time navigation, obstacle avoidance, and goal-directed movement. It integrates LIDAR and camera feeds to build a live map and plan paths dynamically without human intervention.",
    tags: ["ROS2", "LIDAR", "Sensor Fusion", "Path Planning"],
    href: "https://github.com/sudoVed/autonomous-mobile-robot",
    visual: "robot",
  },
  {
    title: "Chain Reaction with Reinforcement Learning",
    descriptor: "Self-play agent for a discrete adversarial strategy game.",
    body:
      "A reinforcement learning agent trained to play Chain Reaction from scratch using self-play and reward shaping. The project explores emergent strategy in adversarial, discrete-action environments with Python and PyTorch.",
    tags: ["Python", "PyTorch", "Self-Play", "Reward Modeling"],
    href: "https://github.com/sudoVed/chain-reaction",
    visual: "chain",
  },
  {
    title: "Chat Application",
    descriptor: "Low-latency messaging with synchronized client state.",
    body:
      "A real-time chat application concept with WebSocket-based messaging, user authentication, and persistent message history. The focus is reliable state synchronization across clients with a clean user experience.",
    tags: ["WebSockets", "Authentication", "Real-Time", "State Sync"],
    href: "",
    visual: "chat",
  },
];

function useReducedMotion() {
  const [reduced, setReduced] = React.useState(false);

  React.useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return reduced;
}


const MAPPING_MODE = false;

function DieScene({ onReady, dieRef, mappingMode = false }) {
  const wrapperRef = React.useRef(null);
  const viewerRef = React.useRef(null);

  React.useEffect(() => {
    const viewer = viewerRef.current;
    const wrapper = wrapperRef.current;
    if (!viewer || !wrapper) return;

    if (mappingMode) {
      dieRef.current = { viewer, wrapper };
      const onLoad = () => onReady();
      viewer.addEventListener("load", onLoad);
      return () => viewer.removeEventListener("load", onLoad);
    }

    wrapper.style.transform = "translateY(-360px)";
    const onLoad = () => {
      const start = performance.now();
      const dur = 2200;
      const step = (now) => {
        const t = Math.min((now - start) / dur, 1);
        const e = 1 - Math.pow(1 - t, 3);
        wrapper.style.transform = `translateY(${-360 * (1 - e)}px)`;
        if (t < 1) requestAnimationFrame(step);
        else {
          wrapper.style.transform = "";
          viewer.setAttribute("auto-rotate", "");
          viewer.setAttribute("rotation-per-second", "40deg");
          dieRef.current = { viewer, wrapper };
          onReady();
        }
      };
      requestAnimationFrame(step);
    };
    viewer.addEventListener("load", onLoad);
    return () => viewer.removeEventListener("load", onLoad);
  }, [mappingMode]);

  return (
    <div ref={wrapperRef} style={{ display: "inline-block" }}>
      <model-viewer
        ref={viewerRef}
        src="/assets/d20.glb"
        ios-src="/assets/d20.usdz"
        camera-controls=""
        interaction-prompt="none"
        auto-rotate-delay="0"
        exposure="1.4"
        shadow-intensity="0"
        style={{
          ...(mappingMode && { width: "260px", height: "260px" }),
          background: "transparent",
          "--poster-color": "transparent",
          "--progress-bar-color": "transparent",
          "--progress-bar-height": "0px",
          pointerEvents: mappingMode ? "auto" : "none",
        }}
        loading="eager"
        aria-label="D20 die"
      />
    </div>
  );
}

function FaceMapper() {
  const dieRef = React.useRef(null);
  const [ready, setReady] = React.useState(false);
  const [orbit, setOrbit] = React.useState(null);
  const [recorded, setRecorded] = React.useState({});

  React.useEffect(() => {
    if (!ready) return;
    const id = setInterval(() => {
      const o = dieRef.current?.viewer?.getCameraOrbit();
      if (o) setOrbit({ theta: o.theta, phi: o.phi });
    }, 80);
    return () => clearInterval(id);
  }, [ready]);

  const record = (face) => {
    if (!orbit) return;
    const twoPI = Math.PI * 2;
    const norm = ((orbit.theta % twoPI) + twoPI) % twoPI;
    setRecorded(prev => ({ ...prev, [face]: [+norm.toFixed(4), +orbit.phi.toFixed(4)] }));
  };

  const exportMap = () => {
    const lines = Object.entries(recorded)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([f, [t, p]]) => `  ${String(f).padStart(2)}: [${t.toFixed(4)}, ${p.toFixed(4)}],`)
      .join("\n");
    const out = `const FACE_POSITIONS = {\n${lines}\n};`;
    navigator.clipboard.writeText(out).catch(() => {});
    alert("Copied to clipboard!\n\n" + out);
  };

  const done = Object.keys(recorded).length;
  const twoPI = Math.PI * 2;
  const normNow = orbit ? ((orbit.theta % twoPI) + twoPI) % twoPI : 0;

  return (
    <div style={{ position: "fixed", inset: 0, background: "#0a0a0a", display: "flex", flexDirection: "column", alignItems: "center", padding: "1rem", gap: "1rem", overflowY: "auto" }}>
      <p style={{ margin: 0, color: "#c9a84c", fontFamily: "monospace", fontSize: "0.8rem", letterSpacing: "0.1em" }}>FACE MAPPING MODE — drag the die to a face, click its number</p>

      <DieScene onReady={() => setReady(true)} dieRef={dieRef} mappingMode />

      {orbit && (
        <div style={{ fontFamily: "monospace", fontSize: "0.95rem", color: "#e8e4dc", background: "#1a1a18", padding: "0.5rem 1rem", borderRadius: "6px" }}>
          θ {normNow.toFixed(4)} &nbsp; φ {orbit.phi.toFixed(4)}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "0.4rem", width: "min(400px, 90vw)" }}>
        {Array.from({ length: 20 }, (_, i) => i + 1).map(f => (
          <button
            key={f}
            onClick={() => record(f)}
            style={{
              padding: "0.5rem",
              border: recorded[f] ? "1px solid #c9a84c" : "1px solid #333",
              borderRadius: "4px",
              background: recorded[f] ? "rgba(201,168,76,0.18)" : "#111",
              color: recorded[f] ? "#c9a84c" : "#888",
              fontFamily: "monospace",
              fontSize: "0.85rem",
              cursor: "pointer",
            }}
          >
            {f}{recorded[f] ? " ✓" : ""}
          </button>
        ))}
      </div>

      <p style={{ margin: 0, color: "#666", fontFamily: "monospace", fontSize: "0.8rem" }}>{done}/20 recorded</p>

      {done === 20 && (
        <button
          onClick={exportMap}
          style={{ padding: "0.6rem 1.4rem", background: "#c9a84c", color: "#0a0a0a", border: 0, borderRadius: "6px", fontFamily: "monospace", fontWeight: 700, cursor: "pointer", fontSize: "0.9rem" }}
        >
          Copy FACE_POSITIONS →
        </button>
      )}

      {done > 0 && done < 20 && (
        <button
          onClick={exportMap}
          style={{ padding: "0.4rem 1rem", background: "transparent", color: "#555", border: "1px solid #333", borderRadius: "6px", fontFamily: "monospace", cursor: "pointer", fontSize: "0.8rem" }}
        >
          Copy partial ({done}/20)
        </button>
      )}
    </div>
  );
}

// Face positions: [theta (normalized 0–2π), phi] — ground truth from FaceMapper
const FACE_POSITIONS = {
   1: [3.1102, 3.0788],
   2: [1.9164, 0.7069],
   3: [4.4925, 1.8692],
   4: [0.6283, 1.4294],
   5: [1.7279, 1.9478],
   6: [5.6549, 1.3195],
   7: [3.1259, 2.1677],
   8: [4.4296, 0.6283],
   9: [5.9062, 2.0263],
  10: [3.5657, 1.0681],
  11: [0.4712, 2.0892],
  12: [2.7175, 1.0367],
  13: [1.1781, 2.5604],
  14: [0.0471, 0.8796],
  15: [2.4976, 1.7122],
  16: [4.9637, 1.2723],
  17: [3.7228, 1.7907],
  18: [1.4451, 1.3352],
  19: [5.1208, 2.4819],
  20: [0.0000, 0.1571],
};


function GlassScreen({ introRef, onComplete }) {
  const [playing, setPlaying] = React.useState(false);
  const [ready, setReady] = React.useState(false);
  const [cursor, setCursor] = React.useState({ x: mousePos.x, y: mousePos.y });
  const videoRef = React.useRef(null);
  const isSmall = window.matchMedia("(max-width: 569px)").matches;

  React.useEffect(() => {
    const t = window.setTimeout(() => setReady(true), 800);
    return () => window.clearTimeout(t);
  }, []);

  const handleMove = (e) => setCursor({ x: e.clientX, y: e.clientY });

  const handleClick = () => {
    if (!ready || playing) return;
    const v = videoRef.current;
    if (!v) return;
    playOnce(glassSrc, 0.45, 0.3);
    startBg();
    setPlaying(true);
    const onSeeked = () => {
      v.removeEventListener("seeked", onSeeked);
      v.play().catch(() => {});
    };
    v.addEventListener("seeked", onSeeked);
    v.currentTime = 2.7;
  };

  const handleEnd = () => {
    if (introRef.current) introRef.current.classList.add("intro-exiting");
    window.setTimeout(onComplete, 500);
  };

  return (
    <div className="glass-screen" onMouseMove={handleMove} onClick={handleClick}>
      <video ref={videoRef} src={isSmall ? "/assets/glass-small.mp4" : "/assets/glass.mp4"} className={isSmall ? "glass-vid-small" : "glass-vid"} preload="auto" onEnded={handleEnd} />
      {!playing && (
        <span className="hammer-cursor" style={{ transform: `translate(${cursor.x - 26}px, ${cursor.y - 10}px)` }}>
          <img src={hammerImg} alt="" />
        </span>
      )}
    </div>
  );
}

function Intro({ onComplete }) {
  const rootRef = React.useRef(null);
  const dieRef = React.useRef(null);
  const [phase, setPhase] = React.useState("silhouette");
  const [ready, setReady] = React.useState(false);
  const reducedMotion = useReducedMotion();
  const quote = "Success and failure share one thing: they change you.";

  React.useEffect(() => {
    if (reducedMotion) {
      onComplete();
      return;
    }
    const t = window.setTimeout(() => setPhase("die"), 2800);
    return () => window.clearTimeout(t);
  }, [onComplete, reducedMotion]);

  React.useEffect(() => {
    if (phase !== "failure") return;
    playOnce(failSrc, 0.4);
    const t = window.setTimeout(() => {
      setPhase("fading");
      window.setTimeout(() => setPhase("glass"), 400);
    }, 1800);
    return () => window.clearTimeout(t);
  }, [phase]);


  const roll = React.useCallback(() => {
    if (!ready || phase !== "die") return;
    setPhase("rolling");
    const { viewer, wrapper } = dieRef.current;
    if (!viewer || !wrapper) return;

    // Face 20 is never shown — roll 1–19 only
    const rolledFace = Math.ceil(Math.random() * 19);

    viewer.removeAttribute("auto-rotate");
    const initOrbit = viewer.getCameraOrbit();
    let spinTheta = initOrbit.theta;
    const spinPhi = initOrbit.phi;
    const SPIN_RATE = (720 * Math.PI) / 180; // rad/s

    const W = window.innerWidth;
    const H = window.innerHeight;
    const dieRadius = viewer.offsetWidth / 2;
    const MAX_X = W / 2 - dieRadius;
    const MAX_Y = H / 2 - dieRadius;
    let vx = (Math.random() > 0.5 ? 1 : -1) * (W * 2.0 + Math.random() * W * 0.6);
    let vy = (Math.random() > 0.5 ? 1 : -1) * (H * 1.5 + Math.random() * H * 0.5);
    let px = 0, py = 0;
    const BOUNCE_DUR = 2400;
    const bounceStart = performance.now();
    let prevTime = bounceStart;

    const bounceStep = (now) => {
      const elapsed = now - bounceStart;
      const dt = Math.min((now - prevTime) / 1000, 0.033);
      prevTime = now;
      vx *= Math.pow(0.99, dt * 60);
      vy *= Math.pow(0.99, dt * 60);
      px += vx * dt;
      py += vy * dt;
      let hitWall = false;
      if (px > MAX_X)  { px = MAX_X;  vx = -Math.abs(vx) * 0.85; vy += (Math.random() - 0.5) * Math.abs(vx) * 0.4; hitWall = true; }
      if (px < -MAX_X) { px = -MAX_X; vx =  Math.abs(vx) * 0.85; vy += (Math.random() - 0.5) * Math.abs(vx) * 0.4; hitWall = true; }
      if (py > MAX_Y)  { py = MAX_Y;  vy = -Math.abs(vy) * 0.85; vx += (Math.random() - 0.5) * Math.abs(vy) * 0.4; hitWall = true; }
      if (py < -MAX_Y) { py = -MAX_Y; vy =  Math.abs(vy) * 0.85; vx += (Math.random() - 0.5) * Math.abs(vy) * 0.4; hitWall = true; }
      if (hitWall) playWall();
      wrapper.style.transform = `translate(${px}px, ${py}px)`;
      spinTheta += SPIN_RATE * dt;
      viewer.setAttribute("camera-orbit", `${spinTheta}rad ${spinPhi}rad 110%`);
      if (elapsed < BOUNCE_DUR) requestAnimationFrame(bounceStep);
      else snapToFace();
    };
    requestAnimationFrame(bounceStep);

    function snapToFace() {
      const startRadius = viewer.getCameraOrbit().radius;
      const rawTheta = spinTheta;
      const face = rolledFace;
      const [ft, fp] = FACE_POSITIONS[face];
      const twoPI = Math.PI * 2;
      const norm = ((rawTheta % twoPI) + twoPI) % twoPI;
      let diff = ((ft - norm) % twoPI + twoPI) % twoPI;
      if (diff > Math.PI) diff -= twoPI;
      const SNAP_DUR = 2500;
      const targetTheta = rawTheta + diff + 2 * twoPI;
      const startTheta = rawTheta, startPhi = spinPhi;
      const dist = targetTheta - startTheta;
      const v0 = Math.min(SPIN_RATE * (SNAP_DUR / 1000) / dist, 3.0);
      const snapStart = performance.now();
      let snapPrevTime = snapStart;

      const snapStep = (now) => {
        const t = Math.min((now - snapStart) / SNAP_DUR, 1);
        const dt = Math.min((now - snapPrevTime) / 1000, 0.033);
        snapPrevTime = now;

        vx *= Math.pow(0.97, dt * 60);
        vy *= Math.pow(0.97, dt * 60);
        px += vx * dt;
        py += vy * dt;
        let hitWallSnap = false;
        if (px > MAX_X)  { px = MAX_X;  vx = -Math.abs(vx) * 0.85; vy += (Math.random() - 0.5) * Math.abs(vx) * 0.4; hitWallSnap = true; }
        if (px < -MAX_X) { px = -MAX_X; vx =  Math.abs(vx) * 0.85; vy += (Math.random() - 0.5) * Math.abs(vx) * 0.4; hitWallSnap = true; }
        if (py > MAX_Y)  { py = MAX_Y;  vy = -Math.abs(vy) * 0.85; vx += (Math.random() - 0.5) * Math.abs(vy) * 0.4; hitWallSnap = true; }
        if (py < -MAX_Y) { py = -MAX_Y; vy =  Math.abs(vy) * 0.85; vx += (Math.random() - 0.5) * Math.abs(vy) * 0.4; hitWallSnap = true; }
        if (hitWallSnap) playWall();
        wrapper.style.transform = `translate(${px}px, ${py}px)`;

        const ease = (v0 - 2) * t * t * t + (3 - 2 * v0) * t * t + v0 * t;
        viewer.setAttribute(
          "camera-orbit",
          `${startTheta + dist * ease}rad ${startPhi + (fp - startPhi) * ease}rad ${startRadius}m`
        );

        if (t < 1) {
          requestAnimationFrame(snapStep);
        } else {
          viewer.removeAttribute("auto-rotate");
          viewer.setAttribute("rotation-per-second", "0deg");
          viewer.setAttribute("camera-orbit", `${targetTheta}rad ${fp}rad ${startRadius}m`);
          window.setTimeout(() => setPhase("failure"), 700);
        }
      };
      requestAnimationFrame(snapStep);
    }
  }, [ready, phase]);

  React.useEffect(() => {
    const keyHandler = (event) => {
      if (event.key === "Enter" || event.key === " ") {
        if (document.activeElement?.classList.contains("skip-intro")) return;
        event.preventDefault();
        if (phase === "die") roll();
      }
    };
    window.addEventListener("keydown", keyHandler);
    return () => window.removeEventListener("keydown", keyHandler);
  }, [phase, roll]);

  return (
    <section className="intro" ref={rootRef} aria-label="Portfolio intro">
      <button className="skip-intro" onClick={() => { playWoosh( 0.75); startBg(); onComplete(); }} onMouseEnter={() => playOnce(hoverSrc, 0.35)}>
        Skip intro
      </button>
<div className={`intro-silhouette${phase !== "silhouette" ? " sil-hidden" : ""}`} aria-hidden={phase !== "silhouette" ? "true" : undefined}>
        <img src="/assets/silhouette.png" scale="150%" alt="" />
        <p className="quote-text">{quote}</p>
      </div>
      <div
        className={`intro-die${phase !== "silhouette" ? " die-active" : ""}${phase === "fading" || phase === "glass" ? " die-exit" : ""}`}
        aria-hidden={phase === "silhouette" ? "true" : undefined}
      >
        {phase !== "silhouette" && <DieScene onReady={() => setReady(true)} dieRef={dieRef} />}
        {phase === "die" && ready && (
          <button className="roll-button" onClick={() => { playWoosh2( 0.25); roll(); }} onMouseEnter={() => playOnce(hoverSrc, 0.35)}>
            Roll for Perception
          </button>
        )}
        {(phase === "failure" || phase === "fading") && (
          <p className="failure-label">FAILURE</p>
        )}
      </div>
      {(phase === "fading" || phase === "glass") && (
        <GlassScreen introRef={rootRef} onComplete={onComplete} />
      )}
    </section>
  );
}

function SpatialScene({ activeProject }) {
  const canvasRef = React.useRef(null);
  const reducedMotion = useReducedMotion();
  const activeProjectRef = React.useRef(activeProject);
  activeProjectRef.current = activeProject;

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 10);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const group = new THREE.Group();
    scene.add(group);

    const fragmentMaterial = new THREE.MeshStandardMaterial({
      color: 0x2b2a26, metalness: 0.65, roughness: 0.36, transparent: true, opacity: 0.62,
    });
    const accentMaterial = new THREE.MeshStandardMaterial({
      color: 0xc9a84c, emissive: 0x3a2a08, metalness: 0.7, roughness: 0.26,
    });

    const TOTAL = 180;
    const sharedGeo = new THREE.TetrahedronGeometry(1, 0);

    // Two instanced meshes — one draw call each instead of 180 separate draw calls
    let accentCount = 0;
    for (let i = 0; i < TOTAL; i++) if (i % 11 === 0) accentCount++;
    const regularInst = new THREE.InstancedMesh(sharedGeo, fragmentMaterial, TOTAL - accentCount);
    const accentInst  = new THREE.InstancedMesh(sharedGeo, accentMaterial, accentCount);
    regularInst.frustumCulled = false;
    accentInst.frustumCulled  = false;
    group.add(regularInst);
    group.add(accentInst);

    // Per-fragment data in typed arrays
    const homeX = new Float32Array(TOTAL);
    const homeY = new Float32Array(TOTAL);
    const homeZ = new Float32Array(TOTAL);
    const curX  = new Float32Array(TOTAL);
    const curY  = new Float32Array(TOTAL);
    const rotX  = new Float32Array(TOTAL);
    const rotY  = new Float32Array(TOTAL);
    const spd   = new Float32Array(TOTAL);
    const scl   = new Float32Array(TOTAL);

    for (let i = 0; i < TOTAL; i++) {
      const x = (Math.random() - 0.5) * 22;
      const y = (Math.random() - 0.5) * 16;
      const z = -Math.random() * 22;
      homeX[i] = curX[i] = x;
      homeY[i] = curY[i] = y;
      homeZ[i] = z;
      rotX[i]  = Math.random() * Math.PI;
      rotY[i]  = Math.random() * Math.PI;
      spd[i]   = 0.001 + Math.random() * 0.003;
      scl[i]   = 0.08 + Math.random() * 0.28;
    }

    const lines = new THREE.Group();
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x6f674f, transparent: true, opacity: 0.18 });
    for (let i = 0; i < 26; i += 1) {
      const pts = [
        new THREE.Vector3((Math.random() - 0.5) * 13, (Math.random() - 0.5) * 9, -4 - Math.random() * 4),
        new THREE.Vector3((Math.random() - 0.5) * 13, (Math.random() - 0.5) * 9, -4 - Math.random() * 4),
      ];
      lines.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), lineMaterial));
    }
    scene.add(lines);

    const lamp = new THREE.PointLight(0xc9a84c, 1.8, 22);
    lamp.position.set(2, 2, 4);
    scene.add(lamp);
    scene.add(new THREE.AmbientLight(0xbab1a0, 0.35));

    const pointer = { x: 0, y: 0 };
    const smooth  = { x: 0, y: 0 };
    const onPointer = (e) => {
      pointer.x = (e.clientX / window.innerWidth  - 0.5) * 2;
      pointer.y = (e.clientY / window.innerHeight - 0.5) * -2;
    };
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("pointermove", onPointer);
    window.addEventListener("resize", onResize);

    const dummy = new THREE.Object3D();
    let raf = 0;

    const tick = () => {
      const scroll = reducedMotion ? 0 : window.scrollY / Math.max(document.body.scrollHeight - window.innerHeight, 1);

      smooth.x += (pointer.x - smooth.x) * 0.09;
      smooth.y += (pointer.y - smooth.y) * 0.09;

      camera.position.z += (9.5 - scroll * 1.5 - camera.position.z) * 0.03;
      lamp.position.x += (smooth.x * 5 - lamp.position.x) * 0.08;
      lamp.position.y += (1.5 + smooth.y * 3 - lamp.position.y) * 0.08;
      lamp.intensity += (1.5 + activeProjectRef.current * 0.45 - lamp.intensity) * 0.04;

      const now = Date.now();
      let regIdx = 0, accIdx = 0;

      for (let i = 0; i < TOTAL; i++) {
        rotX[i] += spd[i] * (i % 3 ? 1 : -1);
        rotY[i] += spd[i] * 1.4;

        const depth = (homeZ[i] + 22) / 22; // 1 = close, 0 = far

        if (!reducedMotion) {
          // Depth-staggered time: close fragments lead the spiral, far ones trail
          const t = scroll * (1 + depth * 0.7);

          // Small home-position-based angular offset gives the spiral arm width
          // without random chaos — nearby fragments fan out together
          const angleOffset = homeX[i] * 0.07 + homeY[i] * 0.05;
          const angle = t * Math.PI * 3.5 + angleOffset;

          // Large radius so close fragments exit screen; far ones sweep visibly
          const r = t * (4 + depth * 13);

          // Perpendicular nudge fans fragments along the arm naturally
          const nudge = Math.sin(homeX[i] * 0.55 + homeZ[i] * 0.28) * scroll * 3;
          const bob   = Math.sin(now * 0.0003 + i) * 0.15;

          const stx = homeX[i] + Math.cos(angle) * r + Math.cos(angle + 1.57) * nudge;
          const sty = homeY[i] + Math.sin(angle) * r * 0.65 + Math.sin(angle + 1.57) * nudge * 0.5 + bob;

          curX[i] += (stx - curX[i]) * 0.12;
          curY[i] += (sty - curY[i]) * 0.12;
        }

        // Z drifts toward camera as scroll increases — close fragments surge forward most
        const tz = homeZ[i] + scroll * depth * 6;
        // Scale grows as fragment approaches camera — amplifies the depth effect
        const scaleMult = 1 + (tz - homeZ[i]) * 0.18;
        dummy.position.set(curX[i], curY[i], tz);
        dummy.rotation.set(rotX[i], rotY[i], 0);
        dummy.scale.setScalar(scl[i] * scaleMult);
        dummy.updateMatrix();

        if (i % 11 === 0) accentInst.setMatrixAt(accIdx++, dummy.matrix);
        else               regularInst.setMatrixAt(regIdx++, dummy.matrix);
      }

      regularInst.instanceMatrix.needsUpdate = true;
      accentInst.instanceMatrix.needsUpdate  = true;

      renderer.render(scene, camera);
      raf = window.requestAnimationFrame(tick);
    };
    tick();

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      sharedGeo.dispose();
      fragmentMaterial.dispose();
      accentMaterial.dispose();
      lineMaterial.dispose();
      lines.children.forEach(l => l.geometry.dispose());
      regularInst.dispose();
      accentInst.dispose();
    };
  }, [reducedMotion]);

  return <canvas className="spatial-canvas" ref={canvasRef} aria-hidden="true" />;
}

const KNOWN_VISUALS = new Set(["robot", "chain", "chat"]);

function ProjectVisual({ type }) {
  const resolved = KNOWN_VISUALS.has(type) ? type : "default";
  return (
    <div className={`project-visual project-visual-${resolved}`} aria-hidden="true">
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
    </div>
  );
}

function ProjectPanel({ project, index, onActive }) {
  const ref = React.useRef(null);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return undefined;

    let tx = 0, ty = 0;
    let targetTx = 0, targetTy = 0;
    let isInside = false;
    let raf = null;

    const tick = () => {
      tx += (targetTx - tx) * 0.1;
      ty += (targetTy - ty) * 0.1;

      if (!isInside && Math.abs(tx) < 0.001 && Math.abs(ty) < 0.001) {
        tx = 0; ty = 0; raf = null;
        element.style.transform = "";
        return;
      }

      element.style.transform = `rotateX(${(-ty * 5).toFixed(3)}deg) rotateY(${(tx * 7).toFixed(3)}deg)`;
      raf = requestAnimationFrame(tick);
    };

    const onUpdate = () => {
      // Temporarily clear tilt so getBoundingClientRect returns the flat layout bounds —
      // this keeps the hover boundary fixed regardless of how much the panel is bent.
      const saved = element.style.transform;
      element.style.transform = "";
      const rect = element.getBoundingClientRect();
      element.style.transform = saved;

      isInside = mousePos.x >= rect.left && mousePos.x <= rect.right &&
                 mousePos.y >= rect.top  && mousePos.y <= rect.bottom;

      if (isInside) {
        targetTx = (mousePos.x - rect.left) / rect.width  - 0.5;
        targetTy = (mousePos.y - rect.top)  / rect.height - 0.5;
        element.style.setProperty("--spot-x", `${mousePos.x - rect.left}px`);
        element.style.setProperty("--spot-y", `${mousePos.y - rect.top}px`);
      } else {
        targetTx = 0;
        targetTy = 0;
      }

      if (!raf) raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onUpdate, { passive: true });
    window.addEventListener("scroll", onUpdate, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onUpdate);
      window.removeEventListener("scroll", onUpdate);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <article
      className="project-panel"
      ref={ref}
      onMouseEnter={() => { onActive(index); playOnce(hoverSrc, 0.35); }}
      onFocus={() => onActive(index)}
      tabIndex="0"
    >
      <div className="project-copy">
        <p className="project-index">0{index + 1}</p>
        <h3>{project.title}</h3>
        <p className="project-descriptor">{project.descriptor}</p>
        <p>{project.body}</p>
        <div className="tag-row">
          {project.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>
      <div className="project-visual-wrap">
        <ProjectVisual type={project.visual} />
        {project.href ? (
          <a className="project-link" href={project.href} target="_blank" rel="noreferrer" aria-label={`${project.title} repository`} onMouseEnter={() => playOnce(hoverSrc, 0.35)} onClick={() => playWoosh( 0.75)}>
            <ArrowUpRight weight="bold" />
          </a>
        ) : (
          <span className="project-link project-link-disabled" aria-label="Project link coming later">
            <ArrowUpRight weight="bold" />
          </span>
        )}
      </div>
    </article>
  );
}

function Portfolio() {
  const [activeProject, setActiveProject] = React.useState(0);
  React.useLayoutEffect(() => {
    const revealContext = gsap.context(() => {
      // Hero: marquee reveal — large blur, long arc, branded weight
      gsap.from(".hero-copy", {
        y: 60, opacity: 0, filter: "blur(14px)",
        duration: 1.1, ease: "power4.out",
        scrollTrigger: { trigger: ".hero-copy", start: "top 88%" },
      });
      gsap.from(".profile-frame", {
        y: 40, opacity: 0, filter: "blur(8px)",
        duration: 0.9, ease: "power3.out", delay: 0.1,
        scrollTrigger: { trigger: ".profile-frame", start: "top 88%" },
      });

      // Section headings: architectural — clean translate, no blur
      gsap.utils.toArray(".section-heading").forEach((el) => {
        gsap.from(el, {
          y: 22, opacity: 0,
          duration: 0.7, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 82%" },
        });
      });

      // Skill rows: stat-block — staggered horizontal slide, no blur
      gsap.utils.toArray(".skill-row").forEach((el, i) => {
        gsap.from(el, {
          x: -14, opacity: 0,
          duration: 0.55, ease: "power3.out",
          delay: i * 0.09,
          scrollTrigger: { trigger: ".skill-table", start: "top 78%" },
        });
      });

      // Project panels: medium blur, less dramatic than hero
      gsap.utils.toArray(".project-panel").forEach((el) => {
        gsap.from(el, {
          y: 28, opacity: 0, filter: "blur(6px)",
          duration: 0.85, ease: "power4.out",
          scrollTrigger: { trigger: el, start: "top 80%" },
        });
      });

      // Contact: quietest moment — opacity fade only
      gsap.from(".contact-core", {
        opacity: 0,
        duration: 0.6, ease: "power2.out",
        scrollTrigger: { trigger: ".contact-core", start: "top 80%" },
      });

      gsap.utils.toArray(".project-panel").forEach((panel, index) => {
        ScrollTrigger.create({
          trigger: panel,
          start: "top 58%",
          end: "bottom 42%",
          onEnter: () => setActiveProject(index),
          onEnterBack: () => setActiveProject(index),
        });
      });

    });

    return () => revealContext.revert();
  }, []);

  return (
    <div className="site-shell">
<SpatialScene activeProject={activeProject} />
      <nav className="side-nav" aria-label="Sections">
        {["About", "Skills", "Projects", "Contact"].map((item) => (
          <a key={item} href={`#${item.toLowerCase()}`} onMouseEnter={() => playOnce(hoverSrc, 0.35)} onClick={() => playWoosh( 0.75)}>
            {item}
          </a>
        ))}
      </nav>
      <main id="content">
        <section className="hero" id="about">
          <div className="hero-inner">
            <div className="hero-copy">
              <h1 className="hero-mark">VED</h1>
              <p className="discipline">Full-Stack Developer / Robotics / Machine Learning</p>
              <p className="about-copy">
                I consider myself someone who is driven by curiosity and desire. I enjoy trying new things, building new
                things, fixing small inconveniences, and finding the small fun things in life.
              </p>
            </div>
            <figure className="profile-frame">
              <img src="/assets/profile.jpg" alt="Portrait of Ved Somani" />
            </figure>
          </div>
        </section>

        <section className="skills-section" id="skills" aria-labelledby="skills-title">
          <div className="section-heading">
            <h2 id="skills-title">Capability map</h2>
            <p>Stat-block structure without fake percentages. The useful signal is what I can work with.</p>
          </div>
          <div className="skill-table">
            {skills.map((skill) => (
              <div className="skill-row" key={skill.group} tabIndex="0" onMouseEnter={() => playOnce(hoverSrc, 0.35)}>
                <h3>{skill.group}</h3>
                <div>
                  {skill.items.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="projects-section" id="projects" aria-labelledby="projects-title">
          <div className="section-heading">
            <h2 id="projects-title">Work panels</h2>
            <p>Three systems, each represented with truthful visuals instead of invented screenshots.</p>
          </div>
          <div className="project-stack">
            {projects.map((project, index) => (
              <ProjectPanel key={project.title} project={project} index={index} onActive={setActiveProject} />
            ))}
          </div>
        </section>

        <section className="contact-section" id="contact" aria-labelledby="contact-title">
          <div className="contact-core">
            <h2 id="contact-title">Let's talk.</h2>
            <div className="contact-links">
              <a href="https://github.com/sudoVed" target="_blank" rel="noreferrer" onMouseEnter={() => playOnce(hoverSrc, 0.35)} onClick={() => playWoosh( 0.75)}>
                <GithubLogo weight="duotone" /> GitHub
              </a>
              <a href="https://www.linkedin.com/in/vedansh-somani-583a91316/" target="_blank" rel="noreferrer" onMouseEnter={() => playOnce(hoverSrc, 0.35)} onClick={() => playWoosh( 0.75)}>
                <LinkedinLogo weight="duotone" /> LinkedIn
              </a>
              <a href="mailto:vedansh.somani.study@gmail.com" onMouseEnter={() => playOnce(hoverSrc, 0.35)} onClick={() => playWoosh(0.75)}>
                <EnvelopeSimple weight="duotone" /> Email
              </a>
            </div>
          </div>
        </section>
      </main>
      <footer>Copyright 2026 Ved / Built with intent.</footer>
    </div>
  );
}

function App() {
  const reducedMotion = useReducedMotion();
  const [introDone, setIntroDone] = React.useState(reducedMotion);

  React.useEffect(() => {
    if (reducedMotion) setIntroDone(true);
  }, [reducedMotion]);

  if (MAPPING_MODE) return <FaceMapper />;
  return introDone ? <Portfolio /> : <Intro onComplete={() => setIntroDone(true)} />;
}

createRoot(document.getElementById("root")).render(<App />);
