"use client";

import Cat, { type CatMood } from "@/components/Cat";
import Dialogue, { type DialogueLine, type Speaker } from "@/components/Dialogue";
import Quiz, { type QuizQuestion } from "@/components/Quiz";
import Robo, { type RoboMood } from "@/components/Robo";
import Splash from "@/components/Splash";
import TopicShell from "@/components/TopicShell";
import { useLang, type Lang, type Localized } from "@/lib/i18n";
import BalanceGame from "./BalanceGame";
import { CoefVisual, EquationVisual, IndexVisual, SplashSeesaw, StepsVisual } from "./Visuals";

const TEKIR = { color: "#d4f5e9", accent: "#7fdcb8" };

const makeSpeakers = (lang: Lang): Record<string, Speaker> => ({
  tekir: {
    name: lang === "en" ? "Tabby the Scale Cat" : "Terazi Tekir",
    bubble: "bg-mint",
    side: "left",
    render: ({ talking, mood }) => (
      <Cat color={TEKIR.color} accent={TEKIR.accent} accessory="bowtie" talking={talking} mood={(mood as CatMood) ?? "happy"} size={120} />
    ),
  },
  robo: {
    name: "Robo",
    bubble: "bg-sky",
    side: "right",
    render: ({ talking, mood }) => <Robo talking={talking} mood={(mood as RoboMood) ?? "happy"} holding="clipboard" size={124} />,
  },
});

type LineDef = Omit<DialogueLine, "text"> & { text: Localized<string> };

const lineDefs: LineDef[] = [
  {
    speaker: "tekir",
    text: {
      tr: "Miyav! Ben Terazi Tekir. Bugün kimyasal denklemleri denkleştireceğiz. Tıpkı bir terazi gibi: iki kefe de eşit olmalı! ⚖️",
      en: "Meow! I'm Tabby the Scale Cat. Today we're going to balance chemical equations. Just like a pair of scales: both pans have to be equal! ⚖️",
    },
  },
  {
    speaker: "robo",
    text: {
      tr: "Bip bop! Kural: Kütlenin korunumu (Lavoisier). Tepkimeden önceki toplam kütle = sonraki toplam kütle. Çünkü atomlar yok olmaz, yoktan var olmaz; sadece yeniden düzenlenir. Lego gibi! 🧱",
      en: "Beep boop! The rule: conservation of mass (Lavoisier). Total mass before the reaction = total mass after. Atoms are never created or destroyed; they're just rearranged. Like LEGO! 🧱",
    },
    mood: "excited",
  },
  {
    speaker: "tekir",
    text: {
      tr: "Şu denkleme bak: H₂ + O₂ → H₂O. Solda 2 oksijen, sağda 1! Kolay: H₂O'yu H₂O₂ yaparım, olur biter! 😼",
      en: "Look at this equation: H₂ + O₂ → H₂O. 2 oxygens on the left, 1 on the right! Easy: I'll just turn H₂O into H₂O₂, job done! 😼",
    },
    mood: "surprised",
    visual: <EquationVisual left={[["H2", 1], ["O2", 1]]} right={[["H2O", 1]]} />,
  },
  {
    speaker: "robo",
    text: {
      tr: "Dur, olmaz! O küçük sayı İNDİS. İndisi değiştirirsen madde değişir: H₂O su, H₂O₂ ise hidrojen peroksit! İndisler asla değiştirilemez.",
      en: "Stop, you can't! That little number is a SUBSCRIPT. Change the subscript and you change the substance: H₂O is water, but H₂O₂ is hydrogen peroxide! Subscripts can never be changed.",
    },
    mood: "sad",
    visual: <IndexVisual />,
  },
  {
    speaker: "tekir",
    text: {
      tr: "Anladım! Değiştirebileceğimiz tek şey formülün önündeki büyük sayı: KATSAYI. Kaç tane molekül olduğunu söyler. 2H₂O = 2 su molekülü = 4 H ve 2 O. (Katsayı 1 ise yazılmaz.)",
      en: "Got it! The only thing we can change is the big number in front of the formula: the COEFFICIENT. It tells us how many molecules there are. 2H₂O = 2 water molecules = 4 H and 2 O. (A coefficient of 1 isn't written.)",
    },
    mood: "thinking",
    visual: <CoefVisual />,
  },
  {
    speaker: "robo",
    text: {
      tr: "Aynen! Deneyelim: 2H₂ + O₂ → 2H₂O. Sol: 4 H, 2 O. Sağ: 4 H, 2 O. Terazi dengede! 🎉",
      en: "Exactly! Let's try: 2H₂ + O₂ → 2H₂O. Left: 4 H, 2 O. Right: 4 H, 2 O. The scale is balanced! 🎉",
    },
    mood: "excited",
    visual: <EquationVisual left={[["H2", 2], ["O2", 1]]} right={[["H2O", 2]]} />,
  },
  {
    speaker: "tekir",
    text: {
      tr: "İşte tarifimiz! 4H₂ + 2O₂ → 4H₂O de dengeli ama sadeleşir; hep en küçük tam sayıları kullan. Şimdi sıra sende, az hamlede çöz! ⭐⭐⭐",
      en: "Here's our recipe! 4H₂ + 2O₂ → 4H₂O is balanced too, but it can be simplified; always use the smallest whole numbers. Now it's your turn: solve it in as few moves as you can! ⭐⭐⭐",
    },
    mood: "love",
    visual: <StepsVisual />,
  },
];

