import type { QuizQuestion } from "@/components/Quiz";
import type { Localized } from "@/lib/i18n";

/**
 * Same order, same answer indexes and same numeric values in both languages.
 * Only wording and decimal notation differ.
 */
export const QUESTIONS: Localized<QuizQuestion[]> = {
  tr: [
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
  ],
  en: [
    {
      q: "How many particles are there in 1 mole of a substance?",
      options: ["12", "6.02×10²³", "22.4", "6.02×10²²"],
      answer: 1,
      explain: "1 mole = Avogadro's number of particles: Nₐ = 6.02×10²³. Just like a dozen, only a much, much bigger pack!",
    },
    {
      q: "What is the molar mass of methane gas, CH₄? (C = 12, H = 1)",
      options: ["13 g/mol", "16 g/mol", "28 g/mol", "48 g/mol"],
      answer: 1,
      explain: "M = 12 + 4×1 = 16 g/mol.",
    },
    {
      q: "How many moles are in 90 grams of water (H₂O)? (H = 1, O = 16)",
      options: ["2 mol", "4 mol", "5 mol", "9 mol"],
      answer: 2,
      explain: "M(H₂O) = 18 g/mol. n = m / M = 90 / 18 = 5 mol.",
    },
    {
      q: "What is the mass of 0.5 mol of CO₂? (C = 12, O = 16)",
      options: ["11 g", "22 g", "44 g", "88 g"],
      answer: 1,
      explain: "M(CO₂) = 12 + 2×16 = 44 g/mol. m = n × M = 0.5 × 44 = 22 g.",
    },
    {
      q: "How many moles are in 67.2 litres of O₂ gas at STP?",
      options: ["1 mol", "2 mol", "3 mol", "6 mol"],
      answer: 2,
      explain: "At STP, 1 mol of gas takes up 22.4 L. n = 67.2 / 22.4 = 3 mol.",
    },
    {
      q: "How many moles of H atoms are there in total in 2 mol of NH₃?",
      options: ["2 mol", "3 mol", "5 mol", "6 mol"],
      answer: 3,
      explain: "1 mol of NH₃ contains 3 mol of H atoms. 2 mol NH₃ → 2×3 = 6 mol of H atoms.",
    },
    {
      q: "What is the mass of 1.204×10²⁴ H₂ molecules? (H = 1)",
      options: ["1 g", "2 g", "4 g", "12 g"],
      answer: 2,
      explain: "n = N / Nₐ = 1.204×10²⁴ / 6.02×10²³ = 2 mol. M(H₂) = 2 g/mol → m = 2 × 2 = 4 g.",
    },
    {
      q: "What is the molar mass of Mg(OH)₂? (Mg = 24, O = 16, H = 1)",
      options: ["41 g/mol", "58 g/mol", "57 g/mol", "74 g/mol"],
      answer: 1,
      explain: "The 2 outside the brackets multiplies the whole OH group: 24 + 2×(16 + 1) = 24 + 34 = 58 g/mol.",
    },
    {
      q: "How many molecules are in a sample of CH₄ gas that occupies 4.48 L at STP?",
      options: ["1.204×10²³", "6.02×10²³", "3.01×10²³", "4.48×10²³"],
      answer: 0,
      explain: "n = 4.48 / 22.4 = 0.2 mol. N = 0.2 × 6.02×10²³ = 1.204×10²³ molecules.",
    },
  ],
};
