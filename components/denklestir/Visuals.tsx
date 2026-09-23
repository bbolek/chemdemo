"use client";

import { motion } from "framer-motion";
import { Fragment } from "react";
import { ATOMIC_MASS, elementOrder, pretty, sideCounts } from "./chem";
import Molecule, { Ball } from "./Molecule";

const INK = "#4a4063";

type Term = [formula: string, coef: number];

/** Story visual: an equation drawn with ball molecules + atom counts per element. */
export function EquationVisual({ left, right, unit = 18 }: { left: Term[]; right: Term[]; unit?: number }) {
  const lc = sideCounts(left.map((t) => t[0]), left.map((t) => t[1]));
  const rc = sideCounts(right.map((t) => t[0]), right.map((t) => t[1]));
  const els = elementOrder([...left, ...right].map((t) => t[0]));
  const ok = els.every((e) => (lc[e] ?? 0) === (rc[e] ?? 0));
  const massL = els.reduce((s, e) => s + (lc[e] ?? 0) * (ATOMIC_MASS[e] ?? 1), 0);
  const massR = els.reduce((s, e) => s + (rc[e] ?? 0) * (ATOMIC_MASS[e] ?? 1), 0);
  const tilt = ok ? 0 : massL > massR ? -8 : 8;

  const side = (terms: Term[]) =>
    terms.map(([f, c], k) => (
      <Fragment key={f + k}>
        {k > 0 && <span className="font-display text-2xl font-bold text-ink-soft">+</span>}
        <div className="flex flex-col items-center">
          <div className="flex items-end gap-1">
            {Array.from({ length: c }, (_, j) => (
              <motion.div key={j} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1 + j * 0.12, type: "spring" }}>
                <Molecule formula={f} unit={unit} />
              </motion.div>
            ))}
          </div>
          <span className="font-display text-lg font-bold">
            {c > 1 && <span className="text-pink-deep">{c}</span>}
            {pretty(f)}
          </span>
        </div>
      </Fragment>
    ));

  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl bg-white/80 p-3" style={{ border: `2px dashed ${INK}` }}>
      <div className="flex flex-wrap items-end justify-center gap-2">
        {side(left)}
        <span className="px-1 font-display text-3xl font-extrabold text-ink-soft">→</span>
        {side(right)}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
        {els.map((e) => {
          const good = (lc[e] ?? 0) === (rc[e] ?? 0);
          return (
            <span key={e} className={`flex items-center gap-1 rounded-full px-2 py-0.5 font-bold ${good ? "bg-mint" : "bg-pink"}`}>
              <svg width="18" height="18" viewBox="-1.1 -1.1 2.2 2.2">
                <Ball el={e} x={0} y={0} r={1} label={false} />
              </svg>
              {e}: {lc[e] ?? 0} | {rc[e] ?? 0} {good ? "✅" : "❌"}
            </span>
          );
        })}
        <MiniScale tilt={tilt} />
      </div>
    </div>
  );
}

function MiniScale({ tilt }: { tilt: number }) {
  return (
    <svg width="54" height="34" viewBox="0 0 54 34" aria-hidden>
      <path d="M27 12 L19 32 L35 32 Z" fill="#b69cff" stroke={INK} strokeWidth={2} />
      <motion.g initial={{ rotate: 0 }} animate={{ rotate: tilt }} transition={{ type: "spring", stiffness: 60, damping: 6 }} style={{ originX: "27px", originY: "12px" }}>
        <rect x="3" y="9" width="48" height="6" rx="3" fill={tilt === 0 ? "#7fdcb8" : "#ffe066"} stroke={INK} strokeWidth={2} />
        <circle cx="7" cy="6" r="3.5" fill="#8cc8ff" stroke={INK} strokeWidth={1.5} />
        <circle cx="47" cy="6" r="3.5" fill="#ff9ebb" stroke={INK} strokeWidth={1.5} />
      </motion.g>
    </svg>
  );
}

