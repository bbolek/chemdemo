"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import Cat from "@/components/Cat";
import Robo from "@/components/Robo";
import { celebrate, sparkleAt } from "@/lib/confetti";
import { useSound } from "@/lib/sound";
import GasLab from "./GasLab";
import { fmt, MODE_LOCKS, MOL_PER_CAT, R, useGas, type GasInit, type GasMode, type GasState, type Locks } from "./gas";
import { POFUDUK } from "./Story";

interface Ctx {
  s: GasState;
  P0: number;
  V0: number;
  T0: number;
}

interface Level {
  id: string;
  emoji: string;
  title: string;
  law: string;
  mode: GasMode;
  locks: Locks;
  init: GasInit;
  task: (c: Ctx) => string;
  hint: string;
  /** canlı ilerleme metni */
  progress: (c: Ctx) => string;
  check: (c: Ctx) => boolean;
  fail?: (c: Ctx) => string | null;
  limitV?: number;
  limitP?: (c: Ctx) => number;
  targetV?: number;
  predict?: { q: string; options: string[]; answer: number; explain: string };
  done: (c: Ctx) => string;
}

const near = (a: number, b: number, tol: number) => Math.abs(a / b - 1) <= tol;

const LEVELS: Level[] = [
  {
    id: "boyle",
    emoji: "🤏",
    title: "Sıkıştır Bakalım",
    law: "Boyle",
    mode: "boyle",
    locks: MODE_LOCKS.boyle,
    init: { T: 300, cats: 10, V: 8 },
    task: ({ P0 }) => `Sıcaklık sabit! Pistonu kullanarak basıncı 2 katına çıkar: ${fmt(P0, 2)} atm → ${fmt(2 * P0, 2)} atm.`,
    hint: "Boyle yasası: P · V = sabit. Basınç 2 katına çıkacaksa hacim ne olmalı? 🤔",
    progress: ({ s, P0 }) => `Hedef: ${fmt(2 * P0, 2)} atm · Şu an: ${fmt(s.P, 2)} atm`,
    check: ({ s, P0 }) => near(s.P, 2 * P0, 0.03),
    done: ({ s }) => `Süper! Hacmi 8 L'den ${fmt(s.V, 1)} L'ye indirdin. Hacim yarıya inince basınç 2 katına çıktı: P₁·V₁ = P₂·V₂. Bisiklet pompası da tam böyle çalışır!`,
  },
  {
    id: "balon",
    emoji: "🎈",
    title: "Balonu Patlatma!",
    law: "Charles + Avogadro",
    mode: "charles",
    locks: { T: false, n: false, V: true, pFixed: true },
    init: { T: 250, cats: 10, V: 4 },
    task: () => "Balonun içindeki basınç sabit. Balonun hacmini 2 katına çıkar (4 L → 8 L) ama 9,5 L'yi geçme, yoksa PATLAR!",
    hint: "Sabit basınçta V, Kelvin sıcaklıkla doğru orantılıdır (V/T sabit). 250 K'i kaç katına çıkarmalısın? Kedi eklemek de işe yarar (Avogadro)!",
    progress: ({ s }) => `Hedef: 8,0 L · Şu an: ${fmt(s.V, 1)} L`,
    check: ({ s }) => near(s.V, 8, 0.03),
    fail: ({ s }) => (s.V > 9.5 ? "Balon 9,5 L'yi geçti ve PATLADI! 💥" : null),
    limitV: 9.5,
    targetV: 8,
    done: ({ s }) =>
      `Harika! Balon ${fmt(s.V, 1)} L oldu. Sıcaklığı 2 katına çıkarırsan (250 K → 500 K) ya da mol sayısını 2 katına çıkarırsan hacim de 2 katına çıkar. Güneşte kalan balonlar bu yüzden şişer.`,
  },
  {
    id: "kelvin",
    emoji: "🌡️",
    title: "Kelvin'i Hatırla!",
    law: "Charles",
    mode: "charles",
    locks: MODE_LOCKS.charles,
    init: { T: 300, cats: 10, V: 3 },
    predict: {
      q: "Sabit basınçta 27 °C'deki 3 L gazı 327 °C'ye ısıtırsak hacim ne olur?",
      options: ["3,6 L", "6 L", "36,3 L", "Değişmez"],
      answer: 1,
      explain: "27 °C = 300 K, 327 °C = 600 K. Kelvin sıcaklık 2 katına çıktı → V = 3 · 600 / 300 = 6 L. °C ile hesaplasaydın 36,3 L gibi yanlış bir sonuç bulurdun!",
    },
    task: () => "Şimdi tahminini test et: gazı 27 °C'den 327 °C'ye ısıt ve hacme bak!",
    hint: "327 °C = 327 + 273 = 600 K. 🔥 düğmesiyle 600 K'e çık.",
    progress: ({ s }) => `Hedef: 600 K (327 °C) · Şu an: ${Math.round(s.T)} K (${Math.round(s.T - 273)} °C) · V = ${fmt(s.V, 1)} L`,
    check: ({ s }) => Math.round(s.T) === 600,
    done: () => "Gördün mü? 327 °C'de hacim tam 6 L oldu. Gaz yasalarında sıcaklık her zaman Kelvin! K = °C + 273.",
  },
  {
    id: "lastik",
    emoji: "🚗",
    title: "Lastik Patlamasın",
    law: "Gay-Lussac",
    mode: "gaylussac",
    locks: MODE_LOCKS.gaylussac,
    init: { T: 300, cats: 10, V: 6 },
    task: ({ P0 }) =>
      `Yaz günü lastik ısınıyor ve hacmi değişmiyor. Basıncı 1,5 katına çıkar (${fmt(1.5 * P0, 2)} atm) ama ${fmt(1.8 * P0, 2)} atm'yi geçme, lastik patlar!`,
    hint: "Hacim sabitse P / T sabittir. Basınç 1,5 katı olacaksa Kelvin sıcaklık da 1,5 katı olmalı: 300 K × 1,5 = ?",
    progress: ({ s, P0 }) => `Hedef: ${fmt(1.5 * P0, 2)} atm · Şu an: ${fmt(s.P, 2)} atm`,
    check: ({ s, P0 }) => near(s.P, 1.5 * P0, 0.02),
    fail: ({ s, P0 }) => (s.P > 1.8 * P0 ? "Basınç sınırı aştı, lastik PATLADI! 💥" : null),
    limitP: ({ P0 }) => 1.8 * P0,
    done: () => "Tam isabet! 300 K → 450 K olunca basınç da 1,5 katına çıktı. Düdüklü tencere ve sıcakta patlayan lastikler hep Gay-Lussac yasası!",
  },
  {
    id: "avogadro",
    emoji: "🐱",
    title: "Kedi Doldur",
    law: "Avogadro",
    mode: "avogadro",
    locks: MODE_LOCKS.avogadro,
    init: { T: 300, cats: 5, V: 3 },
    task: () => "Basınç ve sıcaklık sabit. Kutuya gaz kedisi ekleyerek hacmi 3 katına çıkar: 3 L → 9 L.",
    hint: "Avogadro: V / n sabit. Hacim 3 katı olacaksa mol sayısı da 3 katı olmalı: 0,5 mol × 3 = ?",
    progress: ({ s }) => `Hedef: 9,0 L · Şu an: ${fmt(s.V, 1)} L (${fmt(s.n, 1)} mol)`,
    check: ({ s }) => near(s.V, 9, 0.02),
    targetV: 9,
    done: () => "Bravo! 0,5 mol → 1,5 mol olunca hacim de 3 katına çıktı. Balonu üflediğinde içine daha çok gaz taneciği girer, bu yüzden büyür!",
  },
];

