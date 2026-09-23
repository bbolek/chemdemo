"use client";

import { motion } from "framer-motion";
import Cat from "@/components/Cat";
import Robo from "@/components/Robo";
import Quiz from "@/components/Quiz";
import Splash from "@/components/Splash";
import TopicShell from "@/components/TopicShell";
import { useLang } from "@/lib/i18n";
import LabGame from "./LabGame";
import Story, { MIRMIR } from "./Story";
import Titration from "./Titration";
import { PhScale } from "./Props";
import { QUESTIONS } from "./questions";

const SUSPECTS = ["🍋", "🧼", "🥛", "🧴", "🍶", "🥤"];

export default function AsitBazTopic() {
  const { t, pick } = useLang();
  return (
    <TopicShell
      title={t("Asit mi Baz mı?", "Acid or Base?", "Säure oder Base?")}
      subtitle={t("Dedektif Mırmır ile pH ve nötrleşme", "pH and neutralization with Detective Purr", "pH-Wert und Neutralisation mit Detektiv Schnurr")}
      emoji="🍋"
      color="bg-lemon"
      splash={(start) => (
        <Splash
          title={t("🔍 Mutfak Gizemi", "🔍 The Kitchen Mystery", "🔍 Das Küchen-Rätsel")}
          tagline={t(
            "Mutfakta ekşi, kaygan ve yakıcı şüpheliler var! Dedektif Mırmır ve Robo ile hangisi asit, hangisi baz, bulalım.",
            "The kitchen is full of sour, slippery and corrosive suspects! Let's team up with Detective Purr and Robo to find out which are acids and which are bases.",
            "In der Küche treiben sich saure, glitschige und ätzende Verdächtige herum! Finde mit Detektiv Schnurr und Robo heraus, wer eine Säure und wer eine Base ist.",
          )}
          color="bg-lemon"
          onStart={start}
          startLabel={t("Soruşturmayı Başlat! 🕵️", "Start the Investigation! 🕵️", "Ermittlung starten! 🕵️")}
        >
          <Cat color={MIRMIR.color} accent={MIRMIR.accent} accessory="detective" mood="wink" size={170} />
          <div className="flex max-w-[180px] flex-wrap justify-center gap-1 pb-6">
            {SUSPECTS.map((e, k) => (
              <motion.span
                key={k}
                className="text-4xl"
                animate={{ y: [0, -10, 0], rotate: [0, k % 2 ? 10 : -10, 0] }}
                transition={{ duration: 1.8 + k * 0.2, repeat: Infinity, delay: k * 0.15 }}
              >
                {e}
              </motion.span>
            ))}
          </div>
          <Robo size={140} holding="flask" mood="excited" />
        </Splash>
      )}
      stages={[
        { key: "hikaye", label: t("📖 Hikaye", "📖 Story", "📖 Geschichte"), content: ({ goTo }) => <Story onDone={() => goTo("lab")} /> },
        { key: "lab", label: t("🧪 Laboratuvar", "🧪 Lab", "🧪 Labor"), content: ({ goTo }) => <LabGame onNext={() => goTo("titrasyon")} /> },
        { key: "titrasyon", label: t("⚗️ Titrasyon", "⚗️ Titration", "⚗️ Titration"), content: ({ goTo }) => <Titration onNext={() => goTo("quiz")} /> },
        {
          key: "quiz",
          label: "❓ Quiz",
          content: () => (
            <div className="flex flex-col gap-5">
              <div className="card mx-auto w-full max-w-2xl bg-lemon p-4">
                <p className="mb-2 text-center font-display font-bold">
                  {t("Hatırla: pH 7 nötr · 7'den küçük asidik · 7'den büyük bazik", "Remember: pH 7 is neutral · below 7 is acidic · above 7 is basic", "Merke: pH 7 ist neutral · unter 7 sauer · über 7 basisch")}
                </p>
                <PhScale compact />
              </div>
              <Quiz questions={pick(QUESTIONS)} catColor={MIRMIR.color} />
            </div>
          ),
        },
      ]}
    />
  );
}
