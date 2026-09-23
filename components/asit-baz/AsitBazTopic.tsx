"use client";

import { motion } from "framer-motion";
import Cat from "@/components/Cat";
import Robo from "@/components/Robo";
import Quiz from "@/components/Quiz";
import Splash from "@/components/Splash";
import TopicShell from "@/components/TopicShell";
import LabGame from "./LabGame";
import Story, { MIRMIR } from "./Story";
import Titration from "./Titration";
import { PhScale } from "./Props";
import { QUESTIONS } from "./questions";

const SUSPECTS = ["🍋", "🧼", "🥛", "🧴", "🍶", "🥤"];

export default function AsitBazTopic() {
  return (
    <TopicShell
      title="Asit mi Baz mı?"
      subtitle="Dedektif Mırmır ile pH ve nötrleşme"
      emoji="🍋"
      color="bg-lemon"
      splash={(start) => (
        <Splash
          title="🔍 Mutfak Gizemi"
          tagline="Mutfakta ekşi, kaygan ve yakıcı şüpheliler var! Dedektif Mırmır ve Robo ile hangisi asit, hangisi baz, bulalım."
          color="bg-lemon"
          onStart={start}
          startLabel="Soruşturmayı Başlat! 🕵️"
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
        { key: "hikaye", label: "📖 Hikaye", content: ({ goTo }) => <Story onDone={() => goTo("lab")} /> },
        { key: "lab", label: "🧪 Laboratuvar", content: ({ goTo }) => <LabGame onNext={() => goTo("titrasyon")} /> },
        { key: "titrasyon", label: "⚗️ Titrasyon", content: ({ goTo }) => <Titration onNext={() => goTo("quiz")} /> },
        {
          key: "quiz",
          label: "❓ Quiz",
          content: () => (
            <div className="flex flex-col gap-5">
              <div className="card mx-auto w-full max-w-2xl bg-lemon p-4">
                <p className="mb-2 text-center font-display font-bold">Hatırla: pH 7 nötr · 7&apos;den küçük asidik · 7&apos;den büyük bazik</p>
                <PhScale compact />
              </div>
              <Quiz questions={QUESTIONS} catColor={MIRMIR.color} />
            </div>
          ),
        },
      ]}
    />
  );
}
