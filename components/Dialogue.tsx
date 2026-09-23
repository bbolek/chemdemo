"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import { useSound } from "@/lib/sound";
import { useLang } from "@/lib/i18n";

export interface Speaker {
  name: string;
  /** Bubble color (tailwind bg-* class) */
  bubble: string;
  /** Render the character. `talking` is true while text is typing. */
  render: (opts: { talking: boolean; mood?: string }) => ReactNode;
  side: "left" | "right";
}

export interface DialogueLine {
  speaker: string;
  text: string;
  mood?: string;
  /** Optional visual shown under the bubble (formula, mini-illustration...) */
  visual?: ReactNode;
}

interface Props {
  speakers: Record<string, Speaker>;
  lines: DialogueLine[];
  onDone?: () => void;
  doneLabel?: string;
}

/**
 * Story-mode dialogue. Characters stand on the sides, typewriter text in a bubble.
 * Click "Devam" (or the bubble) to advance.
 */
export default function Dialogue({ speakers, lines, onDone, doneLabel }: Props) {
  const { t } = useLang();
  const [i, setI] = useState(0);
  const [shown, setShown] = useState(0);
  const { play } = useSound();
  const line = lines[i];
  const full = shown >= line.text.length;

  useEffect(() => {
    setShown(0);
    const id = setInterval(() => {
      setShown((s) => {
        if (s >= line.text.length) {
          clearInterval(id);
          return s;
        }
        if (s % 3 === 0) play("tick");
        return s + 1;
      });
    }, 22);
    return () => clearInterval(id);
  }, [i, line.text, play]);

  const next = () => {
    if (!full) return setShown(line.text.length);
    play("click");
    if (i < lines.length - 1) setI(i + 1);
    else onDone?.();
  };

  const left = Object.entries(speakers).filter(([, s]) => s.side === "left");
  const right = Object.entries(speakers).filter(([, s]) => s.side === "right");
  const sp = speakers[line.speaker];

  const renderChar = ([key, s]: [string, Speaker]) => (
    <motion.div
      key={key}
      animate={{ scale: key === line.speaker ? 1 : 0.85, opacity: key === line.speaker ? 1 : 0.55 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className="flex flex-col items-center"
    >
      {s.render({ talking: key === line.speaker && !full, mood: key === line.speaker ? line.mood : undefined })}
      <span className="font-display text-sm font-bold text-ink-soft">{s.name}</span>
    </motion.div>
  );

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
      <div className="flex items-end justify-between gap-2">
        <div className="flex gap-2">{left.map(renderChar)}</div>
        <div className="flex gap-2">{right.map(renderChar)}</div>
      </div>

      <AnimatePresence mode="wait">
        <motion.button
          key={i}
          type="button"
          onClick={next}
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10 }}
          className={`card relative w-full cursor-pointer p-5 text-left ${sp.bubble}`}
        >
          <span className="font-display mb-1 block text-sm font-bold text-ink-soft">{sp.name}</span>
          <p className="min-h-[3.5rem] text-lg leading-relaxed md:text-xl">
            {line.text.slice(0, shown)}
            {!full && <span className="animate-pulse">▍</span>}
          </p>
          {full && line.visual && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mt-3">
              {line.visual}
            </motion.div>
          )}
        </motion.button>
      </AnimatePresence>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          {lines.map((_, k) => (
            <span key={k} className={`h-2.5 rounded-full transition-all ${k === i ? "w-6 bg-ink" : k < i ? "w-2.5 bg-ink-soft" : "w-2.5 bg-ink/20"}`} />
          ))}
        </div>
        <div className="flex gap-2">
          {i > 0 && (
            <button type="button" className="btn whitespace-nowrap bg-white" onClick={() => (play("click"), setI(i - 1))}>
              ← {t("Geri", "Back")}
            </button>
          )}
          <button type="button" className="btn whitespace-nowrap bg-lemon-deep" onClick={next}>
            {i < lines.length - 1 ? t("Devam →", "Next →") : (doneLabel ?? t("Hadi oynayalım! 🎮", "Let's play! 🎮"))}
          </button>
        </div>
      </div>
    </div>
  );
}
