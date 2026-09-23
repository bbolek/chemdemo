"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import Cat, { type CatMood } from "@/components/Cat";
import Robo, { type RoboMood } from "@/components/Robo";
import { ELEMENTS } from "./chem";
import { Face, INK, IsoBox, makeIso, onPlaneY } from "./iso";
import type { Customer } from "./orders";
import { MINNOS } from "./Story";
import { useLang } from "@/lib/i18n";

const VW = 400;
const VH = 300;
const P = makeIso(200, 112, 30);

const pct = ([x, y]: [number, number]) => ({ left: `${(x / VW) * 100}%`, top: `${(y / VH) * 100}%` });

function useWidth() {
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(400);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, w] as const;
}

function Back() {
  const { t, lang } = useLang();
  const tiles = [];
  for (let i = 0; i < 6; i++)
    for (let j = 0; j < 6; j++)
      tiles.push(
        <Face
          key={`${i}-${j}`}
          P={P}
          p={[
            [i, j, 0],
            [i + 1, j, 0],
            [i + 1, j + 1, 0],
            [i, j + 1, 0],
          ]}
          fill={(i + j) % 2 ? "#f3ecff" : "#fff8f0"}
          sw={1}
        />,
      );
  const shelfZ = [0.75, 1.55, 2.35];
  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} className="absolute inset-0 h-full w-full" aria-hidden>
      {/* walls */}
      <Face P={P} p={[[0, 0, 0], [0, 6, 0], [0, 6, 3], [0, 0, 3]]} fill="#e8dcff" />
      <Face P={P} p={[[0, 0, 0], [6, 0, 0], [6, 0, 3], [0, 0, 3]]} fill="#f3ecff" />
      {Array.from({ length: 11 }, (_, k) => {
        const a = P(0, 0.5 + k * 0.5, 0.05);
        const b = P(0, 0.5 + k * 0.5, 2.95);
        return <line key={k} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#d9c9ff" strokeWidth={3} />;
      })}
      {tiles}
      {/* wall shelves with tiny jars */}
      {shelfZ.map((z, row) => (
        <g key={z}>
          <IsoBox P={P} x={0} y={0.5} z={z} dx={0.55} dy={5.2} dz={0.1} top="#ffe5cc" left="#ffb88a" right="#f59f6c" sw={1.8} />
          {Array.from({ length: 7 }, (_, k) => {
            const e = ELEMENTS[(k + row * 3) % ELEMENTS.length];
            const [cx, cy] = P(0.28, 0.9 + k * 0.72, z + 0.1);
            return (
              <g key={k}>
                <rect x={cx - 6} y={cy - 16} width={12} height={16} rx={4} fill={e.color} stroke={INK} strokeWidth={1.5} />
                <rect x={cx - 5} y={cy - 20} width={10} height={4} rx={1.5} fill={e.deep} stroke={INK} strokeWidth={1.3} />
                <text x={cx} y={cy - 5} textAnchor="middle" fontSize={7} fontWeight={800} fill={INK}>
                  {e.sym}
                </text>
              </g>
            );
          })}
        </g>
      ))}
      {/* door on right wall */}
      <Face P={P} p={[[3.9, 0, 0], [5.2, 0, 0], [5.2, 0, 2.2], [3.9, 0, 2.2]]} fill="#b69cff" />
      <Face P={P} p={[[4.05, 0, 1.1], [5.05, 0, 1.1], [5.05, 0, 2.05], [4.05, 0, 2.05]]} fill="#d6ecff" sw={2} />
      {/* window + sign */}
      <Face P={P} p={[[1.0, 0, 1.2], [3.2, 0, 1.2], [3.2, 0, 2.3], [1.0, 0, 2.3]]} fill="#d6ecff" />
      <line x1={P(1.3, 0, 2.1)[0]} y1={P(1.3, 0, 2.1)[1]} x2={P(1.7, 0, 1.6)[0]} y2={P(1.7, 0, 1.6)[1]} stroke="white" strokeWidth={4} strokeLinecap="round" />
      <text transform={onPlaneY(P(2.1, 0, 2.55))} textAnchor="middle" fontFamily="var(--font-baloo), sans-serif" fontWeight={800} fontSize={lang === "en" ? 14 : 15} fill="#ff85a8" stroke={INK} strokeWidth={0.6}>
        {t("MOL MARKET", "MOLE MARKET", "MOL-MARKT")}
      </text>
      {/* floor mat at door */}
      <Face P={P} p={[[3.9, 0.15, 0], [5.2, 0.15, 0], [5.2, 1.0, 0], [3.9, 1.0, 0]]} fill="#ffd6e0" sw={1.5} />
    </svg>
  );
}

