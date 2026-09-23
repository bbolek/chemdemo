"use client";

import Cat, { type CatMood } from "@/components/Cat";
import Dialogue, { type DialogueLine, type Speaker } from "@/components/Dialogue";
import Quiz, { type QuizQuestion } from "@/components/Quiz";
import Robo, { type RoboMood } from "@/components/Robo";
import Splash from "@/components/Splash";
import TopicShell from "@/components/TopicShell";
import BalanceGame from "./BalanceGame";
import { CoefVisual, EquationVisual, IndexVisual, SplashSeesaw, StepsVisual } from "./Visuals";

const TEKIR = { color: "#d4f5e9", accent: "#7fdcb8" };

const speakers: Record<string, Speaker> = {
  tekir: {
    name: "Terazi Tekir",
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
};

const lines: DialogueLine[] = [
  {
    speaker: "tekir",
    text: "Miyav! Ben Terazi Tekir. Bugün kimyasal denklemleri denkleştireceğiz. Tıpkı bir terazi gibi: iki kefe de eşit olmalı! ⚖️",
  },
  {
    speaker: "robo",
    text: "Bip bop! Kural: Kütlenin korunumu (Lavoisier). Tepkimeden önceki toplam kütle = sonraki toplam kütle. Çünkü atomlar yok olmaz, yoktan var olmaz; sadece yeniden düzenlenir. Lego gibi! 🧱",
    mood: "excited",
  },
  {
    speaker: "tekir",
    text: "Şu denkleme bak: H₂ + O₂ → H₂O. Solda 2 oksijen, sağda 1! Kolay: H₂O'yu H₂O₂ yaparım, olur biter! 😼",
    mood: "surprised",
    visual: <EquationVisual left={[["H2", 1], ["O2", 1]]} right={[["H2O", 1]]} />,
  },
  {
    speaker: "robo",
    text: "Dur, olmaz! O küçük sayı İNDİS. İndisi değiştirirsen madde değişir: H₂O su, H₂O₂ ise hidrojen peroksit! İndisler asla değiştirilemez.",
    mood: "sad",
    visual: <IndexVisual />,
  },
  {
    speaker: "tekir",
    text: "Anladım! Değiştirebileceğimiz tek şey formülün önündeki büyük sayı: KATSAYI. Kaç tane molekül olduğunu söyler. 2H₂O = 2 su molekülü = 4 H ve 2 O. (Katsayı 1 ise yazılmaz.)",
    mood: "thinking",
    visual: <CoefVisual />,
  },
  {
    speaker: "robo",
    text: "Aynen! Deneyelim: 2H₂ + O₂ → 2H₂O. Sol: 4 H, 2 O. Sağ: 4 H, 2 O. Terazi dengede! 🎉",
    mood: "excited",
    visual: <EquationVisual left={[["H2", 2], ["O2", 1]]} right={[["H2O", 2]]} />,
  },
  {
    speaker: "tekir",
    text: "İşte tarifimiz! 4H₂ + 2O₂ → 4H₂O de dengeli ama sadeleşir; hep en küçük tam sayıları kullan. Şimdi sıra sende, az hamlede çöz! ⭐⭐⭐",
    mood: "love",
    visual: <StepsVisual />,
  },
];

const questions: QuizQuestion[] = [
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
];

export default function DenklestirTopic() {
  return (
    <TopicShell
      title="Denkleştir Bakalım!"
      subtitle="Kütlenin korunumu ve denklem denkleştirme"
      emoji="⚖️"
      color="bg-mint"
      splash={(start) => (
        <Splash
          title="Denkleştir Bakalım! ⚖️"
          tagline="Atomlar kaybolmaz! Terazi Tekir ve Robo ile katsayıları ayarla, kimyasal denklemleri dengede tut."
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
          label: "📖 Hikaye",
          content: ({ goTo }) => <Dialogue speakers={speakers} lines={lines} onDone={() => goTo("oyun")} doneLabel="Teraziye geç! 🎮" />,
        },
        {
          key: "oyun",
          label: "🎮 Denkleştir",
          content: ({ goTo }) => <BalanceGame onQuiz={() => goTo("quiz")} />,
        },
        {
          key: "quiz",
          label: "❓ Quiz",
          content: () => <Quiz questions={questions} catColor={TEKIR.color} />,
        },
      ]}
    />
  );
}
