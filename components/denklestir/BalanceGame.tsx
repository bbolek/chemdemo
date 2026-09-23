"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Cat from "@/components/Cat";
import Robo from "@/components/Robo";
import { useSound } from "@/lib/sound";
import { celebrate, sparkleAt } from "@/lib/confetti";
import { LEVELS, check, gcdAll, minMoves, parseFormula, pretty, starsFor, type Level } from "./chem";
import Molecule, { Ball, ELEMENT_NAMES, moleculeWidth } from "./Molecule";
import Scale from "./Scale";

const TEKIR = { color: "#d4f5e9", accent: "#7fdcb8" };
const STORE = "denklestir-stars-v1";
const MAX_COEF = 12;

function loadStars(): number[] {
  try {
    const raw = localStorage.getItem(STORE);
    const arr = raw ? (JSON.parse(raw) as number[]) : [];
    return LEVELS.map((_, k) => (typeof arr[k] === "number" ? arr[k] : 0));
  } catch {
    return LEVELS.map(() => 0);
  }
}
function saveStars(s: number[]) {
  try {
    localStorage.setItem(STORE, JSON.stringify(s));
  } catch {}
}

export default function BalanceGame({ onQuiz }: { onQuiz: () => void }) {
  const [stars, setStars] = useState<number[]>(() => LEVELS.map(() => 0));
  const [current, setCurrent] = useState<number | null>(null);
  const { play } = useSound();

  useEffect(() => setStars(loadStars()), []);

  const finish = (idx: number, s: number) => {
    setStars((prev) => {
      const next = [...prev];
      next[idx] = Math.max(next[idx], s);
      saveStars(next);
      return next;
    });
  };

  return (
    <AnimatePresence mode="wait">
      {current === null ? (
        <motion.div key="map" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <LevelMap
            stars={stars}
            onPick={(k) => {
              play("whoosh");
              setCurrent(k);
            }}
            onQuiz={onQuiz}
          />
        </motion.div>
      ) : (
        <motion.div key={`lv-${current}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
          <LevelPlay
            level={LEVELS[current]}
            index={current}
            onWin={(s) => finish(current, s)}
            onMap={() => setCurrent(null)}
            onNext={() => (current < LEVELS.length - 1 ? setCurrent(current + 1) : onQuiz())}
            isLast={current === LEVELS.length - 1}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */

function StarRow({ n, size = "text-lg" }: { n: number; size?: string }) {
  return (
    <span className={`${size} tracking-tight`}>
      {[0, 1, 2].map((k) => (
        <span key={k} className={k < n ? "" : "opacity-25 grayscale"}>
          ⭐
        </span>
      ))}
    </span>
  );
}

function LevelMap({ stars, onPick, onQuiz }: { stars: number[]; onPick: (k: number) => void; onQuiz: () => void }) {
  const total = stars.reduce((a, b) => a + b, 0);
  const { play } = useSound();
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
      <div className="card flex flex-wrap items-center gap-3 bg-mint p-4">
        <Cat color={TEKIR.color} accent={TEKIR.accent} accessory="bowtie" mood="happy" size={72} />
        <div className="min-w-0 flex-1 basis-40">
          <h2 className="text-2xl font-bold">Terazi Haritası</h2>
          <p className="text-ink-soft">Bir seviye seç, katsayılarla teraziyi dengele! Az hamle = çok yıldız.</p>
        </div>
        <div className="card w-full bg-white px-4 py-2 text-center font-display text-xl font-bold sm:w-auto">
          ⭐ {total} / {LEVELS.length * 3}
        </div>
      </div>

      <div className="card relative overflow-hidden bg-cream p-4 sm:p-6">
        <div className="grid grid-cols-3 gap-x-1 gap-y-4 sm:grid-cols-5 sm:gap-x-3 sm:gap-y-5">
          {LEVELS.map((lv, k) => {
            const unlocked = k === 0 || stars[k - 1] > 0 || stars[k] > 0;
            const done = stars[k] > 0;
            return (
              <motion.button
                key={lv.id}
                type="button"
                disabled={!unlocked}
                onClick={() => onPick(k)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: k * 0.05 }}
                whileHover={unlocked ? { scale: 1.06, rotate: k % 2 ? 2 : -2 } : undefined}
                whileTap={unlocked ? { scale: 0.95 } : undefined}
                className={`flex flex-col items-center gap-1 rounded-3xl p-1 text-center sm:p-2 ${lv.boss ? "col-span-3 sm:col-span-1" : ""} ${
                  unlocked ? "cursor-pointer" : "cursor-not-allowed opacity-55"
                } ${k % 2 ? "sm:translate-y-6" : ""}`}
              >
                <div
                  className={`relative flex h-16 w-16 items-center justify-center rounded-full font-display text-2xl sm:h-20 sm:w-20 sm:text-3xl font-extrabold shadow-[0_5px_0_rgb(74_64_99/.25)] ${
                    lv.boss ? "bg-pink-deep" : done ? "bg-mint-deep" : unlocked ? "bg-lemon-deep" : "bg-white"
                  }`}
                  style={{ border: "3px solid #4a4063" }}
                >
                  {unlocked ? (lv.boss ? "👑" : lv.id) : "🔒"}
                  {unlocked && !done && (
                    <motion.span
                      className="absolute -inset-2 rounded-full border-4 border-dashed border-mint-deep"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    />
                  )}
                </div>
                <span className="font-display text-sm font-bold leading-tight">{lv.boss ? `Boss: ${lv.name}` : lv.name}</span>
                <span className="hidden text-xs text-ink-soft sm:block">
                  {lv.left.map(pretty).join(" + ")} → {lv.right.map(pretty).join(" + ")}
                </span>
                <StarRow n={stars[k]} size="text-base" />
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <p className="text-ink-soft">Hazır hissediyor musun?</p>
        <button type="button" className="btn bg-lavender-deep" onClick={() => (play("click"), onQuiz())}>
          Quiz'e geç ❓
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function atomUnits(formula: string) {
  const c = parseFormula(formula);
  return Object.values(c).reduce((a, b) => a + b, 0);
}

function PanPile({ formulas, coefs, w, h }: { formulas: string[]; coefs: number[]; w: number; h: number }) {
  // Estimate the area the balls need and scale the molecules to fit the pan.
  const totalAtoms = formulas.reduce((s, f, k) => s + atomUnits(f) * coefs[k], 0);
  const widest = Math.max(...formulas.map(moleculeWidth));
  const unit = Math.max(4.5, Math.min(24, (w - 4) / widest, Math.sqrt((w * h) / Math.max(1, totalAtoms * 4.4 * 2.2))));
  return (
    <AnimatePresence initial={false}>
      {formulas.flatMap((f, k) =>
        Array.from({ length: coefs[k] }, (_, j) => (
          <motion.div
            key={`${f}-${j}`}
            layout
            initial={{ scale: 0, y: -60, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 18 }}
          >
            <Molecule formula={f} unit={unit} label={unit > 8} />
          </motion.div>
        )),
      )}
    </AnimatePresence>
  );
}

function LevelPlay({
  level,
  index,
  onWin,
  onMap,
  onNext,
  isLast,
}: {
  level: Level;
  index: number;
  onWin: (stars: number) => void;
  onMap: () => void;
  onNext: () => void;
  isLast: boolean;
}) {
  const n = level.left.length + level.right.length;
  const all = [...level.left, ...level.right];
  const [coefs, setCoefs] = useState<number[]>(() => Array(n).fill(1));
  const [moves, setMoves] = useState(0);
  const [hint, setHint] = useState(false);
  const [won, setWon] = useState<number | null>(null);
  const { play } = useSound();
  const tableRef = useRef<HTMLDivElement>(null);

  const res = useMemo(() => check(level, coefs), [level, coefs]);
  const nL = level.left.length;

  // tilt angle from mass difference (heavier side goes down)
  let angle = 0;
  if (!res.equal) {
    const diff = res.massR - res.massL;
    angle = Math.max(-13, Math.min(13, (diff / Math.max(1, res.massL + res.massR)) * 45));
    if (Math.abs(angle) < 3) angle = diff < 0 ? -3 : 3;
  }

  useEffect(() => {
    if (!res.solved || won !== null) return;
    const s = starsFor(level, moves, hint);
    const t = setTimeout(() => {
      setWon(s);
      onWin(s);
      play("levelup");
      celebrate();
    }, 650);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [res.solved]);

  const change = (k: number, d: number, el?: HTMLElement | null) => {
    if (won !== null) return;
    const v = coefs[k] + d;
    if (v < 1 || v > MAX_COEF) {
      play("fail");
      return;
    }
    const next = [...coefs];
    next[k] = v;
    setCoefs(next);
    setMoves((m) => m + 1);
    play(d > 0 ? "pop" : "drip");
    const r = check(level, next);
    if (r.equal && !r.solved) play("bubble");
    else if (r.solved && el) sparkleAt(el);
  };

  const reset = () => {
    play("whoosh");
    setCoefs(Array(n).fill(1));
    setMoves(0);
    setHint(false);
    setWon(null);
  };

  const g = gcdAll(coefs);
  const tekirMood = res.solved ? "love" : res.equal ? "wink" : Math.abs(angle) > 8 ? "surprised" : "thinking";
  const leanText = angle > 0 ? "Sağ kefe ağır basıyor" : "Sol kefe ağır basıyor";

  const status = res.solved
    ? { text: "Mükemmel denge! Atomlar korundu! 🎉", cls: "bg-mint-deep" }
    : res.equal
      ? { text: `Denge var ama katsayılar en küçük tam sayılar değil. Hepsini ${g}'ye bölebilirsin!`, cls: "bg-lemon-deep" }
      : { text: `${leanText}. Hangi atom eksik? Tabloya bak!`, cls: "bg-pink" };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-3">
      {/* top bar */}
      <div className="flex items-center justify-between gap-2">
        <button type="button" aria-label="Harita" className="btn shrink-0 bg-white !px-3 !py-2 sm:!px-5" onClick={() => (play("click"), onMap())}>
          🗺️ <span className="hidden sm:inline">Harita</span>
        </button>
        <div className="min-w-0 text-center">
          <p className="font-display text-xs font-bold text-ink-soft sm:text-sm">
            {level.boss ? "👑 BOSS SEVİYESİ" : `Seviye ${level.id} / ${LEVELS.length}`}
          </p>
          <h2 className="truncate text-lg font-bold leading-tight md:text-2xl">{level.name}</h2>
        </div>
        <div className="flex shrink-0 gap-1.5 sm:gap-2">
          <span className="card flex items-center !rounded-full px-3 py-1 font-display font-bold" title="Hamle sayısı">
            👣 {moves}
          </span>
          <button type="button" className="btn bg-white !px-3 !py-2" onClick={reset} aria-label="Sıfırla">
            🔄
          </button>
        </div>
      </div>

      {/* equation with coefficient buttons */}
      <div className="card flex flex-wrap items-center justify-center gap-x-1 gap-y-2 px-1.5 py-3 sm:gap-x-3 sm:px-4">
        {all.map((f, k) => (
          <Fragment key={k}>
            {k === nL && <span className="font-display text-2xl sm:px-1 sm:text-3xl font-extrabold text-ink-soft">→</span>}
            {k !== 0 && k !== nL && <span className="font-display text-xl sm:text-2xl font-bold text-ink-soft">+</span>}
            <CoefChip formula={f} value={coefs[k]} onChange={(d, el) => change(k, d, el)} side={k < nL ? "left" : "right"} disabled={won !== null} />
          </Fragment>
        ))}
      </div>

      <div className="grid gap-3 lg:grid-cols-[1fr_280px]">
        {/* the scale */}
        <div className={`card relative overflow-hidden p-2 sm:p-4 ${res.solved ? "bg-mint" : "bg-sky/60"}`}>
          <div className="mb-1 flex justify-between px-2 font-display text-sm font-bold text-ink-soft">
            <span>Girenler (sol)</span>
            <span>Ürünler (sağ)</span>
          </div>
          <Scale
            angle={angle}
            balanced={res.solved}
            panHeight={170}
            topper={
              <motion.div animate={res.solved ? { y: [0, -18, 0] } : { y: 0 }} transition={res.solved ? { duration: 0.6, repeat: Infinity } : undefined}>
                <Cat color={TEKIR.color} accent={TEKIR.accent} accessory="bowtie" mood={tekirMood} size={78} bounce={false} />
              </motion.div>
            }
            left={(w, h) => <PanPile formulas={level.left} coefs={coefs.slice(0, nL)} w={w} h={h} />}
            right={(w, h) => <PanPile formulas={level.right} coefs={coefs.slice(nL)} w={w} h={h} />}
          />
          <motion.p key={status.text} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`mx-auto mt-2 w-fit rounded-2xl px-4 py-2 text-center font-display font-bold ${status.cls}`} style={{ border: "3px solid #4a4063" }}>
            {status.text}
          </motion.p>
        </div>

        {/* side panel: atom table + Robo */}
        <div className="flex flex-col gap-3">
          <div ref={tableRef} className="card overflow-hidden">
            <table className="w-full text-center">
              <thead className="bg-lavender font-display">
                <tr>
                  <th className="px-2 py-2 text-left">Atom</th>
                  <th className="px-1">Sol</th>
                  <th className="px-1">Sağ</th>
                  <th className="px-1"></th>
                </tr>
              </thead>
              <tbody>
                {res.elements.map((el) => {
                  const l = res.left[el] ?? 0;
                  const r = res.right[el] ?? 0;
                  const ok = l === r;
                  return (
                    <tr key={el} className={`border-t-2 border-ink/10 ${ok ? "bg-mint/60" : "bg-pink/50"}`}>
                      <td className="px-2 py-1.5 text-left">
                        <span className="flex items-center gap-2">
                          <svg width="26" height="26" viewBox="-1.1 -1.1 2.2 2.2">
                            <Ball el={el} x={0} y={0} r={1} />
                          </svg>
                          <span className="text-sm font-semibold">{ELEMENT_NAMES[el] ?? el}</span>
                        </span>
                      </td>
                      <td className="font-display text-xl font-bold">
                        <motion.span key={l} initial={{ scale: 1.6 }} animate={{ scale: 1 }} className="inline-block">
                          {l}
                        </motion.span>
                      </td>
                      <td className="font-display text-xl font-bold">
                        <motion.span key={r} initial={{ scale: 1.6 }} animate={{ scale: 1 }} className="inline-block">
                          {r}
                        </motion.span>
                      </td>
                      <td className="text-lg">{ok ? "✅" : "❌"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="card flex items-end gap-2 bg-lemon p-3">
            <Robo mood={hint ? "thinking" : res.solved ? "excited" : "happy"} holding="clipboard" size={84} talking={false} />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <AnimatePresence mode="wait">
                <motion.p key={hint ? "h" : "n"} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-white p-2 text-sm leading-snug" style={{ border: "2px solid #4a4063" }}>
                  {hint ? level.hint : "Sadece büyük katsayıları değiştir. İndislere dokunmak yasak! 🚫"}
                </motion.p>
              </AnimatePresence>
              {!hint && (
                <button
                  type="button"
                  className="btn bg-lemon-deep !py-1.5 text-sm"
                  onClick={() => {
                    play("bubble");
                    setHint(true);
                  }}
                >
                  💡 İpucu (en çok 2⭐)
                </button>
              )}
            </div>
          </div>
          <p className="text-center text-xs text-ink-soft">
            3⭐ için en az hamle: {minMoves(level)} · Katsayılar 1–{MAX_COEF}
          </p>
        </div>
      </div>

      <AnimatePresence>{won !== null && <WinModal stars={won} level={level} coefs={coefs} moves={moves} isLast={isLast} onNext={onNext} onMap={onMap} onReplay={reset} index={index} />}</AnimatePresence>
    </div>
  );
}

function CoefChip({
  formula,
  value,
  onChange,
  side,
  disabled,
}: {
  formula: string;
  value: number;
  onChange: (d: number, el: HTMLElement | null) => void;
  side: "left" | "right";
  disabled: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const btn = "flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full font-display text-2xl font-extrabold shadow-[0_3px_0_rgb(74_64_99/.3)] active:translate-y-0.5 active:shadow-none disabled:opacity-40 touch-manipulation";
  return (
    <div ref={ref} className={`flex flex-col items-center gap-1 rounded-3xl px-1 py-1.5 sm:px-1.5 ${side === "left" ? "bg-sky" : "bg-pink"}`}>
      <button type="button" disabled={disabled} className={`${btn} bg-mint-deep`} style={{ border: "3px solid #4a4063" }} onClick={() => onChange(1, ref.current)} aria-label={`${formula} katsayısını artır`}>
        +
      </button>
      <div className="flex flex-col items-center px-0.5 leading-none sm:flex-row sm:items-baseline sm:gap-0.5 sm:px-1">
        <motion.span key={value} initial={{ scale: 1.8, color: "#ff6f91" }} animate={{ scale: 1, color: value === 1 ? "#b3abc6" : "#4a4063" }} className="inline-block font-display text-3xl font-extrabold">
          {value}
        </motion.span>
        <span className="whitespace-nowrap font-display text-lg font-bold sm:text-xl">{pretty(formula)}</span>
      </div>
      <button type="button" disabled={disabled || value <= 1} className={`${btn} bg-white`} style={{ border: "3px solid #4a4063" }} onClick={() => onChange(-1, ref.current)} aria-label={`${formula} katsayısını azalt`}>
        −
      </button>
    </div>
  );
}

function equationText(level: Level, coefs: number[]) {
  const nL = level.left.length;
  const term = (f: string, c: number) => `${c === 1 ? "" : c}${pretty(f)}`;
  return `${level.left.map((f, k) => term(f, coefs[k])).join(" + ")} → ${level.right.map((f, k) => term(f, coefs[nL + k])).join(" + ")}`;
}

function WinModal({
  stars,
  level,
  coefs,
  moves,
  isLast,
  onNext,
  onMap,
  onReplay,
}: {
  stars: number;
  level: Level;
  coefs: number[];
  moves: number;
  isLast: boolean;
  onNext: () => void;
  onMap: () => void;
  onReplay: () => void;
  index: number;
}) {
  const { play } = useSound();
  const msg = stars === 3 ? "Kusursuz! Tam bir terazi ustasısın!" : stars === 2 ? "Çok iyi! Biraz daha az hamleyle 3 yıldız senin!" : "Dengeledin! Şimdi daha az hamleyle dene!";
  return createPortal(
    <motion.div className="fixed inset-0 z-40 flex items-center justify-center bg-ink/40 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div initial={{ scale: 0.6, y: 40 }} animate={{ scale: 1, y: 0 }} transition={{ type: "spring", bounce: 0.5 }} className="card flex w-full max-w-md flex-col items-center gap-3 bg-mint p-6 text-center">
        <div className="flex items-end gap-1">
          <Cat color={TEKIR.color} accent={TEKIR.accent} accessory={level.boss ? "crown" : "bowtie"} mood="love" size={100} />
          <Robo mood="excited" holding="none" size={96} />
        </div>
        <h3 className="text-3xl font-extrabold">{level.boss ? "Boss yenildi! 👑" : "Dengede! ⚖️"}</h3>
        <div className="flex gap-2 text-5xl">
          {[0, 1, 2].map((k) => (
            <motion.span
              key={k}
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3 + k * 0.25, type: "spring", bounce: 0.6 }}
              onAnimationStart={() => k < stars && play("pop")}
              className={k < stars ? "" : "opacity-25 grayscale"}
            >
              ⭐
            </motion.span>
          ))}
        </div>
        <p className="rounded-2xl bg-white px-3 py-2 font-display text-xl font-bold" style={{ border: "3px solid #4a4063" }}>
          {equationText(level, coefs)}
        </p>
        <p className="text-ink-soft">
          {moves} hamle · {msg}
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <button type="button" className="btn bg-white" onClick={() => (play("click"), onReplay())}>
            🔁 Tekrar
          </button>
          <button type="button" className="btn bg-white" onClick={() => (play("click"), onMap())}>
            🗺️ Harita
          </button>
          <button type="button" className="btn bg-pink-deep" onClick={() => (play("click"), onNext())}>
            {isLast ? "Quiz'e geç ❓" : "Sonraki Seviye →"}
          </button>
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  );
}
