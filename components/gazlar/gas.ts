"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Lang, Localized } from "@/lib/i18n";

/** İdeal gaz sabiti (L·atm / mol·K) */
export const R = 0.082;
export const VMIN = 1;
export const VMAX = 12;
export const TMIN = 100;
export const TMAX = 700;
/** Her kedi tanecik 0,1 mol gazı temsil eder */
export const MOL_PER_CAT = 0.1;
export const CAT_MIN = 1;
export const CAT_MAX = 30;

export type GasMode = "serbest" | "boyle" | "charles" | "gaylussac" | "avogadro";

export interface Locks {
  T: boolean;
  n: boolean;
  V: boolean;
  /** true → piston serbest, basınç sabit; hacim kendiliğinden ayarlanır */
  pFixed: boolean;
}

export const MODE_LOCKS: Record<GasMode, Locks> = {
  serbest: { T: false, n: false, V: false, pFixed: false },
  boyle: { T: true, n: true, V: false, pFixed: false },
  charles: { T: false, n: true, V: true, pFixed: true },
  gaylussac: { T: false, n: true, V: true, pFixed: false },
  avogadro: { T: true, n: false, V: true, pFixed: true },
};

export interface ModeInfo {
  key: GasMode;
  name: Localized<string>;
  short: Localized<string>;
  emoji: string;
  constant: Localized<string>;
  formula: Localized<string>;
  idea: Localized<string>;
  example: Localized<string>;
  color: string;
}

export const MODES: ModeInfo[] = [
  {
    key: "serbest",
    name: { tr: "Serbest Oyun", en: "Free Play", de: "Freies Spiel" },
    short: { tr: "Serbest", en: "Free", de: "Frei" },
    emoji: "🎈",
    constant: { tr: "Her şey serbest", en: "Everything can change", de: "Alles darf sich ändern" },
    formula: { tr: "P·V = n·R·T", en: "P·V = n·R·T", de: "P·V = n·R·T" },
    idea: {
      tr: "Pistonu it, kutuyu ısıt, kedi ekle! Hepsi ideal gaz denklemine uyar.",
      en: "Push the piston, heat the box, add cats! Everything obeys the ideal gas equation.",
      de: "Drück den Kolben, heiz die Box auf, füg Katzen hinzu! Alles gehorcht dem idealen Gasgesetz.",
    },
    example: {
      tr: "Düdüklü tencere: hacim sabit, ısı artar → basınç artar, yemek daha çabuk pişer.",
      en: "Pressure cooker: volume stays fixed, heat goes up → pressure goes up, and food cooks faster.",
      de: "Schnellkochtopf: Das Volumen bleibt gleich, die Temperatur steigt → der Druck steigt und das Essen wird schneller gar.",
    },
    color: "bg-lavender",
  },
  {
    key: "boyle",
    name: { tr: "Boyle Yasası", en: "Boyle's Law", de: "Gesetz von Boyle-Mariotte" },
    short: { tr: "Boyle", en: "Boyle", de: "Boyle" },
    emoji: "🤏",
    constant: { tr: "T ve n sabit", en: "T and n constant", de: "T und n konstant" },
    formula: { tr: "P·V = sabit", en: "P·V = constant", de: "P·V = konstant" },
    idea: {
      tr: "Hacmi küçült → kediler duvarlara daha sık çarpar → basınç artar. Hacim yarıya inerse basınç 2 katına çıkar.",
      en: "Shrink the volume → the cats hit the walls more often → pressure rises. Halve the volume and the pressure doubles.",
      de: "Verkleinere das Volumen → die Katzen prallen öfter gegen die Wände → der Druck steigt. Halbes Volumen, doppelter Druck!",
    },
    example: {
      tr: "Bisiklet pompası ve dalgıç: derine inildikçe basınç artar, hava kabarcıkları küçülür; yüzeye çıkarken büyür.",
      en: "Bike pumps and divers: the deeper you go, the higher the pressure and the smaller the air bubbles; they grow again on the way up.",
      de: "Fahrradpumpe und Taucher: Je tiefer du tauchst, desto höher der Druck und desto kleiner die Luftblasen; beim Auftauchen werden sie wieder größer.",
    },
    color: "bg-sky",
  },
  {
    key: "charles",
    name: { tr: "Charles Yasası", en: "Charles's Law", de: "Gesetz von Charles" },
    short: { tr: "Charles", en: "Charles", de: "Charles" },
    emoji: "🔥",
    constant: { tr: "P ve n sabit", en: "P and n constant", de: "P und n konstant" },
    formula: { tr: "V / T = sabit", en: "V / T = constant", de: "V / T = konstant" },
    idea: {
      tr: "Isıtınca kediler hızlanır, pistonu yukarı iter → hacim artar. Sıcaklık MUTLAKA Kelvin olmalı!",
      en: "Heat it up and the cats speed up and push the piston higher → volume increases. Temperature MUST be in kelvin!",
      de: "Heiz auf, dann werden die Katzen schneller und drücken den Kolben nach oben → das Volumen wächst. Die Temperatur MUSS in Kelvin sein!",
    },
    example: {
      tr: "Güneşte bırakılan balon şişer, buzdolabına konan balon büzülür.",
      en: "A balloon left in the sun swells; a balloon put in the fridge shrinks.",
      de: "Ein Luftballon in der Sonne dehnt sich aus, einer im Kühlschrank schrumpft.",
    },
    color: "bg-peach",
  },
  {
    key: "gaylussac",
    name: { tr: "Gay-Lussac Yasası", en: "Gay-Lussac's Law", de: "Gesetz von Gay-Lussac" },
    short: { tr: "Gay-Lussac", en: "Gay-Lussac", de: "Gay-Lussac" },
    emoji: "🔒",
    constant: { tr: "V ve n sabit", en: "V and n constant", de: "V und n konstant" },
    formula: { tr: "P / T = sabit", en: "P / T = constant", de: "P / T = konstant" },
    idea: {
      tr: "Piston kilitli. Isıtınca kediler hem daha hızlı hem daha sert çarpar → basınç artar.",
      en: "The piston is locked. Heat it up and the cats hit the walls more often and harder → pressure rises.",
      de: "Der Kolben ist blockiert. Heiz auf, dann prallen die Katzen öfter und härter gegen die Wände → der Druck steigt.",
    },
    example: {
      tr: "Yazın sıcakta araba lastiği patlayabilir; sprey kutuları ateşe atılmaz!",
      en: "Car tyres can burst on hot summer days, and aerosol cans must never go in a fire!",
      de: "Autoreifen können an heißen Sommertagen platzen, und Spraydosen gehören niemals ins Feuer!",
    },
    color: "bg-pink",
  },
  {
    key: "avogadro",
    name: { tr: "Avogadro Yasası", en: "Avogadro's Law", de: "Gesetz von Avogadro" },
    short: { tr: "Avogadro", en: "Avogadro", de: "Avogadro" },
    emoji: "🐱",
    constant: { tr: "P ve T sabit", en: "P and T constant", de: "P und T konstant" },
    formula: { tr: "V / n = sabit", en: "V / n = constant", de: "V / n = konstant" },
    idea: {
      tr: "Daha çok kedi (mol) → daha çok çarpışma → piston yükselir, hacim artar.",
      en: "More cats (moles) → more collisions → the piston rises and the volume increases.",
      de: "Mehr Katzen (Mol) → mehr Zusammenstöße → der Kolben steigt und das Volumen wächst.",
    },
    example: {
      tr: "Balonu üfleyerek şişirmek: içeri daha çok gaz taneciği girer, balon büyür.",
      en: "Blowing up a balloon: more gas particles go in, so the balloon gets bigger.",
      de: "Luftballon aufpusten: Es kommen mehr Gasteilchen hinein, also wird der Ballon größer.",
    },
    color: "bg-mint",
  },
];

