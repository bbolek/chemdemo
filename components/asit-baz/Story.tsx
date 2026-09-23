"use client";

import Cat, { type CatMood } from "@/components/Cat";
import Robo, { type RoboMood } from "@/components/Robo";
import Dialogue, { type DialogueLine, type Speaker } from "@/components/Dialogue";
import { useLang } from "@/lib/i18n";
import { Litmus, PhScale } from "./Props";
import { phColor } from "./ph";

export const MIRMIR = { color: "#ffe5cc", accent: "#ffb88a" };

type T = (tr: string, en: string) => string;

const makeSpeakers = (t: T): Record<string, Speaker> => ({
  mirmir: {
    name: t("Dedektif Mırmır", "Detective Purr"),
    bubble: "bg-peach",
    side: "left",
    render: ({ talking, mood }) => (
      <Cat color={MIRMIR.color} accent={MIRMIR.accent} accessory="detective" talking={talking} mood={(mood as CatMood) ?? "happy"} size={130} />
    ),
  },
  robo: {
    name: "Robo",
    bubble: "bg-sky",
    side: "right",
    render: ({ talking, mood }) => <Robo talking={talking} mood={(mood as RoboMood) ?? "happy"} holding="clipboard" size={120} />,
  },
});

function Chip({ ph, name, emoji }: { ph: number; name: string; emoji: string }) {
  const { num } = useLang();
  return (
    <span className="inline-flex items-center gap-1 rounded-full border-2 border-ink px-2.5 py-0.5 text-sm font-bold" style={{ background: phColor(ph) }}>
      {emoji} {name} <span className="rounded-full bg-white/80 px-1.5">{num(ph)}</span>
    </span>
  );
}

const Eq = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl border-3 border-dashed border-ink/40 bg-white/70 px-3 py-2 text-center font-display text-base font-bold sm:text-xl">{children}</div>
);

