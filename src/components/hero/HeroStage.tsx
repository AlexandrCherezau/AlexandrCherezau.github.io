"use client";

import dynamic from "next/dynamic";
// This module is loaded client-only (ssr: false), so reading window in state initialisers is safe.
import { Component, useCallback, useEffect, useState, type ReactNode } from "react";
import { BASE_PATH, asset } from "@/lib/content";
import { useHeroInput } from "./useHeroInput";

const Scene = dynamic(() => import("./Scene"), { ssr: false });

const PRELOADER_MAX_MS = 2500;
const SEEN_KEY = "pk:assembled";

type WebGLState = "yes" | "no";

function detectWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
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

class SceneBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.warn("3D scene failed, showing poster instead", error);
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function Poster() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={asset("/poster.webp")}
      alt=""
      width={900}
      height={900}
      className="pointer-events-none absolute left-1/2 top-1/2 w-[min(84%,380px)] -translate-x-1/2 -translate-y-1/2 select-none md:left-[63%] md:top-[46%] md:w-[min(70vh,42vw)]"
    />
  );
}

export function HeroStage({ heroRef }: { heroRef: React.RefObject<HTMLElement | null> }) {
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
  const noop = useCallback(() => {}, []);
  const markFailed = useCallback(() => setFailed(true), []);

  const retry = () => {
    setFailed(false);
    setAttempt((a) => a + 1);
  };

  const skipIntro = env.seen || env.reduced;
  const showLoader = webgl !== "no" && !failed && !assembled && !timedOut && !skipIntro;
  const fallback = (
    <>
      <Poster />
      <FailedNotice onRetry={retry} onMount={markFailed} />
    </>
  );

  return (
    <div className="absolute inset-0 z-[1]" aria-hidden={!failed}>
      {webgl === "no" && <Poster />}
      {webgl === "yes" && (
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
            onReady={noop}
          />
        </SceneBoundary>
      )}
      {showLoader && (
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center md:left-[63%] md:top-[46%]">
          <div className="h-display text-[clamp(48px,7vw,96px)] tabular-nums text-cream/90" role="status">
            {String(Math.round(progress)).padStart(2, "0")}
            <span className="sr-only"> процентов загружено</span>
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
    <div className="absolute bottom-2 left-1/2 flex w-[90%] -translate-x-1/2 flex-col items-center gap-3 text-center text-sm text-moss md:bottom-[22%] md:left-[60%] md:w-auto">
      <p>3D не загрузилось. Это не мешает читать сайт.</p>
      <button type="button" onClick={onRetry} className="keybtn keybtn--ghost keybtn--sm">
        Повторить
      </button>
    </div>
  );
}