export const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));

/** Dile göre sayı biçimi: 3,08 (tr, de) / 3.08 (en) */
export const fmt = (x: number, d = 2, lang: Lang = "tr") =>
  x.toLocaleString(lang === "en" ? "en-US" : lang === "de" ? "de-DE" : "tr-TR", { minimumFractionDigits: d, maximumFractionDigits: d });

export interface GasInit {
  T: number;
  cats: number;
  V: number;
}

export interface GasState {
  T: number;
  cats: number;
  n: number;
  V: number;
  P: number;
  Pfix: number;
  /** piston sınıra dayandı mı (sabit basınç modunda) */
  atStop: boolean;
  /** +1 ısıtılıyor, -1 soğutuluyor, 0 */
  trend: number;
}

export interface GasPoint {
  x: number;
  y: number;
}

/** Gaz kutusunun durum yöneticisi: T, n, V (veya sabit P) → P = nRT/V */
export function useGas(init: GasInit, locks: Locks) {
  const [T, setTraw] = useState(init.T);
  const [cats, setCats] = useState(init.cats);
  const [Vset, setVset] = useState(init.V);
  const [Pfix, setPfix] = useState(() => (init.cats * MOL_PER_CAT * R * init.T) / init.V);
  const [trend, setTrend] = useState(0);
  const trendTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const n = cats * MOL_PER_CAT;
  const Vfree = (n * R * T) / Pfix;
  const V = locks.pFixed ? clamp(Vfree, VMIN, VMAX) : Vset;
  const atStop = locks.pFixed && (Vfree > VMAX || Vfree < VMIN);
  const P = (n * R * T) / V;

  // Sabit basınç moduna geçerken mevcut basıncı "kilitle"
  const prevPFixed = useRef(locks.pFixed);
  const lastV = useRef(V);
  useEffect(() => {
    if (locks.pFixed && !prevPFixed.current) setPfix((n * R * T) / Vset);
    if (!locks.pFixed && prevPFixed.current) setVset(Math.round(lastV.current * 10) / 10);
    prevPFixed.current = locks.pFixed;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locks.pFixed]);
  useEffect(() => {
    lastV.current = V;
  });

  const setT = useCallback((next: number | ((t: number) => number)) => {
    setTraw((t) => {
      const v = clamp(Math.round(typeof next === "function" ? next(t) : next), TMIN, TMAX);
      if (v !== t) {
        setTrend(v > t ? 1 : -1);
        if (trendTimer.current) clearTimeout(trendTimer.current);
        trendTimer.current = setTimeout(() => setTrend(0), 1200);
      }
      return v;
    });
  }, []);

  const setV = useCallback((v: number) => setVset(clamp(Math.round(v * 10) / 10, VMIN, VMAX)), []);
  const setCatCount = useCallback((c: number | ((c: number) => number)) => {
    setCats((old) => clamp(typeof c === "function" ? c(old) : c, CAT_MIN, CAT_MAX));
  }, []);

  const reset = useCallback((i: GasInit) => {
    setTraw(i.T);
    setCats(i.cats);
    setVset(i.V);
    setPfix((i.cats * MOL_PER_CAT * R * i.T) / i.V);
    setTrend(0);
  }, []);

  useEffect(() => () => void (trendTimer.current && clearTimeout(trendTimer.current)), []);

  const state: GasState = useMemo(
    () => ({ T, cats, n, V, P, Pfix, atStop, trend }),
    [T, cats, n, V, P, Pfix, atStop, trend],
  );
  return { state, setT, setV, setCats: setCatCount, reset };
}

export type GasApi = ReturnType<typeof useGas>;
