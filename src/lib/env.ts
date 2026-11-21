/** Evaluated once at load  this is a client-only SPA. */
export const REDUCED_MOTION =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** True on devices with a mouse-like pointer (enables custom cursor, tilt, magnetic effects). */
export const FINE_POINTER =
  typeof window !== "undefined" &&
  window.matchMedia("(hover:hover) and (pointer:fine)").matches;
