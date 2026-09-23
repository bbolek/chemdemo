"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useState, type ReactNode } from "react";
import { useSound } from "@/lib/sound";
import MuteButton from "./MuteButton";

export interface Stage {
  key: string;
  /** Tab label, e.g. "📖 Hikaye" */
  label: string;
  content: (api: { goTo: (key: string) => void }) => ReactNode;
}

interface Props {
  title: string;
  subtitle?: string;
  emoji: string;
  /** tailwind bg class for the header pill */
  color: string;
  stages: Stage[];
  /** Optional splash / intro rendered before the stages; receives start() */
  splash?: (start: () => void) => ReactNode;
}

/** Common page frame for a topic: header, stage tabs, animated stage switching. */
export default function TopicShell({ title, subtitle, emoji, color, stages, splash }: Props) {
  const [started, setStarted] = useState(!splash);
  const [active, setActive] = useState(stages[0].key);
  const { play } = useSound();

  const goTo = (key: string) => {
    play("whoosh");
    setActive(key);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const stage = stages.find((s) => s.key === active)!;

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col gap-4 px-4 py-4 md:py-6">
      <header className="flex items-center justify-between gap-3">
        <Link href="/" className="btn bg-white !px-4" onClick={() => play("click")}>
          ← <span className="hidden sm:inline">Ana Sayfa</span>
        </Link>
        <div className={`card flex items-center gap-2 px-4 py-2 ${color}`}>
          <span className="text-2xl">{emoji}</span>
          <div className="leading-tight">
            <h1 className="text-lg font-bold md:text-2xl">{title}</h1>
            {subtitle && <p className="hidden text-sm text-ink-soft sm:block">{subtitle}</p>}
          </div>
        </div>
        <MuteButton />
      </header>

      {!started && splash ? (
        splash(() => {
          play("splash");
          setStarted(true);
        })
      ) : (
        <>
          <nav className="flex flex-wrap justify-center gap-2">
            {stages.map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={() => goTo(s.key)}
                className={`btn !py-2 text-base ${s.key === active ? "bg-ink text-white" : "bg-white"}`}
              >
                {s.label}
              </button>
            ))}
          </nav>
          <AnimatePresence mode="wait">
            <motion.section
              key={active}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              className="flex-1"
            >
              {stage.content({ goTo })}
            </motion.section>
          </AnimatePresence>
        </>
      )}
    </main>
  );
}
