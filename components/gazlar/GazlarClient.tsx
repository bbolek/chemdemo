"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Cat from "@/components/Cat";
import Quiz from "@/components/Quiz";
import Robo from "@/components/Robo";
import Splash from "@/components/Splash";
import TopicShell from "@/components/TopicShell";
import CatHead, { CAT_COLORS } from "./CatHead";
import Challenges from "./Challenges";
import MiniBox from "./MiniBox";
import { QUESTIONS } from "./questions";
import Sandbox from "./Sandbox";
import Story, { POFUDUK } from "./Story";

function SplashArt() {
  return (
    <>
      <Cat {...POFUDUK} mood="happy" size={130} />
      <div className="flex flex-col items-center gap-2">
        <div className="flex gap-1">
          {CAT_COLORS.map((c, k) => (
            <motion.span key={c} animate={{ y: [0, -18, 0] }} transition={{ duration: 0.7, repeat: Infinity, delay: k * 0.12, ease: "easeOut" }}>
              <CatHead size={30} color={c} />
            </motion.span>
          ))}
        </div>
        <MiniBox count={10} speed={1.4} width={230} height={140} label="💨 gaz kedileri" />
      </div>
      <Robo mood="excited" holding="flask" size={130} />
    </>
  );
}

export default function GazlarClient() {
  return (
    <TopicShell
      title="Gaz Kedileri"
      subtitle="11. Sınıf · Gazlar ve gaz yasaları"
      emoji="💨"
      color="bg-sky"
      splash={(start) => (
        <Splash
          title="Gaz Kedileri 💨"
          tagline="Minik gaz kedileri kutuda koşturuyor! Pistonu it, kutuyu ısıt, kedi ekle: basınç, hacim ve sıcaklığın sırrını keşfet."
          color="bg-sky"
          onStart={start}
          startLabel="Kutuyu aç! 🐱"
        >
          <SplashArt />
        </Splash>
      )}
      stages={[
        { key: "hikaye", label: "📖 Hikaye", content: ({ goTo }) => <Story onDone={() => goTo("kutu")} /> },
        { key: "kutu", label: "🎮 Gaz Kutusu", content: ({ goTo }) => <Sandbox onNext={() => goTo("gorev")} /> },
        { key: "gorev", label: "🏆 Görevler", content: ({ goTo }) => <Challenges onFinish={() => goTo("quiz")} /> },
        {
          key: "quiz",
          label: "❓ Quiz",
          content: () => (
            <div className="flex flex-col items-center gap-4">
              <div className="card flex w-full max-w-2xl items-center gap-3 bg-sky p-3">
                <Cat {...POFUDUK} mood="thinking" size={70} className="shrink-0" />
                <p className="text-base md:text-lg">
                  Son sınav! Hesap sorularında <b>sıcaklığı Kelvin&apos;e çevirmeyi</b> ve <b>R = 0,082</b> değerini unutma. 🧠
                </p>
              </div>
              <Quiz questions={QUESTIONS} catColor={POFUDUK.color} />
              <Link href="/" className="btn bg-white">
                🏠 Diğer konulara dön
              </Link>
            </div>
          ),
        },
      ]}
    />
  );
}
