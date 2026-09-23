import type { QuizQuestion } from "@/components/Quiz";
import type { Localized } from "@/lib/i18n";

/** Same order, same answer indexes in both languages. */
export const QUESTIONS: Localized<QuizQuestion[]> = {
  tr: [
    {
      q: "Arrhenius tanımına göre asit nedir?",
      options: ["Suda çözününce OH⁻ iyonu veren madde", "Suda çözününce H⁺ iyonu veren madde", "Tadı tatlı olan madde", "Suda hiç çözünmeyen madde"],
      answer: 1,
      explain: "Asitler suda H⁺ iyonu verir. Örneğin HCl → H⁺ + Cl⁻.",
    },
    {
      q: "pH değeri 12,5 olan çamaşır suyu için hangisi doğrudur?",
      options: ["Kuvvetli asidiktir", "Nötrdür", "Baziktir", "pH'ı ölçülemez"],
      answer: 2,
      explain: "pH > 7 ise çözelti baziktir. 12,5 oldukça yüksek, yani kuvvetli bazik ve yakıcıdır.",
    },
    {
      q: "pH'ı 3 olan bir çözelti, pH'ı 5 olan çözeltiden kaç kat daha asidiktir?",
      options: ["2 kat", "10 kat", "20 kat", "100 kat"],
      answer: 3,
      explain: "Her 1 pH birimi 10 kat fark demektir. 2 birim fark: 10 × 10 = 100 kat.",
    },
    {
      q: "Mavi turnusol kâğıdı limon suyuna batırılırsa ne olur?",
      options: ["Kırmızıya döner", "Mavi kalır", "Yeşile döner", "Beyazlaşır"],
      answer: 0,
      explain: "Asitler mavi turnusolü kırmızıya çevirir. Bazlar ise kırmızı turnusolü maviye çevirir.",
    },
    {
      q: "HCl + NaOH → ? + H₂O tepkimesinde boşluğa ne gelmelidir?",
      options: ["Cl₂", "NaCl", "NaH", "O₂"],
      answer: 1,
      explain: "Asit + baz → tuz + su. Oluşan tuz sodyum klorür, yani yemek tuzudur (NaCl).",
    },
    {
      q: "25 °C'de saf suyun pH değeri kaçtır?",
      options: ["0", "5", "7", "14"],
      answer: 2,
      explain: "Saf suda H⁺ ve OH⁻ derişimleri eşittir, pH = 7 yani nötrdür.",
    },
    {
      q: "Laboratuvarda bilinmeyen bir sıvının asit mi baz mı olduğunu anlamak için ne yapmalıyız?",
      options: ["Biraz tadına bakarız", "Derin derin koklarız", "Parmağımızla dokunuruz", "İndikatör ya da pH metre kullanırız"],
      answer: 3,
      explain: "Laboratuvarda hiçbir madde tadılmaz, koklanmaz, elle tutulmaz. Kanıt için indikatör veya pH metre kullanılır!",
    },
    {
      q: "Evrensel indikatör damlatılan bir çözelti mor renk aldı. Bu çözelti büyük olasılıkla hangisidir?",
      options: ["Sirke", "Lavabo açıcı", "Saf su", "Kola"],
      answer: 1,
      explain: "Evrensel indikatörde mor renk kuvvetli bazik ortamı gösterir. Lavabo açıcıdaki NaOH buna yol açar.",
    },
    {
      q: "25 mL 0,1 M HCl çözeltisini tam nötrleştirmek için kaç mL 0,1 M NaOH gerekir?",
      options: ["12,5 mL", "25 mL", "50 mL", "0,1 mL"],
      answer: 1,
      explain: "n(H⁺) = 0,1 × 25 = 2,5 mmol. Aynı mol OH⁻ için 2,5 ÷ 0,1 = 25 mL NaOH gerekir.",
    },
    {
      q: "Mide ekşimesi yaşayan birine hangisi rahatlama sağlayabilir?",
      options: ["Limon suyu", "Sirke", "Karbonat (hafif bazik)", "Kola"],
      answer: 2,
      explain: "Midedeki fazla asit, hafif bazik karbonatla (NaHCO₃) nötrleştirilerek azaltılır.",
    },
  ],
  en: [
    {
      q: "According to the Arrhenius definition, what is an acid?",
      options: ["A substance that releases OH⁻ ions in water", "A substance that releases H⁺ ions in water", "A substance that tastes sweet", "A substance that doesn't dissolve in water at all"],
      answer: 1,
      explain: "Acids release H⁺ ions in water. For example: HCl → H⁺ + Cl⁻.",
    },
    {
      q: "Bleach has a pH of 12.5. Which statement is true?",
      options: ["It is strongly acidic", "It is neutral", "It is basic (alkaline)", "Its pH can't be measured"],
      answer: 2,
      explain: "If pH > 7, the solution is basic. 12.5 is pretty high, so it's strongly alkaline and corrosive.",
    },
    {
      q: "How many times more acidic is a solution with pH 3 than one with pH 5?",
      options: ["2 times", "10 times", "20 times", "100 times"],
      answer: 3,
      explain: "Each pH unit is a 10× difference. A 2-unit gap: 10 × 10 = 100 times.",
    },
    {
      q: "What happens when blue litmus paper is dipped into lemon juice?",
      options: ["It turns red", "It stays blue", "It turns green", "It turns white"],
      answer: 0,
      explain: "Acids turn blue litmus red. Bases turn red litmus blue.",
    },
    {
      q: "What goes in the blank? HCl + NaOH → ? + H₂O",
      options: ["Cl₂", "NaCl", "NaH", "O₂"],
      answer: 1,
      explain: "Acid + base → salt + water. The salt formed is sodium chloride, a.k.a. table salt (NaCl).",
    },
    {
      q: "What is the pH of pure water at 25 °C?",
      options: ["0", "5", "7", "14"],
      answer: 2,
      explain: "In pure water the H⁺ and OH⁻ concentrations are equal, so pH = 7: neutral.",
    },
    {
      q: "In the lab, how should we find out whether an unknown liquid is an acid or a base?",
      options: ["Take a little taste", "Take a deep sniff", "Touch it with a finger", "Use an indicator or a pH meter"],
      answer: 3,
      explain: "In the lab you never taste, sniff or touch any substance. Get your evidence with an indicator or a pH meter!",
    },
    {
      q: "A few drops of universal indicator turn a solution purple. Which is it most likely to be?",
      options: ["Vinegar", "Drain cleaner", "Pure water", "Cola"],
      answer: 1,
      explain: "Purple on universal indicator means strongly basic. The NaOH in drain cleaner does exactly that.",
    },
    {
      q: "How many mL of 0.1 M NaOH are needed to exactly neutralize 25 mL of 0.1 M HCl?",
      options: ["12.5 mL", "25 mL", "50 mL", "0.1 mL"],
      answer: 1,
      explain: "n(H⁺) = 0.1 × 25 = 2.5 mmol. The same moles of OH⁻ need 2.5 ÷ 0.1 = 25 mL of NaOH.",
    },
    {
      q: "Which could bring relief to someone with heartburn?",
      options: ["Lemon juice", "Vinegar", "Baking soda (mildly basic)", "Cola"],
      answer: 2,
      explain: "Excess stomach acid is reduced by neutralizing it with mildly basic baking soda (NaHCO₃).",
    },
  ],
};
