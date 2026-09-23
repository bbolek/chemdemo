"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Cat from "@/components/Cat";
import Robo from "@/components/Robo";
import { useSound } from "@/lib/sound";
import { celebrate, sparkleAt } from "@/lib/confetti";
import { Beaker, Litmus, PhMeter, PhScale } from "./Props";
import { MIRMIR } from "./Story";
import { kindOf, phColor, type Kind } from "./ph";

interface Item {
  id: string;
  name: string;
  emoji: string;
  ph: number;
  fact: string;
}

const ITEMS: Item[] = [
  { id: "limon", name: "Limon suyu", emoji: "🍋", ph: 2, fact: "Limonda sitrik asit vardır. Ekşi tat, asitlerin tipik özelliğidir." },
  { id: "kola", name: "Kola", emoji: "🥤", ph: 2.5, fact: "Kolada fosforik asit ve karbonik asit bulunur. Diş minesine zarar verebilir!" },
  { id: "sirke", name: "Sirke", emoji: "🍶", ph: 3, fact: "Sirkenin ekşiliği asetik asitten (CH₃COOH) gelir." },
  { id: "kahve", name: "Kahve", emoji: "☕", ph: 5, fact: "Kahve hafif asidiktir. Limondan yaklaşık 1000 kat daha az asidik!" },
  { id: "sut", name: "Süt", emoji: "🥛", ph: 6.5, fact: "Süt çok hafif asidiktir. Bekledikçe laktik asit artar, pH düşer ve süt ekşir." },
  { id: "su", name: "Saf su", emoji: "💧", ph: 7, fact: "Saf suda H⁺ ve OH⁻ derişimleri eşittir, bu yüzden tam nötrdür." },
  { id: "yumurta", name: "Yumurta akı", emoji: "🥚", ph: 8, fact: "Yumurta akı hafif baziktir. Yumurta bayatladıkça pH'ı yükselir." },
  { id: "karbonat", name: "Karbonat", emoji: "🧂", ph: 8.5, fact: "Karbonat (NaHCO₃) hafif baziktir. Mide ekşimesinde fazla asidi nötrleştirir." },
  { id: "sabun", name: "Sabunlu su", emoji: "🧼", ph: 10, fact: "Sabun baziktir. Elde bıraktığı kayganlık hissi bazların tipik özelliğidir." },
  { id: "camasir", name: "Çamaşır suyu", emoji: "🧴", ph: 12.5, fact: "Çamaşır suyu kuvvetli baziktir. Asla tuz ruhu gibi asitli temizleyicilerle karıştırma: zehirli klor gazı çıkar!" },
  { id: "lavabo", name: "Lavabo açıcı", emoji: "🪠", ph: 14, fact: "Lavabo açıcılarda NaOH bulunur, pH'ı 14'e yaklaşır. Çok yakıcıdır: eldiven ve gözlük şart!" },
  { id: "domates", name: "Domates suyu", emoji: "🍅", ph: 4.5, fact: "Domates hafif asidiktir. Sitrik ve malik asit içerir." },
];

const KINDS: { k: Kind; label: string; cls: string; emoji: string }[] = [
  { k: "asidik", label: "Asidik", cls: "bg-pink-deep", emoji: "🍋" },
  { k: "nötr", label: "Nötr", cls: "bg-mint-deep", emoji: "💧" },
  { k: "bazik", label: "Bazik", cls: "bg-lavender-deep", emoji: "🧼" },
];

const START_PH = 7;

type Phase = "pick" | "guess" | "falling" | "result";

