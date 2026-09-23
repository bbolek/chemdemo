"use client";

import Cat, { type CatMood } from "@/components/Cat";
import Dialogue, { type DialogueLine, type Speaker } from "@/components/Dialogue";
import Robo, { type RoboMood } from "@/components/Robo";
import { useMemo } from "react";
import { useLang } from "@/lib/i18n";
import MiniBox from "./MiniBox";

export const POFUDUK = { color: "#d6ecff", accent: "#8cc8ff", accessory: "glasses" as const };

const buildSpeakers = (profName: string): Record<string, Speaker> => ({
  pofuduk: {
    name: profName,
    bubble: "bg-sky",
    side: "left",
    render: ({ talking, mood }) => (
      <Cat {...POFUDUK} mood={(mood as CatMood) ?? "happy"} talking={talking} size={120} className="md:!h-[150px] md:!w-[150px]" />
    ),
  },
  robo: {
    name: "Robo",
    bubble: "bg-lavender",
    side: "right",
    render: ({ talking, mood }) => <Robo mood={(mood as RoboMood) ?? "happy"} talking={talking} holding="clipboard" size={120} className="md:!h-[150px] md:!w-[150px]" />,
  },
});

function Chips({ items }: { items: [string, string, string][] }) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {items.map(([sym, name, color]) => (
        <span key={sym} className={`rounded-2xl border-[3px] border-ink px-3 py-1 text-center ${color}`}>
          <b className="font-display text-xl">{sym}</b>
          <span className="block text-xs font-semibold">{name}</span>
        </span>
      ))}
    </div>
  );
}

const Formula = ({ children, note }: { children: string; note?: string }) => (
  <div className="mx-auto w-fit rounded-2xl border-[3px] border-dashed border-ink bg-white px-5 py-2 text-center">
    <div className="font-display text-2xl font-extrabold md:text-3xl">{children}</div>
    {note && <div className="text-sm font-semibold text-ink-soft">{note}</div>}
  </div>
);

function buildLines(t: (tr: string, en: string) => string): DialogueLine[] {
  return [
    {
      speaker: "pofuduk",
      mood: "happy",
      text: t(
        "Merhaba! Ben Profesör Pofuduk. Bugün sana gözle göremediğimiz bir dünyayı göstereceğim: GAZLARI!",
        "Hello! I'm Professor Fluffy. Today I'm going to show you a world we can't see with our eyes: GASES!",
      ),
    },
    {
      speaker: "pofuduk",
      mood: "wink",
      text: t(
        "Gazlar görünmez ama hayal gücümüz var! Gaz taneciklerini minicik kediler gibi düşün. Bir kutunun içinde durmadan, rastgele koşturuyorlar.",
        "Gases are invisible, but we have imagination! Picture gas particles as teeny-tiny cats, zooming around a box nonstop in random directions.",
      ),
      visual: (
        <div className="flex justify-center">
          <MiniBox count={9} label={t("gaz kutusu", "gas box")} />
        </div>
      ),
    },
    {
      speaker: "robo",
      mood: "thinking",
      text: t(
        "Kinetik teori! Gaz tanecikleri sürekli ve rastgele hareket eder. Aralarında kocaman boşluklar var; bu yüzden gazlar sıkıştırılabilir.",
        "Kinetic theory! Gas particles move constantly and randomly. There are huge gaps between them, which is why gases can be compressed.",
      ),
    },
    {
      speaker: "pofuduk",
      mood: "surprised",
      text: t(
        "Kutuyu ısıtırsak kedicikler coşar! Sıcaklık artınca taneciklerin ortalama hızı ve kinetik enerjisi artar.",
        "Heat the box and the kitties go wild! When temperature rises, the particles' average speed and kinetic energy increase.",
      ),
      visual: (
        <div className="flex flex-wrap justify-center gap-3">
          <MiniBox count={6} speed={0.45} width={150} height={110} label={t("🧊 soğuk: yavaş", "🧊 cold: slow")} />
          <MiniBox count={6} speed={2.2} width={150} height={110} hot label={t("🔥 sıcak: hızlı", "🔥 hot: fast")} />
        </div>
      ),
    },
    {
      speaker: "pofuduk",
      mood: "happy",
      text: t(
        "Peki basınç nedir? Kedicikler kabın duvarlarına saniyede milyarlarca kez çarpar. Bu çarpışmaların duvara uyguladığı kuvvet basıncı oluşturur.",
        "So what is pressure? The kitties bump into the container walls billions of times a second. The force of all those collisions on the walls is the pressure.",
      ),
      visual: (
        <Formula note={t("Daha sık ve daha sert çarpışma → daha yüksek basınç", "More frequent, harder collisions → higher pressure")}>
          {t("💥 çarpışma = basınç", "💥 collisions = pressure")}
        </Formula>
      ),
    },
    {
      speaker: "robo",
      mood: "excited",
      text: t(
        "Bir gazı tanımlamak için 4 şeyi ölçeriz: basınç, hacim, sıcaklık ve mol sayısı. Dördü birbirine bağlı!",
        "To describe a gas we measure 4 things: pressure, volume, temperature and amount in moles. All four are linked!",
      ),
      visual: (
        <Chips
          items={[
            ["P", t("basınç (atm)", "pressure (atm)"), "bg-lemon"],
            ["V", t("hacim (L)", "volume (L)"), "bg-lavender"],
            ["T", t("sıcaklık (K)", "temperature (K)"), "bg-peach"],
            ["n", t("mol sayısı", "moles"), "bg-mint"],
          ]}
        />
      ),
    },
    {
      speaker: "pofuduk",
      mood: "thinking",
      text: t(
        "Çok önemli bir kural: gaz hesaplarında sıcaklık her zaman KELVİN olmalı! 0 K mutlak sıfırdır, yani −273 °C.",
        "A super important rule: in gas calculations, temperature must ALWAYS be in KELVIN! 0 K is absolute zero, which is −273 °C.",
      ),
      visual: <Formula note={t("Örnek: 27 °C = 27 + 273 = 300 K", "Example: 27 °C = 27 + 273 = 300 K")}>K = °C + 273</Formula>,
    },
    {
      speaker: "robo",
      mood: "excited",
      text: t(
        "Ve hepsi tek bir süper denklemde buluşuyor: ideal gaz denklemi! R sabiti 0,082 L·atm/(mol·K).",
        "And they all come together in one super equation: the ideal gas equation! The constant R is 0.082 L·atm/(mol·K).",
      ),
      visual: <Formula note={t("R = 0,082 L·atm / (mol·K)", "R = 0.082 L·atm / (mol·K)")}>P · V = n · R · T</Formula>,
    },
    {
      speaker: "pofuduk",
      mood: "love",
      text: t(
        "Laf yeter! Gaz Kutusu'na geç: pistonu it, kutuyu ısıt, kedi ekle ve Boyle, Charles, Gay-Lussac, Avogadro yasalarını kendi gözünle gör!",
        "Enough talk! Head to the Gas Box: push the piston, heat the box, add cats, and see Boyle's, Charles's, Gay-Lussac's and Avogadro's laws with your own eyes!",
      ),
    },
  ];
}

export default function Story({ onDone }: { onDone: () => void }) {
  const { t, lang } = useLang();
  const lines = useMemo(() => buildLines(t), [t]);
  const speakers = useMemo(() => buildSpeakers(lang === "en" ? "Professor Fluffy" : "Profesör Pofuduk"), [lang]);
  return <Dialogue speakers={speakers} lines={lines} onDone={onDone} doneLabel={t("Gaz Kutusu'na! 🎮", "To the Gas Box! 🎮")} />;
}
