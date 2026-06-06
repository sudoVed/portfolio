import React from "react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { playOnce, playWoosh, hoverSrc } from "../audio";
import { mousePos } from "../mousePos";
import { ProjectVisual } from "./ProjectVisual";

export function ProjectPanel({ project, index, onActive }) {
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
    >
      <div className="project-copy">
        <p className="project-index">0{index + 1}</p>
        <h3>{project.title}</h3>
        {project.descriptor && <p className="project-descriptor">{project.descriptor}</p>}
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
          <a className="project-link" href={project.href} target="_blank" rel="noreferrer" aria-label={`${project.title} repository`} onMouseEnter={() => playOnce(hoverSrc, 0.35)} onClick={() => playWoosh(0.75)}>
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
