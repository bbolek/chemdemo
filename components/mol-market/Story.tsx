"use client";

import Cat, { type CatMood } from "@/components/Cat";
import Robo, { type RoboMood } from "@/components/Robo";
import Dialogue, { type DialogueLine, type Speaker } from "@/components/Dialogue";
import { useLang } from "@/lib/i18n";
import { ELEMENTS, fmt } from "./chem";

export const MINNOS = { color: "#e8dcff", accent: "#b69cff" };

function Pack({ emoji, name, n, color, unit }: { emoji: string; name: string; n: string; color: string; unit: string }) {
  return (
    <div className={`flex min-w-[88px] flex-1 flex-col items-center rounded-2xl border-2 border-ink p-2 ${color}`}>
      <span className="text-3xl">{emoji}</span>
      <span className="font-display font-bold">1 {name}</span>
      <span className="text-sm font-semibold text-ink-soft">
        = {n} {unit}
      </span>
    </div>
  );
}

function Formula({ children, color = "bg-white" }: { children: React.ReactNode; color?: string }) {
  return <div className={`rounded-2xl border-2 border-ink px-4 py-2 text-center font-display text-xl font-bold ${color}`}>{children}</div>;
}

export default function Story({ onDone }: { onDone: () => void }) {
  const { t, lang } = useLang();

  const speakers: Record<string, Speaker> = {
    minnos: {
      name: t("Kasiyer Minnoş", "Cashier Cutie", "Kassiererin Mietzi"),
      bubble: "bg-lavender",
      side: "left",
      render: ({ talking, mood }) => <Cat color={MINNOS.color} accent={MINNOS.accent} accessory="chef" talking={talking} mood={(mood as CatMood) ?? "happy"} size={130} />,
    },
    robo: {
      name: t("Müdür Robo", "Manager Robo", "Filialleiter Robo"),
      bubble: "bg-sky",
      side: "right",
      render: ({ talking, mood }) => <Robo talking={talking} mood={(mood as RoboMood) ?? "happy"} holding="clipboard" size={115} />,
    },
  };

  const unit = t("tane", "items", "Stück");

  const lines: DialogueLine[] = [
    {
      speaker: "minnos",
      text: t(
        "Mol Market'e hoş geldin! Ben Kasiyer Minnoş. Burada atomları tek tek değil, PAKET PAKET satıyoruz! 🧺",
        "Welcome to the Mole Market! I'm Cashier Cutie. Here we don't sell atoms one by one — we sell them in PACKS! 🧺",
        "Willkommen im Mol-Markt! Ich bin Kassiererin Mietzi. Hier verkaufen wir Atome nicht einzeln, sondern PACKUNGSWEISE! 🧺",
      ),
    },
    {
      speaker: "robo",
      mood: "excited",
      text: t(
        "Bip bop! Ben market müdürü Robo. Günlük hayatta da paketlerle sayarız: 1 düzine yumurta 12 tane, 1 deste gül 10 tanedir.",
        "Beep boop! I'm Robo, the store manager. In everyday life we count in packs too: a dozen eggs is 12, and a pair of socks is 2.",
        "Piep piep! Ich bin Robo, der Filialleiter. Auch im Alltag zählen wir in Packungen: Ein Dutzend Eier sind 12 Stück, ein Paar Socken sind 2.",
      ),
      visual: (
        <div className="flex flex-wrap gap-2">
          <Pack emoji="🥚" name={t("düzine", "dozen", "Dutzend")} n="12" unit={unit} color="bg-peach" />
          {lang === "tr" ? <Pack emoji="🌹" name="deste" n="10" unit={unit} color="bg-pink" /> : <Pack emoji="🧦" name={lang === "de" ? "Paar" : "pair"} n="2" unit={unit} color="bg-pink" />}
          <Pack emoji="⚛️" name="mol" n={t("6,02·10²³", "6.02×10²³", "6,02·10²³")} unit={t("tane", "particles", "Teilchen")} color="bg-lemon" />
        </div>
      ),
    },
    {
      speaker: "minnos",
      text: t(
        "Atomlar ise minnacık! O kadar küçükler ki bir paketin içine tam 6,02·10²³ tane koyuyoruz. İşte bu dev pakete 1 MOL diyoruz.",
        "Atoms, though, are teeny-tiny! So tiny that we pack exactly 6.02×10²³ of them into one pack. We call this giant pack 1 MOLE.",
        "Atome dagegen sind winzig klein! So winzig, dass wir genau 6,02·10²³ Stück in eine Packung stecken. Diese Riesenpackung nennen wir 1 MOL.",
      ),
    },
    {
      speaker: "robo",
      mood: "surprised",
      text: t(
        "Bu sayının adı Avogadro sayısı, sembolü Nₐ. Açık yazarsak: 602 000 000 000 000 000 000 000. Yani 602'nin arkasında tam 21 sıfır!",
        "This number is called Avogadro's number, symbol Nₐ. Written out in full: 602 000 000 000 000 000 000 000. That's 602 followed by 21 zeros!",
        "Diese Zahl steckt in der Avogadro-Konstante, Symbol Nₐ = 6,02·10²³ mol⁻¹. Ausgeschrieben: 602 000 000 000 000 000 000 000. Also 602 mit 21 Nullen dahinter!",
      ),
      visual: (
        <Formula color="bg-lemon">
          1 mol = N<sub>A</sub> = {t("6,02·10²³ tanecik", "6.02×10²³ particles", "6,02·10²³ Teilchen")}
        </Formula>
      ),
    },
    {
      speaker: "minnos",
      mood: "surprised",
      text: t(
        "1 mol kum tanesi, dünyadaki bütün plajların kumundan bile kat kat fazla! 1 mol kedi maması tanesini Türkiye'nin üstüne yaysak, yüzlerce kilometre yüksekliğinde mama dağı olurdu! 😹",
        "1 mole of sand grains is way more than all the sand on every beach on Earth! If we spread 1 mole of cat-food kibbles over a whole country, we'd get a kibble mountain hundreds of kilometres high! 😹",
        "1 mol Sandkörner ist viel mehr als der ganze Sand an allen Stränden der Erde! Würden wir 1 mol Katzenfutter-Bröckchen über ein ganzes Land verteilen, entstünde ein Futterberg, Hunderte Kilometer hoch! 😹",
      ),
    },
    {
      speaker: "robo",
      text: t(
        "Peki 1 paket (1 mol) madde kaç gram gelir? Buna mol kütlesi (M) diyoruz, birimi g/mol. Formüldeki atomların kütlelerini toplarız. İşte raf etiketlerimiz:",
        "So how many grams does 1 pack (1 mole) of a substance weigh? That's the molar mass (M), measured in g/mol. We add up the masses of the atoms in the formula. Here are our shelf labels:",
        "Und wie viel Gramm wiegt 1 Packung (1 mol) eines Stoffes? Das ist die molare Masse M, Einheit g/mol. Dafür addieren wir die Massen der Atome in der Formel. Hier sind unsere Regaletiketten:",
      ),
      visual: (
        <div className="grid grid-cols-5 gap-1.5">
          {ELEMENTS.map((e) => (
            <div key={e.sym} className="flex flex-col items-center rounded-xl border-2 border-ink py-1" style={{ background: e.color }}>
              <span className="font-display text-lg font-extrabold leading-none">{e.sym}</span>
              <span className="text-xs font-bold">{fmt(e.mass, lang)}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      speaker: "minnos",
      mood: "wink",
      text: t(
        "Mesela su, H₂O: 2 tane H ve 1 tane O var. 2·1 + 16 = 18 g/mol. Yani 1 mol su tam 18 gram! Bir yudum kadar. 💧",
        "Take water, H₂O: it has 2 H and 1 O. 2×1 + 16 = 18 g/mol. So 1 mole of water is exactly 18 grams — about one sip! 💧",
        "Nehmen wir Wasser, H₂O: 2 H und 1 O. 2·1 + 16 = 18 g/mol. 1 mol Wasser wiegt also genau 18 Gramm – ungefähr ein Schluck! 💧",
      ),
      visual: <Formula color="bg-sky">{t("M(H₂O) = 2·1 + 1·16 = 18 g/mol", "M(H₂O) = 2×1 + 1×16 = 18 g/mol", "M(H₂O) = 2·1 + 1·16 = 18 g/mol")}</Formula>,
    },
    {
      speaker: "robo",
      mood: "thinking",
      text: t(
        "Formüldeki küçük sayılar bir tarif gibidir: 1 mol H₂O'da 2 mol H atomu ve 1 mol O atomu bulunur. 2 mol H₂O'da ise 4 mol H ve 2 mol O!",
        "The little subscripts in a formula are like a recipe: 1 mol of H₂O contains 2 mol of H atoms and 1 mol of O atoms. And 2 mol of H₂O? 4 mol of H and 2 mol of O!",
        "Die kleinen Indizes in einer Formel sind wie ein Rezept: 1 mol H₂O enthält 2 mol H-Atome und 1 mol O-Atome. Und 2 mol H₂O? 4 mol H und 2 mol O!",
      ),
    },
    {
      speaker: "minnos",
      text: t(
        "Kasada iki sihirli formül kullanacağız: mol sayısı n = m / M, tanecik sayısı N = n · Nₐ.",
        "At the till we'll use two magic formulas: number of moles n = m / M, and number of particles N = n × Nₐ.",
        "An der Kasse benutzen wir zwei Zauberformeln: Stoffmenge n = m / M und Teilchenzahl N = n · Nₐ.",
      ),
      visual: (
        <div className="flex flex-wrap justify-center gap-2">
          <Formula color="bg-mint">n = m / M</Formula>
          <Formula color="bg-pink">
            N = n {t("·", "×", "·")} N<sub>A</sub>
          </Formula>
        </div>
      ),
    },
    {
      speaker: "robo",
      mood: "excited",
      text: t(
        "Gazlar için bonus kural: Normal koşullarda (NK: 0 °C ve 1 atm) 1 mol gaz 22,4 litre yer kaplar. Hangi gaz olursa olsun!",
        "Bonus rule for gases: at STP (0 °C and 1 atm), 1 mole of any gas takes up 22.4 litres. It doesn't matter which gas!",
        "Bonusregel für Gase: Bei Normbedingungen (0 °C und 1013 hPa) nimmt 1 mol Gas 22,4 Liter ein. Egal, welches Gas!",
      ),
      visual: <Formula color="bg-lavender">{t("NK'da: V = n · 22,4 L", "At STP: V = n × 22.4 L", "Normbedingungen: V = n · 22,4 L")}</Formula>,
    },
    {
      speaker: "minnos",
      mood: "love",
      text: t(
        "Aaa, kapının zili çaldı! Müşteriler geliyor. Önlüğünü giy, kasaya geçiyoruz! 🛒",
        "Ooh, the doorbell just rang! Customers are coming. Put on your apron — to the till we go! 🛒",
        "Oh, die Türglocke bimmelt! Die Kundschaft kommt. Schürze an – ab an die Kasse! 🛒",
      ),
    },
  ];

  return <Dialogue speakers={speakers} lines={lines} onDone={onDone} doneLabel={t("Kasaya geç! 🛒", "To the till! 🛒", "Ab an die Kasse! 🛒")} />;
}
