"use client";

import { useRef, type ReactNode } from "react";

const STRENGTH = 0.28;

/** Pulls its child slightly toward the cursor (fine pointers only, no reduced motion). */
export function Magnetic({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  const allowed = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const onMove = (e: React.PointerEvent<HTMLSpanElement>) => {
    const el = ref.current;
    if (!el || !allowed()) return;
    const r = el.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) * STRENGTH;
    const dy = (e.clientY - (r.top + r.height / 2)) * STRENGTH;
    el.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <span
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`inline-flex transition-transform duration-300 ease-[var(--ease-out-quint)] ${className ?? ""}`}
    >
      {children}
    </span>
  );
}
