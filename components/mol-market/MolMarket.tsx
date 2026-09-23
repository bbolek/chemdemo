"use client";

import TopicShell from "@/components/TopicShell";
import Splash from "@/components/Splash";
import Quiz from "@/components/Quiz";
import Cat from "@/components/Cat";
import Robo from "@/components/Robo";
import { useLang } from "@/lib/i18n";
import Story, { MINNOS } from "./Story";
import MarketGame from "./MarketGame";
import Conveyor from "./Conveyor";
import Storefront from "./Storefront";
import { QUESTIONS } from "./quiz";

export default function MolMarket() {
  const { t, pick } = useLang();
  return (
    <TopicShell
      title={t("Mol Market", "Mole Market", "Mol-Markt")}
      subtitle={t("Mol kavramı · Avogadro sayısı · mol kütlesi", "The mole · Avogadro's number · molar mass", "Stoffmenge · Avogadro-Konstante · molare Masse")}
      emoji="🧺"
      color="bg-lavender"
      splash={(start) => (
        <Splash
          title={t("Mol Market 🧺", "Mole Market 🧺", "Mol-Markt 🧺")}
          tagline={t(
            "Kasiyer Minnoş ve müdür Robo'nun marketinde atomlar tane tane değil, 6,02·10²³'lük paketlerle satılıyor! Kasaya geçmeye hazır mısın?",
            "At Cashier Cutie and manager Robo's shop, atoms aren't sold one at a time — they come in packs of 6.02×10²³! Ready to take over the till?",
            "Im Laden von Kassiererin Mietzi und Filialleiter Robo gibt es Atome nicht einzeln, sondern in Packungen zu 6,02·10²³ Stück! Bereit, die Kasse zu übernehmen?",
          )}
          onStart={start}
          color="bg-lavender"
          startLabel={t("Dükkânı aç! 🛒", "Open the shop! 🛒", "Laden aufmachen! 🛒")}
        >
          <div className="relative w-[min(560px,78vw)]">
            <Storefront className="w-full" />
            <div className="absolute -bottom-2 left-0 sm:left-2">
              <Cat color={MINNOS.color} accent={MINNOS.accent} accessory="chef" mood="wink" size={110} />
            </div>
            <div className="absolute -bottom-2 right-0 sm:right-2">
              <Robo holding="clipboard" mood="excited" size={90} />
            </div>
          </div>
        </Splash>
      )}
      stages={[
        { key: "hikaye", label: t("📖 Hikaye", "📖 Story", "📖 Geschichte"), content: ({ goTo }) => <Story onDone={() => goTo("market")} /> },
        { key: "market", label: t("🛒 Mol Market", "🛒 Mole Market", "🛒 Mol-Markt"), content: ({ goTo }) => <MarketGame onNext={() => goTo("donustur")} /> },
        { key: "donustur", label: t("⚖️ Mol Dönüştürücü", "⚖️ Mole Converter", "⚖️ Mol-Umrechner"), content: ({ goTo }) => <Conveyor onNext={() => goTo("quiz")} /> },
        {
          key: "quiz",
          label: "❓ Quiz",
          content: () => (
            <div className="flex flex-col gap-4">
              <div className="card mx-auto flex max-w-2xl items-center gap-3 bg-lavender p-3">
                <Robo holding="clipboard" size={60} bounce={false} />
                <p className="flex-1 font-semibold">
                  {t("Atom kütleleri", "Atomic masses", "Atommassen")}: H = 1, C = 12, N = 14, O = 16, Na = 23, Mg = 24, S = 32, Cl = {t("35,5", "35.5", "35,5")}, Ca = 40, Fe = 56. N<sub>A</sub> ={" "}
                  {t("6,02·10²³, NK'da 1 mol gaz = 22,4 L.", "6.02×10²³; at STP, 1 mol of gas = 22.4 L.", "6,02·10²³ mol⁻¹; bei Normbedingungen gilt: 1 mol Gas = 22,4 L.")}
                </p>
              </div>
              <Quiz questions={pick(QUESTIONS)} catColor={MINNOS.color} />
            </div>
          ),
        },
      ]}
    />
  );
}
