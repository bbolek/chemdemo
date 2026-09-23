"use client";

import confetti from "canvas-confetti";

const PASTELS = ["#ff9ebb", "#ffb88a", "#ffe066", "#7fdcb8", "#8cc8ff", "#b69cff"];

/** Big celebration burst from both sides. */
export function celebrate() {
  const opts = { particleCount: 70, spread: 70, colors: PASTELS, scalar: 1.1 };
  confetti({ ...opts, angle: 60, origin: { x: 0, y: 0.7 } });
  confetti({ ...opts, angle: 120, origin: { x: 1, y: 0.7 } });
}

/** Small burst at a screen point (x, y in 0..1). */
export function sparkle(x = 0.5, y = 0.5) {
  confetti({ particleCount: 30, spread: 55, startVelocity: 25, colors: PASTELS, origin: { x, y }, scalar: 0.8, shapes: ["circle"] });
}

/** Burst at a DOM element's center. */
export function sparkleAt(el: Element | null) {
  if (!el) return sparkle();
  const r = el.getBoundingClientRect();
  sparkle((r.left + r.width / 2) / window.innerWidth, (r.top + r.height / 2) / window.innerHeight);
}
