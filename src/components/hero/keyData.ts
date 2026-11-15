import * as THREE from "three";

export const GLYPH_COUNT = 16;
export const ATLAS_COLS = 4;
/** Centre-to-centre spacing between neighbouring keys (key footprint is 1). */
const KEY_SPACING = 1.17;
export const ballRadius = (count: number) => KEY_SPACING * Math.sqrt(count / (4 * Math.PI));
/** Fraction of the assembly timeline used to stagger keys. */
export const STAGGER = 0.4;

export const KEY_COLORS = {
  cream: new THREE.Color("#ede6d6"),
  pine: new THREE.Color("#2a3b33"),
  enter: new THREE.Color("#f5c542"),
  legendDark: new THREE.Color("#1d2a24"),
  legendLight: new THREE.Color("#ede6d6"),
};

export interface KeyData {
  target: THREE.Vector3;
  quat: THREE.Quaternion;
  start: THREE.Vector3;
  startQuat: THREE.Quaternion;
  delay: number;
  scatter: number;
  color: THREE.Color;
  legendColor: THREE.Color;
  glyph: number;
}

/** Small deterministic PRNG so the ball looks the same on every visit. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const UP = new THREE.Vector3(0, 1, 0);

/** Keys spread over a sphere (Fibonacci lattice), each facing outward with a random twist. */
export function buildKeys(count: number): KeyData[] {
  const radius = ballRadius(count);
  const rand = mulberry32(7);
  const golden = Math.PI * (3 - Math.sqrt(5));
  const keys: KeyData[] = [];
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    const normal = new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r).normalize();
    const twist = new THREE.Quaternion().setFromAxisAngle(UP, (rand() - 0.5) * 0.5);
    const quat = new THREE.Quaternion().setFromUnitVectors(UP, normal).multiply(twist);

    const dir = new THREE.Vector3(rand() - 0.5, rand() - 0.5, rand() * 0.6 + 0.2).normalize();
    const start = dir.multiplyScalar(9 + rand() * 6);
    const startQuat = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(rand() * Math.PI * 2, rand() * Math.PI * 2, rand() * Math.PI * 2),
    );

    const roll = rand();
    const color = roll < 0.09 ? KEY_COLORS.enter : roll < 0.33 ? KEY_COLORS.pine : KEY_COLORS.cream;
    const legendColor = color === KEY_COLORS.pine ? KEY_COLORS.legendLight : KEY_COLORS.legendDark;

    keys.push({
      target: normal.clone().multiplyScalar(radius),
      quat,
      start,
      startQuat,
      delay: rand() * STAGGER,
      scatter: 0.9 + rand() * 1.2,
      color,
      legendColor,
      glyph: i % GLYPH_COUNT,
    });
  }
  return keys;
}

/** A coiled keyboard cable wrapped around the ball. */
export function buildCableGeometry(segments: number, radius: number): THREE.TubeGeometry {
  const pts: THREE.Vector3[] = [];
  const turns = 2.2;
  const steps = 160;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const theta = t * Math.PI * 2 * turns;
    const phi = Math.PI * (0.18 + 0.64 * t);
    const rr = radius + 0.5 + Math.sin(t * Math.PI * 3) * 0.1;
    pts.push(
      new THREE.Vector3(Math.sin(phi) * Math.cos(theta) * rr, Math.cos(phi) * rr, Math.sin(phi) * Math.sin(theta) * rr),
    );
  }
  const spine = new THREE.CatmullRomCurve3(pts);
  const frames = spine.computeFrenetFrames(segments, false);
  const coil = new THREE.Vector3();
  const coilPts: THREE.Vector3[] = [];
  const coils = 110;
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const a = t * Math.PI * 2 * coils;
    const p = spine.getPointAt(t);
    coil
      .copy(frames.normals[i])
      .multiplyScalar(Math.cos(a) * 0.11)
      .addScaledVector(frames.binormals[i], Math.sin(a) * 0.11);
    coilPts.push(p.add(coil));
  }
  const coilCurve = new THREE.CatmullRomCurve3(coilPts);
  return new THREE.TubeGeometry(coilCurve, segments, 0.036, 6, false);
}

export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
