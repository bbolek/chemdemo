"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useState, type ReactNode } from "react";
import { useSound } from "@/lib/sound";
import MuteButton from "./MuteButton";
import LangSwitch from "./LangSwitch";
import { useLang } from "@/lib/i18n";

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
  const { t } = useLang();

  const goTo = (key: string) => {
    play("whoosh");
    setActive(key);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const stage = stages.find((s) => s.key === active)!;

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col gap-4 px-4 py-4 md:py-6">
      <header className="flex items-center justify-between gap-2 sm:gap-3">
        <Link href="/" className="btn shrink-0 bg-white !px-3 sm:!px-4" onClick={() => play("click")}>
          ← <span className="hidden sm:inline">{t("Ana Sayfa", "Home")}</span>
        </Link>
        <div className={`card flex min-w-0 items-center gap-2 px-3 py-2 sm:px-4 ${color}`}>
          <span className="hidden text-2xl sm:inline">{emoji}</span>
          <div className="min-w-0 leading-tight">
            <h1 className="truncate text-base font-bold sm:text-lg md:text-2xl">{title}</h1>
            {subtitle && <p className="hidden text-sm text-ink-soft sm:block">{subtitle}</p>}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <LangSwitch />
          <MuteButton />
        </div>
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
