"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Cat from "@/components/Cat";
import Robo from "@/components/Robo";
import MuteButton from "@/components/MuteButton";
import { TOPICS } from "@/lib/topics";
import { useSound } from "@/lib/sound";

const FLOATERS = ["⚗️", "🧪", "⚛️", "💧", "🔬", "✨", "🫧", "🧫"];

export default function Home() {
  const { play } = useSound();

  return (
    <main className="relative mx-auto flex min-h-dvh w-full max-w-6xl flex-col gap-8 overflow-hidden px-4 py-6">
      {FLOATERS.map((e, k) => (
        <motion.span
          key={k}
          className="pointer-events-none absolute text-3xl opacity-60"
          style={{ left: `${(k * 13 + 4) % 95}%`, top: `${(k * 23 + 10) % 85}%` }}
          animate={{ y: [0, -18, 0], rotate: [0, 12, -12, 0] }}
          transition={{ duration: 4 + k * 0.4, repeat: Infinity, ease: "easeInOut" }}
        >
          {e}
        </motion.span>
      ))}

      <div className="flex justify-end">
        <MuteButton />
      </div>

      <section className="relative flex flex-col items-center gap-4 text-center">
        <div className="flex items-end gap-2">
          <Cat color="#ffd6e0" accessory="goggles" mood="wink" size={140} />
          <Robo size={120} holding="flask" />
          <Cat color="#d6ecff" accent="#8cc8ff" accessory="bowtie" size={140} flip />
        </div>
        <motion.h1
          className="text-5xl font-extrabold md:text-7xl"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.55 }}
        >
          Kimya <span className="text-pink-deep">Kedileri</span>
        </motion.h1>
        <p className="max-w-2xl text-lg md:text-xl">
          Kediler ve laboratuvar asistanı <b>Robo</b> ile kimyayı oynayarak öğren! Bir konu seç, hikâyeyi dinle, oyunu oyna, quiz&apos;i geç. 🐾
        </p>
      </section>

      <section className="relative grid gap-5 sm:grid-cols-2">
        {TOPICS.map((t, k) => (
          <motion.div
            key={t.slug}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 + k * 0.1, type: "spring", bounce: 0.4 }}
            whileHover={{ y: -6, rotate: k % 2 ? 1 : -1 }}
          >
            <Link
              href={`/${t.slug}/`}
              onClick={() => play("pop")}
              onMouseEnter={() => play("tick")}
              className={`card flex h-full items-center gap-4 p-5 ${t.color}`}
            >
              <Cat color={t.catColor} size={110} bounce={false} mood={k % 2 ? "happy" : "wink"} />
              <div className="flex-1">
                <span className="rounded-full border-2 border-ink bg-white px-2 py-0.5 text-xs font-bold">{t.grade}</span>
                <h2 className="mt-1 text-2xl font-bold">
                  {t.emoji} {t.title}
                </h2>
                <p className="text-ink-soft">{t.blurb}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </section>

      <footer className="relative pb-4 text-center text-sm text-ink-soft">Lise öğrencileri için sevgiyle yapıldı 💜 · Sesli deneyim için 🔊</footer>
    </main>
  );
}
