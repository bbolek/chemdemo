import type { QuizQuestion } from "@/components/Quiz";

export const QUESTIONS: QuizQuestion[] = [
  {
    q: "1 mol maddede kaç tane tanecik bulunur?",
    options: ["12 tane", "6,02·10²³ tane", "22,4 tane", "6,02·10²² tane"],
    answer: 1,
    explain: "1 mol = Avogadro sayısı kadar tanecik: Nₐ = 6,02·10²³. Düzine gibi, sadece çok daha büyük bir paket!",
  },
  {
    q: "CH₄ (metan) gazının mol kütlesi kaçtır? (C = 12, H = 1)",
    options: ["13 g/mol", "16 g/mol", "28 g/mol", "48 g/mol"],
    answer: 1,
    explain: "M = 12 + 4·1 = 16 g/mol.",
  },
  {
    q: "90 gram su (H₂O) kaç moldür? (H = 1, O = 16)",
    options: ["2 mol", "4 mol", "5 mol", "9 mol"],
    answer: 2,
    explain: "M(H₂O) = 18 g/mol. n = m / M = 90 / 18 = 5 mol.",
  },
  {
    q: "0,5 mol CO₂ kaç gramdır? (C = 12, O = 16)",
    options: ["11 g", "22 g", "44 g", "88 g"],
    answer: 1,
    explain: "M(CO₂) = 12 + 2·16 = 44 g/mol. m = n · M = 0,5 · 44 = 22 g.",
  },
  {
    q: "Normal koşullarda (NK) 67,2 litre O₂ gazı kaç moldür?",
    options: ["1 mol", "2 mol", "3 mol", "6 mol"],
    answer: 2,
    explain: "NK'da 1 mol gaz 22,4 L. n = 67,2 / 22,4 = 3 mol.",
  },
  {
    q: "2 mol NH₃ molekülünde toplam kaç mol H atomu vardır?",
    options: ["2 mol", "3 mol", "5 mol", "6 mol"],
    answer: 3,
    explain: "1 mol NH₃'te 3 mol H atomu var. 2 mol NH₃ → 2·3 = 6 mol H atomu.",
  },
  {
    q: "1,204·10²⁴ tane H₂ molekülü kaç gramdır? (H = 1)",
    options: ["1 g", "2 g", "4 g", "12 g"],
    answer: 2,
    explain: "n = N / Nₐ = 1,204·10²⁴ / 6,02·10²³ = 2 mol. M(H₂) = 2 g/mol → m = 2 · 2 = 4 g.",
  },
  {
    q: "Mg(OH)₂ bileşiğinin mol kütlesi kaçtır? (Mg = 24, O = 16, H = 1)",
    options: ["41 g/mol", "58 g/mol", "57 g/mol", "74 g/mol"],
    answer: 1,
    explain: "Parantezin dışındaki 2, OH'nin tamamını çarpar: 24 + 2·(16 + 1) = 24 + 34 = 58 g/mol.",
  },
  {
    q: "NK'da 4,48 L hacim kaplayan CH₄ gazında kaç tane molekül vardır?",
    options: ["1,204·10²³", "6,02·10²³", "3,01·10²³", "4,48·10²³"],
    answer: 0,
    explain: "n = 4,48 / 22,4 = 0,2 mol. N = 0,2 · 6,02·10²³ = 1,204·10²³ molekül.",
  },
];
