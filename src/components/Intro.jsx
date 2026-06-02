import React from "react";
import { FastForward } from "@phosphor-icons/react";
import { useReducedMotion } from "../hooks/useReducedMotion";
import {
  playOnce, playWoosh, playWoosh2, playWall,
  startBg, stopAllAudio,
  hoverSrc, failSrc, successSrc,
} from "../audio";
import { DieScene } from "./DieScene";
import { GlassScreen } from "./GlassScreen";

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

export function Intro({ onComplete }) {
  const rootRef = React.useRef(null);
  const dieRef = React.useRef(null);
  const skippedRef = React.useRef(false);
  const autoRotateStartRef = React.useRef(null);
  const [phase, setPhase] = React.useState("die");
  const [ready, setReady] = React.useState(false);
  const [rolledFaceNum, setRolledFaceNum] = React.useState(null);
  const reducedMotion = useReducedMotion();
  const quote = "Success and failure share one thing: they change you.";

  React.useEffect(() => {
    if (reducedMotion) onComplete();
  }, [onComplete, reducedMotion]);

  React.useEffect(() => {
    if (phase !== "failure") return;
    if (rolledFaceNum < 17) {
      playOnce(failSrc, 0.4);
      const t = window.setTimeout(() => {
        setPhase("fading");
        window.setTimeout(() => setPhase("glass"), 400);
      }, 1800);
      return () => window.clearTimeout(t);
    } else {
      playOnce(successSrc, 0.6);
      const t = window.setTimeout(() => {
        startBg();
        if (rootRef.current) rootRef.current.classList.add("intro-exiting");
        window.setTimeout(onComplete, 500);
      }, 1800);
      return () => window.clearTimeout(t);
    }
  }, [phase, rolledFaceNum, onComplete]);

  const roll = React.useCallback(() => {
    if (!ready || phase !== "die") return;
    let offby = 0.0;
    if (autoRotateStartRef.current !== null) {
      const elapsed = (performance.now() - autoRotateStartRef.current) / 1000;
      offby = (elapsed * 40) % 360;
      console.log(`Auto-rotate: ${elapsed.toFixed(3)}s → ${(elapsed * 40).toFixed(1)}° spun`);
    }
    const face = Math.ceil(Math.random() * 19) + 1;        //only 2 - 20
    setRolledFaceNum(face);
    setPhase("winding");
    const { viewer, wrapper } = dieRef.current;
    if (!viewer || !wrapper) return;

    const WINDUP_RPS = 360;
    const windupdistance = (offby <= 180)? offby+360: offby;
    const windupMs = Math.round((windupdistance / WINDUP_RPS) * 1000);
    viewer.setAttribute("auto-rotate", "");
    viewer.setAttribute("rotation-per-second", `${-WINDUP_RPS}deg`);

    window.setTimeout(() => {
      if (skippedRef.current) return;
      viewer.removeAttribute("auto-rotate");
      setPhase("rolling");
      playWoosh2(0.25);

      const initOrbit = viewer.getCameraOrbit();
      const twoPI = Math.PI * 2;
      const snapTheta = ((initOrbit.theta % twoPI) + twoPI) % twoPI;
      let spinTheta = snapTheta;
      const spinPhi = initOrbit.phi;
      const SPIN_RATE = (720 * Math.PI) / 180;

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
        if (skippedRef.current) return;
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
          if (skippedRef.current) return;
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
            viewer.setAttribute("camera-orbit", `${targetTheta}rad ${fp}rad ${startRadius}m`);
            window.setTimeout(() => setPhase("failure"), 700);
          }
        };
        requestAnimationFrame(snapStep);
      }
    }, windupMs);
  }, [ready, phase]);

  // Keep a stable ref so the keydown effect never needs to re-subscribe when roll/phase change
  const rollRef = React.useRef(roll);
  rollRef.current = roll;

  React.useEffect(() => {
    const keyHandler = (event) => {
      if (event.key === "Enter" || event.key === " ") {
        if (document.activeElement?.classList.contains("skip-intro")) return;
        event.preventDefault();
        rollRef.current();
      }
    };
    window.addEventListener("keydown", keyHandler);
    return () => window.removeEventListener("keydown", keyHandler);
  }, []);

  return (
    <section className="intro" ref={rootRef} aria-label="Portfolio intro">
      <video
        src={window.matchMedia("(max-width: 569px)").matches ? "/assets/glass-small.mp4" : "/assets/glass.mp4"}
        preload="auto"
        style={{ display: "none" }}
        aria-hidden="true"
      />
      <button type="button" className="skip-intro" onClick={() => { skippedRef.current = true; stopAllAudio(); playWoosh(0.75); startBg(); onComplete(); }} onMouseEnter={() => playOnce(hoverSrc, 0.35)} aria-label="Skip to portfolio">
        <FastForward size={15} weight="bold" />
        <span className="skip-label">Portfolio</span>
      </button>
<div className={`intro-silhouette${phase !== "silhouette" ? " sil-hidden" : ""}`} aria-hidden={phase !== "silhouette" ? "true" : undefined}>
        <img src="/assets/silhouette.png" scale="150%" alt="" />
        <p className="quote-text">{quote}</p>
      </div>
      <div
        className={`intro-die${phase !== "silhouette" ? " die-active" : ""}${phase === "fading" || phase === "glass" ? " die-exit" : ""}${phase === "die" && ready ? " die-clickable" : ""}`}
        aria-hidden={phase === "silhouette" ? "true" : undefined}
        onClick={phase === "die" && ready ? () => { roll(); } : undefined}
      >
        {phase !== "silhouette" && <DieScene onReady={() => { setReady(true); autoRotateStartRef.current = performance.now(); }} dieRef={dieRef} />}
        {(phase === "die" || phase === "winding" || phase === "rolling") && ready && (
          <button
            type="button"
            className="roll-button"
            disabled={phase !== "die"}
            onClick={phase === "die" ? (e) => { e.stopPropagation(); roll(); } : undefined}
            onMouseEnter={phase === "die" ? () => playOnce(hoverSrc, 0.35) : undefined}
          >
            {phase === "die" ? "Roll for Perception" : "Rolling DC 17"}
          </button>
        )}
        {(phase === "failure" || phase === "fading") && rolledFaceNum !== null && (
          rolledFaceNum < 17 ? (
            <p className="failure-label">
              <span className="roll-result">{rolledFaceNum}</span>
              FAILURE
            </p>
          ) : (
            <p className="success-label">
              <span className="roll-result">{rolledFaceNum}</span>
              {rolledFaceNum === 20 ? "Critical Success" : "Success"}
            </p>
          )
        )}
      </div>
      {(phase === "fading" || phase === "glass") && (
        <GlassScreen introRef={rootRef} onComplete={onComplete} />
      )}
    </section>
  );
}