const questions: Localized<QuizQuestion[]> = {
  tr: [
    {
      q: "Kimyasal tepkimelerde aşağıdakilerden hangisi her zaman korunur?",
      options: ["Molekül sayısı", "Atomların sayısı ve türü", "Maddelerin fiziksel hâli", "Maddelerin rengi"],
      answer: 1,
      explain: "Atomlar yok olmaz, yoktan var olmaz; sadece yeniden düzenlenir. Molekül sayısı ise değişebilir (2H₂ + O₂ → 2H₂O: 3 molekül → 2 molekül).",
    },
    {
      q: "H₂ + O₂ → H₂O denklemini denkleştirirken hangisi YAPILAMAZ?",
      options: ["H₂O'nun önüne 2 yazmak", "H₂'nin önüne 2 yazmak", "H₂O'yu H₂O₂ yapmak", "Her iki taraftaki atomları saymak"],
      answer: 2,
      explain: "İndis değiştirilemez! H₂O₂ bambaşka bir madde (hidrojen peroksit). Sadece katsayılar değiştirilir.",
    },
    {
      q: "N₂ + 3H₂ → 2NH₃ denkleminde ürünler tarafında kaç H atomu vardır?",
      options: ["3", "5", "6", "2"],
      answer: 2,
      explain: "2NH₃ = 2 × 3 H = 6 H. Girenlerde de 3H₂ = 6 H var. Denk! ✅",
    },
    {
      q: "__Al + __O₂ → __Al₂O₃ denkleminin en küçük tam sayılarla katsayıları sırasıyla nedir?",
      options: ["2, 3, 1", "4, 3, 2", "4, 6, 4", "2, 1, 1"],
      answer: 1,
      explain: "4Al + 3O₂ → 2Al₂O₃: Al 4 = 4, O 6 = 6. (2, 3, 1'de O: 6 ≠ 3 olur.)",
    },
    {
      q: "CH₄ + 2O₂ → CO₂ + 2H₂O tepkimesinde 16 g CH₄ ile 64 g O₂ tamamen tepkimeye giriyor. Oluşan ürünlerin toplam kütlesi kaç gramdır?",
      options: ["48 g", "64 g", "80 g", "96 g"],
      answer: 2,
      explain: "Kütlenin korunumu: 16 + 64 = 80 g. Girenlerin kütlesi = ürünlerin kütlesi.",
    },
    {
      q: "C₃H₈ + 5O₂ → xCO₂ + yH₂O denkleminde x + y kaçtır?",
      options: ["5", "6", "7", "8"],
      answer: 2,
      explain: "3 C → 3CO₂ (x = 3); 8 H → 4H₂O (y = 4). O kontrolü: 6 + 4 = 10 = 5 × 2 ✅. x + y = 7.",
    },
    {
      q: "2KClO₃ → 2KCl + 3O₂ denklemindeki \"3\" neyi ifade eder?",
      options: ["O₂'nin indisini", "3 tane O₂ molekülünü", "Toplam 3 oksijen atomunu", "KCl'nin kütlesini"],
      answer: 1,
      explain: "Formülün önündeki sayı katsayıdır: 3 tane O₂ molekülü, yani 6 O atomu.",
    },
    {
      q: "Bir öğrenci 4H₂ + 2O₂ → 4H₂O yazmış. Bu denklem için hangisi doğrudur?",
      options: ["Denk değildir", "Denktir ama en küçük tam sayılarla yazılmamıştır", "Tamamen doğrudur", "İndisleri yanlıştır"],
      answer: 1,
      explain: "Atomlar eşit (8 H, 4 O) ama tüm katsayılar 2'ye bölünebilir: 2H₂ + O₂ → 2H₂O.",
    },
    {
      q: "Denkleştirmeye genellikle hangi adımla başlamak işi kolaylaştırır?",
      options: ["O₂'yi hemen eşitlemek", "En karmaşık (en çok atomlu) molekülden başlamak", "Tüm katsayıları 10 yapmak", "İndisleri eşitlemek"],
      answer: 1,
      explain: "En karmaşık molekülden başla, H ve O'yu sona bırak. Tek elementli O₂ gibi molekülleri en son ayarlamak kolaydır.",
    },
  ],
  en: [
    {
      q: "Which of these is always conserved in a chemical reaction?",
      options: ["The number of molecules", "The number and type of atoms", "The physical state of the substances", "The colour of the substances"],
      answer: 1,
      explain: "Atoms are never created or destroyed; they're only rearranged. The number of molecules can change (2H₂ + O₂ → 2H₂O: 3 molecules → 2 molecules).",
    },
    {
      q: "When balancing H₂ + O₂ → H₂O, which of these is NOT allowed?",
      options: ["Writing a 2 in front of H₂O", "Writing a 2 in front of H₂", "Changing H₂O into H₂O₂", "Counting the atoms on both sides"],
      answer: 2,
      explain: "You can't change a subscript! H₂O₂ is a completely different substance (hydrogen peroxide). Only coefficients may be changed.",
    },
    {
      q: "In N₂ + 3H₂ → 2NH₃, how many H atoms are on the products side?",
      options: ["3", "5", "6", "2"],
      answer: 2,
      explain: "2NH₃ = 2 × 3 H = 6 H. The reactants have 3H₂ = 6 H too. Balanced! ✅",
    },
    {
      q: "What are the smallest whole-number coefficients for __Al + __O₂ → __Al₂O₃, in order?",
      options: ["2, 3, 1", "4, 3, 2", "4, 6, 4", "2, 1, 1"],
      answer: 1,
      explain: "4Al + 3O₂ → 2Al₂O₃: Al 4 = 4, O 6 = 6. (With 2, 3, 1 you'd get O: 6 ≠ 3.)",
    },
    {
      q: "In CH₄ + 2O₂ → CO₂ + 2H₂O, 16 g of CH₄ reacts completely with 64 g of O₂. What is the total mass of the products?",
      options: ["48 g", "64 g", "80 g", "96 g"],
      answer: 2,
      explain: "Conservation of mass: 16 + 64 = 80 g. Mass of reactants = mass of products.",
    },
    {
      q: "In C₃H₈ + 5O₂ → xCO₂ + yH₂O, what is x + y?",
      options: ["5", "6", "7", "8"],
      answer: 2,
      explain: "3 C → 3CO₂ (x = 3); 8 H → 4H₂O (y = 4). Check O: 6 + 4 = 10 = 5 × 2 ✅. x + y = 7.",
    },
    {
      q: "In 2KClO₃ → 2KCl + 3O₂, what does the \"3\" mean?",
      options: ["The subscript of O₂", "3 molecules of O₂", "3 oxygen atoms in total", "The mass of KCl"],
      answer: 1,
      explain: "The number in front of a formula is a coefficient: 3 molecules of O₂, i.e. 6 O atoms.",
    },
    {
      q: "A student wrote 4H₂ + 2O₂ → 4H₂O. Which statement about this equation is true?",
      options: ["It isn't balanced", "It's balanced, but not with the smallest whole numbers", "It's completely correct", "Its subscripts are wrong"],
      answer: 1,
      explain: "The atoms match (8 H, 4 O), but every coefficient can be divided by 2: 2H₂ + O₂ → 2H₂O.",
    },
    {
      q: "Which first step usually makes balancing easier?",
      options: ["Balancing O₂ straight away", "Starting with the most complex molecule (the one with the most atoms)", "Making every coefficient 10", "Making the subscripts equal"],
      answer: 1,
      explain: "Start with the most complex molecule and leave H and O until last. Single-element molecules like O₂ are easiest to adjust at the very end.",
    },
  ],
};

