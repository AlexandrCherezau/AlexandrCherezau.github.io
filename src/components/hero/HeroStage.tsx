"use client";

import dynamic from "next/dynamic";
// This module is loaded client-only (ssr: false), so reading window in state initialisers is safe.
import { Component, useCallback, useEffect, useState, type ReactNode } from "react";
import { BASE_PATH, SCENE_ASSETS, asset } from "@/lib/assets";
import { useHeroInput } from "./useHeroInput";

const Scene = dynamic(() => import("./Scene"), { ssr: false });

const PRELOADER_MAX_MS = 2500;
const SEEN_KEY = "pk:assembled";

type WebGLState = "yes" | "no";

const SOFTWARE_RENDERER = /swiftshader|llvmpipe|softpipe|software|basic render/i;

/** `?3d=force` keeps the 3D scene even on software rendering (handy for headless QA). */
const force3d = () => new URLSearchParams(window.location.search).get("3d") === "force";

/**
 * WebGL with real GPU acceleration. Software rasterisers (no GPU, e.g. some old phones or headless audits)
 * report a "major performance caveat"; those get the static poster instead of a janky scene.
 */
function detectWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    const opts: WebGLContextAttributes = { failIfMajorPerformanceCaveat: !force3d() };
    const gl = c.getContext("webgl2", opts) ?? c.getContext("webgl", opts);
    if (!gl) return false;
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "";
    // Free the probe context right away: browsers cap the number of live WebGL contexts.
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return force3d() || !SOFTWARE_RENDERER.test(renderer);
  } catch {
    return false;
  }
}

function readSeen(): boolean {
  try {
    return window.localStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

function writeSeen() {
  try {
    window.localStorage.setItem(SEEN_KEY, "1");
  } catch {
    /* storage can be blocked: the intro simply plays again next time */
  }
}

/** next/dynamic caches a rejected chunk import, so only a reload can recover from it. */
let chunkFailed = false;
const isChunkError = (e: unknown) =>
  e instanceof Error && /chunk|dynamically imported module|Importing a module script failed/i.test(`${e.name} ${e.message}`);

export class SceneBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.warn("3D scene failed, showing poster instead", error);
    if (isChunkError(error)) chunkFailed = true;
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}


interface HeroStageProps {
  heroRef: React.RefObject<HTMLElement | null>;
  /** true while the 3D scene is (or will be) visible; false means "show the static poster". */
  onSceneState: (live: boolean) => void;
}

export function HeroStage({ heroRef, onSceneState }: HeroStageProps) {
  const [webgl] = useState<WebGLState>(() => (detectWebGL() ? "yes" : "no"));
  const [env] = useState(() => ({
    mobile: window.matchMedia("(max-width: 767px), (pointer: coarse)").matches,
    reduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    seen: readSeen(),
  }));
  const [progress, setProgress] = useState(0);
  const [assembled, setAssembled] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [active, setActive] = useState(true);
  const [attempt, setAttempt] = useState(0);
  const [failed, setFailed] = useState(false);

  // Warm the HTTP cache for the GLB and atlas while the three.js chunk is still downloading.
  useEffect(() => {
    if (webgl !== "yes") return;
    for (const path of Object.values(SCENE_ASSETS)) fetch(asset(path)).catch(() => undefined);
  }, [webgl]);

  useEffect(() => {
    const t = window.setTimeout(() => setTimedOut(true), PRELOADER_MAX_MS);
    return () => window.clearTimeout(t);
  }, []);

  // Stop rendering when the hero is off-screen or the tab is hidden.
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    let visible = true;
    const update = () => setActive(visible && document.visibilityState === "visible");
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    io.observe(el);
    document.addEventListener("visibilitychange", update);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, [heroRef]);

  const input = useHeroInput(heroRef, webgl === "yes");

  const onAssembled = useCallback(() => {
    setAssembled(true);
    writeSeen();
  }, []);
  const onProgress = useCallback((v: number) => setProgress(v), []);
  const markFailed = useCallback(() => setFailed(true), []);
  const onStart = useCallback(() => onSceneState(true), [onSceneState]);

  // Poster is server-rendered; bring it back whenever the scene is unavailable.
  useEffect(() => {
    if (webgl === "no" || failed) onSceneState(false);
  }, [webgl, failed, onSceneState]);

  const retry = () => {
    if (chunkFailed) {
      window.location.reload();
      return;
    }
    setFailed(false);
    setAttempt((a) => a + 1);
    // The retry button unmounts with the old scene: keep keyboard focus on the hero.
    heroRef.current?.focus({ preventScroll: true });
  };

  const skipIntro = env.seen || env.reduced;
  const showLoader = webgl !== "no" && !failed && !assembled && !timedOut && !skipIntro;
  const fallback = <FailedNotice onRetry={retry} onMount={markFailed} />;

  return (
    <div className="absolute inset-0 z-[1]">
      {webgl === "yes" && failed && fallback}
      {webgl === "yes" && !failed && (
        <SceneBoundary key={attempt} fallback={fallback}>
          <Scene
            active={active}
            mobile={env.mobile}
            skipIntro={skipIntro}
            reducedMotion={env.reduced}
            assetVersion={attempt}
            basePath={BASE_PATH}
            input={input}
            onProgress={onProgress}
            onAssembled={onAssembled}
            onContextLost={markFailed}
            onStart={onStart}
          />
        </SceneBoundary>
      )}
      {showLoader && (
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center lg:left-[63%] lg:top-[46%]">
          <div className="h-display text-[clamp(48px,7vw,96px)] tabular-nums text-cream/90" aria-hidden>
            {String(Math.round(progress)).padStart(2, "0")}
          </div>
          <div className="mt-2 text-sm text-moss">собираю клавиши</div>
        </div>
      )}
    </div>
  );
}

function FailedNotice({ onRetry, onMount }: { onRetry: () => void; onMount: () => void }) {
  useEffect(onMount, [onMount]);
  return (
    <div className="absolute bottom-2 left-1/2 flex w-[90%] -translate-x-1/2 flex-col items-center gap-3 text-center text-sm text-moss lg:bottom-[22%] lg:left-[60%] lg:w-auto">
      <p>3D не загрузилось. Это не мешает читать сайт.</p>
      <button type="button" onClick={onRetry} className="keybtn keybtn--ghost keybtn--sm">
        Повторить
      </button>
    </div>
  );
}