const makeLines = (t: T): DialogueLine[] => [
  {
    speaker: "mirmir",
    mood: "thinking",
    text: t(
      "Robo, mutfakta bir gizem var! Limon ekşi, sabun kaygan, çamaşır suyu da tehlikeli kokuyor. Bu maddelerin ortak sırrı ne?",
      "Robo, there's a mystery in the kitchen! Lemon is sour, soap is slippery, and bleach smells dangerous. What secret do these suspects share?",
    ),
  },
  {
    speaker: "robo",
    mood: "excited",
    text: t(
      "Bip bip! Dosyayı açıyorum: Şüpheliler iki gruba ayrılıyor. ASİTLER ve BAZLAR!",
      "Beep boop! Opening the case file: the suspects split into two gangs. ACIDS and BASES!",
    ),
  },
  {
    speaker: "mirmir",
    mood: "wink",
    text: t(
      "Arrhenius'a göre asit, suda çözününce H⁺ iyonu veren maddedir. Baz ise suda çözününce OH⁻ iyonu verir.",
      "According to Arrhenius, an acid is a substance that releases H⁺ ions when it dissolves in water. A base releases OH⁻ ions in water.",
    ),
    visual: (
      <div className="grid gap-2 sm:grid-cols-2">
        <Eq>
          HCl → <span className="text-[#e0485f]">H⁺</span> + Cl⁻
        </Eq>
        <Eq>
          NaOH → Na⁺ + <span className="text-[#5a86ea]">OH⁻</span>
        </Eq>
      </div>
    ),
  },
  {
    speaker: "robo",
    mood: "thinking",
    text: t(
      "Peki ne kadar asidik olduklarını nasıl ölçeceğiz? Ben olsam tadına bakardım... ah, benim dilim yok ki!",
      "So how do we measure how acidic they are? I'd just taste them... oh wait, I don't have a tongue!",
    ),
  },
  {
    speaker: "mirmir",
    mood: "surprised",
    text: t(
      "Asla! Laboratuvarda hiçbir madde tadılmaz, doğrudan koklanmaz, çıplak elle tutulmaz. Dedektifler kanıtla çalışır: pH skalası!",
      "Never! In the lab we never taste, sniff or touch anything with bare hands. Detectives work with evidence: the pH scale!",
    ),
    visual: (
      <div className="rounded-2xl bg-pink-deep/40 px-3 py-2 text-center font-bold">
        {t("⚠️ Tatma yok · Koklama yok · Gözlük ve eldiven takılır!", "⚠️ No tasting · No sniffing · Goggles and gloves on!")}
      </div>
    ),
  },
  {
    speaker: "mirmir",
    mood: "happy",
    text: t(
      "pH skalası 0'dan 14'e gider. 7 nötrdür. 7'den küçükse asidik, 7'den büyükse baziktir.",
      "The pH scale runs from 0 to 14. 7 is neutral. Below 7 is acidic, above 7 is basic (alkaline).",
    ),
    visual: <PhScale marker={7} />,
  },
  {
    speaker: "robo",
    mood: "surprised",
    text: t(
      "Dikkat! pH'ta 1 birimlik fark, H⁺ derişiminde 10 kat fark demek. pH 2 olan limon suyu, pH 3 olan sirkeden 10 kat daha asidik!",
      "Heads up! A difference of 1 pH unit means a 10× difference in H⁺ concentration. Lemon juice at pH 2 is 10 times more acidic than vinegar at pH 3!",
    ),
    visual: (
      <div className="flex flex-wrap justify-center gap-2">
        <Chip ph={2} name={t("Limon", "Lemon")} emoji="🍋" />
        <span className="font-display text-lg font-bold">×10</span>
        <Chip ph={3} name={t("Sirke", "Vinegar")} emoji="🍶" />
        <span className="font-display text-lg font-bold">×10</span>
        <Chip ph={4} name={t("Domates", "Tomato")} emoji="🍅" />
      </div>
    ),
  },
  {
    speaker: "mirmir",
    mood: "thinking",
    text: t(
      "Mutfaktaki şüphelilerin pH kayıtları şöyle. Çamaşır suyu ve lavabo açıcı çok bazik; bunlar yakıcıdır, çok dikkat!",
      "Here are the pH records of our kitchen suspects. Bleach and drain cleaner are very basic. They're corrosive, so be extra careful!",
    ),
    visual: (
      <div className="flex flex-wrap justify-center gap-1.5">
        <Chip ph={2} name={t("Limon", "Lemon")} emoji="🍋" />
        <Chip ph={2.5} name={t("Kola", "Cola")} emoji="🥤" />
        <Chip ph={6.5} name={t("Süt", "Milk")} emoji="🥛" />
        <Chip ph={7} name={t("Saf su", "Pure water")} emoji="💧" />
        <Chip ph={8.5} name={t("Karbonat", "Baking soda")} emoji="🧂" />
        <Chip ph={10} name={t("Sabun", "Soap")} emoji="🧼" />
        <Chip ph={12.5} name={t("Çamaşır suyu", "Bleach")} emoji="🧴" />
        <Chip ph={14} name={t("Lavabo açıcı", "Drain cleaner")} emoji="🪠" />
      </div>
    ),
  },
  {
    speaker: "robo",
    mood: "happy",
    text: t(
      "Hızlı test için turnusol kâğıdı! Asit mavi turnusolü KIRMIZIYA, baz kırmızı turnusolü MAVİYE çevirir.",
      "For a quick test: litmus paper! An acid turns blue litmus RED, and a base turns red litmus BLUE.",
    ),
    visual: (
      <div className="flex items-end justify-center gap-6 font-bold">
        <span className="flex flex-col items-center">
          <Litmus ph={2} />
          {t("asit", "acid")}
        </span>
        <span className="flex flex-col items-center">
          <Litmus ph={7} />
          {t("nötr", "neutral")}
        </span>
        <span className="flex flex-col items-center">
          <Litmus ph={12} />
          {t("baz", "base")}
        </span>
      </div>
    ),
  },
  {
    speaker: "mirmir",
    mood: "wink",
    text: t(
      "Evrensel indikatör daha da havalı: her pH için farklı renk verir. Kırmızı → turuncu → sarı → yeşil (nötr) → mavi → mor.",
      "Universal indicator is even cooler: it shows a different colour for every pH. Red → orange → yellow → green (neutral) → blue → purple.",
    ),
  },
  {
    speaker: "robo",
    mood: "excited",
    text: t(
      "Son ipucu: Asit ile baz buluşunca birbirinin etkisini giderir! Buna nötrleşme denir. Ürünler: tuz ve su.",
      "Final clue: when an acid meets a base, they cancel each other out! That's called neutralization. The products: a salt and water.",
    ),
    visual: (
      <Eq>
        <span className="text-[#e0485f]">HCl</span> + <span className="text-[#5a86ea]">NaOH</span> → NaCl + H₂O
        <span className="mt-1 block text-sm font-semibold text-ink-soft">
          {t("asit + baz → tuz + su (H⁺ + OH⁻ → H₂O)", "acid + base → salt + water (H⁺ + OH⁻ → H₂O)")}
        </span>
      </Eq>
    ),
  },
  {
    speaker: "mirmir",
    mood: "love",
    text: t(
      "Harika! Gizemi çözmek için laboratuvara gidiyoruz. Önce tahmin et, sonra kanıtla. Hadi ortak!",
      "Purr-fect! We're off to the lab to crack the case. First predict, then prove it. Let's go, partner!",
    ),
  },
];

export default function Story({ onDone }: { onDone: () => void }) {
  const { t } = useLang();
  // flex-wrap on the dots/buttons row: the shared Dialogue overflows at 375px with 12 lines
  return (
    <div className="[&>div>div:last-child]:flex-wrap [&>div>div:last-child]:gap-3">
      <Dialogue speakers={makeSpeakers(t)} lines={makeLines(t)} onDone={onDone} doneLabel={t("Laboratuvara! 🧪", "To the lab! 🧪")} />
    </div>
  );
}
