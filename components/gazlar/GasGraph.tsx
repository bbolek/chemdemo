"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useLang, type Lang } from "@/lib/i18n";
import { CAT_MAX, fmt, MOL_PER_CAT, R, TMAX, VMAX, VMIN, type GasMode, type GasPoint, type GasState } from "./gas";

const W = 320;
const H = 230;
const PL = 46;
const PR = 14;
const PT = 26;
const PB = 40;

/** 4 eşit aralığa bölünebilen "güzel" üst sınır */
function niceCeil(x: number) {
  const step = x / 4;
  const e = Math.pow(10, Math.floor(Math.log10(Math.max(step, 1e-6))));
  for (const m of [1, 2, 2.5, 5, 10]) if (m * e >= step) return 4 * m * e;
  return 40 * e;
}

interface Cfg {
  xLabel: string;
  yLabel: string;
  xMax: number;
  yMax: number;
  x: number;
  y: number;
  curve: GasPoint[];
  dashed?: GasPoint[];
  title: string;
  note?: string;
  xDec: number;
  yDec: number;
}

function config(mode: GasMode, s: GasState, lang: Lang): Cfg {
  const t = (tr: string, en: string) => (lang === "en" ? en : tr);
  const nRT = s.n * R * s.T;
  if (mode === "charles") {
    const k = (s.n * R) / s.Pfix;
    const pts = (a: number, b: number) =>
      Array.from({ length: 2 }, (_, i) => {
        const t = a + (b - a) * i;
        return { x: t, y: k * t };
      });
    return {
      title: t("V – T grafiği (doğru!)", "V – T graph (straight line!)"),
      xLabel: t("Sıcaklık T (K)", "Temperature T (K)"),
      yLabel: t("Hacim V (L)", "Volume V (L)"),
      xMax: TMAX,
      yMax: VMAX,
      x: s.T,
      y: s.V,
      curve: pts(100, TMAX),
      dashed: pts(0, 100),
      note: t("Doğru 0 K'e (−273 °C) uzanır", "The line extends to 0 K (−273 °C)"),
      xDec: 0,
      yDec: 1,
    };
  }
  if (mode === "gaylussac") {
    const k = (s.n * R) / s.V;
    const yMax = niceCeil(k * TMAX * 1.05);
    return {
      title: t("P – T grafiği", "P – T graph"),
      xLabel: t("Sıcaklık T (K)", "Temperature T (K)"),
      yLabel: t("Basınç P (atm)", "Pressure P (atm)"),
      xMax: TMAX,
      yMax,
      x: s.T,
      y: s.P,
      curve: [
        { x: 100, y: k * 100 },
        { x: TMAX, y: k * TMAX },
      ],
      dashed: [
        { x: 0, y: 0 },
        { x: 100, y: k * 100 },
      ],
      note: t("P / T = sabit", "P / T = constant"),
      xDec: 0,
      yDec: 1,
    };
  }
  if (mode === "avogadro") {
    const k = (R * s.T) / s.Pfix;
    const nMax = CAT_MAX * MOL_PER_CAT;
    return {
      title: t("V – n grafiği", "V – n graph"),
      xLabel: t("Mol sayısı n (mol)", "Amount n (mol)"),
      yLabel: t("Hacim V (L)", "Volume V (L)"),
      xMax: nMax,
      yMax: VMAX,
      x: s.n,
      y: s.V,
      curve: [
        { x: 0, y: 0 },
        { x: nMax, y: k * nMax },
      ],
      note: t("V / n = sabit", "V / n = constant"),
      xDec: 1,
      yDec: 1,
    };
  }
  // boyle & serbest: P–V hiperbolü
  const yMax = niceCeil(Math.max(nRT / 2, s.P) * 1.1);
  const curve: GasPoint[] = [];
  for (let v = VMIN; v <= VMAX + 1e-9; v += 0.25) curve.push({ x: v, y: nRT / v });
  return {
    title: mode === "boyle" ? t("P – V grafiği (hiperbol)", "P – V graph (hyperbola)") : t("P – V grafiği", "P – V graph"),
    xLabel: t("Hacim V (L)", "Volume V (L)"),
    yLabel: t("Basınç P (atm)", "Pressure P (atm)"),
    xMax: VMAX,
    yMax,
    x: s.V,
    y: s.P,
    curve,
    note: mode === "boyle" ? t("P · V = sabit", "P · V = constant") : `${t("Eğri", "Curve")}: ${fmt(s.n, 1, lang)} mol, ${Math.round(s.T)} K`,
    xDec: 1,
    yDec: 1,
  };
}

