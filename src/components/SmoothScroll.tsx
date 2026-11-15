"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { scrollToTarget, setLenis } from "@/lib/scroll";

/**
 * Lenis smooth scrolling (off for reduced motion) plus in-page anchor handling that also moves focus,
 * so the skip link and header links work for keyboard users.
 */
export function SmoothScroll() {
  useEffect(() => {
    const lenis = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? null
      : new Lenis({ autoRaf: true, lerp: 0.11 });
    setLenis(lenis);

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      const id = a?.getAttribute("href")?.slice(1);
      const target = id ? document.getElementById(id) : null;
      if (!target) return;
      e.preventDefault();
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      history.replaceState(null, "", `#${id}`);
      scrollToTarget(target);
    };
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      setLenis(null);
      lenis?.destroy();
    };
  }, []);
  return null;
}
