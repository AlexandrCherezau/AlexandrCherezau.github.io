"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { SceneBoundary } from "./HeroStage";

const HeroStage = dynamic(() => import("./HeroStage").then((m) => m.HeroStage), { ssr: false });

/** Client island for the 3D stage; a failed chunk falls back to nothing rather than breaking the page. */
export function HeroStageSlot() {
  const hero = useRef<HTMLElement | null>(null);
  return (
    <div
      ref={(el) => {
        hero.current = el?.closest("section") ?? null;
      }}
      className="relative z-[1] -mt-4 h-[min(96vw,420px)] lg:absolute lg:inset-0 lg:mt-0 lg:h-auto"
    >
      <SceneBoundary fallback={null}>
        <HeroStage heroRef={hero} />
      </SceneBoundary>
    </div>
  );
}
