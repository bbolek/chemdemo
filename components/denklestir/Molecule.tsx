"use client";

import { parseFormula } from "./chem";

/** Pastel CPK-ish palette: [main, shade] */
export const ELEMENT_COLORS: Record<string, [string, string]> = {
  H: ["#ffffff", "#c9c3dc"],
  O: ["#ff8f9e", "#e0607a"],
  N: ["#8cb8ff", "#5f8ee0"],
  C: ["#9a93ad", "#6f6885"],
  Na: ["#c7a8ff", "#9b78e6"],
  K: ["#e0a8ff", "#b477e0"],
  Cl: ["#a8ec8c", "#72c85a"],
  Mg: ["#8fe3c7", "#55bd9c"],
  Al: ["#d3d9e8", "#9ea8c2"],
  Fe: ["#ffb57a", "#e38a4a"],
  Ca: ["#ffe27a", "#e6b93f"],
};

export const ELEMENT_NAMES: Record<string, string> = {
  H: "Hidrojen",
  O: "Oksijen",
  N: "Azot",
  C: "Karbon",
  Na: "Sodyum",
  K: "Potasyum",
  Cl: "Klor",
  Mg: "Magnezyum",
  Al: "Alüminyum",
  Fe: "Demir",
  Ca: "Kalsiyum",
};

const RADIUS: Record<string, number> = { H: 0.62, O: 0.95, N: 0.95, C: 0.95, Cl: 1.1, Na: 1.2, K: 1.3, Mg: 1.1, Al: 1.1, Fe: 1.15, Ca: 1.25 };
const rad = (el: string) => RADIUS[el] ?? 1;

type A = [el: string, x: number, y: number, z?: number];

/** Hand-placed cute 2.5D layouts for the formulas used in the game. */
const LAYOUTS: Record<string, A[]> = {
  H2: [["H", -0.45, 0], ["H", 0.45, 0, 1]],
  O2: [["O", -0.65, 0], ["O", 0.65, 0, 1]],
  N2: [["N", -0.65, 0], ["N", 0.65, 0, 1]],
  Cl2: [["Cl", -0.8, 0], ["Cl", 0.8, 0, 1]],
  H2O: [["O", 0, -0.15], ["H", -0.85, 0.55, 1], ["H", 0.85, 0.55, 1]],
  H2O2: [["H", -1.5, 0.6, 1], ["O", -0.6, 0], ["O", 0.6, 0.1, 1], ["H", 1.5, -0.5]],
  NH3: [["H", 0, -0.95, -1], ["N", 0, 0], ["H", -0.9, 0.55, 1], ["H", 0.9, 0.55, 1]],
  NaCl: [["Na", -0.85, 0], ["Cl", 0.9, 0.05, 1]],
  KCl: [["K", -0.95, 0], ["Cl", 0.95, 0.05, 1]],
  MgO: [["Mg", -0.75, 0], ["O", 0.8, 0.05, 1]],
  HCl: [["Cl", 0.35, 0], ["H", -0.85, 0.1, 1]],
  CH4: [["H", 0, -0.95, -1], ["C", 0, 0], ["H", -0.95, 0.35, 1], ["H", 0.95, 0.35, 1], ["H", 0, 0.9, 2]],
  CO2: [["O", -1.25, 0], ["C", 0, 0, 1], ["O", 1.25, 0, 2]],
  KClO3: [["K", -2.1, 0.2], ["O", 0.55, -1.05, -1], ["Cl", 0.55, 0], ["O", -0.4, 0.75, 1], ["O", 1.55, 0.6, 1]],
  Al2O3: [["Al", -0.95, -0.4], ["Al", 0.95, -0.4], ["O", -1.85, 0.45, 1], ["O", 0, 0.45, 1], ["O", 1.85, 0.45, 1]],
  Fe2O3: [["Fe", -0.95, -0.4], ["Fe", 0.95, -0.4], ["O", -1.9, 0.45, 1], ["O", 0, 0.45, 1], ["O", 1.9, 0.45, 1]],
  "Ca(OH)2": [["H", -2.55, -0.55, -1], ["H", 2.55, -0.55, -1], ["O", -1.75, 0], ["O", 1.75, 0], ["Ca", 0, 0, 1]],
  CaCl2: [["Cl", -1.85, 0], ["Cl", 1.85, 0], ["Ca", 0, 0, 1]],
  C3H8: [
    ["H", -1.55, -1.0, -1], ["H", 0, -1.15, -1], ["H", 1.55, -1.0, -1],
    ["C", -1.2, 0], ["C", 0, -0.35], ["C", 1.2, 0],
    ["H", -2.15, 0.35, 1], ["H", 2.15, 0.35, 1],
    ["H", -1.2, 0.95, 2], ["H", 0, 0.6, 2], ["H", 1.2, 0.95, 2],
  ],
};

