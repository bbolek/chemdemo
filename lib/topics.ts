export interface Topic {
  slug: string;
  title: string;
  emoji: string;
  grade: string;
  blurb: string;
  /** tailwind bg class */
  color: string;
  catColor: string;
}

export const TOPICS: Topic[] = [
  {
    slug: "asit-baz",
    title: "Asit mi Baz mı?",
    emoji: "🍋",
    grade: "10. Sınıf",
    blurb: "Dedektif Mırmır ile mutfaktaki gizemleri çöz, pH'ı keşfet ve nötrleşme yap!",
    color: "bg-lemon",
    catColor: "#ffe5cc",
  },
  {
    slug: "gazlar",
    title: "Gaz Kedileri",
    emoji: "💨",
    grade: "11. Sınıf",
    blurb: "Pistonu it, kutuyu ısıt! Boyle, Charles ve Avogadro yasalarını canlı gör.",
    color: "bg-sky",
    catColor: "#d6ecff",
  },
  {
    slug: "denklestir",
    title: "Denkleştir Bakalım!",
    emoji: "⚖️",
    grade: "10. Sınıf",
    blurb: "Terazi kedileri dengede tut: kimyasal denklemleri denkleştir, seviyeleri geç!",
    color: "bg-mint",
    catColor: "#d4f5e9",
  },
  {
    slug: "mol-market",
    title: "Mol Market",
    emoji: "🧺",
    grade: "10. Sınıf",
    blurb: "Robo'nun marketinde atom alışverişi! Mol kavramı ve Avogadro sayısı.",
    color: "bg-lavender",
    catColor: "#e8dcff",
  },
];
