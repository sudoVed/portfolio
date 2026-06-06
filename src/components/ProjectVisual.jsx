import React from "react";

const IMAGE_MAP = {
  robot: "/assets/proj1.png",
  chain: "/assets/proj2.png",
  chat: "/assets/proj3.png",
};

export function ProjectVisual({ type }) {
  const src = IMAGE_MAP[type] ?? "/assets/projdefault.png";
  return (
    <div className="project-visual" aria-hidden="true">
      <img src={src} alt="" />
    </div>
  );
}