function genericLayout(formula: string): A[] {
  const counts = parseFormula(formula);
  const atoms = Object.entries(counts).flatMap(([el, n]) => Array.from({ length: n }, () => el));
  if (atoms.length === 1) return [[atoms[0], 0, 0]];
  const step = 1.3;
  return atoms.map((el, k) => [el, (k - (atoms.length - 1) / 2) * step, k % 2 ? 0.4 : -0.2, k % 2]);
}

export function layoutFor(formula: string): A[] {
  return LAYOUTS[formula] ?? genericLayout(formula);
}

/** Width of a molecule in layout units. */
export function moleculeWidth(formula: string) {
  const atoms = layoutFor(formula);
  return Math.max(...atoms.map(([el, x]) => x + rad(el))) - Math.min(...atoms.map(([el, x]) => x - rad(el))) + 0.3;
}

/** One shiny pseudo-3D atom ball drawn at (x, y) with radius r (SVG user units). */
export function Ball({ el, x, y, r, label = true }: { el: string; x: number; y: number; r: number; label?: boolean }) {
  const [main, shade] = ELEMENT_COLORS[el] ?? ["#eee", "#bbb"];
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={shade} stroke="#4a4063" strokeWidth={r * 0.1} />
      <circle cx={x - r * 0.12} cy={y - r * 0.14} r={r * 0.78} fill={main} />
      <ellipse cx={x - r * 0.35} cy={y - r * 0.42} rx={r * 0.28} ry={r * 0.17} fill="white" opacity={0.85} transform={`rotate(-30 ${x - r * 0.35} ${y - r * 0.42})`} />
      {label && (
        <text
          x={x - r * 0.08}
          y={y + r * 0.02}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={r * (el.length > 1 ? 0.8 : 0.95)}
          fontWeight={800}
          fill="#4a4063"
          style={{ fontFamily: "var(--font-baloo), sans-serif" }}
        >
          {el}
        </text>
      )}
    </g>
  );
}

/** A molecule rendered as clustered balls. `unit` = px per layout unit. */
export default function Molecule({ formula, unit = 14, label = true, className = "" }: { formula: string; unit?: number; label?: boolean; className?: string }) {
  const atoms = layoutFor(formula);
  const pad = 0.15;
  const minX = Math.min(...atoms.map(([el, x]) => x - rad(el))) - pad;
  const maxX = Math.max(...atoms.map(([el, x]) => x + rad(el))) + pad;
  const minY = Math.min(...atoms.map(([el, , y]) => y - rad(el))) - pad;
  const maxY = Math.max(...atoms.map(([el, , y]) => y + rad(el))) + pad;
  const w = maxX - minX;
  const h = maxY - minY;
  const sorted = [...atoms].sort((a, b) => (a[3] ?? 0) - (b[3] ?? 0));
  return (
    <svg viewBox={`${minX} ${minY} ${w} ${h}`} width={w * unit} height={h * unit} className={className} aria-label={formula} role="img">
      {sorted.map(([el, x, y], k) => (
        <Ball key={k} el={el} x={x} y={y} r={rad(el)} label={label} />
      ))}
    </svg>
  );
}
