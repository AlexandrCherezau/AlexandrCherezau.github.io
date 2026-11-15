"use client";

import dynamic from "next/dynamic";
import { useCallback, useRef, useState } from "react";
import { asset } from "@/lib/assets";
import { SceneBoundary } from "./HeroStage";

const HeroStage = dynamic(() => import("./HeroStage").then((m) => m.HeroStage), { ssr: false });

/**
 * Hero 3D island. The poster is in the server HTML (instant paint, works without JS or WebGL) and fades out
 * once the live scene renders its first frame.
 */
export function HeroStageSlot() {
  const hero = useRef<HTMLElement | null>(null);
  const [live, setLive] = useState(false);
  const onSceneState = useCallback((v: boolean) => setLive(v), []);

  return (
    <div
      ref={(el) => {
        hero.current = el?.closest("section") ?? null;
      }}
      className="relative z-[1] -mt-4 h-[min(96vw,420px)] lg:absolute lg:inset-0 lg:mt-0 lg:h-auto"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset("/poster.webp")}
        srcSet={`${asset("/poster-420.webp")} 420w, ${asset("/poster.webp")} 720w`}
        sizes="(min-width: 1024px) min(70vh, 42vw), min(84vw, 380px)"
        alt=""
        width={720}
        height={720}
        fetchPriority="high"
        className={`pointer-events-none absolute left-1/2 top-1/2 w-[min(84%,380px)] -translate-x-1/2 -translate-y-1/2 select-none transition-opacity duration-500 lg:left-[63%] lg:top-[46%] lg:w-[min(70vh,42vw)] ${
          live ? "opacity-0" : "opacity-100"
        }`}
      />
      <SceneBoundary fallback={null}>
        <HeroStage heroRef={hero} onSceneState={onSceneState} />
      </SceneBoundary>
    </div>
  );
}
