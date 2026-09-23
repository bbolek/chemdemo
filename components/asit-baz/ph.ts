/** pH helpers: universal-indicator colors + strong acid / strong base titration math. */

/** Universal indicator color stops for pH 0..14 (slightly pastel-ised). */
const STOPS = [
  "#ff4d6d", // 0
  "#ff5c5c", // 1
  "#ff764f", // 2
  "#ff9442", // 3
  "#ffb43c", // 4
  "#ffd23f", // 5
  "#e2e04c", // 6
  "#7fd66b", // 7
  "#3fc6a3", // 8
  "#40ade0", // 9
  "#5a86ea", // 10
  "#7466e2", // 11
  "#8a55d8", // 12
  "#9a48cb", // 13
  "#a53dba", // 14
];

const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const toHex = (c: number[]) => "#" + c.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");

export function phColor(ph: number): string {
  const p = Math.min(14, Math.max(0, ph));
  const i = Math.min(13, Math.floor(p));
  const t = p - i;
  const a = hex(STOPS[i]);
  const b = hex(STOPS[i + 1]);
  return toHex(a.map((v, k) => v + (b[k] - v) * t));
}

/** Mix a color toward white (0..1) for lighter variants. */
export function lighten(color: string, amt: number): string {
  return toHex(hex(color).map((v) => v + (255 - v) * amt));
}

export const PH_GRADIENT = STOPS.map((c, i) => `${c} ${(i / 14) * 100}%`).join(", ");

export type Kind = "asidik" | "nötr" | "bazik";
export const kindOf = (ph: number): Kind => (ph < 6.9 ? "asidik" : ph > 7.1 ? "bazik" : "nötr");

/**
 * pH of 25 mL 0.1 M HCl after adding `vb` mL 0.1 M NaOH (strong/strong).
 * Uses the charge balance with water autoionisation, so it is smooth through equivalence.
 */
export const ACID_ML = 25;
export const ACID_M = 0.1;
export const BASE_M = 0.1;
export const EQ_ML = (ACID_ML * ACID_M) / BASE_M; // 25 mL

export function titrationPH(vb: number): number {
  const nA = (ACID_M * ACID_ML) / 1000;
  const nB = (BASE_M * vb) / 1000;
  const V = (ACID_ML + vb) / 1000;
  const d = (nA - nB) / V; // net strong acid molarity (negative = excess base)
  const Kw = 1e-14;
  const h = (d + Math.sqrt(d * d + 4 * Kw)) / 2;
  return -Math.log10(h);
}
