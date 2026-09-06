import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createVoxels, MODULE, QR_EXTENT, VIEW_SIZE, voxelPose } from "./geometry.js";
import { QR_ROWS } from "./qr-data.js";

test("QR module data reproduces the supplied SVG, including finder patterns", () => {
  const svg = readFileSync(new URL("../../../public/assets/qr.svg", import.meta.url), "utf8");
  const rows = Array.from({ length: 29 }, () => Array(29).fill("0"));
  for (const match of svg.matchAll(/translate\((\d+),(\d+)\) scale\(4\.12\)/g)) {
    rows[(Number(match[2]) - 48) / 24][(Number(match[1]) - 48) / 24] = "1";
  }
  for (const match of svg.matchAll(/translate\((\d+),(\d+)\)"><g transform="scale\(12\)"><(path|rect)/g)) {
    const x = (Number(match[1]) - 48) / 24;
    const y = (Number(match[2]) - 48) / 24;
    const size = match[3] === "path" ? 7 : 3;
    for (let dy = 0; dy < size; dy++) for (let dx = 0; dx < size; dx++) {
      if (size === 3 || dx === 0 || dy === 0 || dx === 6 || dy === 6) rows[y + dy][x + dx] = "1";
    }
  }
  assert.deepEqual(rows.map(row => row.join("")), QR_ROWS);
});

test("the same distinct cubes cover only source QR modules, three deep", () => {
  const voxels = createVoxels();
  const lit = QR_ROWS.join("").split("1").length - 1;
  assert.equal(voxels.length, lit * 3);
  assert.equal(new Set(voxels.map(voxel => voxel.home.join(","))).size, voxels.length);
  const projection = new Map();
  for (const voxel of voxels) {
    const x = Math.round(voxel.qr[0] / MODULE + 14);
    const y = Math.round(14 - voxel.qr[1] / MODULE);
    assert.equal(QR_ROWS[y][x], "1");
    assert.ok(voxel.qr[2] <= 0);
    const key = `${x},${y}`;
    projection.set(key, (projection.get(key) ?? 0) + 1);
  }
  assert.equal(projection.size, lit);
  assert.ok([...projection.values()].every(count => count === 3));
  assert.ok(QR_EXTENT < VIEW_SIZE);
  assert.equal((QR_EXTENT / MODULE - QR_ROWS.length) / 2, 4);
});

test("both endpoints settle exactly and the travel has stagger and depth", () => {
  const voxels = createVoxels();
  for (const voxel of voxels) {
    assert.equal(voxelPose(voxel, 0).t, 0);
    assert.equal(voxelPose(voxel, 1).t, 1);
    assert.ok(Math.abs(voxelPose(voxel, 1).arc) < 1e-12);
    assert.ok(voxel.fan[2] > 0.6);
  }
  const halfway = voxels.map(voxel => voxelPose(voxel, 0.5).t);
  assert.ok(Math.max(...halfway) - Math.min(...halfway) > 0.3);
  const depths = voxels.map(voxel => voxel.home[2]);
  assert.ok(Math.max(...depths) - Math.min(...depths) > MODULE * 10);
});
