"use client";

import { useEffect, useRef } from "react";

export interface HeroInput {
  /** Pointer / tilt, each in [-1, 1]. */
  x: number;
  y: number;
  /** How far the hero has been scrolled away, [0, 1]. */
  scroll: number;
}

const TILT_RANGE_DEG = 25;

/** Collects pointer, device tilt and hero scroll progress into a mutable ref (no re-renders). */
export function useHeroInput(heroRef: React.RefObject<HTMLElement | null>, enabled: boolean) {
  const input = useRef<HeroInput>({ x: 0, y: 0, scroll: 0 });

  useEffect(() => {
    if (!enabled) return;
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      input.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      input.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onTilt = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      const clamp = (v: number) => Math.max(-1, Math.min(1, v));
      input.current.x = clamp(e.gamma / TILT_RANGE_DEG);
      input.current.y = clamp((e.beta - 45) / TILT_RANGE_DEG);
    };
    const onScroll = () => {
      const hero = heroRef.current;
      const h = hero ? hero.offsetHeight : window.innerHeight;
      input.current.scroll = Math.min(1, Math.max(0, window.scrollY / (h * 0.85)));
    };
    onScroll();
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    // iOS needs an explicit permission prompt for tilt; we only listen where it is available freely.
    const DOE = typeof window !== "undefined" ? window.DeviceOrientationEvent : undefined;
    const needsPermission =
      DOE && typeof (DOE as unknown as { requestPermission?: unknown }).requestPermission === "function";
    const tiltOn = !!DOE && !needsPermission && window.matchMedia("(pointer: coarse)").matches;
    if (tiltOn) window.addEventListener("deviceorientation", onTilt, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
      if (tiltOn) window.removeEventListener("deviceorientation", onTilt);
    };
  }, [enabled, heroRef]);

  return input;
}
