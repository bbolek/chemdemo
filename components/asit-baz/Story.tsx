"use client";

import Cat, { type CatMood } from "@/components/Cat";
import Robo, { type RoboMood } from "@/components/Robo";
import Dialogue, { type DialogueLine, type Speaker } from "@/components/Dialogue";
import { Litmus, PhScale } from "./Props";
import { phColor } from "./ph";

export const MIRMIR = { color: "#ffe5cc", accent: "#ffb88a" };

const speakers: Record<string, Speaker> = {
  mirmir: {
    name: "Dedektif Mırmır",
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
};

const Chip = ({ ph, name, emoji }: { ph: number; name: string; emoji: string }) => (
  <span className="inline-flex items-center gap-1 rounded-full border-2 border-ink px-2.5 py-0.5 text-sm font-bold" style={{ background: phColor(ph) }}>
    {emoji} {name} <span className="rounded-full bg-white/80 px-1.5">{ph}</span>
  </span>
);

const Eq = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl border-3 border-dashed border-ink/40 bg-white/70 px-3 py-2 text-center font-display text-base font-bold sm:text-xl">{children}</div>
);

const lines: DialogueLine[] = [
  {
    speaker: "mirmir",
    mood: "thinking",
    text: "Robo, mutfakta bir gizem var! Limon ekşi, sabun kaygan, çamaşır suyu da tehlikeli kokuyor. Bu maddelerin ortak sırrı ne?",
  },
  {
    speaker: "robo",
    mood: "excited",
    text: "Bip bip! Dosyayı açıyorum: Şüpheliler iki gruba ayrılıyor. ASİTLER ve BAZLAR!",
  },
  {
    speaker: "mirmir",
    mood: "wink",
    text: "Arrhenius'a göre asit, suda çözününce H⁺ iyonu veren maddedir. Baz ise suda çözününce OH⁻ iyonu verir.",
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
    text: "Peki ne kadar asidik olduklarını nasıl ölçeceğiz? Ben olsam tadına bakardım... ah, benim dilim yok ki!",
  },
  {
    speaker: "mirmir",
    mood: "surprised",
    text: "Asla! Laboratuvarda hiçbir madde tadılmaz, doğrudan koklanmaz, çıplak elle tutulmaz. Dedektifler kanıtla çalışır: pH skalası!",
    visual: (
      <div className="rounded-2xl bg-pink-deep/40 px-3 py-2 text-center font-bold">⚠️ Tatma yok · Koklama yok · Gözlük ve eldiven takılır!</div>
    ),
  },
  {
    speaker: "mirmir",
    mood: "happy",
    text: "pH skalası 0'dan 14'e gider. 7 nötrdür. 7'den küçükse asidik, 7'den büyükse baziktir.",
    visual: <PhScale marker={7} />,
  },
  {
    speaker: "robo",
    mood: "surprised",
    text: "Dikkat! pH'ta 1 birimlik fark, H⁺ derişiminde 10 kat fark demek. pH 2 olan limon suyu, pH 3 olan sirkeden 10 kat daha asidik!",
    visual: (
      <div className="flex flex-wrap justify-center gap-2">
        <Chip ph={2} name="Limon" emoji="🍋" />
        <span className="font-display text-lg font-bold">×10</span>
        <Chip ph={3} name="Sirke" emoji="🍶" />
        <span className="font-display text-lg font-bold">×10</span>
        <Chip ph={4} name="Domates" emoji="🍅" />
      </div>
    ),
  },
  {
    speaker: "mirmir",
    mood: "thinking",
    text: "Mutfaktaki şüphelilerin pH kayıtları şöyle. Çamaşır suyu ve lavabo açıcı çok bazik; bunlar yakıcıdır, çok dikkat!",
    visual: (
      <div className="flex flex-wrap justify-center gap-1.5">
        <Chip ph={2} name="Limon" emoji="🍋" />
        <Chip ph={2.5} name="Kola" emoji="🥤" />
        <Chip ph={6.5} name="Süt" emoji="🥛" />
        <Chip ph={7} name="Saf su" emoji="💧" />
        <Chip ph={8.5} name="Karbonat" emoji="🧂" />
        <Chip ph={10} name="Sabun" emoji="🧼" />
        <Chip ph={12.5} name="Çamaşır suyu" emoji="🧴" />
        <Chip ph={14} name="Lavabo açıcı" emoji="🪠" />
      </div>
    ),
  },
  {
    speaker: "robo",
    mood: "happy",
    text: "Hızlı test için turnusol kâğıdı! Asit mavi turnusolü KIRMIZIYA, baz kırmızı turnusolü MAVİYE çevirir.",
    visual: (
      <div className="flex items-end justify-center gap-6 font-bold">
        <span className="flex flex-col items-center">
          <Litmus ph={2} />
          asit
        </span>
        <span className="flex flex-col items-center">
          <Litmus ph={7} />
          nötr
        </span>
        <span className="flex flex-col items-center">
          <Litmus ph={12} />
          baz
        </span>
      </div>
    ),
  },
  {
    speaker: "mirmir",
    mood: "wink",
    text: "Evrensel indikatör daha da havalı: her pH için farklı renk verir. Kırmızı → turuncu → sarı → yeşil (nötr) → mavi → mor.",
  },
  {
    speaker: "robo",
    mood: "excited",
    text: "Son ipucu: Asit ile baz buluşunca birbirinin etkisini giderir! Buna nötrleşme denir. Ürünler: tuz ve su.",
    visual: (
      <Eq>
        <span className="text-[#e0485f]">HCl</span> + <span className="text-[#5a86ea]">NaOH</span> → NaCl + H₂O
        <span className="mt-1 block text-sm font-semibold text-ink-soft">asit + baz → tuz + su (H⁺ + OH⁻ → H₂O)</span>
      </Eq>
    ),
  },
  {
    speaker: "mirmir",
    mood: "love",
    text: "Harika! Gizemi çözmek için laboratuvara gidiyoruz. Önce tahmin et, sonra kanıtla. Hadi ortak!",
  },
];

export default function Story({ onDone }: { onDone: () => void }) {
  // flex-wrap on the dots/buttons row: the shared Dialogue overflows at 375px with 12 lines
  return (
    <div className="[&>div>div:last-child]:flex-wrap [&>div>div:last-child]:gap-3">
      <Dialogue speakers={speakers} lines={lines} onDone={onDone} doneLabel="Laboratuvara! 🧪" />
    </div>
  );
}
