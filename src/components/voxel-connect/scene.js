import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { createVoxels, MODULE, smooth, VIEW_SIZE, voxelPose } from "./geometry";

export function createScene(canvas, { reducedMotion, onSettled, onFailure }) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  // Let the section paint the backdrop, avoiding a separately composited rectangle.
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  const room = new RoomEnvironment();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environment = pmrem.fromScene(room, 0.04);
  scene.environment = environment.texture;
  scene.environmentIntensity = 0.3;
  room.dispose();
  pmrem.dispose();
  const half = VIEW_SIZE / 2;
  const camera = new THREE.OrthographicCamera(-half, half, half, -half, 0.1, 40);
  camera.position.set(0, 0, 12);
  const group = new THREE.Group();
  scene.add(group);
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const gold = new THREE.Color("#c9a84c");
  const material = new THREE.MeshStandardMaterial({
    color: gold, metalness: 0.55, roughness: 0.28, toneMapped: false,
  });
  const qrBlend = { value: 0 };
  material.onBeforeCompile = (shader) => {
    shader.uniforms.qrBlend = qrBlend;
    shader.uniforms.qrGold = { value: gold };
    shader.fragmentShader = `uniform float qrBlend; uniform vec3 qrGold;\n${shader.fragmentShader}`
      .replace("#include <opaque_fragment>", "outgoingLight = mix(outgoingLight, qrGold, qrBlend);\n#include <opaque_fragment>");
  };
  const voxels = createVoxels();
  const mesh = new THREE.InstancedMesh(geometry, material, voxels.length);
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  mesh.frustumCulled = false;
  group.add(mesh);
  scene.add(new THREE.HemisphereLight(0xfff4dc, 0x302510, 0.55));
  for (const [color, intensity, position] of [
    [0xfff2d7, 2.7, [-3, 5, 7]],
    [0xc9a84c, 1.6, [4, 1, -3]],
    [0xe1e5ec, 0.6, [-4, -2, 2]],
  ]) {
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(...position);
    scene.add(light);
  }
  const dummy = new THREE.Object3D();
  let progress = 0;
  let target = 0;
  let velocity = 0;
  let idleTime = 0;
  let active = false;
  let disposed = false;
  let raf = 0;
  let previousTime = 0;
  let reported = 0;
  let lastProgress = -1;

  function draw() {
    const alignment = 1 - smooth(progress / 0.92);
    group.rotation.set(
      (-0.24 + Math.sin(idleTime * 0.23) * 0.09) * alignment,
      (0.55 + Math.sin(idleTime * 0.3) * 0.85) * alignment,
      -0.055 * alignment,
    );
    if (progress !== lastProgress) {
      for (let i = 0; i < voxels.length; i++) {
        const voxel = voxels[i];
        const { t, arc } = voxelPose(voxel, progress);
        dummy.position.set(
          THREE.MathUtils.lerp(voxel.home[0], voxel.qr[0], t) + voxel.fan[0] * arc,
          THREE.MathUtils.lerp(voxel.home[1], voxel.qr[1], t) + voxel.fan[1] * arc,
          THREE.MathUtils.lerp(voxel.home[2], voxel.qr[2], t) + voxel.fan[2] * arc,
        );
        dummy.rotation.set(arc * voxel.turn, (1 - t) * voxel.tilt + arc * voxel.turn * 0.8, arc * voxel.turn * 0.4);
        // Subpixel overlap removes antialiased seams inside solid QR regions.
        dummy.scale.setScalar(MODULE * THREE.MathUtils.lerp(0.92, 1.003, t));
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
      // Remove all lighting, including specular reflections, for exact QR gold.
      qrBlend.value = smooth((progress - 0.55) / 0.45);
      lastProgress = progress;
    }
    renderer.render(scene, camera);
  }

  function tick(time) {
    raf = 0;
    if (disposed || !active || document.hidden) return;
    const dt = previousTime ? Math.min((time - previousTime) / 1000, 0.05) : 0;
    previousTime = time;
    if (progress !== target) {
      if (reducedMotion) progress = target;
      else {
        const desired = Math.sign(target - progress) / 3.4;
        velocity = THREE.MathUtils.damp(velocity, desired, 12, dt);
        progress = THREE.MathUtils.clamp(progress + velocity * dt, 0, 1);
      }
    } else if (progress === 0 && !reducedMotion) idleTime += dt;
    draw();
    if (progress === target && reported !== target) {
      velocity = 0;
      reported = target;
      onSettled(target === 1);
    }
    // A completed QR is a still frame. No perpetual animation loop to scan it.
    if (progress !== target || (target === 0 && !reducedMotion)) raf = requestAnimationFrame(tick);
  }

  function wake() {
    if (active && !document.hidden && !disposed && !raf) {
      previousTime = 0;
      raf = requestAnimationFrame(tick);
    }
  }
  const resize = new ResizeObserver(() => {
    const size = canvas.clientWidth;
    renderer.setSize(size, size, false);
    if (active && !document.hidden) draw();
  });
  resize.observe(canvas);
  function visibility() {
    if (document.hidden) { cancelAnimationFrame(raf); raf = 0; }
    else wake();
  }
  function contextLost(event) {
    event.preventDefault();
    onFailure();
  }
  document.addEventListener("visibilitychange", visibility);
  canvas.addEventListener("webglcontextlost", contextLost);
  return {
    setReducedMotion(value) {
      reducedMotion = value;
      wake();
    },
    setActive(value) {
      active = value;
      if (value) wake();
      else { cancelAnimationFrame(raf); raf = 0; }
    },
    setTarget(qr) {
      target = qr ? 1 : 0;
      reported = -1;
      wake();
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(raf);
      resize.disconnect();
      document.removeEventListener("visibilitychange", visibility);
      canvas.removeEventListener("webglcontextlost", contextLost);
      geometry.dispose();
      material.dispose();
      environment.dispose();
      renderer.dispose();
    },
  };
}
