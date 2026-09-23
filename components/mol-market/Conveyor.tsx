"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState, type ReactNode } from "react";
import Robo from "@/components/Robo";
import Cat from "@/components/Cat";
import { useSound } from "@/lib/sound";
import { celebrate, sparkleAt } from "@/lib/confetti";
import { NA, fmt, fmtN } from "./chem";
import { MINNOS } from "./Story";

type Unit = "g" | "mol" | "N" | "L";

interface Round {
  sub: string;
  M: number;
  Mcalc: string;
  gas: boolean;
  particle: "molekül" | "atom" | "formül birimi";
  start: Unit;
  value: number;
  target: Unit;
}

const ROUNDS: Round[] = [
  { sub: "O₂", M: 32, Mcalc: "2·16", gas: true, particle: "molekül", start: "g", value: 64, target: "mol" },
  { sub: "H₂O", M: 18, Mcalc: "2·1 + 16", gas: false, particle: "molekül", start: "mol", value: 2, target: "N" },
  { sub: "CO₂", M: 44, Mcalc: "12 + 2·16", gas: true, particle: "molekül", start: "g", value: 44, target: "L" },
  { sub: "CH₄", M: 16, Mcalc: "12 + 4·1", gas: true, particle: "molekül", start: "N", value: 3.01e23, target: "g" },
  { sub: "NH₃", M: 17, Mcalc: "14 + 3·1", gas: true, particle: "molekül", start: "L", value: 11.2, target: "N" },
  { sub: "Fe", M: 56, Mcalc: "56", gas: false, particle: "atom", start: "N", value: 1.204e24, target: "g" },
  { sub: "CaCO₃", M: 100, Mcalc: "40 + 12 + 3·16", gas: false, particle: "formül birimi", start: "g", value: 20, target: "N" },
];

interface Op {
  id: string;
  label: ReactNode;
  text: string;
  from: Unit;
  to: Unit;
  apply: (v: number, M: number) => number;
}

const OPS: Op[] = [
  { id: "divM", label: "÷ M", text: "÷ M", from: "g", to: "mol", apply: (v, M) => v / M },
  { id: "mulM", label: "× M", text: "× M", from: "mol", to: "g", apply: (v, M) => v * M },
  { id: "mulNA", label: <>× N<sub>A</sub></>, text: "× Nₐ", from: "mol", to: "N", apply: (v) => v * NA },
  { id: "divNA", label: <>÷ N<sub>A</sub></>, text: "÷ Nₐ", from: "N", to: "mol", apply: (v) => v / NA },
  { id: "mul224", label: "× 22,4", text: "× 22,4", from: "mol", to: "L", apply: (v) => v * 22.4 },
  { id: "div224", label: "÷ 22,4", text: "÷ 22,4", from: "L", to: "mol", apply: (v) => v / 22.4 },
];

const STATIONS: Record<Unit, { name: string; emoji: string; x: number; y: number; color: string }> = {
  g: { name: "Kütle", emoji: "⚖️", x: 15, y: 34, color: "bg-peach" },
  mol: { name: "Mol", emoji: "🧺", x: 50, y: 34, color: "bg-lemon" },
  N: { name: "Tanecik", emoji: "✨", x: 85, y: 34, color: "bg-pink" },
  L: { name: "Hacim (NK)", emoji: "🎈", x: 50, y: 78, color: "bg-sky" },
};

const UNIT_NAME: Record<Unit, string> = { g: "kütle (gram)", mol: "mol sayısı", N: "tanecik sayısı", L: "hacim (NK, litre)" };

function show(v: number, u: Unit, r: Round) {
  if (u === "g") return `${fmt(v)} g`;
  if (u === "mol") return `${fmt(v)} mol`;
  if (u === "L") return `${fmt(v)} L`;
  return `${fmtN(v)} ${r.particle}`;
}