export default function GasGraph({ mode, state }: { mode: GasMode; state: GasState }) {
  const { lang, num } = useLang();
  const c = config(mode, state, lang);
  const sx = (x: number) => PL + (x / c.xMax) * (W - PL - PR);
  const sy = (y: number) => H - PB - (y / c.yMax) * (H - PT - PB);
  const path = (pts: GasPoint[]) => pts.map((p, i) => `${i ? "L" : "M"}${sx(p.x).toFixed(1)},${sy(p.y).toFixed(1)}`).join(" ");

  // gezilen noktalar (iz)
  const [trail, setTrail] = useState<GasPoint[]>([]);
  const lastKey = useRef("");
  useEffect(() => setTrail([]), [mode]);
  useEffect(() => {
    const key = `${c.x.toFixed(2)}|${c.y.toFixed(2)}`;
    if (key === lastKey.current) return;
    lastKey.current = key;
    setTrail((t) => [...t.slice(-40), { x: c.x, y: c.y }]);
  }, [c.x, c.y]);

  const xt = Array.from({ length: 5 }, (_, i) => (c.xMax * i) / 4);
  const yt = Array.from({ length: 5 }, (_, i) => (c.yMax * i) / 4);
  const cx = sx(Math.min(c.x, c.xMax));
  const cy = sy(Math.min(c.y, c.yMax));

  return (
    <div className="w-full">
      <div className="mb-1 flex items-baseline justify-between gap-2 px-1">
        <h4 className="font-display text-base font-bold">📈 {c.title}</h4>
        {c.note && <span className="text-xs font-semibold text-ink-soft">{c.note}</span>}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={c.title}>
        <defs>
          <clipPath id="gz-plot">
            <rect x={PL} y={PT - 4} width={W - PL - PR + 4} height={H - PT - PB + 4} />
          </clipPath>
        </defs>
        <rect x={PL} y={PT} width={W - PL - PR} height={H - PT - PB} rx={8} fill="#fff8f0" />
        {yt.map((t, i) => (
          <g key={`y${i}`}>
            <line x1={PL} x2={W - PR} y1={sy(t)} y2={sy(t)} stroke="#4a4063" strokeOpacity={0.1} />
            <text x={PL - 6} y={sy(t) + 4} fontSize={10} textAnchor="end" fill="#7d7396">
              {num(Math.round(t * 100) / 100)}
            </text>
          </g>
        ))}
        {xt.map((t, i) => (
          <g key={`x${i}`}>
            <line y1={PT} y2={H - PB} x1={sx(t)} x2={sx(t)} stroke="#4a4063" strokeOpacity={0.1} />
            <text x={sx(t)} y={H - PB + 14} fontSize={10} textAnchor="middle" fill="#7d7396">
              {num(Math.round(t * 100) / 100)}
            </text>
          </g>
        ))}
        <line x1={PL} x2={W - PR} y1={H - PB} y2={H - PB} stroke="#4a4063" strokeWidth={2} />
        <line x1={PL} x2={PL} y1={PT} y2={H - PB} stroke="#4a4063" strokeWidth={2} />
        <text x={(PL + W - PR) / 2} y={H - 6} fontSize={11} fontWeight={700} textAnchor="middle" fill="#4a4063">
          {c.xLabel}
        </text>
        <text x={12} y={(PT + H - PB) / 2} fontSize={11} fontWeight={700} textAnchor="middle" fill="#4a4063" transform={`rotate(-90 12 ${(PT + H - PB) / 2})`}>
          {c.yLabel}
        </text>
        <g clipPath="url(#gz-plot)">
          {c.dashed && <path d={path(c.dashed)} fill="none" stroke="#b69cff" strokeWidth={3} strokeDasharray="5 5" />}
          <path d={path(c.curve)} fill="none" stroke="#b69cff" strokeWidth={4} strokeLinecap="round" />
          {trail.map((p, i) => (
            <circle key={i} cx={sx(p.x)} cy={sy(p.y)} r={3} fill="#ff9ebb" opacity={0.25 + (0.6 * i) / Math.max(1, trail.length)} />
          ))}
          <line x1={cx} x2={cx} y1={cy} y2={H - PB} stroke="#ff9ebb" strokeDasharray="3 3" strokeWidth={1.5} />
          <line x1={PL} x2={cx} y1={cy} y2={cy} stroke="#ff9ebb" strokeDasharray="3 3" strokeWidth={1.5} />
        </g>
        <motion.g animate={{ x: cx, y: cy }} transition={{ type: "spring", stiffness: 300, damping: 25 }} initial={false}>
          <circle r={11} fill="#ff9ebb" stroke="#4a4063" strokeWidth={2.5} />
          <path d="M-8 -5 L-6 -14 L-1 -9 Z M8 -5 L6 -14 L1 -9 Z" fill="#ff9ebb" stroke="#4a4063" strokeWidth={2} strokeLinejoin="round" />
          <circle cx={-3.5} cy={-1} r={1.6} fill="#4a4063" />
          <circle cx={3.5} cy={-1} r={1.6} fill="#4a4063" />
          <path d="M-2.5 3 q1.2 1.6 2.5 0 q1.3 1.6 2.5 0" fill="none" stroke="#4a4063" strokeWidth={1.2} />
        </motion.g>
        <text x={W - PR - 4} y={PT - 8} fontSize={11} textAnchor="end" fill="#4a4063" fontWeight={700}>
          ({fmt(c.x, c.xDec, lang)}{lang === "en" ? ", " : " ; "}{fmt(c.y, c.yDec, lang)})
        </text>
      </svg>
    </div>
  );
}
