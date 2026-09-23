"use client";

import Cat, { type CatMood } from "@/components/Cat";
import Dialogue, { type DialogueLine, type Speaker } from "@/components/Dialogue";
import Robo, { type RoboMood } from "@/components/Robo";
import MiniBox from "./MiniBox";

export const POFUDUK = { color: "#d6ecff", accent: "#8cc8ff", accessory: "glasses" as const };

const speakers: Record<string, Speaker> = {
  pofuduk: {
    name: "Profesör Pofuduk",
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
};

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

const lines: DialogueLine[] = [
  { speaker: "pofuduk", mood: "happy", text: "Merhaba! Ben Profesör Pofuduk. Bugün sana gözle göremediğimiz bir dünyayı göstereceğim: GAZLARI!" },
  {
    speaker: "pofuduk",
    mood: "wink",
    text: "Gazlar görünmez ama hayal gücümüz var! Gaz taneciklerini minicik kediler gibi düşün. Bir kutunun içinde durmadan, rastgele koşturuyorlar.",
    visual: (
      <div className="flex justify-center">
        <MiniBox count={9} label="gaz kutusu" />
      </div>
    ),
  },
  {
    speaker: "robo",
    mood: "thinking",
    text: "Kinetik teori! Gaz tanecikleri sürekli ve rastgele hareket eder. Aralarında kocaman boşluklar var; bu yüzden gazlar sıkıştırılabilir.",
  },
  {
    speaker: "pofuduk",
    mood: "surprised",
    text: "Kutuyu ısıtırsak kedicikler coşar! Sıcaklık artınca taneciklerin ortalama hızı ve kinetik enerjisi artar.",
    visual: (
      <div className="flex flex-wrap justify-center gap-3">
        <MiniBox count={6} speed={0.45} width={150} height={110} label="🧊 soğuk: yavaş" />
        <MiniBox count={6} speed={2.2} width={150} height={110} hot label="🔥 sıcak: hızlı" />
      </div>
    ),
  },
  {
    speaker: "pofuduk",
    mood: "happy",
    text: "Peki basınç nedir? Kedicikler kabın duvarlarına saniyede milyarlarca kez çarpar. Bu çarpışmaların duvara uyguladığı kuvvet basıncı oluşturur.",
    visual: <Formula note="Daha sık ve daha sert çarpışma → daha yüksek basınç">💥 çarpışma = basınç</Formula>,
  },
  {
    speaker: "robo",
    mood: "excited",
    text: "Bir gazı tanımlamak için 4 şeyi ölçeriz: basınç, hacim, sıcaklık ve mol sayısı. Dördü birbirine bağlı!",
    visual: (
      <Chips
        items={[
          ["P", "basınç (atm)", "bg-lemon"],
          ["V", "hacim (L)", "bg-lavender"],
          ["T", "sıcaklık (K)", "bg-peach"],
          ["n", "mol sayısı", "bg-mint"],
        ]}
      />
    ),
  },
  {
    speaker: "pofuduk",
    mood: "thinking",
    text: "Çok önemli bir kural: gaz hesaplarında sıcaklık her zaman KELVİN olmalı! 0 K mutlak sıfırdır, yani −273 °C.",
    visual: <Formula note="Örnek: 27 °C = 27 + 273 = 300 K">K = °C + 273</Formula>,
  },
  {
    speaker: "robo",
    mood: "excited",
    text: "Ve hepsi tek bir süper denklemde buluşuyor: ideal gaz denklemi! R sabiti 0,082 L·atm/(mol·K).",
    visual: <Formula note="R = 0,082 L·atm / (mol·K)">P · V = n · R · T</Formula>,
  },
  {
    speaker: "pofuduk",
    mood: "love",
    text: "Laf yeter! Gaz Kutusu'na geç: pistonu it, kutuyu ısıt, kedi ekle ve Boyle, Charles, Gay-Lussac, Avogadro yasalarını kendi gözünle gör!",
  },
];

export default function Story({ onDone }: { onDone: () => void }) {
  return <Dialogue speakers={speakers} lines={lines} onDone={onDone} doneLabel="Gaz Kutusu'na! 🎮" />;
}