function Box({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 60 56" className="w-12 drop-shadow md:w-14" aria-hidden>
        <polygon points="30,4 56,17 30,30 4,17" fill="#ffe5cc" stroke="#4a4063" strokeWidth={3} strokeLinejoin="round" />
        <polygon points="4,17 30,30 30,54 4,41" fill="#ffb88a" stroke="#4a4063" strokeWidth={3} strokeLinejoin="round" />
        <polygon points="56,17 30,30 30,54 56,41" fill="#f59f6c" stroke="#4a4063" strokeWidth={3} strokeLinejoin="round" />
        <polyline points="17,10.5 43,23.5 43,34" fill="none" stroke="#ff9ebb" strokeWidth={4} />
        <circle cx={17} cy={34} r={1.8} fill="#4a4063" />
        <circle cx={23} cy={37} r={1.8} fill="#4a4063" />
      </svg>
      <span className="mt-0.5 whitespace-nowrap rounded-full border-2 border-ink bg-white px-2 font-display text-xs font-bold md:text-sm">{label}</span>
    </div>
  );
}

function Belt({ style, vertical = false }: { style: React.CSSProperties; vertical?: boolean }) {
  return (
    <div className="absolute overflow-hidden rounded-full border-3 border-ink bg-[#cfc6e3]" style={style}>
      <div
        className={vertical ? "mm-belt-v h-full w-full" : "mm-belt h-full w-full"}
        style={{
          backgroundImage: vertical
            ? "repeating-linear-gradient(0deg, transparent 0 14px, rgba(74,64,99,.25) 14px 18px)"
            : "repeating-linear-gradient(90deg, transparent 0 14px, rgba(74,64,99,.25) 14px 18px)",
        }}
      />
    </div>
  );
}

