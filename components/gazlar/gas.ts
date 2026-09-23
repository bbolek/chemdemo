"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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
  name: string;
  short: string;
  emoji: string;
  constant: string;
  formula: string;
  idea: string;
  example: string;
  color: string;
}

export const MODES: ModeInfo[] = [
  {
    key: "serbest",
    name: "Serbest Oyun",
    short: "Serbest",
    emoji: "🎈",
    constant: "Her şey serbest",
    formula: "P·V = n·R·T",
    idea: "Pistonu it, kutuyu ısıt, kedi ekle! Hepsi ideal gaz denklemine uyar.",
    example: "Düdüklü tencere: hacim sabit, ısı artar → basınç artar, yemek daha çabuk pişer.",
    color: "bg-lavender",
  },
  {
    key: "boyle",
    name: "Boyle Yasası",
    short: "Boyle",
    emoji: "🤏",
    constant: "T ve n sabit",
    formula: "P·V = sabit",
    idea: "Hacmi küçült → kediler duvarlara daha sık çarpar → basınç artar. Hacim yarıya inerse basınç 2 katına çıkar.",
    example: "Bisiklet pompası ve dalgıç: derine inildikçe basınç artar, hava kabarcıkları küçülür; yüzeye çıkarken büyür.",
    color: "bg-sky",
  },
  {
    key: "charles",
    name: "Charles Yasası",
    short: "Charles",
    emoji: "🔥",
    constant: "P ve n sabit",
    formula: "V / T = sabit",
    idea: "Isıtınca kediler hızlanır, pistonu yukarı iter → hacim artar. Sıcaklık MUTLAKA Kelvin olmalı!",
    example: "Güneşte bırakılan balon şişer, buzdolabına konan balon büzülür.",
    color: "bg-peach",
  },
  {
    key: "gaylussac",
    name: "Gay-Lussac Yasası",
    short: "Gay-Lussac",
    emoji: "🔒",
    constant: "V ve n sabit",
    formula: "P / T = sabit",
    idea: "Piston kilitli. Isıtınca kediler hem daha hızlı hem daha sert çarpar → basınç artar.",
    example: "Yazın sıcakta araba lastiği patlayabilir; sprey kutuları ateşe atılmaz!",
    color: "bg-pink",
  },
  {
    key: "avogadro",
    name: "Avogadro Yasası",
    short: "Avogadro",
    emoji: "🐱",
    constant: "P ve T sabit",
    formula: "V / n = sabit",
    idea: "Daha çok kedi (mol) → daha çok çarpışma → piston yükselir, hacim artar.",
    example: "Balonu üfleyerek şişirmek: içeri daha çok gaz taneciği girer, balon büyür.",
    color: "bg-mint",
  },
];

export const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));

/** Türkçe sayı biçimi: 3,08 */
export const fmt = (x: number, d = 2) =>
  x.toLocaleString("tr-TR", { minimumFractionDigits: d, maximumFractionDigits: d });

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
