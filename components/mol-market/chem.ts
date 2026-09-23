import type { Lang, Localized } from "@/lib/i18n";

export type El = "H" | "C" | "N" | "O" | "Na" | "Mg" | "S" | "Cl" | "Ca" | "Fe";

export interface ElementInfo {
  sym: El;
  name: Localized<string>;
  /** MEB ders kitabı yuvarlanmış atom kütlesi (g/mol) */
  mass: number;
  color: string;
  deep: string;
}

export const ELEMENTS: ElementInfo[] = [
  { sym: "H", name: { tr: "Hidrojen", en: "Hydrogen" }, mass: 1, color: "#d6ecff", deep: "#8cc8ff" },
  { sym: "C", name: { tr: "Karbon", en: "Carbon" }, mass: 12, color: "#e4dff0", deep: "#9b90b8" },
  { sym: "N", name: { tr: "Azot", en: "Nitrogen" }, mass: 14, color: "#d4f5e9", deep: "#7fdcb8" },
  { sym: "O", name: { tr: "Oksijen", en: "Oxygen" }, mass: 16, color: "#ffd6e0", deep: "#ff9ebb" },
  { sym: "Na", name: { tr: "Sodyum", en: "Sodium" }, mass: 23, color: "#fff5b8", deep: "#ffe066" },
  { sym: "Mg", name: { tr: "Magnezyum", en: "Magnesium" }, mass: 24, color: "#e9f7cf", deep: "#b9e37a" },
  { sym: "S", name: { tr: "Kükürt", en: "Sulfur" }, mass: 32, color: "#fff0a0", deep: "#f5cf3a" },
  { sym: "Cl", name: { tr: "Klor", en: "Chlorine" }, mass: 35.5, color: "#dcf7c4", deep: "#9fd97a" },
  { sym: "Ca", name: { tr: "Kalsiyum", en: "Calcium" }, mass: 40, color: "#ffe5cc", deep: "#ffb88a" },
  { sym: "Fe", name: { tr: "Demir", en: "Iron" }, mass: 56, color: "#f6d6c8", deep: "#e0967a" },
];

export const EL: Record<El, ElementInfo> = Object.fromEntries(ELEMENTS.map((e) => [e.sym, e])) as Record<El, ElementInfo>;

/** Language-aware decimal: 29.25 -> "29,25" (tr) / "29.25" (en) */
export function fmt(x: number, lang: Lang, digits = 3): string {
  const f = 10 ** digits;
  const r = Math.round(x * f) / f;
  const s = String(r);
  return lang === "tr" ? s.replace(".", ",") : s;
}

/** Particle count with a 10²³ coefficient: 1.204e24 -> "12,04·10²³" (tr) / "12.04×10²³" (en) */
export function fmtN(x: number, lang: Lang): string {
  return `${fmt(x / 1e23, lang)}${lang === "tr" ? "·" : "×"}10²³`;
}

/** Parses a typed decimal; "," and "." are both accepted as the separator. */
export function parseDec(s: string): number {
  return Number(s.replace(",", "."));
}

/** Shorthand for a bilingual string. */
export const L = (tr: string, en: string): Localized<string> => ({ tr, en });

export const NA = 6.02e23;