export default function Conveyor({ onNext }: { onNext: () => void }) {
  const { play } = useSound();
  const [ri, setRi] = useState(0);
  const r = ROUNDS[ri];
  const [pos, setPos] = useState<Unit>(r.start);
  const [val, setVal] = useState(r.value);
  const [trail, setTrail] = useState<string[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [stars, setStars] = useState<number[]>([]);
  const [wob, setWob] = useState(0);
  const [finished, setFinished] = useState(false);

  const solved = pos === r.target;

  const load = (i: number) => {
    const n = ROUNDS[i];
    setRi(i);
    setPos(n.start);
    setVal(n.value);
    setTrail([]);
    setMsg(null);
    setMistakes(0);
  };

  const apply = (op: Op, btn: HTMLElement) => {
    if (solved) return;
    const wanted: Unit = pos === "mol" ? r.target : "mol";
    if (op.from !== pos) {
      play("fail");
      setWob((w) => w + 1);
      setMistakes((m) => m + 1);
      setMsg(`Bu işlem ${UNIT_NAME[op.from]} istasyonunda çalışır. Paket şu an ${UNIT_NAME[pos]} istasyonunda! Tüm yollar önce MOL'e çıkar. 🧺`);
      return;
    }
    if (op.to !== wanted) {
      play("fail");
      setWob((w) => w + 1);
      setMistakes((m) => m + 1);
      if (op.to === "L" && !r.gas) setMsg(`${r.sub} gaz değil! 22,4 L kuralı sadece normal koşullardaki gazlar için geçerli.`);
      else setMsg(`Hmm, paket ${UNIT_NAME[op.to]} tarafına gidiyor ama hedef ${UNIT_NAME[r.target]}. Başka bir işlem dene!`);
      return;
    }
    const nv = op.apply(val, r.M);
    play("whoosh");
    setTimeout(() => play("pop"), 450);
    setTrail((t) => [...t, `${op.text}${op.id.endsWith("M") ? ` (${r.M})` : ""}`]);
    setVal(nv);
    setPos(op.to);
    setMsg(null);
    if (op.to === r.target) {
      setTimeout(() => {
        play("success");
        sparkleAt(btn);
      }, 600);
      setStars((s) => {
        const c = [...s];
        c[ri] = mistakes === 0 ? 3 : mistakes === 1 ? 2 : 1;
        return c;
      });
    }
  };

  const next = () => {
    play("click");
    if (ri === ROUNDS.length - 1) {
      setFinished(true);
      play("levelup");
      celebrate();
    } else load(ri + 1);
  };

  const total = stars.reduce((a, b) => a + (b ?? 0), 0);

  if (finished) {
    return (
      <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="card mx-auto flex max-w-xl flex-col items-center gap-4 bg-mint p-8 text-center">
        <div className="flex items-end gap-2">
          <Cat color={MINNOS.color} accent={MINNOS.accent} accessory="chef" mood="love" size={120} />
          <Robo mood="excited" holding="clipboard" size={100} />
        </div>
        <h3 className="text-3xl font-extrabold">Bant ustası oldun! 🏭</h3>
        <p className="text-xl">
          Toplam ⭐ {total} / {ROUNDS.length * 3}
        </p>
        <p className="text-lg">Unutma: kütle, tanecik ve hacim arasında giderken hep önce MOL&apos;e uğrarız!</p>
        <div className="flex flex-wrap justify-center gap-2">
          <button type="button" className="btn bg-white" onClick={() => (setStars([]), setFinished(false), load(0))}>
            Tekrar 🔁
          </button>
          <button type="button" className="btn bg-lemon-deep" onClick={onNext}>
            Quiz&apos;e geç ❓ →
          </button>
        </div>
      </motion.div>
    );
  }

  const st = STATIONS[pos];

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
      <style>{`
        @keyframes mmBelt { from { background-position: 0 0; } to { background-position: 36px 0; } }
        @keyframes mmBeltV { from { background-position: 0 0; } to { background-position: 0 36px; } }
        .mm-belt { animation: mmBelt 1.2s linear infinite; }
        .mm-belt-v { animation: mmBeltV 1.2s linear infinite; }
      `}</style>

      {/* task card */}
      <div className="card flex flex-col gap-2 bg-lavender p-4 sm:flex-row sm:items-center">
        <div className="flex-1">
          <p className="font-display text-sm font-bold text-ink-soft">
            Paket {ri + 1} / {ROUNDS.length} · M({r.sub}) = {r.Mcalc} = {r.M} g/mol{r.gas ? " · gaz 🎈" : " · gaz değil"}
          </p>
          <p className="text-lg font-semibold md:text-xl">
            <b>{show(r.value, r.start, r)}</b> {r.sub} paketini <b className="rounded-lg bg-lemon-deep px-1.5">{UNIT_NAME[r.target]}</b> istasyonuna taşı!
          </p>
        </div>
        <div className="flex gap-1 text-2xl">
          {ROUNDS.map((_, k) => (
            <span key={k} className={`h-3 w-3 rounded-full border-2 border-ink ${k < ri || (k === ri && solved) ? "bg-mint-deep" : k === ri ? "bg-lemon-deep" : "bg-white"}`} />
          ))}
        </div>
      </div>

      {/* factory floor */}
      <div className="card relative h-[330px] overflow-hidden bg-cream sm:h-[360px]" style={{ backgroundImage: "radial-gradient(circle, #e8dcff 1.5px, transparent 1.5px)", backgroundSize: "18px 18px" }}>
        <Belt style={{ left: "15%", right: "15%", top: "calc(34% - 12px)", height: 24 }} />
        <Belt vertical style={{ left: "calc(50% - 12px)", width: 24, top: "34%", bottom: "22%" }} />

        {(Object.keys(STATIONS) as Unit[]).map((u) => {
          const s = STATIONS[u];
          const isTarget = u === r.target;
          const here = u === pos;
          return (
            <div key={u} className="absolute" style={{ left: `${s.x}%`, top: `${s.y}%`, translate: "-50% -30%" }}>
              {isTarget && !solved && (
                <motion.span
                  className="absolute inset-0 -m-2 rounded-3xl border-4 border-dashed border-pink-deep"
                  animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                />
              )}
              <div className={`relative flex w-[84px] flex-col items-center rounded-2xl border-3 border-ink px-1 pb-1 pt-4 shadow-[0_6px_0_#4a4063] sm:w-[104px] ${s.color} ${here ? "ring-4 ring-white" : ""}`}>
                <span className="text-2xl leading-none">{s.emoji}</span>
                <span className="font-display text-sm font-bold leading-tight sm:text-base">{s.name}</span>
                <span className="text-[11px] font-semibold text-ink-soft">{u === "N" ? "tane" : u === "L" ? "litre" : u === "g" ? "gram" : "mol"}</span>
                {isTarget && <span className="absolute -top-3 rounded-full border-2 border-ink bg-pink-deep px-2 text-[10px] font-bold text-white">HEDEF</span>}
              </div>
            </div>
          );
        })}

        {/* the package */}
        <motion.div
          className="absolute z-10"
          animate={{ left: `${st.x}%`, top: `${st.y}%` }}
          transition={{ type: "spring", stiffness: 80, damping: 14 }}
          style={{ translate: "-50% -118%" }}
        >
          <motion.div key={wob} animate={wob ? { rotate: [0, -14, 12, -8, 0] } : { y: [0, -4, 0] }} transition={wob ? { duration: 0.45 } : { duration: 1.4, repeat: Infinity }}>
            <Box label={show(val, pos, r)} />
          </motion.div>
        </motion.div>

        {/* supervisor */}
        <div className="absolute bottom-2 left-2 hidden sm:block">
          <Robo mood={solved ? "excited" : msg ? "thinking" : "happy"} holding="clipboard" size={80} />
        </div>
        <div className="absolute bottom-1 right-2 hidden sm:block">
          <Cat color={MINNOS.color} accent={MINNOS.accent} accessory="chef" mood={solved ? "love" : msg ? "thinking" : "happy"} size={95} flip />
        </div>
      </div>

      {/* formula trail */}
      <div className="card flex flex-wrap items-center gap-2 bg-white p-3 font-display font-bold">
        <span className="text-ink-soft">Hesap şeridi:</span>
        <span className="rounded-lg bg-peach px-2">{show(r.value, r.start, r)}</span>
        {trail.map((t, k) => (
          <motion.span key={k} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="rounded-lg bg-lavender px-2">
            {t} →
          </motion.span>
        ))}
        {trail.length > 0 && <span className="rounded-lg bg-mint px-2">{show(val, pos, r)}</span>}
      </div>

      {/* operation buttons */}
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {OPS.map((op) => (
          <motion.button
            key={op.id}
            type="button"
            whileTap={{ scale: 0.93 }}
            disabled={solved}
            onClick={(e) => apply(op, e.currentTarget)}
            className="btn flex-col !gap-0 !rounded-2xl bg-white !px-1 !py-2 text-xl"
          >
            <span>{op.label}</span>
            <span className="text-[11px] font-semibold text-ink-soft">
              {STATIONS[op.from].name} → {STATIONS[op.to].name}
            </span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {msg && !solved && (
          <motion.div key={msg} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="card flex items-center gap-3 bg-sky p-3">
            <Robo mood="thinking" holding="clipboard" size={56} bounce={false} />
            <p className="flex-1 font-semibold">{msg}</p>
          </motion.div>
        )}
        {solved && (
          <motion.div key="ok" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="card flex flex-col items-center gap-2 bg-mint p-3 text-center sm:flex-row sm:gap-3 sm:text-left">
            <span className="text-3xl">{"⭐".repeat(stars[ri] ?? 1)}</span>
            <p className="flex-1 font-semibold">
              Paket teslim! {show(r.value, r.start, r)} {r.sub} = <b>{show(val, pos, r)}</b>
            </p>
            <button type="button" className="btn bg-lemon-deep" onClick={next}>
              {ri === ROUNDS.length - 1 ? "Bitir 🏁" : "Sonraki paket →"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
