import React from "react";
import * as THREE from "three";
import { useReducedMotion } from "../hooks/useReducedMotion";

export function SpatialScene({ activeProject }) {
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
    for (let i = 0; i < TOTAL; i++) if (i % 7 === 0) accentCount++;
    const regularInst = new THREE.InstancedMesh(sharedGeo, fragmentMaterial, TOTAL - accentCount);
    const accentInst  = new THREE.InstancedMesh(sharedGeo, accentMaterial, accentCount);
    regularInst.frustumCulled = false;
    accentInst.frustumCulled  = false;
    group.add(regularInst);
    group.add(accentInst);

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

        const depth = (homeZ[i] + 22) / 22;

        if (!reducedMotion) {
          const t = scroll * (1 + depth * 0.7);
          const angleOffset = homeX[i] * 0.07 + homeY[i] * 0.05;
          const angle = t * Math.PI * 3.5 + angleOffset;
          const r = t * (4 + depth * 13);
          const nudge = Math.sin(homeX[i] * 0.55 + homeZ[i] * 0.28) * scroll * 3;
          const bob   = Math.sin(now * 0.0003 + i) * 0.15;

          const stx = homeX[i] + Math.cos(angle) * r + Math.cos(angle + 1.57) * nudge;
          const sty = homeY[i] + Math.sin(angle) * r * 0.65 + Math.sin(angle + 1.57) * nudge * 0.5 + bob;

          curX[i] += (stx - curX[i]) * 0.12;
          curY[i] += (sty - curY[i]) * 0.12;
        }

        const tz = homeZ[i] + scroll * depth * 6;
        const scaleMult = 1 + (tz - homeZ[i]) * 0.18;
        dummy.position.set(curX[i], curY[i], tz);
        dummy.rotation.set(rotX[i], rotY[i], 0);
        dummy.scale.setScalar(scl[i] * scaleMult);
        dummy.updateMatrix();

        if (i % 7 === 0) accentInst.setMatrixAt(accIdx++, dummy.matrix);
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