export default function DenklestirTopic() {
  const { lang, t, pick } = useLang();
  const speakers = makeSpeakers(lang);
  const lines: DialogueLine[] = lineDefs.map((l) => ({ ...l, text: pick(l.text) }));
  return (
    <TopicShell
      title={t("Denkleştir Bakalım!", "Balance It!")}
      subtitle={t("Kütlenin korunumu ve denklem denkleştirme", "Conservation of mass and balancing equations")}
      emoji="⚖️"
      color="bg-mint"
      splash={(start) => (
        <Splash
          title={t("Denkleştir Bakalım! ⚖️", "Balance It! ⚖️")}
          tagline={t(
            "Atomlar kaybolmaz! Terazi Tekir ve Robo ile katsayıları ayarla, kimyasal denklemleri dengede tut.",
            "Atoms never vanish! Adjust the coefficients with Tabby the Scale Cat and Robo to keep chemical equations in balance.",
          )}
          color="bg-mint"
          onStart={start}
        >
          <Cat color={TEKIR.color} accent={TEKIR.accent} accessory="bowtie" mood="wink" size={120} />
          <SplashSeesaw />
          <Robo mood="excited" holding="clipboard" size={124} />
        </Splash>
      )}
      stages={[
        {
          key: "hikaye",
          label: t("📖 Hikaye", "📖 Story"),
          content: ({ goTo }) => (
            <Dialogue speakers={speakers} lines={lines} onDone={() => goTo("oyun")} doneLabel={t("Teraziye geç! 🎮", "On to the scale! 🎮")} />
          ),
        },
        {
          key: "oyun",
          label: t("🎮 Denkleştir", "🎮 Balance"),
          content: ({ goTo }) => <BalanceGame onQuiz={() => goTo("quiz")} />,
        },
        {
          key: "quiz",
          label: "❓ Quiz",
          content: () => <Quiz questions={pick(questions)} catColor={TEKIR.color} />,
        },
      ]}
    />
  );
}
