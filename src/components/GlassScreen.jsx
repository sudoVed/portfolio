import React from "react";
import { playOnce, startBg, glassSrc } from "../audio";
import { mousePos } from "../mousePos";
import hammerImg from "../../assets/hammer.png";

export function GlassScreen({ introRef, onComplete }) {
  const [playing, setPlaying] = React.useState(false);
  const [ready, setReady] = React.useState(false);
  const [cursor, setCursor] = React.useState({ x: mousePos.x, y: mousePos.y });
  const videoRef = React.useRef(null);
  const isSmall = window.matchMedia("(max-width: 569px)").matches;

  React.useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.readyState >= 4) { setReady(true); return; }
    const onReady = () => setReady(true);
    v.addEventListener("canplaythrough", onReady);
    return () => v.removeEventListener("canplaythrough", onReady);
  }, []);

  const handleMove = (e) => setCursor({ x: e.clientX, y: e.clientY });

  const startPlayback = () => {
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
    <div className="glass-screen" onMouseMove={handleMove} onClick={startPlayback}>
      <video ref={videoRef} src={isSmall ? "/assets/glass-small.mp4" : "/assets/glass.mp4"} className={isSmall ? "glass-vid-small" : "glass-vid"} preload="auto" onEnded={handleEnd} />
      {ready && !playing && (
        <span className="hammer-cursor" style={{ transform: `translate(${cursor.x - 26}px, ${cursor.y - 10}px)` }}>
          <img src={hammerImg} alt="" />
        </span>
      )}
    </div>
  );
}
