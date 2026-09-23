import type { Localized } from "./i18n";

export interface Topic {
  slug: string;
  title: Localized<string>;
  emoji: string;
  grade: Localized<string>;
  blurb: Localized<string>;
  /** tailwind bg class */
  color: string;
  catColor: string;
}

export const TOPICS: Topic[] = [
  {
    slug: "asit-baz",
    title: { tr: "Asit mi Baz mı?", en: "Acid or Base?", de: "Säure oder Base?" },
    emoji: "🍋",
    grade: { tr: "10. Sınıf", en: "Grade 10", de: "10. Klasse" },
    blurb: {
      tr: "Dedektif Mırmır ile mutfaktaki gizemleri çöz, pH'ı keşfet ve nötrleşme yap!",
      en: "Solve kitchen mysteries with Detective Purr, discover pH and neutralize!",
      de: "Löse Küchenrätsel mit Detektiv Schnurr, entdecke den pH-Wert und neutralisiere!",
    },
    color: "bg-lemon",
    catColor: "#ffe5cc",
  },
  {
    slug: "gazlar",
    title: { tr: "Gaz Kedileri", en: "Gas Cats", de: "Gas-Katzen" },
    emoji: "💨",
    grade: { tr: "11. Sınıf", en: "Grade 11", de: "11. Klasse" },
    blurb: {
      tr: "Pistonu it, kutuyu ısıt! Boyle, Charles ve Avogadro yasalarını canlı gör.",
      en: "Push the piston, heat the box! See Boyle's, Charles's and Avogadro's laws live.",
      de: "Drück den Kolben, heiz die Kiste! Erlebe die Gesetze von Boyle, Charles und Avogadro live.",
    },
    color: "bg-sky",
    catColor: "#d6ecff",
  },
  {
    slug: "denklestir",
    title: { tr: "Denkleştir Bakalım!", en: "Balance It!", de: "Gleich aus!" },
    emoji: "⚖️",
    grade: { tr: "10. Sınıf", en: "Grade 10", de: "10. Klasse" },
    blurb: {
      tr: "Terazi kedileri dengede tut: kimyasal denklemleri denkleştir, seviyeleri geç!",
      en: "Keep the scale cats level: balance chemical equations and beat the levels!",
      de: "Halte die Waagen-Katzen im Gleichgewicht: Gleiche Reaktionsgleichungen aus und meistere die Level!",
    },
    color: "bg-mint",
    catColor: "#d4f5e9",
  },
  {
    slug: "mol-market",
    title: { tr: "Mol Market", en: "Mole Market", de: "Mol-Markt" },
    emoji: "🧺",
    grade: { tr: "10. Sınıf", en: "Grade 10", de: "10. Klasse" },
    blurb: {
      tr: "Robo'nun marketinde atom alışverişi! Mol kavramı ve Avogadro sayısı.",
      en: "Shop for atoms at Robo's market! The mole concept and Avogadro's number.",
      de: "Kauf Atome in Robos Markt ein! Das Mol und die Avogadro-Konstante.",
    },
    color: "bg-lavender",
    catColor: "#e8dcff",
  },
];
