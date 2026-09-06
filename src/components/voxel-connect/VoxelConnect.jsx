import React from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import "./voxel-connect.css";

export function VoxelConnect() {
  const sectionRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const sceneRef = React.useRef(null);
  const targetRef = React.useRef(false);
  const [targetQR, setTargetQR] = React.useState(false);
  const [settledQR, setSettledQR] = React.useState(false);
  const [ready, setReady] = React.useState(false);
  const [failed, setFailed] = React.useState(false);
  const reducedMotion = useReducedMotion();
  const reducedMotionRef = React.useRef(reducedMotion);

  React.useEffect(() => {
    reducedMotionRef.current = reducedMotion;
    sceneRef.current?.setReducedMotion(reducedMotion);
  }, [reducedMotion]);

  React.useEffect(() => {
    sceneRef.current = null;
    let disposed = false;
    let loading = false;
    let visible = false;
    let instance;
    const observer = new IntersectionObserver(async ([entry]) => {
      visible = entry.isIntersecting;
      if (sceneRef.current) sceneRef.current.setActive(visible);
      if (!visible || loading) return;
      loading = true;
      try {
        const { createScene } = await import("./scene");
        if (disposed) return;
        instance = createScene(canvasRef.current, {
          reducedMotion: reducedMotionRef.current,
          onSettled: setSettledQR,
          onFailure: () => { instance?.setActive(false); setFailed(true); },
        });
        sceneRef.current = instance;
        instance.setTarget(targetRef.current);
        instance.setActive(visible);
        setReady(true);
      } catch (error) {
        console.error("Unable to initialize the voxel connection scene:", error);
        if (!disposed) setFailed(true);
      }
    });
    observer.observe(sectionRef.current);
    return () => {
      disposed = true;
      observer.disconnect();
      instance?.dispose();
    };
  }, []);

  function toggle() {
    const next = !targetRef.current;
    targetRef.current = next;
    setTargetQR(next);
    setSettledQR(false);
    sceneRef.current?.setTarget(next);
  }

  return (
    <section className="voxel-connect" id="voxel-connect" ref={sectionRef} aria-labelledby="voxel-connect-title">
      <header className="voxel-connect-heading">
        <h2 id="voxel-connect-title">Stay connected.</h2>
      </header>
      <div className="voxel-connect-stage" data-state={failed ? "fallback" : settledQR ? "qr" : targetQR ? "assembling" : "v"}>
        {!failed && <canvas ref={canvasRef} aria-label="Gold voxel sculpture rearranging between a three-dimensional V and a QR code" role="img" />}
        {settledQR && !failed && <a className="voxel-connect-qr-link" href="/connect" aria-label="Open Vedansh’s contact details" />}
        {failed && <a className="voxel-connect-fallback" href="/connect" aria-label="Open Vedansh’s contact details">
          <img src="/assets/qr.svg" alt="Scan or tap to connect with Vedansh" />
        </a>}
      </div>
      <div className="voxel-connect-controls">
        {!failed && <button type="button" onClick={toggle} disabled={!ready} aria-pressed={targetQR} aria-controls="voxel-connect-status">
          {targetQR ? "BACK" : "CONNECT"}<span aria-hidden="true">{targetQR ? "↶" : "↗"}</span>
        </button>}
        <p id="voxel-connect-status" role="status">
          {failed || settledQR ? "Scan or tap for my contact details." : targetQR ? "" : "One scan. Every way to reach me."}
        </p>
      </div>
    </section>
  );
}