function Counter() {
  const { t } = useLang();
  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
      <IsoBox P={P} x={0.6} y={3.3} z={0} dx={2.8} dy={0.8} dz={1.1} top="#fff5b8" left="#b69cff" right="#a58af2" />
      <Face P={P} p={[[0.8, 4.1, 0.3], [3.2, 4.1, 0.3], [3.2, 4.1, 0.8], [0.8, 4.1, 0.8]]} fill="#e8dcff" sw={2} />
      <text transform={onPlaneY(P(2.0, 4.1, 0.43))} textAnchor="middle" fontFamily="var(--font-baloo), sans-serif" fontWeight={800} fontSize={12} fill={INK}>
        {t("KASA 🧺", "TILL 🧺", "KASSE 🧺")}
      </text>
      {/* cash register */}
      <IsoBox P={P} x={2.55} y={3.4} z={1.1} dx={0.7} dy={0.6} dz={0.35} top="#ffd6e0" left="#ff9ebb" right="#ff85a8" sw={2} />
      <IsoBox P={P} x={2.65} y={3.45} z={1.45} dx={0.3} dy={0.45} dz={0.35} top="#d6ecff" left="#8cc8ff" right="#6fb6f5" sw={2} />
      {/* basket on counter */}
      <IsoBox P={P} x={1.0} y={3.45} z={1.1} dx={0.7} dy={0.5} dz={0.3} top="#ffe5cc" left="#ffb88a" right="#f59f6c" sw={2} />
    </svg>
  );
}

/** "ka-ching!" pop above the register, drawn on top of the customer layer. */
function KaChing({ ka }: { ka: number }) {
  const [rx, ry] = P(2.95, 3.4, 1.8);
  const x = rx + 30;
  const y = ry - 45;
  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
      {/* pivot at the label's centre in viewBox coords (framer originX on SVG is fill-box relative, so use CSS) */}
      <style>{`
        @keyframes mmKaching { 0% { transform: scale(0.4); opacity: 0; } 20% { transform: scale(1.3); opacity: 1; } 80% { transform: scale(1); opacity: 1; } 100% { transform: scale(1); opacity: 0; } }
        .mm-kaching { transform-box: view-box; animation: mmKaching 1.8s ease-out forwards; }
      `}</style>
      {ka > 0 && (
        <g key={ka} className="mm-kaching" style={{ transformOrigin: `${x}px ${y - 6}px`, opacity: 0 }}>
          <text x={x} y={y} textAnchor="middle" fontFamily="var(--font-baloo), sans-serif" fontWeight={800} fontSize={16} fill="#ff85a8" stroke="white" strokeWidth={3} paintOrder="stroke">
            ka-ching!
          </text>
        </g>
      )}
    </svg>
  );
}

interface Props {
  customer: Customer | null;
  customerKey: number;
  customerMood: CatMood;
  minnosMood: CatMood;
  roboMood: RoboMood;
  ka: number;
  bubble?: ReactNode;
}

/** Isometric shop interior with animated walk-in customers. */
export default function ShopScene({ customer, customerKey, customerMood, minnosMood, roboMood, ka, bubble }: Props) {
  const [ref, w] = useWidth();
  const u = w / VW;
  const door = P(4.55, 0.4);
  const spot = P(3.95, 4.65);
  const exit = P(5.5, 7.5);

  return (
    <div ref={ref} className="relative w-full select-none" style={{ aspectRatio: `${VW} / ${VH}` }}>
      <Back />
      <div className="absolute" style={pct(P(1.25, 2.6))}>
        <div style={{ translate: "-50% -100%" }}>
          <Cat color={MINNOS.color} accent={MINNOS.accent} accessory="chef" mood={minnosMood} size={92 * u} />
        </div>
      </div>
      <Counter />
      <div className="absolute" style={pct(P(0.75, 5.25))}>
        <div style={{ translate: "-50% -100%" }}>
          <Robo mood={roboMood} holding="clipboard" size={70 * u} />
        </div>
      </div>
      <AnimatePresence>
        {customer && (
          <motion.div
            key={customerKey}
            className="absolute"
            initial={{ ...pct(door), opacity: 0, scale: 0.75 }}
            animate={{ ...pct(spot), opacity: 1, scale: 1 }}
            exit={{ ...pct(exit), opacity: 0, scale: 1.05, transition: { duration: 1.1, ease: "easeIn" } }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            <div style={{ translate: "-50% -100%" }} className="relative">
              <motion.div animate={{ rotate: [-5, 5, -5] }} transition={{ duration: 0.35, repeat: 4 }}>
                <Cat color={customer.color} accent={customer.accent} accessory={customer.accessory} mood={customerMood} size={96 * u} bounce={false} flip />
              </motion.div>
              {bubble && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.4, type: "spring" }}
                  className="absolute -top-2 left-3/4 whitespace-nowrap rounded-full border-2 border-ink bg-white px-2 py-0.5 font-display text-xs font-bold shadow md:text-sm"
                >
                  {bubble}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <KaChing ka={ka} />
    </div>
  );
}
