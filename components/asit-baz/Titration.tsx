"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import Cat from "@/components/Cat";
import Robo from "@/components/Robo";
import { useSound } from "@/lib/sound";
import { celebrate } from "@/lib/confetti";
import { Beaker, PhMeter } from "./Props";
import { MIRMIR } from "./Story";
import { ACID_M, ACID_ML, BASE_M, phColor, titrationPH } from "./ph";

const INK = "#4a4063";
/** One drop = 0.05 mL. Volumes are kept as integer drop counts so 25.00 mL is reachable exactly. */
const DROP_ML = 0.05;
const MAX_UNITS = 800; // 40 mL
const BURETTE_ML = 50;

type Status = "run" | "win" | "over";

const vol = (u: number) => u * DROP_ML;
const fmt = (n: number, d = 2) => n.toFixed(d).replace(".", ",");

/** Live pH vs added NaOH volume graph. */
function Graph({ pts, status }: { pts: [number, number][]; status: Status }) {
  const W = 300;
  const H = 180;
  const pad = { l: 30, r: 10, t: 10, b: 26 };
  const X = (v: number) => pad.l + (v / 40) * (W - pad.l - pad.r);
  const Y = (p: number) => pad.t + (1 - p / 14) * (H - pad.t - pad.b);
  const d = pts.map(([v, p], i) => `${i ? "L" : "M"}${X(v).toFixed(1)} ${Y(p).toFixed(1)}`).join(" ");
  const last = pts[pts.length - 1];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="pH - eklenen NaOH hacmi grafiği">
      <rect x={pad.l} y={Y(7.5)} width={W - pad.l - pad.r} height={Y(6.5) - Y(7.5)} fill="#7fdcb8" opacity="0.45" />
      {[0, 7, 14].map((p) => (
        <g key={p}>
          <line x1={pad.l} x2={W - pad.r} y1={Y(p)} y2={Y(p)} stroke={INK} strokeOpacity={p === 7 ? 0.35 : 0.12} strokeDasharray={p === 7 ? "4 4" : undefined} />
          <text x={pad.l - 6} y={Y(p) + 4} textAnchor="end" fontSize="11" fontWeight="700" fill={INK}>
            {p}
          </text>
        </g>
      ))}
      {[0, 10, 20, 25, 30, 40].map((v) => (
        <text key={v} x={X(v)} y={H - 10} textAnchor="middle" fontSize="11" fontWeight="700" fill={v === 25 && status !== "run" ? "#e0485f" : INK}>
          {v}
        </text>
      ))}
      <text x={W - pad.r} y={H - 0} textAnchor="end" fontSize="10" fill={INK} opacity="0.7">
        NaOH (mL)
      </text>
      <text x={4} y={pad.t + 2} fontSize="10" fill={INK} opacity="0.7" transform={`rotate(90 4 ${pad.t + 2})`}>
        pH
      </text>
      <line x1={pad.l} x2={pad.l} y1={pad.t} y2={H - pad.b} stroke={INK} strokeWidth="2" />
      <line x1={pad.l} x2={W - pad.r} y1={H - pad.b} y2={H - pad.b} stroke={INK} strokeWidth="2" />
      {status !== "run" && <line x1={X(25)} x2={X(25)} y1={pad.t} y2={H - pad.b} stroke="#e0485f" strokeDasharray="3 3" strokeWidth="1.5" />}
      <path d={d} fill="none" stroke={INK} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
      {last && <circle cx={X(last[0])} cy={Y(last[1])} r="6" fill={phColor(last[1])} stroke={INK} strokeWidth="2.5" />}
    </svg>
  );
}

