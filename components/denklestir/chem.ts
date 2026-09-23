/** Formula parsing + balancing logic for "Denkleştir Bakalım!" */

export type Counts = Record<string, number>;

/** Parse a formula like "Ca(OH)2", "Al2O3", "C3H8" into element counts. */
export function parseFormula(formula: string): Counts {
  let i = 0;
  const parseGroup = (): Counts => {
    const out: Counts = {};
    while (i < formula.length) {
      const ch = formula[i];
      if (ch === "(") {
        i++;
        const inner = parseGroup();
        const n = readNumber();
        for (const [el, c] of Object.entries(inner)) out[el] = (out[el] ?? 0) + c * n;
      } else if (ch === ")") {
        i++;
        return out;
      } else if (/[A-Z]/.test(ch)) {
        let el = ch;
        i++;
        while (i < formula.length && /[a-z]/.test(formula[i])) el += formula[i++];
        const n = readNumber();
        out[el] = (out[el] ?? 0) + n;
      } else {
        throw new Error(`Bad formula: ${formula}`);
      }
    }
    return out;
  };
  const readNumber = () => {
    let s = "";
    while (i < formula.length && /[0-9]/.test(formula[i])) s += formula[i++];
    return s ? parseInt(s, 10) : 1;
  };
  return parseGroup();
}

/** Elements in order of first appearance in a list of formulas. */
export function elementOrder(formulas: string[]): string[] {
  const seen: string[] = [];
  for (const f of formulas) for (const m of f.matchAll(/[A-Z][a-z]?/g)) if (!seen.includes(m[0])) seen.push(m[0]);
  return seen;
}

export function sideCounts(formulas: string[], coefs: number[]): Counts {
  const out: Counts = {};
  formulas.forEach((f, k) => {
    for (const [el, c] of Object.entries(parseFormula(f))) out[el] = (out[el] ?? 0) + c * coefs[k];
  });
  return out;
}

export const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));
export const gcdAll = (xs: number[]) => xs.reduce((g, x) => gcd(g, x), 0);

export const ATOMIC_MASS: Record<string, number> = {
  H: 1, C: 12, N: 14, O: 16, Na: 23, Mg: 24, Al: 27, Cl: 35.5, K: 39, Ca: 40, Fe: 56,
};

export interface Level {
  id: number;
  left: string[];
  right: string[];
  /** Correct smallest-integer coefficients (left then right) */
  solution: number[];
  name: string;
  hint: string;
  boss?: boolean;
}

export interface CheckResult {
  left: Counts;
  right: Counts;
  elements: string[];
  /** every element equal on both sides */
  equal: boolean;
  /** equal AND gcd == 1 */
  solved: boolean;
  massL: number;
  massR: number;
}

export function check(level: Level, coefs: number[]): CheckResult {
  const nL = level.left.length;
  const left = sideCounts(level.left, coefs.slice(0, nL));
  const right = sideCounts(level.right, coefs.slice(nL));
  const elements = elementOrder([...level.left, ...level.right]);
  const equal = elements.every((e) => (left[e] ?? 0) === (right[e] ?? 0));
  const solved = equal && coefs.every((c) => c >= 1) && gcdAll(coefs) === 1;
  const mass = (c: Counts) => Object.entries(c).reduce((s, [el, n]) => s + (ATOMIC_MASS[el] ?? 10) * n, 0);
  return { left, right, elements, equal, solved, massL: mass(left), massR: mass(right) };
}

/** Minimum number of +/- clicks from all-ones to the solution. */
export const minMoves = (lv: Level) => lv.solution.reduce((s, c) => s + (c - 1), 0);

export function starsFor(lv: Level, moves: number, hintUsed: boolean) {
  const min = minMoves(lv);
  let s = moves <= min ? 3 : moves <= min + 4 ? 2 : 1;
  if (hintUsed) s = Math.min(s, 2);
  return s;
}

export const LEVELS: Level[] = [
  {
    id: 1,
    name: "Su Damlası",
    left: ["H2", "O2"],
    right: ["H2O"],
    solution: [2, 1, 2],
    hint: "Solda 2 O var, sağda 1. Önce H₂O'nun katsayısını 2 yap, sonra H'leri say!",
  },
  {
    id: 2,
    name: "Sofra Tuzu",
    left: ["Na", "Cl2"],
    right: ["NaCl"],
    solution: [2, 1, 2],
    hint: "Cl₂'de 2 klor var. NaCl'den 2 tane yaparsan kaç Na gerekir?",
  },
  {
    id: 3,
    name: "Parlak Magnezyum",
    left: ["Mg", "O2"],
    right: ["MgO"],
    solution: [2, 1, 2],
    hint: "O₂ molekülünde 2 oksijen var, MgO'da sadece 1. MgO'yu çoğalt, sonra Mg'yi eşitle.",
  },
  {
    id: 4,
    name: "Amonyak Fabrikası",
    left: ["N2", "H2"],
    right: ["NH3"],
    solution: [1, 3, 2],
    hint: "Azotla başla: N₂'de 2 N var → 2 NH₃ lazım. Şimdi sağda 6 H oldu; H₂'den kaç tane gerekir?",
  },
  {
    id: 5,
    name: "Oksijen Balonu",
    left: ["KClO3"],
    right: ["KCl", "O2"],
    solution: [2, 2, 3],
    hint: "Solda 3 O (tek sayı), sağda O₂ (çift). KClO₃'ün önüne 2 yazarak O'yu çift yap: 6 O → 3 O₂.",
  },
  {
    id: 6,
    name: "Doğal Gaz Ocağı",
    left: ["CH4", "O2"],
    right: ["CO2", "H2O"],
    solution: [1, 2, 1, 2],
    hint: "En karmaşık molekül CH₄. 1 C → 1 CO₂; 4 H → 2 H₂O. Oksijeni en sona bırak!",
  },
  {
    id: 7,
    name: "Kireç Suyu",
    left: ["Ca(OH)2", "HCl"],
    right: ["CaCl2", "H2O"],
    solution: [1, 2, 1, 2],
    hint: "Parantez dikkat! Ca(OH)₂ = 1 Ca, 2 O, 2 H. CaCl₂'de 2 Cl var → HCl'den 2 tane lazım.",
  },
  {
    id: 8,
    name: "Alüminyum Folyo",
    left: ["Al", "O2"],
    right: ["Al2O3"],
    solution: [4, 3, 2],
    hint: "O sayıları 2 ve 3. İkisinin ortak katı 6! 3 O₂ → 6 O → 2 Al₂O₃. Sonra Al'ı say.",
  },
  {
    id: 9,
    name: "Paslı Çivi",
    left: ["Fe", "O2"],
    right: ["Fe2O3"],
    solution: [4, 3, 2],
    hint: "Tıpkı alüminyum gibi! Oksijen için 2 ve 3'ün ortak katı 6'yı hedefle.",
  },
  {
    id: 10,
    name: "Mangal Tüpü",
    left: ["C3H8", "O2"],
    right: ["CO2", "H2O"],
    solution: [1, 5, 3, 4],
    hint: "C₃H₈ ile başla: 3 C → 3 CO₂; 8 H → 4 H₂O. Sağdaki O'ları topla (6 + 4 = 10) → kaç O₂?",
    boss: true,
  },
];

/** "H2O" -> "H₂O" */
export function pretty(formula: string) {
  const sub = "₀₁₂₃₄₅₆₇₈₉";
  return formula.replace(/[0-9]/g, (d) => sub[+d]);
}
