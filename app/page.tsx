"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Cat from "@/components/Cat";
import Robo from "@/components/Robo";
import MuteButton from "@/components/MuteButton";
import LangSwitch from "@/components/LangSwitch";
import { useLang } from "@/lib/i18n";
import { TOPICS } from "@/lib/topics";
import { useSound } from "@/lib/sound";

const FLOATERS = ["⚗️", "🧪", "⚛️", "💧", "🔬", "✨", "🫧", "🧫"];

export default function Home() {
  const { play } = useSound();
  const { t, pick } = useLang();

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

      <div className="relative z-10 flex justify-end gap-2">
        <LangSwitch />
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
          {t("Kimya", "Chemistry", "Chemie")}{" "}
          <span className="text-pink-deep">{t("Kedileri", "Cats", "Katzen")}</span>
        </motion.h1>
        <p className="max-w-2xl text-lg md:text-xl">
          {t("Kediler ve laboratuvar asistanı ", "Learn chemistry by playing with cats and lab assistant ", "Lerne Chemie spielerisch mit Katzen und Laborassistent ")}
          <b>Robo</b>
          {t(
            " ile kimyayı oynayarak öğren! Bir konu seç, hikâyeyi dinle, oyunu oyna, quiz'i geç. 🐾",
            "! Pick a topic, listen to the story, play the game, ace the quiz. 🐾",
            "! Wähle ein Thema, hör dir die Geschichte an, spiel das Spiel und meistere das Quiz. 🐾",
          )}
        </p>
      </section>

      <section className="relative grid gap-5 sm:grid-cols-2">
        {TOPICS.map((tp, k) => (
          <motion.div
            key={tp.slug}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 + k * 0.1, type: "spring", bounce: 0.4 }}
            whileHover={{ y: -6, rotate: k % 2 ? 1 : -1 }}
          >
            <Link
              href={`/${tp.slug}/`}
              onClick={() => play("pop")}
              onMouseEnter={() => play("tick")}
              className={`card flex h-full items-center gap-4 p-5 ${tp.color}`}
            >
              <Cat color={tp.catColor} size={110} bounce={false} mood={k % 2 ? "happy" : "wink"} />
              <div className="flex-1">
                <span className="rounded-full border-2 border-ink bg-white px-2 py-0.5 text-xs font-bold">{pick(tp.grade)}</span>
                <h2 className="mt-1 text-2xl font-bold">
                  {tp.emoji} {pick(tp.title)}
                </h2>
                <p className="text-ink-soft">{pick(tp.blurb)}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </section>

      <footer className="relative pb-4 text-center text-sm text-ink-soft">{t("Lise öğrencileri için sevgiyle yapıldı 💜 · Sesli deneyim için 🔊", "Made with love for high school students 💜 · Best with sound 🔊", "Mit Liebe für Schüler*innen der Oberstufe gemacht 💜 · Am besten mit Ton 🔊")}</footer>
    </main>
  );
}
