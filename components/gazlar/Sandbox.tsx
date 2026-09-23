"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import Cat from "@/components/Cat";
import { useLang } from "@/lib/i18n";
import { useSound } from "@/lib/sound";
import GasLab from "./GasLab";
import { MODE_LOCKS, MODES, useGas, type GasMode } from "./gas";
import { POFUDUK } from "./Story";

export default function Sandbox({ onNext }: { onNext: () => void }) {
  const [mode, setMode] = useState<GasMode>("boyle");
  const locks = MODE_LOCKS[mode];
  const api = useGas({ T: 300, cats: 10, V: 6 }, locks);
  const { play } = useSound();
  const { t, pick } = useLang();
  const info = MODES.find((m) => m.key === mode)!;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap justify-center gap-2" role="tablist" aria-label={t("Gaz yasası seç", "Choose a gas law", "Gasgesetz wählen")}>
        {MODES.map((m) => (
          <button
            key={m.key}
            type="button"
            role="tab"
            aria-selected={m.key === mode}
            onClick={() => {
              play("click");
              setMode(m.key);
            }}
            className={`btn !px-3 !py-1.5 text-sm md:text-base ${m.key === mode ? `${m.color} ring-4 ring-ink/20` : "bg-white"}`}
          >
            {m.emoji} {pick(m.short)}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`card flex items-center gap-3 p-3 md:p-4 ${info.color}`}
        >
          <Cat {...POFUDUK} mood="happy" size={84} className="shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h3 className="text-xl font-bold md:text-2xl">{pick(info.name)}</h3>
              <span className="rounded-full border-2 border-ink bg-white px-2 py-0.5 text-xs font-bold">{pick(info.constant)}</span>
              <span className="font-display text-lg font-extrabold">{pick(info.formula)}</span>
            </div>
            <p className="text-sm md:text-base">{pick(info.idea)}</p>
            <p className="mt-1 text-sm text-ink-soft">
              <b>{t("Günlük hayatta:", "In everyday life:", "Im Alltag:")}</b> {pick(info.example)}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      <GasLab api={api} mode={mode} locks={locks} />

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          className="btn bg-white"
          onClick={() => {
            play("pop");
            api.reset({ T: 300, cats: 10, V: 6 });
          }}
        >
          {t("🔄 Sıfırla", "🔄 Reset", "🔄 Zurücksetzen")}
        </button>
        <button type="button" className="btn bg-lemon-deep" onClick={onNext}>
          {t("Görevlere geç! 🏆", "On to the missions! 🏆", "Auf zu den Missionen! 🏆")}
        </button>
      </div>
    </div>
  );
}