/** Burette on a stand. `frac` = fraction of the 50 mL still inside. */
function Burette({ frac, open }: { frac: number; open: boolean }) {
  const top = 10;
  const bot = 200;
  const liqTop = top + (1 - frac) * (bot - top);
  return (
    <svg viewBox="0 0 120 240" width="120" height="240" className="overflow-visible">
      {/* stand */}
      <rect x="4" y="0" width="8" height="222" rx="4" fill="#c9b8f0" stroke={INK} strokeWidth="3" />
      <rect x="8" y="60" width="44" height="10" rx="4" fill="#ffb88a" stroke={INK} strokeWidth="3" />
      {/* tube */}
      <rect x="50" y={top} width="20" height={bot - top} rx="6" fill="#fff" stroke={INK} strokeWidth="3" />
      <motion.rect x="53" width="14" rx="4" fill="#bfe3ff" initial={false} animate={{ y: liqTop, height: Math.max(0, bot - 3 - liqTop) }} transition={{ duration: 0.15 }} />
      {Array.from({ length: 11 }).map((_, i) => (
        <line key={i} x1="50" x2={i % 5 === 0 ? 60 : 56} y1={top + 8 + i * 17} y2={top + 8 + i * 17} stroke={INK} strokeWidth="1.5" opacity="0.6" />
      ))}
      <text x="74" y="30" fontSize="11" fontWeight="800" fill={INK}>
        NaOH
      </text>
      <text x="74" y="44" fontSize="10" fontWeight="700" fill={INK} opacity="0.7">
        0,1 M
      </text>
      {/* stopcock */}
      <path d={`M54 ${bot} L66 ${bot} L62 ${bot + 14} L58 ${bot + 14} Z`} fill="#fff" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <motion.g animate={{ rotate: open ? 90 : 0 }} transition={{ type: "spring", stiffness: 300, damping: 15 }}>
        <rect x="42" y={bot + 3} width="36" height="8" rx="4" fill="#ff9ebb" stroke={INK} strokeWidth="2.5" />
      </motion.g>
      <rect x="58" y={bot + 14} width="4" height="22" fill="#fff" stroke={INK} strokeWidth="2" />
    </svg>
  );
}

