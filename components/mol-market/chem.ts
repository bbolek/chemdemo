export type El = "H" | "C" | "N" | "O" | "Na" | "Mg" | "S" | "Cl" | "Ca" | "Fe";

export interface ElementInfo {
  sym: El;
  name: string;
  /** MEB ders kitabı yuvarlanmış atom kütlesi (g/mol) */
  mass: number;
  color: string;
  deep: string;
}

export const ELEMENTS: ElementInfo[] = [
  { sym: "H", name: "Hidrojen", mass: 1, color: "#d6ecff", deep: "#8cc8ff" },
  { sym: "C", name: "Karbon", mass: 12, color: "#e4dff0", deep: "#9b90b8" },
  { sym: "N", name: "Azot", mass: 14, color: "#d4f5e9", deep: "#7fdcb8" },
  { sym: "O", name: "Oksijen", mass: 16, color: "#ffd6e0", deep: "#ff9ebb" },
  { sym: "Na", name: "Sodyum", mass: 23, color: "#fff5b8", deep: "#ffe066" },
  { sym: "Mg", name: "Magnezyum", mass: 24, color: "#e9f7cf", deep: "#b9e37a" },
  { sym: "S", name: "Kükürt", mass: 32, color: "#fff0a0", deep: "#f5cf3a" },
  { sym: "Cl", name: "Klor", mass: 35.5, color: "#dcf7c4", deep: "#9fd97a" },
  { sym: "Ca", name: "Kalsiyum", mass: 40, color: "#ffe5cc", deep: "#ffb88a" },
  { sym: "Fe", name: "Demir", mass: 56, color: "#f6d6c8", deep: "#e0967a" },
];

export const EL: Record<El, ElementInfo> = Object.fromEntries(ELEMENTS.map((e) => [e.sym, e])) as Record<El, ElementInfo>;

/** Türkçe ondalık gösterim: 29.25 -> "29,25" */
export function fmt(x: number, digits = 3): string {
  const f = 10 ** digits;
  const r = Math.round(x * f) / f;
  return String(r).replace(".", ",");
}

/** Tanecik sayısını 10²³ katsayısıyla yazar: 1.204e24 -> "12,04·10²³" */
export function fmtN(x: number): string {
  return `${fmt(x / 1e23)}·10²³`;
}

export const NA = 6.02e23;