function Stars({ n, size = "text-2xl" }: { n: number; size?: string }) {
  return (
    <span className={size} aria-label={`${n} yıldız`}>
      {[0, 1, 2].map((k) => (
        <motion.span
          key={k}
          className="inline-block"
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.15 * k, type: "spring" }}
          style={{ filter: k < n ? "none" : "grayscale(1) opacity(0.35)" }}
        >
          ⭐
        </motion.span>
      ))}
    </span>
  );
}

function Run({ level, onWin, onNext, isLast }: { level: Level; onWin: (stars: number) => void; onNext: () => void; isLast: boolean }) {
  const [answered, setAnswered] = useState<number | null>(level.predict ? null : -1);
  const locks = useMemo<Locks>(
    () => (level.predict && answered === null ? { ...level.locks, T: true, n: true } : level.locks),
    [level, answered],
  );
  const api = useGas(level.init, locks);
  const { play } = useSound();
  const [popped, setPopped] = useState<string | null>(null);
  const [won, setWon] = useState(false);
  const [fails, setFails] = useState(0);
  const [hint, setHint] = useState(false);
  const [stars, setStars] = useState(0);
  const winRef = useRef<HTMLDivElement>(null);

  const P0 = (level.init.cats * MOL_PER_CAT * R * level.init.T) / level.init.V;
  const c: Ctx = { s: api.state, P0, V0: level.init.V, T0: level.init.T };

  const failMsg = level.fail?.(c) ?? null;
  const ok = answered !== null && !popped && !won && level.check(c);

  useEffect(() => {
    if (won || popped || !failMsg) return;
    setPopped(failMsg);
    setFails((f) => f + 1);
    play("splash");
    setTimeout(() => play("fail"), 250);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [failMsg]);

  useEffect(() => {
    if (!ok) return;
    const id = setTimeout(() => {
      const st = fails === 0 && !hint ? 3 : fails <= 1 ? 2 : 1;
      setStars(st);
      setWon(true);
      onWin(st);
      play("levelup");
      celebrate();
    }, 700);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ok]);

  useEffect(() => {
    if (won) setTimeout(() => winRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 300);
  }, [won]);

  const retry = () => {
    play("pop");
    api.reset(level.init);
    setPopped(null);
  };

  const pick = (k: number, el: HTMLElement) => {
    if (answered !== null) return;
    setAnswered(k);
    if (k === level.predict!.answer) {
      play("success");
      sparkleAt(el);
    } else {
      play("fail");
      setFails((f) => f + 1);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="card flex items-center gap-3 bg-lemon p-3 md:p-4">
        <Cat {...POFUDUK} mood={popped ? "sad" : won ? "love" : "thinking"} size={80} className="shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-xl font-bold md:text-2xl">
              {level.emoji} {level.title}
            </h3>
            <span className="rounded-full border-2 border-ink bg-white px-2 py-0.5 text-xs font-bold">{level.law}</span>
          </div>
          <p className="text-base md:text-lg">{level.task(c)}</p>
          {answered !== null && (
            <p className={`mt-1 inline-block rounded-full px-3 py-0.5 text-sm font-bold tabular-nums ${ok || won ? "bg-mint-deep" : "bg-white"}`}>
              🎯 {level.progress(c)}
            </p>
          )}
        </div>
      </div>

      {level.predict && (
        <div className="card flex flex-col gap-3 bg-lavender p-4">
          <p className="font-display text-lg font-bold">🔮 Önce tahmin et: {level.predict.q}</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {level.predict.options.map((o, k) => {
              const state = answered === null ? "bg-white" : k === level.predict!.answer ? "bg-mint-deep" : k === answered ? "bg-pink-deep" : "bg-white opacity-60";
              return (
                <button key={o} type="button" className={`btn ${state}`} onClick={(e) => pick(k, e.currentTarget)} disabled={answered !== null && k !== answered && k !== level.predict!.answer}>
                  {o}
                </button>
              );
            })}
          </div>
          {answered !== null && (
            <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-white p-3 text-sm md:text-base">
              {answered === level.predict.answer ? "✅ Doğru! " : "❌ Olmadı! "}
              {level.predict.explain}
            </motion.p>
          )}
        </div>
      )}

      <div className="relative">
        <GasLab
          api={api}
          mode={level.mode}
          locks={locks}
          limitV={level.limitV}
          limitP={level.limitP?.(c)}
          targetV={level.targetV}
          popped={!!popped}
          tLockMsg={level.predict && answered === null ? "Önce yukarıdaki tahmin sorusunu cevapla!" : undefined}
          footer={
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" className="btn !py-1.5 bg-white text-sm" onClick={() => (play("click"), setHint(true))} disabled={hint}>
                💡 İpucu
              </button>
              <button type="button" className="btn !py-1.5 bg-white text-sm" onClick={retry}>
                🔄 Baştan
              </button>
              {hint && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full rounded-2xl bg-white/80 p-2 text-sm">
                  💡 {level.hint}
                </motion.p>
              )}
            </div>
          }
        />
        <AnimatePresence>
          {popped && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 flex items-start justify-center rounded-[1.75rem] bg-ink/25 p-4 pt-16 backdrop-blur-[2px]"
            >
              <motion.div
                initial={{ scale: 0.3, rotate: -12 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", bounce: 0.6 }}
                className="card flex max-w-sm flex-col items-center gap-2 bg-pink p-5 text-center"
              >
                <motion.div className="text-6xl" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 0.6, repeat: 2 }}>
                  💥
                </motion.div>
                <h4 className="text-2xl font-extrabold">PATLADI!</h4>
                <p>{popped}</p>
                <Robo mood="sad" size={90} holding="none" />
                <button type="button" className="btn bg-lemon-deep" onClick={retry}>
                  Tekrar dene 🔁
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {won && (
          <motion.div ref={winRef} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="card flex flex-col items-center gap-3 bg-mint p-5 text-center md:flex-row md:text-left">
            <Robo mood="excited" size={100} holding="flask" />
            <div className="flex-1">
              <h4 className="text-2xl font-extrabold">Görev tamam! 🎉</h4>
              <Stars n={stars} size="text-3xl" />
              <p className="mt-1">{level.done(c)}</p>
            </div>
            <button type="button" className="btn bg-lemon-deep" onClick={onNext}>
              {isLast ? "Quiz'e geç! ❓" : "Sonraki görev →"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Challenges({ onFinish }: { onFinish: () => void }) {
  const [idx, setIdx] = useState(0);
  const [stars, setStars] = useState<number[]>(() => LEVELS.map(() => 0));
  const { play } = useSound();
  const total = stars.reduce((a, b) => a + b, 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {LEVELS.map((l, k) => {
          const unlocked = k === 0 || stars[k - 1] > 0 || stars[k] > 0;
          return (
            <button
              key={l.id}
              type="button"
              disabled={!unlocked}
              onClick={() => (play("click"), setIdx(k))}
              className={`btn flex-col !gap-0 !rounded-2xl !px-3 !py-1.5 text-sm ${k === idx ? "bg-sky-deep ring-4 ring-ink/20" : stars[k] ? "bg-mint" : "bg-white"}`}
            >
              <span>
                {unlocked ? l.emoji : "🔒"} {k + 1}. {l.title}
              </span>
              <span className="text-xs leading-none">{[0, 1, 2].map((s) => (s < stars[k] ? "★" : "☆")).join("")}</span>
            </button>
          );
        })}
        <span className="rounded-full border-[3px] border-ink bg-lemon px-3 py-1 font-display font-bold">⭐ {total} / {LEVELS.length * 3}</span>
      </div>
      <Run
        key={LEVELS[idx].id}
        level={LEVELS[idx]}
        isLast={idx === LEVELS.length - 1}
        onWin={(st) => setStars((s) => s.map((v, k) => (k === idx ? Math.max(v, st) : v)))}
        onNext={() => {
          if (idx < LEVELS.length - 1) {
            play("whoosh");
            setIdx(idx + 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
          } else onFinish();
        }}
      />
    </div>
  );
}
