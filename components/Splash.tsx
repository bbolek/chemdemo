"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useLang } from "@/lib/i18n";

interface Props {
  title: string;
  tagline: string;
  /** Characters / art shown in the middle */
  children: ReactNode;
  onStart: () => void;
  /** tailwind bg class */
  color?: string;
  startLabel?: string;
}

/** Big animated intro screen for a topic ("splash"). Floating bubbles + bouncy title. */
export default function Splash({ title, tagline, children, onStart, color = "bg-lavender", startLabel }: Props) {
  const { t } = useLang();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`card relative flex flex-1 flex-col items-center justify-center gap-6 overflow-hidden p-8 text-center ${color}`}
    >
      {Array.from({ length: 14 }).map((_, k) => (
        <motion.span
          key={k}
          className="pointer-events-none absolute rounded-full border-2 border-white/80 bg-white/40"
          style={{ width: 14 + ((k * 7) % 36), height: 14 + ((k * 7) % 36), left: `${(k * 37) % 100}%`, bottom: -40 }}
          animate={{ y: [0, -700], opacity: [0, 1, 0] }}
          transition={{ duration: 6 + (k % 5), repeat: Infinity, delay: k * 0.5, ease: "easeOut" }}
        />
      ))}
      <motion.h2
        className="relative text-4xl font-extrabold md:text-6xl"
        initial={{ y: -40 }}
        animate={{ y: 0, rotate: [-2, 2, -2] }}
        transition={{ y: { type: "spring", bounce: 0.6 }, rotate: { duration: 3, repeat: Infinity } }}
      >
        {title}
      </motion.h2>
      <p className="relative max-w-xl text-lg md:text-xl">{tagline}</p>
      <div className="relative flex flex-wrap items-end justify-center gap-4">{children}</div>
      <motion.button
        type="button"
        className="btn relative bg-pink-deep !px-8 !py-4 !text-2xl"
        onClick={onStart}
        animate={{ scale: [1, 1.07, 1] }}
        transition={{ duration: 1.4, repeat: Infinity }}
      >
        {startLabel ?? t("Başla! 🚀", "Start! 🚀", "Los geht's! 🚀")}
      </motion.button>
    </motion.div>
  );
}