/** "Index vs coefficient" comparison card. */
export function IndexVisual() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="flex flex-col items-center gap-1 rounded-2xl bg-mint p-3" style={{ border: `2px solid ${INK}` }}>
        <Molecule formula="H2O" unit={20} />
        <span className="font-display text-xl font-bold">H₂O</span>
        <span className="text-sm">Su 💧</span>
      </div>
      <div className="relative flex flex-col items-center gap-1 rounded-2xl bg-pink p-3" style={{ border: `2px solid ${INK}` }}>
        <Molecule formula="H2O2" unit={20} />
        <span className="font-display text-xl font-bold">H₂O₂</span>
        <span className="text-sm">Hidrojen peroksit 🧴</span>
        <motion.span initial={{ scale: 3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3 }} className="absolute -right-2 -top-3 text-4xl">
          🚫
        </motion.span>
      </div>
      <p className="col-span-2 text-center text-sm">
        Küçük sayı = <b>indis</b> (maddenin kimliği, dokunma!) · Büyük sayı = <b>katsayı</b> (kaç tane molekül)
      </p>
    </div>
  );
}

export function CoefVisual() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 rounded-2xl bg-white/80 p-3" style={{ border: `2px dashed ${INK}` }}>
      <div className="flex flex-col items-center">
        <div className="flex gap-1">
          <Molecule formula="H2O" unit={18} />
          <Molecule formula="H2O" unit={18} />
        </div>
        <span className="font-display text-2xl font-bold">
          <span className="text-pink-deep">2</span>H<sub>2</sub>O
        </span>
      </div>
      <div className="font-display text-lg font-bold leading-snug">
        = 2 × (2 H + 1 O)
        <br />= <span className="rounded-full bg-sky px-2">4 H</span> + <span className="rounded-full bg-pink px-2">2 O</span>
      </div>
    </div>
  );
}

export function StepsVisual() {
  const steps = [
    ["🧩", "En karmaşık (en çok atomlu) molekülden başla."],
    ["⚙️", "Metalleri ve diğer atomları eşitle."],
    ["💧", "H ve O atomlarını sona bırak."],
    ["✂️", "Katsayıları en küçük tam sayılara sadeleştir."],
  ];
  return (
    <ol className="grid gap-2 sm:grid-cols-2">
      {steps.map(([e, t], k) => (
        <motion.li key={k} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: k * 0.15 }} className="flex items-center gap-2 rounded-2xl bg-white p-2" style={{ border: `2px solid ${INK}` }}>
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lemon-deep font-display font-bold" style={{ border: `2px solid ${INK}` }}>
            {k + 1}
          </span>
          <span className="text-base">
            {e} {t}
          </span>
        </motion.li>
      ))}
    </ol>
  );
}

/** Wobbling seesaw for the splash screen. */
export function SplashSeesaw() {
  return (
    <svg viewBox="0 0 320 170" className="w-[min(88vw,420px)]" aria-hidden>
      <ellipse cx="160" cy="160" rx="120" ry="8" fill="#4a4063" opacity={0.12} />
      <path d="M160 92 L128 158 L192 158 Z" fill="#b69cff" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      <motion.g style={{ originX: "160px", originY: "92px" }} animate={{ rotate: [-10, 10, -10] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}>
        <rect x="20" y="84" width="280" height="16" rx="8" fill="#ffe066" stroke={INK} strokeWidth={4} />
        {/* left: H2 + H2 + O2 */}
        <g transform="translate(58 62)">
          <Ball el="H" x={-18} y={4} r={9} />
          <Ball el="H" x={-4} y={6} r={9} />
          <Ball el="O" x={20} y={0} r={14} />
          <Ball el="O" x={38} y={2} r={14} />
          <Ball el="H" x={-25} y={-9} r={9} />
          <Ball el="H" x={-11} y={-8} r={9} />
        </g>
        {/* right: H2O x2 */}
        <g transform="translate(250 60)">
          <Ball el="O" x={-18} y={4} r={14} />
          <Ball el="H" x={-32} y={14} r={9} />
          <Ball el="H" x={-4} y={14} r={9} />
          <Ball el="O" x={18} y={-2} r={14} />
          <Ball el="H" x={6} y={10} r={9} />
          <Ball el="H" x={32} y={10} r={9} />
        </g>
      </motion.g>
      <circle cx="160" cy="92" r="8" fill="#ff9ebb" stroke={INK} strokeWidth={3} />
    </svg>
  );
}