export default function LabGame({ onNext }: { onNext: () => void }) {
  const { play } = useSound();
  const [phase, setPhase] = useState<Phase>("pick");
  const [item, setItem] = useState<Item | null>(null);
  const [guess, setGuess] = useState<Kind | null>(null);
  const [ph, setPh] = useState<number | null>(null);
  const [splashKey, setSplashKey] = useState(0);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [finished, setFinished] = useState(false);
  const benchRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));

  const tested = Object.keys(results).length;
  const score = Object.values(results).filter(Boolean).length;
  const liquidPh = ph ?? START_PH;
  const correct = item && guess ? kindOf(item.ph) === guess : false;

  const choose = (it: Item) => {
    if (results[it.id] !== undefined) return;
    play("pop");
    setItem(it);
    setGuess(null);
    setPh(null);
    setPhase("guess");
  };

  const doGuess = (k: Kind) => {
    if (!item) return;
    play("click");
    setGuess(k);
    setPhase("falling");
    if (window.innerWidth < 768) benchRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    play("whoosh");
    later(() => {
      play("splash");
      setSplashKey((s) => s + 1);
      setPh(item.ph);
    }, 650);
    later(() => play("bubble"), 1100);
    later(() => {
      const ok = kindOf(item.ph) === k;
      setResults((r) => ({ ...r, [item.id]: ok }));
      setPhase("result");
      if (ok) {
        play("success");
        sparkleAt(benchRef.current);
      } else play("fail");
    }, 1500);
  };

  const nextRound = () => {
    play("click");
    setItem(null);
    setGuess(null);
    setPh(null);
    setPhase("pick");
    if (tested >= ITEMS.length) {
      setFinished(true);
      play("levelup");
      celebrate();
    }
  };

  const reset = () => {
    play("click");
    setResults({});
    setFinished(false);
    setItem(null);
    setPh(null);
    setPhase("pick");
  };

  const stars = score >= 11 ? 3 : score >= 8 ? 2 : 1;
  const catMood = phase === "result" ? (correct ? "love" : "surprised") : phase === "guess" ? "thinking" : "happy";
  const bubbleText = finished
    ? "Dosya kapandı! Sırada titrasyon var. ⚗️"
    : phase === "pick"
      ? "Bir şüpheli seç! Önce tahmin, sonra kanıt. 🔍"
      : phase === "guess"
        ? `${item?.name}: asidik mi, nötr mü, bazik mi?`
        : phase === "falling"
          ? "Ve... şlap! 💦"
          : correct
            ? "Doğru tahmin, ortak! 🎉"
            : "Hmm, kanıtlar başka diyor! 🙀";

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
      <div className="card flex flex-wrap items-center justify-between gap-2 bg-lemon px-4 py-3">
        <h2 className="text-xl font-bold md:text-2xl">🧪 Mutfak Laboratuvarı</h2>
        <div className="flex items-center gap-3 font-display font-bold">
          <span className="rounded-full border-2 border-ink bg-white px-3 py-0.5">
            🔍 {tested}/{ITEMS.length}
          </span>
          <span className="rounded-full border-2 border-ink bg-mint px-3 py-0.5">✅ {score}</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[1.05fr_1fr]">
        {/* Lab bench */}
        <div ref={benchRef} className="card relative overflow-hidden p-0">
          <div
            className="relative h-full min-h-[380px] sm:min-h-[430px]"
            style={{
              backgroundColor: "#fdf6ff",
              backgroundImage:
                "linear-gradient(90deg, rgba(182,156,255,.13) 2px, transparent 2px), linear-gradient(rgba(182,156,255,.13) 2px, transparent 2px)",
              backgroundSize: "34px 34px",
            }}
          >
            {/* shelf */}
            <div className="absolute left-4 right-4 top-16 h-3 rounded-full border-2 border-ink bg-peach-deep/70" />
            <div className="absolute left-6 top-6 flex gap-2 text-2xl opacity-80">
              <span>🧫</span>
              <span>⚗️</span>
              <span>🔬</span>
            </div>
            {/* speech */}
            <div className="absolute right-3 top-3 z-10 flex max-w-[62%] items-start gap-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={bubbleText}
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="rounded-2xl border-2 border-ink bg-white px-3 py-1.5 text-sm font-bold shadow"
                >
                  {bubbleText}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* bench surface */}
            <div className="absolute inset-x-0 bottom-0 h-24 border-t-3 border-ink bg-[#e9dcff]">
              <div className="h-4 bg-[#d8c6ff]" />
            </div>

            {/* beaker */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
              <AnimatePresence>
                {phase === "falling" && item && (
                  <motion.span
                    key={item.id}
                    className="absolute left-1/2 z-10 -ml-6 text-5xl"
                    initial={{ y: -240, rotate: -30, opacity: 0 }}
                    animate={{ y: [-240, 60], rotate: [-30, 200], opacity: [1, 1, 0] }}
                    transition={{ duration: 0.7, ease: "easeIn" }}
                  >
                    {item.emoji}
                  </motion.span>
                )}
              </AnimatePresence>
              <div className="w-[170px] sm:w-[200px]">
                <Beaker color={phColor(liquidPh)} level={0.55} width={200} splashKey={splashKey} label={ph === null ? "saf su" : `pH ${String(liquidPh).replace(".", ",")}`} />
              </div>
            </div>

            {/* meter + litmus */}
            <div className="absolute bottom-3 right-2 flex origin-bottom-right scale-[0.8] flex-col items-center sm:right-4 sm:scale-100">
              <PhMeter ph={ph} size={136} />
            </div>
            <div className="absolute bottom-4 left-3 flex items-end gap-1 sm:left-5">
              <div className="-mb-1">
                <Cat color={MIRMIR.color} accent={MIRMIR.accent} accessory="detective" mood={catMood} size={92} />
              </div>
            </div>
            <div className="absolute bottom-28 right-6 flex flex-col items-center text-xs font-bold sm:right-10">
              <Litmus ph={phase === "result" ? ph : null} size={30} />
              turnusol
            </div>
          </div>
        </div>

        {/* Control panel */}
        <div className="card flex flex-col gap-3 p-4">
          <AnimatePresence mode="wait">
            {finished ? (
              <motion.div key="fin" initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center gap-3 text-center">
                <h3 className="text-2xl font-bold">Gizem çözüldü! 🕵️</h3>
                <div className="flex gap-1 text-5xl">
                  {[1, 2, 3].map((s) => (
                    <motion.span key={s} initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: s * 0.25, type: "spring" }}>
                      {s <= stars ? "⭐" : "☆"}
                    </motion.span>
                  ))}
                </div>
                <p className="text-lg">
                  {ITEMS.length} şüpheliden <b>{score}</b> tanesini doğru tahmin ettin.
                </p>
                <div className="w-full">
                  <PhScale compact />
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  <button type="button" className="btn bg-white" onClick={reset}>
                    Tekrar Oyna 🔁
                  </button>
                  <button type="button" className="btn bg-lemon-deep" onClick={onNext}>
                    Titrasyona geç ⚗️
                  </button>
                </div>
              </motion.div>
            ) : phase === "pick" ? (
              <motion.div key="pick" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-3">
                <p className="font-display text-lg font-bold">Hangi şüpheliyi test edelim?</p>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {ITEMS.map((it) => {
                    const r = results[it.id];
                    const done = r !== undefined;
                    return (
                      <motion.button
                        key={it.id}
                        type="button"
                        disabled={done}
                        whileHover={done ? undefined : { y: -3, rotate: -2 }}
                        whileTap={done ? undefined : { scale: 0.92 }}
                        onClick={() => choose(it)}
                        className={`relative flex flex-col items-center gap-0.5 rounded-2xl border-3 border-ink p-2 text-center text-xs font-bold leading-tight sm:text-sm ${
                          done ? "opacity-90" : "bg-cream hover:bg-lemon"
                        }`}
                        style={done ? { background: phColor(it.ph) } : undefined}
                      >
                        <span className="text-3xl">{it.emoji}</span>
                        {it.name}
                        {done && (
                          <span className="absolute -right-1.5 -top-1.5 rounded-full border-2 border-ink bg-white px-1 text-[11px]">
                            {r ? "✅" : "❌"} {it.ph}
                          </span>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              item && (
                <motion.div key="round" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 rounded-2xl border-3 border-ink bg-peach p-3">
                    <motion.span className="text-5xl" animate={{ rotate: [-8, 8, -8] }} transition={{ duration: 1.6, repeat: Infinity }}>
                      {item.emoji}
                    </motion.span>
                    <div>
                      <p className="text-sm font-bold text-ink-soft">Şüpheli</p>
                      <p className="font-display text-2xl font-bold">{item.name}</p>
                    </div>
                  </div>
                  <p className="font-display text-lg font-bold">1) Tahminin ne?</p>
                  <div className="grid grid-cols-3 gap-2">
                    {KINDS.map((k) => {
                      const picked = guess === k.k;
                      const isAnswer = phase === "result" && kindOf(item.ph) === k.k;
                      return (
                        <motion.button
                          key={k.k}
                          type="button"
                          disabled={phase !== "guess"}
                          whileTap={{ scale: 0.92 }}
                          animate={phase === "result" && picked && !isAnswer ? { x: [0, -6, 6, -4, 4, 0] } : isAnswer ? { scale: [1, 1.08, 1] } : {}}
                          onClick={() => doGuess(k.k)}
                          className={`btn !px-2 !text-base ${k.cls} ${phase !== "guess" && !picked && !isAnswer ? "!opacity-40" : ""} ${
                            isAnswer ? "ring-4 ring-mint-deep ring-offset-2" : ""
                          }`}
                        >
                          {k.emoji} {k.label}
                        </motion.button>
                      );
                    })}
                  </div>
                  {phase === "guess" && <p className="text-sm text-ink-soft">Tahmin ettiğin anda madde behere dökülecek! 💦</p>}
                  {phase === "result" && (
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3">
                      <div className={`rounded-2xl border-3 border-ink p-3 ${correct ? "bg-mint" : "bg-pink"}`}>
                        <p className="font-display text-xl font-bold">
                          {correct ? "Doğru! 🎉" : "Olmadı! 🙀"} pH ≈ {item.ph} → {kindOf(item.ph).toUpperCase()}
                        </p>
                        <p className="mt-1">{item.fact}</p>
                        <p className="mt-1 text-sm font-semibold text-ink-soft">
                          Turnusol: {kindOf(item.ph) === "asidik" ? "kırmızı 🔴" : kindOf(item.ph) === "bazik" ? "mavi 🔵" : "renk değiştirmez 🟣"}
                        </p>
                      </div>
                      <PhScale marker={item.ph} compact />
                      <button type="button" className="btn self-end bg-lemon-deep" onClick={nextRound}>
                        {tested >= ITEMS.length ? "Sonucu gör 🏁" : "Beheri yıka, sıradaki! 🧽"}
                      </button>
                    </motion.div>
                  )}
                </motion.div>
              )
            )}
          </AnimatePresence>
          {!finished && (
            <div className="mt-auto flex items-center justify-between gap-2 border-t-2 border-dashed border-ink/20 pt-3">
              <div className="flex items-center gap-2">
                <Robo size={52} mood="happy" holding="none" bounce={false} />
                <span className="text-sm text-ink-soft">Tümünü test et, yıldızları topla!</span>
              </div>
              <button type="button" className="btn bg-white !px-3 !py-1.5 !text-sm" onClick={onNext}>
                Titrasyon →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
