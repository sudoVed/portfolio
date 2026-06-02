import React from "react";

const KNOWN_VISUALS = new Set(["robot", "chain", "chat"]);

export function ProjectVisual({ type }) {
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
