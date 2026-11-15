"use client";

import { useEffect, useRef } from "react";

const INTERACTIVE = "a, button, [role='button'], summary, input, label";

/** A small key-shaped cursor that grows over interactive elements. Desktop only. */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = dot.current;
    if (!fine || reduced || !el) return;

    document.documentElement.classList.add("has-cursor");
    let x = -100;
    let y = -100;
    let cx = x;
    let cy = y;
    let raf = 0;
    let shown = false;

    const tick = () => {
      cx += (x - cx) * 0.25;
      cy += (y - cy) * 0.25;
      el.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`;
      // Sleep when the dot has caught up; the next pointermove wakes it.
      raf = Math.abs(x - cx) + Math.abs(y - cy) > 0.2 ? requestAnimationFrame(tick) : 0;
    };
    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!shown) {
        shown = true;
        cx = x;
        cy = y;
        el.style.opacity = "1";
      }
      if (!raf) raf = requestAnimationFrame(tick);
      const target = e.target as Element | null;
      el.dataset.hover = target?.closest(INTERACTIVE) ? "1" : "0";
    };
    const onLeave = () => {
      shown = false;
      el.style.opacity = "0";
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  return (
    <div
      ref={dot}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100] hidden h-4 w-4 rounded-[5px] border-2 border-enter opacity-0 mix-blend-difference transition-[width,height,border-radius,background-color] duration-200 data-[hover='1']:h-10 data-[hover='1']:w-10 data-[hover='1']:rounded-[10px] data-[hover='1']:bg-enter/20 md:block"
    />
  );
}
