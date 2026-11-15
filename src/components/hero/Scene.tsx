"use client";

import { Suspense, memo, useEffect, useMemo } from "react";
import { SCENE_ASSETS } from "@/lib/assets";
import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer, useProgress } from "@react-three/drei";
import { KeyBall } from "./KeyBall";
import type { HeroInput } from "./useHeroInput";

export interface SceneProps {
  active: boolean;
  mobile: boolean;
  skipIntro: boolean;
  reducedMotion: boolean;
  assetVersion: number;
  basePath: string;
  input: React.RefObject<HeroInput>;
  onProgress: (value: number) => void;
  onAssembled: () => void;
  onContextLost: () => void;
}

/** Reports real asset loading progress (GLB + glyph atlas) to the preloader. */
function ProgressReporter({ onProgress }: { onProgress: (v: number) => void }) {
  const progress = useProgress((s) => s.progress);
  useEffect(() => onProgress(progress), [progress, onProgress]);
  return null;
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[-4, 6, 6]} intensity={2.1} color="#fff4e0" />
      <directionalLight position={[5, -2, -4]} intensity={0.9} color="#9fd6c4" />
      {/* Procedural studio environment: no HDR download. */}
      <Environment resolution={128} frames={1} environmentIntensity={0.9}>
        <Lightformer form="rect" intensity={2.2} position={[0, 4, 4]} scale={[8, 2, 1]} color="#fff7e8" />
        <Lightformer form="rect" intensity={1.2} position={[-5, 0, 2]} scale={[2, 6, 1]} color="#f5c542" />
        <Lightformer form="rect" intensity={0.8} position={[5, 1, -2]} scale={[2, 6, 1]} color="#bfe6d8" />
      </Environment>
    </>
  );
}

function Scene(props: SceneProps) {
  const { active, mobile, skipIntro, reducedMotion, assetVersion, basePath, input, onProgress, onAssembled, onContextLost } =
    props;
  const url = useMemo(() => {
    const q = assetVersion ? `?r=${assetVersion}` : "";
    return { glb: `${basePath}${SCENE_ASSETS.glb}${q}`, atlas: `${basePath}${SCENE_ASSETS.atlas}${q}` };
  }, [assetVersion, basePath]);

  return (
    <>
      <ProgressReporter onProgress={onProgress} />
      <Canvas
        frameloop={active ? "always" : "never"}
        dpr={mobile ? [1, 1.5] : [1, 1.75]}
        gl={{ antialias: !mobile, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 11], fov: 35 }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener(
            "webglcontextlost",
            (e) => {
              e.preventDefault();
              onContextLost();
            },
            { once: true },
          );
        }}
        style={{ position: "absolute", inset: 0 }}
        aria-hidden
      >
        <Lights />
        <Suspense fallback={null}>
          <KeyBall
            url={url}
            count={mobile ? 40 : 56}
            cableSegments={mobile ? 700 : 1400}
            skipIntro={skipIntro}
            reducedMotion={reducedMotion}
            input={input}
            onAssembled={onAssembled}
          />
        </Suspense>
      </Canvas>
    </>
  );
}

export default memo(Scene);
