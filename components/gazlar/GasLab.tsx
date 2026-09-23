"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useLang } from "@/lib/i18n";
import { useSound } from "@/lib/sound";
import GasCanvas from "./GasCanvas";
import GasGraph from "./GasGraph";
import { CAT_MAX, CAT_MIN, fmt, R, TMAX, TMIN, VMAX, VMIN, type GasApi, type GasMode, type Locks } from "./gas";

/** Basılı tutunca tekrar eden buton (ısıt / soğut / kedi ekle) */
function HoldButton({ onStep, disabled, className, children, label }: { onStep: () => void; disabled?: boolean; className: string; children: ReactNode; label: string }) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stepRef = useRef(onStep);
  stepRef.current = onStep;
  const stop = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };
  useEffect(() => stop, []);
  const start = () => {
    if (disabled) return;
    stepRef.current();
    const loop = (d: number) => {
      timer.current = setTimeout(() => {
        stepRef.current();
        loop(Math.max(45, d * 0.8));
      }, d);
    };
    loop(320);
  };
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      className={`btn !px-3 !py-2 text-lg ${className}`}
      onPointerDown={(e) => {
        e.preventDefault();
        start();
      }}
      onPointerUp={stop}
      onPointerLeave={stop}
      onPointerCancel={stop}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && stepRef.current()}
      style={{ touchAction: "manipulation" }}
    >
      {children}
    </button>
  );
}

function Tile({ label, value, unit, sub, color, bar, locked }: { label: string; value: string; unit: string; sub?: string; color: string; bar: number; locked?: boolean }) {
  const { t } = useLang();
  return (
    <div className={`relative rounded-2xl border-[3px] border-ink p-2.5 ${color}`}>
      <div className="flex flex-wrap items-center justify-between gap-x-1 text-xs font-bold text-ink-soft">
        <span>{label}</span>
        {locked && <span className="whitespace-nowrap" title={t("sabit", "constant", "konstant")}>🔒 {t("sabit", "constant", "konstant")}</span>}
      </div>
      <div className="font-display text-2xl leading-tight font-extrabold tabular-nums">
        {value} <span className="text-sm font-bold">{unit}</span>
      </div>
      {sub && <div className="text-xs font-semibold text-ink-soft tabular-nums">{sub}</div>}
      <div className="mt-1 h-2 overflow-hidden rounded-full bg-white/80">
        <motion.div className="h-full rounded-full bg-ink/70" animate={{ width: `${Math.max(3, Math.min(100, bar * 100))}%` }} transition={{ type: "spring", stiffness: 200, damping: 25 }} />
      </div>
    </div>
  );
}

/** Basınç göstergesi (ibreli) */
function PressureDial({ P, maxP, limitP }: { P: number; maxP: number; limitP?: number }) {
  const a = (x: number) => -120 + (Math.min(x, maxP) / maxP) * 240;
  const pt = (deg: number, r: number) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return [60 + r * Math.cos(rad), 62 + r * Math.sin(rad)];
  };
  const arc = (d0: number, d1: number, r: number) => {
    const [x0, y0] = pt(d0, r);
    const [x1, y1] = pt(d1, r);
    return `M${x0} ${y0} A${r} ${r} 0 ${d1 - d0 > 180 ? 1 : 0} 1 ${x1} ${y1}`;
  };
  const danger = limitP !== undefined && P > limitP * 0.9;
  const { t, lang } = useLang();
  return (
    <div className={`relative flex flex-col items-center rounded-2xl border-[3px] border-ink p-2 ${danger ? "bg-pink" : "bg-lemon"}`}>
      <span className="self-start text-xs font-bold text-ink-soft">{t("Basınç P", "Pressure P", "Druck P")}</span>
      <svg viewBox="0 0 120 106" className="w-full max-w-[150px]">
        <path d={arc(-120, 120, 44)} stroke="#fff" strokeWidth={12} fill="none" strokeLinecap="round" />
        <path d={arc(-120, a(P), 44)} stroke={danger ? "#ff5a7a" : "#8cc8ff"} strokeWidth={12} fill="none" strokeLinecap="round" />
        {limitP !== undefined && (() => {
          const [x0, y0] = pt(a(limitP), 34);
          const [x1, y1] = pt(a(limitP), 54);
          return <line x1={x0} y1={y0} x2={x1} y2={y1} stroke="#ff5a7a" strokeWidth={3} />;
        })()}
        <g style={{ transform: `rotate(${a(P)}deg)`, transformOrigin: "60px 62px", transformBox: "view-box", transition: "transform 0.45s cubic-bezier(.34,1.56,.64,1)" }}>
          <line x1={60} y1={62} x2={60} y2={26} stroke="#4a4063" strokeWidth={4} strokeLinecap="round" />
        </g>
        <circle cx={60} cy={62} r={6} fill="#4a4063" />
        <text x={60} y={102} textAnchor="middle" fontSize={17} fontWeight={800} fill="#4a4063" className="font-display">
          {fmt(P, 2, lang)} atm
        </text>
      </svg>
    </div>
  );
}

