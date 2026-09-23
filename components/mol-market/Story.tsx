"use client";

import Cat, { type CatMood } from "@/components/Cat";
import Robo, { type RoboMood } from "@/components/Robo";
import Dialogue, { type DialogueLine, type Speaker } from "@/components/Dialogue";
import { ELEMENTS, fmt } from "./chem";

export const MINNOS = { color: "#e8dcff", accent: "#b69cff" };

const speakers: Record<string, Speaker> = {
  minnos: {
    name: "Kasiyer Minnoş",
    bubble: "bg-lavender",
    side: "left",
    render: ({ talking, mood }) => <Cat color={MINNOS.color} accent={MINNOS.accent} accessory="chef" talking={talking} mood={(mood as CatMood) ?? "happy"} size={130} />,
  },
  robo: {
    name: "Müdür Robo",
    bubble: "bg-sky",
    side: "right",
    render: ({ talking, mood }) => <Robo talking={talking} mood={(mood as RoboMood) ?? "happy"} holding="clipboard" size={115} />,
  },
};

function Pack({ emoji, name, n, color }: { emoji: string; name: string; n: string; color: string }) {
  return (
    <div className={`flex min-w-[88px] flex-1 flex-col items-center rounded-2xl border-2 border-ink p-2 ${color}`}>
      <span className="text-3xl">{emoji}</span>
      <span className="font-display font-bold">1 {name}</span>
      <span className="text-sm font-semibold text-ink-soft">= {n} tane</span>
    </div>
  );
}

function Formula({ children, color = "bg-white" }: { children: React.ReactNode; color?: string }) {
  return <div className={`rounded-2xl border-2 border-ink px-4 py-2 text-center font-display text-xl font-bold ${color}`}>{children}</div>;
}

const lines: DialogueLine[] = [
  { speaker: "minnos", text: "Mol Market'e hoş geldin! Ben Kasiyer Minnoş. Burada atomları tek tek değil, PAKET PAKET satıyoruz! 🧺" },
  {
    speaker: "robo",
    mood: "excited",
    text: "Bip bop! Ben market müdürü Robo. Günlük hayatta da paketlerle sayarız: 1 düzine yumurta 12 tane, 1 deste gül 10 tanedir.",
    visual: (
      <div className="flex flex-wrap gap-2">
        <Pack emoji="🥚" name="düzine" n="12" color="bg-peach" />
        <Pack emoji="🌹" name="deste" n="10" color="bg-pink" />
        <Pack emoji="⚛️" name="mol" n="6,02·10²³" color="bg-lemon" />
      </div>
    ),
  },
  { speaker: "minnos", text: "Atomlar ise minnacık! O kadar küçükler ki bir paketin içine tam 6,02·10²³ tane koyuyoruz. İşte bu dev pakete 1 MOL diyoruz." },
  {
    speaker: "robo",
    mood: "surprised",
    text: "Bu sayının adı Avogadro sayısı, sembolü Nₐ. Açık yazarsak: 602 000 000 000 000 000 000 000. Yani 602'nin arkasında tam 21 sıfır!",
    visual: <Formula color="bg-lemon">1 mol = N<sub>A</sub> = 6,02·10²³ tanecik</Formula>,
  },
  {
    speaker: "minnos",
    mood: "surprised",
    text: "1 mol kum tanesi, dünyadaki bütün plajların kumundan bile kat kat fazla! 1 mol kedi maması tanesini Türkiye'nin üstüne yaysak, yüzlerce kilometre yüksekliğinde mama dağı olurdu! 😹",
  },
  {
    speaker: "robo",
    text: "Peki 1 paket (1 mol) madde kaç gram gelir? Buna mol kütlesi (M) diyoruz, birimi g/mol. Formüldeki atomların kütlelerini toplarız. İşte raf etiketlerimiz:",
    visual: (
      <div className="grid grid-cols-5 gap-1.5">
        {ELEMENTS.map((e) => (
          <div key={e.sym} className="flex flex-col items-center rounded-xl border-2 border-ink py-1" style={{ background: e.color }}>
            <span className="font-display text-lg font-extrabold leading-none">{e.sym}</span>
            <span className="text-xs font-bold">{fmt(e.mass)}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    speaker: "minnos",
    mood: "wink",
    text: "Mesela su, H₂O: 2 tane H ve 1 tane O var. 2·1 + 16 = 18 g/mol. Yani 1 mol su tam 18 gram! Bir yudum kadar. 💧",
    visual: <Formula color="bg-sky">M(H₂O) = 2·1 + 1·16 = 18 g/mol</Formula>,
  },
  {
    speaker: "robo",
    mood: "thinking",
    text: "Formüldeki küçük sayılar bir tarif gibidir: 1 mol H₂O'da 2 mol H atomu ve 1 mol O atomu bulunur. 2 mol H₂O'da ise 4 mol H ve 2 mol O!",
  },
  {
    speaker: "minnos",
    text: "Kasada iki sihirli formül kullanacağız: mol sayısı n = m / M, tanecik sayısı N = n · Nₐ.",
    visual: (
      <div className="flex flex-wrap justify-center gap-2">
        <Formula color="bg-mint">n = m / M</Formula>
        <Formula color="bg-pink">
          N = n · N<sub>A</sub>
        </Formula>
      </div>
    ),
  },
  {
    speaker: "robo",
    mood: "excited",
    text: "Gazlar için bonus kural: Normal koşullarda (NK: 0 °C ve 1 atm) 1 mol gaz 22,4 litre yer kaplar. Hangi gaz olursa olsun!",
    visual: <Formula color="bg-lavender">NK&apos;da: V = n · 22,4 L</Formula>,
  },
  { speaker: "minnos", mood: "love", text: "Aaa, kapının zili çaldı! Müşteriler geliyor. Önlüğünü giy, kasaya geçiyoruz! 🛒" },
];

export default function Story({ onDone }: { onDone: () => void }) {
  return <Dialogue speakers={speakers} lines={lines} onDone={onDone} doneLabel="Kasaya geç! 🛒" />;
}
