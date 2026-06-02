import React from "react";

export function DieScene({ onReady, dieRef, mappingMode = false }) {
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
      const model = viewer.model;
      const mat0 = model?.materials?.[0];
      if (mat0) {
        mat0.pbrMetallicRoughness?.baseColorTexture?.setTexture(null);
        mat0.pbrMetallicRoughness?.setBaseColorFactor([0.10, 0.05, 0.25, 1.0]);
        mat0.setEmissiveFactor?.([0, 0, 0]);
      }
      const mat1 = model?.materials?.[1];
      if (mat1) {
        mat1.pbrMetallicRoughness?.baseColorTexture?.setTexture(null);
        mat1.pbrMetallicRoughness?.setBaseColorFactor([0.0, 0.0, 0.0, 1.0]);
        mat1.pbrMetallicRoughness?.setMetallicFactor?.(0.0);
        mat1.pbrMetallicRoughness?.setRoughnessFactor?.(0.6);
        mat1.setEmissiveFactor?.([0, 0, 0]);
      }

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
    // react-doctor-disable-next-line react-doctor/exhaustive-deps
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