export default function Titration({ onNext }: { onNext: () => void }) {
  const { play } = useSound();
  const [units, setUnits] = useState(0);
  const [pts, setPts] = useState<[number, number][]>([[0, titrationPH(0)]]);
  const [status, setStatus] = useState<Status>("run");
  const [holding, setHolding] = useState(false);
  const [drops, setDrops] = useState<number[]>([]);
  const [splash, setSplash] = useState(0);
  const [wins, setWins] = useState(0);

  const unitsRef = useRef(0);
  const statusRef = useRef<Status>("run");
  const holdRef = useRef<number | null>(null);
  const holdStart = useRef(0);
  const lastDrip = useRef(0);
  const dropId = useRef(0);

  const v = vol(units);
  const ph = titrationPH(v);

  const stopHold = useCallback(() => {
    if (holdRef.current !== null) {
      clearInterval(holdRef.current);
      holdRef.current = null;
    }
    setHolding(false);
  }, []);

  useEffect(() => stopHold, [stopHold]);

  const add = useCallback(
    (n: number) => {
      if (statusRef.current !== "run") return;
      const u = Math.min(MAX_UNITS, unitsRef.current + n);
      if (u === unitsRef.current) return stopHold();
      unitsRef.current = u;
      const vv = vol(u);
      const p = titrationPH(vv);
      setUnits(u);
      setPts((a) => [...a, [vv, p]]);
      const id = ++dropId.current;
      setDrops((d) => [...d.slice(-6), id]);
      const now = performance.now();
      if (now - lastDrip.current > 110) {
        play("drip");
        lastDrip.current = now;
      }
      if (p >= 6.5 && p <= 7.5) {
        statusRef.current = "win";
        setStatus("win");
        stopHold();
        setWins((w) => w + 1);
        setTimeout(() => {
          play("levelup");
          celebrate();
        }, 250);
      } else if (p > 7.5) {
        statusRef.current = "over";
        setStatus("over");
        stopHold();
        setTimeout(() => play("fail"), 250);
      }
    },
    [play, stopHold],
  );

  const startHold = (e: React.PointerEvent) => {
    e.preventDefault();
    if (statusRef.current !== "run" || holdRef.current !== null) return;
    setHolding(true);
    holdStart.current = performance.now();
    add(1);
    holdRef.current = window.setInterval(() => {
      const t = performance.now() - holdStart.current;
      // stream speeds up the longer you hold
      add(t < 600 ? 1 : t < 1500 ? 2 : t < 2600 ? 4 : 8);
    }, 110);
  };

  const reset = () => {
    play("whoosh");
    stopHold();
    unitsRef.current = 0;
    statusRef.current = "run";
    setUnits(0);
    setPts([[0, titrationPH(0)]]);
    setStatus("run");
    setDrops([]);
    setSplash((s) => s + 1);
  };

  const level = (ACID_ML + v) / 70;
  const surfY = 250 - 190 * level; // in beaker viewBox units (0..280)
  const beakerW = 180;
  const sceneH = 430;
  const beakerTop = sceneH - (beakerW * 280) / 220;
  const dropEnd = beakerTop + (surfY * beakerW) / 220;

  const hint =
    status === "win"
      ? "Tam isabet! Asit ve baz birbirini nötrleştirdi. 🎉"
      : status === "over"
        ? "Eyvah! Fazla baz ekledik, çözelti bazik oldu! 🙀"
        : v < 15
          ? "Başla ortak! Musluğu basılı tut, NaOH akıtalım."
          : v < 22
            ? "Renk hâlâ kırmızımsı... ama sakın gevşeme!"
            : v < 24.5
              ? "Yavaşla! Artık tek damla tek damla! 💧"
              : "Çok yakınız! Bir damla bile her şeyi değiştirir!";

  const controls = (compact: boolean) => (
    <div className="grid grid-cols-2 gap-2">
      <button
        type="button"
        className={`btn touch-none select-none ${compact ? "!px-2 !py-3" : "!py-4"} ${holding ? "bg-sky-deep" : "bg-sky"}`}
        onPointerDown={startHold}
        onPointerUp={stopHold}
        onPointerLeave={stopHold}
        onPointerCancel={stopHold}
        onContextMenu={(e) => e.preventDefault()}
      >
        🚰 Basılı tut
      </button>
      <button type="button" className={`btn bg-mint ${compact ? "!px-2 !py-3" : "!py-4"}`} onClick={() => add(1)}>
        💧 Tek damla
      </button>
      {!compact && (
        <p className="col-span-2 text-center text-sm text-ink-soft">
          Basılı tuttukça akış hızlanır. Bir damla = {fmt(DROP_ML)} mL
        </p>
      )}
    </div>
  );

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
      <div className="card flex flex-wrap items-center justify-between gap-2 bg-lavender px-4 py-3">
        <h2 className="text-xl font-bold md:text-2xl">⚗️ Titrasyon Görevi</h2>
        <p className="text-sm font-semibold sm:text-base">
          {ACID_ML} mL {fmt(ACID_M, 1)} M HCl + {fmt(BASE_M, 1)} M NaOH → hedef: <b className="whitespace-nowrap">pH 6,5 – 7,5</b>
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_1.1fr]">
        {/* Scene */}
        <div className="card relative flex flex-col justify-end overflow-hidden bg-[#fdf6ff] p-3 pb-5">
          <div className="absolute inset-x-0 bottom-0 h-16 border-t-3 border-ink bg-[#e9dcff]" />
          <div className="relative mx-auto flex items-end justify-center gap-1">
            <div className="relative z-10 mb-2 hidden flex-col items-center sm:flex">
              <AnimatePresence mode="wait">
                <motion.div
                  key={hint}
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mb-1 max-w-[150px] rounded-2xl border-2 border-ink bg-white px-2 py-1 text-xs font-bold"
                >
                  {hint}
                </motion.div>
              </AnimatePresence>
              <motion.div animate={status === "over" ? { rotate: [0, -6, 6, -4, 0] } : {}} transition={{ duration: 0.5 }}>
                <Cat
                  color={MIRMIR.color}
                  accent={MIRMIR.accent}
                  accessory="detective"
                  mood={status === "win" ? "love" : status === "over" ? "surprised" : v > 22 ? "thinking" : "happy"}
                  size={110}
                />
              </motion.div>
            </div>

            <div className="relative" style={{ width: 200, height: sceneH }}>
              <div className="absolute left-[40px] top-0">
                <Burette frac={Math.max(0, 1 - v / BURETTE_ML)} open={holding} />
              </div>
              <AnimatePresence>
                {drops.map((id) => (
                  <motion.span
                    key={id}
                    className="absolute z-10 block h-3 w-2.5 rounded-b-full rounded-t-[40%] border-2 border-ink bg-[#bfe3ff]"
                    style={{ left: 95 }}
                    initial={{ top: 232, opacity: 1 }}
                    animate={{ top: dropEnd - 8, opacity: [1, 1, 0.2] }}
                    transition={{ duration: 0.45, ease: "easeIn" }}
                    onAnimationComplete={() => {
                      setDrops((d) => d.filter((x) => x !== id));
                    }}
                  />
                ))}
              </AnimatePresence>
              <div className="absolute bottom-0 left-[10px]">
                <Beaker color={phColor(ph)} level={level} width={beakerW} bubbles={holding} splashKey={splash + (status === "run" ? 0 : 1000)} label="HCl" />
              </div>
            </div>

            <div className="relative z-10 mb-2 hidden flex-col items-center lg:flex">
              <Robo size={90} mood={status === "win" ? "excited" : status === "over" ? "surprised" : "thinking"} holding="clipboard" />
            </div>
          </div>
          {/* hint for mobile */}
          <div className="relative mt-2 flex items-center gap-2 sm:hidden">
            <Cat
              color={MIRMIR.color}
              accent={MIRMIR.accent}
              accessory="detective"
              mood={status === "win" ? "love" : status === "over" ? "surprised" : "thinking"}
              size={64}
              bounce={false}
            />
            <p className="flex-1 rounded-2xl border-2 border-ink bg-white px-2 py-1 text-sm font-bold">{hint}</p>
            {status !== "run" && (
              <button type="button" className="btn bg-white !px-3 !py-1.5 !text-sm" onClick={reset} aria-label="Tekrar dene">
                🔁
              </button>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="card flex flex-col gap-3 p-4">
          <div className="grid grid-cols-[auto_1fr] items-center gap-3">
            <PhMeter ph={ph} size={140} />
            <div className="flex flex-col gap-1.5 font-display font-bold">
              <div className="rounded-2xl border-2 border-ink bg-sky px-3 py-1">
                Eklenen NaOH: <span className="text-xl">{fmt(v)} mL</span>
              </div>
              <div className="rounded-2xl border-2 border-ink px-3 py-1" style={{ background: phColor(ph) }}>
                pH: <span className="text-xl">{fmt(ph)}</span>
              </div>
            </div>
          </div>

          {status === "run" ? (
            <div className="hidden md:block">{controls(false)}</div>
          ) : (
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`rounded-2xl border-3 border-ink p-3 ${status === "win" ? "bg-mint" : "bg-pink"}`}
            >
              {status === "win" ? (
                <>
                  <p className="font-display text-xl font-bold">Nötrleşme tamam! pH = {fmt(ph)} 🎉</p>
                  <p className="mt-1">
                    HCl + NaOH → NaCl + H₂O. {fmt(ACID_M * ACID_ML, 1)} mmol H⁺, tam {fmt(v)} mL NaOH&apos;deki {fmt(BASE_M * v, 1)} mmol OH⁻ ile su oluşturdu. Beherde artık tuzlu su var!
                  </p>
                </>
              ) : (
                <>
                  <p className="font-display text-xl font-bold">Fazla baz! pH = {fmt(ph)} 💜</p>
                  <p className="mt-1">
                    Dönüm noktasına yakın tek bir damla pH&apos;ı birkaç birim zıplatır. İndikatörün rengi {ph < 11 ? "maviye" : "mora"} döndü. Fenolftalein kullansaydık çözelti pembe olurdu!
                  </p>
                </>
              )}
              <div className="mt-3 flex flex-wrap justify-end gap-2">
                <button type="button" className="btn bg-white" onClick={reset}>
                  {status === "win" ? "Yeniden 🔁" : "Tekrar dene 🔁"}
                </button>
                {status === "win" && (
                  <button type="button" className="btn bg-lemon-deep" onClick={onNext}>
                    Quiz&apos;e geç ❓
                  </button>
                )}
              </div>
            </motion.div>
          )}

          <div className="rounded-2xl border-2 border-ink/20 bg-cream p-2">
            <p className="px-1 font-display text-sm font-bold text-ink-soft">📈 pH – NaOH hacmi grafiği</p>
            <Graph pts={pts} status={status} />
          </div>

          <details className="rounded-2xl border-2 border-dashed border-ink/30 px-3 py-2 text-sm">
            <summary className="cursor-pointer font-display font-bold">🕵️ Mırmır&apos;ın ipucu (hesapla!)</summary>
            <p className="mt-1">
              n(HCl) = M × V = 0,1 × 25 = 2,5 mmol H⁺. Nötrleşme için aynı mol OH⁻ gerekir: 2,5 mmol ÷ 0,1 M = <b>? mL</b> NaOH. Bu hacme yaklaşınca yavaşla!
            </p>
          </details>
          {wins > 0 && status === "run" && (
            <button type="button" className="btn self-end bg-lemon-deep" onClick={onNext}>
              Quiz&apos;e geç ❓
            </button>
          )}
        </div>
      </div>
      {status === "run" && (
        <div className="card sticky bottom-2 z-30 flex flex-col gap-2 p-2.5 md:hidden">
          <div className="flex justify-between gap-2 font-display text-sm font-bold">
            <span className="rounded-full border-2 border-ink bg-sky px-2.5 py-0.5">NaOH: {fmt(v)} mL</span>
            <span className="rounded-full border-2 border-ink px-2.5 py-0.5" style={{ background: phColor(ph) }}>
              pH: {fmt(ph)}
            </span>
          </div>
          {controls(true)}
        </div>
      )}
    </div>
  );
}
