import React from "react";
import { playOnce, playWoosh, hoverSrc } from "../audio";
import { mousePos } from "../mousePos";

export function NavDot({ label, targetId }) {
  const ref = React.useRef(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const update = () => {
      const saved = el.style.transform;
      el.style.transform = "none";
      const rect = el.getBoundingClientRect();
      el.style.transform = saved;

      const inside =
        mousePos.x >= rect.left && mousePos.x <= rect.right &&
        mousePos.y >= rect.top  && mousePos.y <= rect.bottom;
      el.classList.toggle("nav-hovered", inside);
    };

    window.addEventListener("pointermove", update, { passive: true });
    return () => window.removeEventListener("pointermove", update);
  }, []);

  function scrollToSection() {
    playWoosh(0.75);
    if (window.location.hash) {
      window.history.replaceState(window.history.state, "", window.location.pathname + window.location.search);
    }
    document.getElementById(targetId)?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
      block: "start",
    });
  }

  return (
    <button type="button" ref={ref} aria-label={label} aria-controls={targetId} onMouseEnter={() => playOnce(hoverSrc, 0.35)} onClick={scrollToSection}>
      {label}
    </button>
  );
}
