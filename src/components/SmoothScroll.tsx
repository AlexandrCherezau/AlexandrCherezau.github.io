"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/** Lenis smooth scrolling; off for reduced motion and touch-first devices keep native momentum. */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ autoRaf: true, anchors: { offset: -64 }, lerp: 0.11 });
    return () => lenis.destroy();
  }, []);
  return null;
}
