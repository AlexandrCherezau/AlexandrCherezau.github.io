"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF, useTexture } from "@react-three/drei";
import {
  ATLAS_COLS,
  ballRadius,
  GLYPH_COUNT,
  STAGGER,
  buildCableGeometry,
  buildKeys,
  clamp01,
  easeOutCubic,
} from "./keyData";
import type { HeroInput } from "./useHeroInput";

const ASSEMBLE_MS = 1700;
const LEGEND_SIZE = 0.6;
const LEGEND_LIFT = 0.004; // the cap top is flat at y=0

interface KeyBallProps {
  url: { glb: string; atlas: string };
  count: number;
  cableSegments: number;
  skipIntro: boolean;
  reducedMotion: boolean;
  input: React.RefObject<HeroInput>;
  onAssembled: () => void;
  onStart: () => void;
}

export function KeyBall({
  url,
  count,
  cableSegments,
  skipIntro,
  reducedMotion,
  input,
  onAssembled,
  onStart,
}: KeyBallProps) {
  const gltf = useGLTF(url.glb, false, true);
  const atlas = useTexture(url.atlas);
  const viewport = useThree((s) => s.viewport);
  const size = useThree((s) => s.size);
  const invalidate = useThree((s) => s.invalidate);

  const keys = useMemo(() => buildKeys(count), [count]);
  const keyGeometry = useMemo(() => {
    let mesh: THREE.Mesh | null = null;
    gltf.scene.traverse((o) => {
      if (!mesh && (o as THREE.Mesh).isMesh) mesh = o as THREE.Mesh;
    });
    if (!mesh) throw new Error("keycap.glb has no mesh");
    const found = mesh as THREE.Mesh;
    // gltf-transform quantizes positions and moves the scale/offset into the node transform: bake it back.
    gltf.scene.updateMatrixWorld(true);
    return found.geometry.clone().applyMatrix4(found.matrixWorld);
  }, [gltf]);
  const radius = ballRadius(count);
  const cableGeometry = useMemo(() => buildCableGeometry(cableSegments, radius), [cableSegments, radius]);
  const legendGeometry = useMemo(
    () => new THREE.PlaneGeometry(LEGEND_SIZE, LEGEND_SIZE).rotateX(-Math.PI / 2),
    [],
  );

  // One texture view per glyph cell; they share the same image upload.
  const legendTextures = useMemo(() => {
    return Array.from({ length: GLYPH_COUNT }, (_, g) => {
      const t = atlas.clone();
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 4;
      t.repeat.set(1 / ATLAS_COLS, 1 / ATLAS_COLS);
      t.offset.set((g % ATLAS_COLS) / ATLAS_COLS, 1 - (Math.floor(g / ATLAS_COLS) + 1) / ATLAS_COLS);
      return t;
    });
  }, [atlas]);

  const glyphGroups = useMemo(() => {
    const groups: number[][] = Array.from({ length: GLYPH_COUNT }, () => []);
    keys.forEach((k, i) => groups[k.glyph].push(i));
    return groups;
  }, [keys]);

  const group = useRef<THREE.Group>(null);
  const bodies = useRef<THREE.InstancedMesh>(null);
  const legends = useRef<(THREE.InstancedMesh | null)[]>([]);
  const cableMat = useRef<THREE.MeshStandardMaterial>(null);
  const state = useRef({
    assemble: skipIntro || reducedMotion ? 1 : 0,
    lastScatter: -1,
    lastAssemble: -1,
    announced: false,
    started: false,
    rotX: 0,
    rotY: 0,
    spin: 0,
  });

  // Colours never change: write them once.
  useEffect(() => {
    const body = bodies.current;
    if (!body) return;
    keys.forEach((k, i) => body.setColorAt(i, k.color));
    if (body.instanceColor) body.instanceColor.needsUpdate = true;
    glyphGroups.forEach((idx, g) => {
      const mesh = legends.current[g];
      if (!mesh) return;
      idx.forEach((ki, j) => mesh.setColorAt(j, keys[ki].legendColor));
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    });
    invalidate();
  }, [keys, glyphGroups, invalidate]);

  useEffect(() => () => keyGeometry.dispose(), [keyGeometry]);
  useEffect(
    () => () => {
      cableGeometry.dispose();
      legendGeometry.dispose();
      legendTextures.forEach((t) => t.dispose());
    },
    [cableGeometry, legendGeometry, legendTextures],
  );

  const tmp = useMemo(
    () => ({
      obj: new THREE.Object3D(),
      pos: new THREE.Vector3(),
      quat: new THREE.Quaternion(),
      twist: new THREE.Quaternion(),
      mat: new THREE.Matrix4(),
      legendLocal: new THREE.Matrix4().makeTranslation(0, LEGEND_LIFT, 0),
      up: new THREE.Vector3(0, 1, 0),
      counters: new Uint16Array(GLYPH_COUNT),
    }),
    [],
  );

  // Compact box (phone): centre the ball and fill the box. Wide hero (desktop): ball right of the copy.
  const compact = size.width / size.height < 1.3;
  const desiredDiameter = compact
    ? Math.min(viewport.width, viewport.height) * 0.84
    : Math.min(viewport.height * 0.7, viewport.width * 0.42);
  const scale = desiredDiameter / ((radius + 0.7) * 2);
  const baseY = compact ? 0 : -viewport.height * 0.04;
  const baseX = compact ? 0 : viewport.width * 0.13;

  useFrame((_, delta) => {
    const s = state.current;
    const g = group.current;
    const body = bodies.current;
    if (!g || !body) return;
    const inp = input.current;
    if (!s.started) {
      s.started = true;
      onStart();
    }
    // Advance by frame delta (clamped) so a hidden tab does not skip the intro.
    if (s.assemble < 1) s.assemble = clamp01(s.assemble + (Math.min(delta, 0.05) * 1000) / ASSEMBLE_MS);
    if (s.assemble >= 1 && !s.announced) {
      s.announced = true;
      onAssembled();
    }

    const scatter = reducedMotion ? 0 : inp.scroll;
    const needsKeys = s.assemble !== s.lastAssemble || Math.abs(scatter - s.lastScatter) > 0.0005;

    if (needsKeys) {
      s.lastAssemble = s.assemble;
      s.lastScatter = scatter;
      const counters = tmp.counters.fill(0);
      for (let i = 0; i < keys.length; i++) {
        const k = keys[i];
        const local = easeOutCubic(clamp01((s.assemble - k.delay) / (1 - STAGGER)));
        const spread = 1 + scatter * k.scatter;
        tmp.pos.copy(k.target).multiplyScalar(spread);
        tmp.pos.lerpVectors(k.start, tmp.pos, local);
        tmp.quat.slerpQuaternions(k.startQuat, k.quat, local);
        if (scatter > 0) {
          tmp.twist.setFromAxisAngle(tmp.up, scatter * k.scatter * 2.4);
          tmp.quat.multiply(tmp.twist);
        }
        tmp.obj.position.copy(tmp.pos);
        tmp.obj.quaternion.copy(tmp.quat);
        tmp.obj.scale.setScalar(local < 0.02 ? 0.0001 : 1);
        tmp.obj.updateMatrix();
        body.setMatrixAt(i, tmp.obj.matrix);
        const legend = legends.current[k.glyph];
        if (legend) {
          tmp.mat.multiplyMatrices(tmp.obj.matrix, tmp.legendLocal);
          legend.setMatrixAt(counters[k.glyph]++, tmp.mat);
        }
      }
      body.instanceMatrix.needsUpdate = true;
      for (let g2 = 0; g2 < legends.current.length; g2++) {
        const m = legends.current[g2];
        if (m) m.instanceMatrix.needsUpdate = true;
      }
      if (cableMat.current) {
        const cableIn = clamp01((s.assemble - 0.55) / 0.45);
        cableMat.current.opacity = cableIn * (1 - clamp01(scatter * 1.6));
        cableMat.current.visible = cableMat.current.opacity > 0.01;
      }
    }

    // Idle spin + pointer / tilt parallax, damped.
    if (!reducedMotion) s.spin += delta * 0.14;
    const targetX = reducedMotion ? 0 : inp.y * 0.32 + scatter * 0.5;
    const targetY = reducedMotion ? 0 : inp.x * 0.45;
    s.rotX = THREE.MathUtils.damp(s.rotX, targetX, 4, delta);
    s.rotY = THREE.MathUtils.damp(s.rotY, targetY, 4, delta);
    g.rotation.set(s.rotX, s.spin + s.rotY, 0);
    g.position.y = baseY + scatter * viewport.height * 0.18;
  });

  return (
    <group ref={group} scale={scale} position={[baseX, baseY, 0]}>
      <mesh>
        <sphereGeometry args={[radius - 0.45, 32, 16]} />
        <meshStandardMaterial color="#0b120f" roughness={0.9} />
      </mesh>
      <instancedMesh ref={bodies} args={[keyGeometry, undefined, keys.length]} frustumCulled={false}>
        <meshStandardMaterial roughness={0.48} metalness={0} />
      </instancedMesh>
      {glyphGroups.map((idx, g) =>
        idx.length ? (
          <instancedMesh
            key={g}
            ref={(m) => {
              legends.current[g] = m;
            }}
            args={[legendGeometry, undefined, idx.length]}
            frustumCulled={false}
          >
            <meshBasicMaterial map={legendTextures[g]} transparent depthWrite={false} toneMapped={false} />
          </instancedMesh>
        ) : null,
      )}
      <mesh geometry={cableGeometry}>
        <meshStandardMaterial
          ref={cableMat}
          color="#f5c542"
          roughness={0.32}
          metalness={0.05}
          transparent
          opacity={skipIntro || reducedMotion ? 1 : 0}
        />
      </mesh>
    </group>
  );
}