export interface GasLabProps {
  api: GasApi;
  mode: GasMode;
  locks: Locks;
  limitV?: number;
  limitP?: number;
  targetV?: number;
  popped?: boolean;
  /** Ek içerik (kartın altına) */
  footer?: ReactNode;
  /** grafik göster */
  showGraph?: boolean;
  /** Sıcaklık kilidi için özel açıklama */
  tLockMsg?: string;
}

export default function GasLab({ api, mode, locks, limitV, limitP, targetV, popped, footer, showGraph = true, tLockMsg }: GasLabProps) {
  const { state, setT, setV, setCats } = api;
  const { play } = useSound();
  const { t, lang } = useLang();
  const f = (x: number, d?: number) => fmt(x, d, lang);
  const [soundOn, setSoundOn] = useState(true);
  const lastWhoosh = useRef(0);
  const whoosh = () => {
    const now = performance.now();
    if (now - lastWhoosh.current > 450) {
      lastWhoosh.current = now;
      play("whoosh");
    }
  };

  const off = popped;
  const vReason = locks.pFixed
    ? t("Piston serbest: sabit basınçta hacim kendiliğinden ayarlanır", "Piston floats freely: at constant pressure the volume adjusts by itself", "Kolben beweglich: Bei konstantem Druck stellt sich das Volumen von selbst ein")
    : locks.V
      ? t("Piston kilitli: hacim sabit", "Piston locked: volume is constant", "Kolben blockiert: Volumen konstant")
      : "";
  const heatReason = locks.T ? (tLockMsg ?? t("Sıcaklık sabit (termostat açık)", "Temperature is constant (thermostat on)", "Temperatur konstant (Thermostat an)")) : "";
  const nReason = locks.n ? t("Kapak kapalı: mol sayısı sabit", "Lid closed: number of moles is constant", "Deckel zu: Stoffmenge konstant") : "";
  const celsius = state.T - 273;

  return (
    <div className="grid w-full gap-4 lg:grid-cols-[1.3fr_1fr]">
      <div className="card flex min-w-0 flex-col gap-3 bg-sky/60 p-3 md:p-4">
        <div className="relative overflow-hidden rounded-2xl border-[3px] border-ink bg-white/70">
          <GasCanvas
            state={state}
            locks={locks}
            limitV={limitV}
            targetV={targetV}
            popped={popped}
            soundOn={soundOn}
            onDragStart={whoosh}
            onDragEnd={whoosh}
            onDragV={setV}
          />
          <button
            type="button"
            className="absolute top-2 right-2 rounded-full border-2 border-ink bg-white px-2.5 py-1 text-xs font-bold"
            onClick={() => (setSoundOn((s) => !s), play("click"))}
          >
            {soundOn ? t("🔊 çarpışma sesi", "🔊 collision sound", "🔊 Stoßgeräusch") : t("🔈 ses kapalı", "🔈 sound off", "🔈 Ton aus")}
          </button>
          <span className="absolute top-8 left-2 rounded-full border-2 border-ink bg-white/90 px-2 py-0.5 text-xs font-bold">
            {t("1 kedi", "1 cat", "1 Katze")} = {f(0.1, 1)} mol
          </span>
        </div>

        {/* Hacim */}
        <div className="flex flex-col gap-1">
          <label className="flex items-center justify-between text-sm font-bold">
            <span>{t("🟪 Piston (Hacim V)", "🟪 Piston (Volume V)", "🟪 Kolben (Volumen V)")}</span>
            <span className="tabular-nums">{f(state.V, 1)} L</span>
          </label>
          <input
            type="range"
            min={VMIN}
            max={VMAX}
            step={0.1}
            value={state.V}
            disabled={locks.V || locks.pFixed || off}
            onChange={(e) => setV(+e.target.value)}
            onPointerDown={whoosh}
            className="gz-range w-full"
            aria-label={t("Hacim", "Volume", "Volumen")}
          />
          {vReason && <p className="text-xs font-semibold text-ink-soft">🔒 {vReason}</p>}
        </div>

        {/* Sıcaklık */}
        <div className="flex flex-col gap-1">
          <label className="flex items-center justify-between text-sm font-bold">
            <span>{t("🌡️ Sıcaklık T", "🌡️ Temperature T", "🌡️ Temperatur T")}</span>
            <span className="tabular-nums">
              {Math.round(state.T)} K <span className="text-ink-soft">({Math.round(celsius)} °C)</span>
            </span>
          </label>
          <div className="flex items-center gap-2">
            <HoldButton label={t("Soğut", "Cool", "Abkühlen")} className="bg-sky-deep" disabled={locks.T || off} onStep={() => (setT((t) => t - 10), play("drip"))}>
              🧊
            </HoldButton>
            <input
              type="range"
              min={TMIN}
              max={TMAX}
              step={10}
              value={state.T}
              disabled={locks.T || off}
              onChange={(e) => setT(+e.target.value)}
              className="gz-range min-w-0 flex-1"
              aria-label={t("Sıcaklık", "Temperature", "Temperatur")}
            />
            <HoldButton label={t("Isıt", "Heat", "Erhitzen")} className="bg-peach-deep" disabled={locks.T || off} onStep={() => (setT((t) => t + 10), play("bubble"))}>
              🔥
            </HoldButton>
          </div>
          {heatReason && <p className="text-xs font-semibold text-ink-soft">🔒 {heatReason}</p>}
        </div>

        {/* Mol */}
        <div className="flex flex-col gap-1">
          <label className="flex items-center justify-between text-sm font-bold">
            <span>{t("🐱 Gaz kedisi sayısı (n)", "🐱 Number of gas cats (n)", "🐱 Anzahl Gas-Katzen (n)")}</span>
            <span className="tabular-nums">
              {state.cats} {t("kedi", state.cats === 1 ? "cat" : "cats", state.cats === 1 ? "Katze" : "Katzen")} = {f(state.n, 1)} mol
            </span>
          </label>
          <div className="flex items-center gap-2">
            <HoldButton label={t("Kedi çıkar", "Remove a cat", "Katze entfernen")} className="bg-white" disabled={locks.n || off || state.cats <= CAT_MIN} onStep={() => (setCats((c) => c - 1), play("pop"))}>
              ➖
            </HoldButton>
            <div className="flex min-w-0 flex-1 flex-wrap gap-0.5 rounded-full border-2 border-ink/20 bg-white/70 px-2 py-1.5">
              {Array.from({ length: CAT_MAX }).map((_, k) => (
                <span key={k} className={`h-2.5 w-2.5 rounded-full transition-colors ${k < state.cats ? "bg-pink-deep" : "bg-ink/10"}`} />
              ))}
            </div>
            <HoldButton
              label={t("Kedi ekle", "Add a cat", "Katze hinzufügen")}
              className="bg-mint-deep"
              disabled={locks.n || off || state.cats >= CAT_MAX}
              onStep={() => (setCats((c) => c + 1), play(Math.random() < 0.25 ? "meow" : "pop"))}
            >
              ➕
            </HoldButton>
          </div>
          {nReason && <p className="text-xs font-semibold text-ink-soft">🔒 {nReason}</p>}
        </div>
        {footer}
      </div>

      <div className="flex min-w-0 flex-col gap-4">
        <div className="card flex flex-col gap-3 p-3 md:p-4">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2">
            <PressureDial P={state.P} maxP={[10, 25, 50, 100, 200].find((m) => m >= Math.max(state.P, (limitP ?? 0) * 1.25)) ?? 200} limitP={limitP} />
            <Tile label={t("Hacim V", "Volume V", "Volumen V")} value={f(state.V, 1)} unit="L" color="bg-lavender" bar={state.V / VMAX} locked={locks.V && !locks.pFixed} sub={locks.pFixed ? `${t("P sabit", "P fixed", "P konstant")}: ${f(state.Pfix, 2)} atm` : undefined} />
            <Tile label={t("Sıcaklık T", "Temperature T", "Temperatur T")} value={`${Math.round(state.T)}`} unit="K" sub={`= ${Math.round(celsius)} °C + 273`} color="bg-peach" bar={state.T / TMAX} locked={locks.T} />
            <Tile label={t("Mol n", "Moles n", "Stoffmenge n")} value={f(state.n, 1)} unit="mol" color="bg-mint" bar={state.cats / CAT_MAX} locked={locks.n} />
          </div>
          <div className="rounded-2xl border-2 border-dashed border-ink/30 bg-cream px-3 py-2 text-center text-sm">
            <div className="font-display text-lg font-bold">P · V = n · R · T</div>
            <div className="tabular-nums">
              {f(state.P, 2)} · {f(state.V, 1)} = {f(state.n, 1)} · {f(R, 3)} · {Math.round(state.T)}
            </div>
            <div className="font-bold tabular-nums text-ink-soft">
              {f(state.P * state.V, 2)} = {f(state.n * R * state.T, 2)} ✔
            </div>
          </div>
          {state.atStop && !popped && <p className="rounded-xl bg-lemon px-3 py-1 text-center text-sm font-bold">{t("⚠️ Piston sınıra dayandı! Artık basınç da değişiyor.", "⚠️ The piston hit its limit! Now the pressure changes too.", "⚠️ Der Kolben ist am Anschlag! Jetzt ändert sich auch der Druck.")}</p>}
        </div>
        {showGraph && (
          <div className="card p-3 md:p-4">
            <GasGraph mode={mode} state={state} />
          </div>
        )}
      </div>
      <style>{`
        .gz-range { accent-color: #b69cff; height: 28px; }
        .gz-range:disabled { opacity: .45; }
      `}</style>
    </div>
  );
}
