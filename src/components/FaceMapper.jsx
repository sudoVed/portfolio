import React from "react";
import { DieScene } from "./DieScene";

export function FaceMapper() {
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
      <p style={{ margin: 0, color: "#c9a84c", fontFamily: "monospace", fontSize: "0.8rem", letterSpacing: "0.1em" }}>FACE MAPPING MODE: drag the die to a face, click its number</p>

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
            type="button"
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
          type="button"
          onClick={exportMap}
          style={{ padding: "0.6rem 1.4rem", background: "#c9a84c", color: "#0a0a0a", border: 0, borderRadius: "6px", fontFamily: "monospace", fontWeight: 700, cursor: "pointer", fontSize: "0.9rem" }}
        >
          Copy FACE_POSITIONS →
        </button>
      )}

      {done > 0 && done < 20 && (
        <button
          type="button"
          onClick={exportMap}
          style={{ padding: "0.4rem 1rem", background: "transparent", color: "#555", border: "1px solid #333", borderRadius: "6px", fontFamily: "monospace", cursor: "pointer", fontSize: "0.8rem" }}
        >
          Copy partial ({done}/20)
        </button>
      )}
    </div>
  );
}
