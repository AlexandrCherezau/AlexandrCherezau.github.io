import type Lenis from "lenis";

/** Module-level handle so dialogs can pause smooth scrolling while they are open. */
let instance: Lenis | null = null;

export const setLenis = (l: Lenis | null) => {
  instance = l;
};

export const pauseScroll = () => instance?.stop();
export const resumeScroll = () => instance?.start();

/** Smooth-scroll to an element and move keyboard focus there (falls back to native behaviour). */
export function scrollToTarget(el: HTMLElement) {
  const focus = () => el.focus({ preventScroll: true });
  if (instance) instance.scrollTo(el, { offset: -64, onComplete: focus });
  else {
    el.scrollIntoView({ block: "start" });
    focus();
  }
}
