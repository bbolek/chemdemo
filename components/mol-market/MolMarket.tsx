"use client";

import TopicShell from "@/components/TopicShell";
import Splash from "@/components/Splash";
import Quiz from "@/components/Quiz";
import Cat from "@/components/Cat";
import Robo from "@/components/Robo";
import Story, { MINNOS } from "./Story";
import MarketGame from "./MarketGame";
import Conveyor from "./Conveyor";
import Storefront from "./Storefront";
import { QUESTIONS } from "./quiz";

export default function MolMarket() {
  return (
    <TopicShell
      title="Mol Market"
      subtitle="Mol kavramı · Avogadro sayısı · mol kütlesi"
      emoji="🧺"
      color="bg-lavender"
      splash={(start) => (
        <Splash
          title="Mol Market 🧺"
          tagline="Kasiyer Minnoş ve müdür Robo'nun marketinde atomlar tane tane değil, 6,02·10²³'lük paketlerle satılıyor! Kasaya geçmeye hazır mısın?"
          onStart={start}
          color="bg-lavender"
          startLabel="Dükkânı aç! 🛒"
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
        { key: "hikaye", label: "📖 Hikaye", content: ({ goTo }) => <Story onDone={() => goTo("market")} /> },
        { key: "market", label: "🛒 Mol Market", content: ({ goTo }) => <MarketGame onNext={() => goTo("donustur")} /> },
        { key: "donustur", label: "⚖️ Mol Dönüştürücü", content: ({ goTo }) => <Conveyor onNext={() => goTo("quiz")} /> },
        {
          key: "quiz",
          label: "❓ Quiz",
          content: () => (
            <div className="flex flex-col gap-4">
              <div className="card mx-auto flex max-w-2xl items-center gap-3 bg-lavender p-3">
                <Robo holding="clipboard" size={60} bounce={false} />
                <p className="flex-1 font-semibold">
                  Atom kütleleri: H = 1, C = 12, N = 14, O = 16, Na = 23, Mg = 24, S = 32, Cl = 35,5, Ca = 40, Fe = 56. N<sub>A</sub> = 6,02·10²³, NK&apos;da 1 mol gaz = 22,4 L.
                </p>
              </div>
              <Quiz questions={QUESTIONS} catColor={MINNOS.color} />
            </div>
          ),
        },
      ]}
    />
  );
}
