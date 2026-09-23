"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Cat from "@/components/Cat";
import Quiz from "@/components/Quiz";
import Robo from "@/components/Robo";
import Splash from "@/components/Splash";
import TopicShell from "@/components/TopicShell";
import { useLang } from "@/lib/i18n";
import CatHead, { CAT_COLORS } from "./CatHead";
import Challenges from "./Challenges";
import MiniBox from "./MiniBox";
import { QUESTIONS } from "./questions";
import Sandbox from "./Sandbox";
import Story, { POFUDUK } from "./Story";

function SplashArt() {
  const { t } = useLang();
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
        <MiniBox count={10} speed={1.4} width={230} height={140} label={t("💨 gaz kedileri", "💨 gas cats", "💨 Gas-Katzen")} />
      </div>
      <Robo mood="excited" holding="flask" size={130} />
    </>
  );
}

export default function GazlarClient() {
  const { t, pick } = useLang();
  return (
    <TopicShell
      title={t("Gaz Kedileri", "Gas Cats", "Gas-Katzen")}
      subtitle={t("11. Sınıf · Gazlar ve gaz yasaları", "Grade 11 · Gases and the gas laws", "Klasse 11 · Gase und Gasgesetze")}
      emoji="💨"
      color="bg-sky"
      splash={(start) => (
        <Splash
          title={t("Gaz Kedileri 💨", "Gas Cats 💨", "Gas-Katzen 💨")}
          tagline={t(
            "Minik gaz kedileri kutuda koşturuyor! Pistonu it, kutuyu ısıt, kedi ekle: basınç, hacim ve sıcaklığın sırrını keşfet.",
            "Tiny gas cats are zooming around a box! Push the piston, heat the box, add cats: discover the secrets of pressure, volume and temperature.",
            "Winzige Gas-Katzen flitzen durch eine Box! Drück den Kolben, heiz die Box auf, füg Katzen hinzu: Entdecke die Geheimnisse von Druck, Volumen und Temperatur.",
          )}
          color="bg-sky"
          onStart={start}
          startLabel={t("Kutuyu aç! 🐱", "Open the box! 🐱", "Box öffnen! 🐱")}
        >
          <SplashArt />
        </Splash>
      )}
      stages={[
        { key: "hikaye", label: t("📖 Hikaye", "📖 Story", "📖 Geschichte"), content: ({ goTo }) => <Story onDone={() => goTo("kutu")} /> },
        { key: "kutu", label: t("🎮 Gaz Kutusu", "🎮 Gas Box", "🎮 Gas-Box"), content: ({ goTo }) => <Sandbox onNext={() => goTo("gorev")} /> },
        { key: "gorev", label: t("🏆 Görevler", "🏆 Missions", "🏆 Missionen"), content: ({ goTo }) => <Challenges onFinish={() => goTo("quiz")} /> },
        {
          key: "quiz",
          label: "❓ Quiz",
          content: () => (
            <div className="flex flex-col items-center gap-4">
              <div className="card flex w-full max-w-2xl items-center gap-3 bg-sky p-3">
                <Cat {...POFUDUK} mood="thinking" size={70} className="shrink-0" />
                <p className="text-base md:text-lg">
                  {t("Son sınav! Hesap sorularında ", "Final test! In the calculation questions, don't forget to ", "Letzter Test! Vergiss bei den Rechenaufgaben nicht, ")}
                  <b>{t("sıcaklığı Kelvin'e çevirmeyi", "convert temperature to kelvin", "die Temperatur in Kelvin umzurechnen")}</b>
                  {t(" ve ", " and to use ", " und ")}
                  <b>{t("R = 0,082", "R = 0.082", "R = 0,082")}</b>
                  {t(" değerini unutma. 🧠", ". 🧠", " zu verwenden. 🧠")}
                </p>
              </div>
              <Quiz questions={pick(QUESTIONS)} catColor={POFUDUK.color} />
              <Link href="/" className="btn bg-white">
                {t("🏠 Diğer konulara dön", "🏠 Back to all topics", "🏠 Zurück zu allen Themen")}
              </Link>
            </div>
          ),
        },
      ]}
    />
  );
}
