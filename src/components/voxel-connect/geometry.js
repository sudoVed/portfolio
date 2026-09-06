import { QR_ROWS } from "./qr-data.js";

export const MODULE = 0.16;
export const VIEW_SIZE = 7.2;
export const QR_EXTENT = (QR_ROWS.length + 8) * MODULE;
export const smooth = (t) => {
  const x = Math.max(0, Math.min(1, t));
  return x * x * x * (x * (x * 6 - 15) + 10);
};

// Three persistent cubes per lit module: the rear two hide behind the front
// one in QR projection and become the sculpture's substantial depth.
export function createVoxels() {
  const grid = [];
  QR_ROWS.forEach((row, y) => [...row].forEach((value, x) => {
    if (value === "1") {
      for (let z = 0; z < 3; z++) grid.push({ x, y, z });
    }
  }));
  const sculpture = [];
  for (let row = 0; row < 26; row++) {
    const t = row / 25;
    for (const side of [-1, 1]) {
      for (let width = 0; width < 4; width++) {
        for (let depth = 0; depth < 7; depth++) {
          // Twisted, tapering rectangular sections sweep along both arms.
          // Opposing depth curves give the V a different silhouette from each side.
          const twist = side * (t * 0.85 - 0.25);
          const u = (width - 1.5) * 0.175 * (0.75 + t * 0.35);
          const v = (depth - 3) * 0.18 * (0.65 + t * 0.45);
          sculpture.push([
            side * (0.16 + t * 1.56) + u * Math.cos(twist) - v * Math.sin(twist),
            (t - 0.5) * 4.2,
            u * Math.sin(twist) + v * Math.cos(twist) + Math.sin(t * Math.PI * 0.8) * side * 0.5,
          ]);
        }
      }
    }
  }
  // Spatial ordering keeps neighboring pieces traveling in readable ribbons.
  sculpture.sort((a, b) => a[0] - b[0] || b[1] - a[1] || a[2] - b[2]);
  grid.sort((a, b) => a.x - b.x || a.y - b.y || a.z - b.z);
  return grid.map(({ x, y, z }, i) => {
    const seed = Math.sin(i * 127.1 + 31.7) * 43758.5453;
    const noise = seed - Math.floor(seed);
    const home = sculpture[Math.floor(i * sculpture.length / grid.length)];
    return {
      home,
      tilt: Math.sign(home[0]) * ((home[1] / 4.2 + 0.5) * 0.85 - 0.25),
      qr: [(x - 14) * MODULE, (14 - y) * MODULE, -z * MODULE],
      delay: 0.17 * (x / 28) + noise * 0.1,
      fan: [Math.sign(home[0]) * (0.3 + noise * 0.5), (noise - 0.5) * 0.6, 0.65 + noise * 1.3],
      turn: (noise - 0.5) * 1.6,
    };
  });
}

export function voxelPose(voxel, progress) {
  const t = smooth((progress - voxel.delay) / 0.73);
  const arc = t === 0 || t === 1 ? 0 : Math.sin(Math.PI * t);
  return { t, arc };
}
