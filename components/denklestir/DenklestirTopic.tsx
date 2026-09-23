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
    name: lang === "en" ? "Tabby the Scale Cat" : lang === "de" ? "Tiger die Waagenkatze" : "Terazi Tekir",
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
      de: "Miau! Ich bin Tiger die Waagenkatze. Heute gleichen wir chemische Reaktionsgleichungen aus. Genau wie bei einer Waage: Beide Waagschalen müssen gleich schwer sein! ⚖️",
    },
  },
  {
    speaker: "robo",
    text: {
      tr: "Bip bop! Kural: Kütlenin korunumu (Lavoisier). Tepkimeden önceki toplam kütle = sonraki toplam kütle. Çünkü atomlar yok olmaz, yoktan var olmaz; sadece yeniden düzenlenir. Lego gibi! 🧱",
      en: "Beep boop! The rule: conservation of mass (Lavoisier). Total mass before the reaction = total mass after. Atoms are never created or destroyed; they're just rearranged. Like LEGO! 🧱",
      de: "Piep, piep! Die Regel heißt Massenerhaltung (Lavoisier): Gesamtmasse vor der Reaktion = Gesamtmasse danach. Atome werden nie erzeugt oder vernichtet, sie werden nur neu zusammengesteckt. Wie LEGO! 🧱",
    },
    mood: "excited",
  },
  {
    speaker: "tekir",
    text: {
      tr: "Şu denkleme bak: H₂ + O₂ → H₂O. Solda 2 oksijen, sağda 1! Kolay: H₂O'yu H₂O₂ yaparım, olur biter! 😼",
      en: "Look at this equation: H₂ + O₂ → H₂O. 2 oxygens on the left, 1 on the right! Easy: I'll just turn H₂O into H₂O₂, job done! 😼",
      de: "Schau dir diese Gleichung an: H₂ + O₂ → H₂O. Links 2 Sauerstoffatome, rechts nur 1! Ganz easy: Ich mach aus H₂O einfach H₂O₂, fertig! 😼",
    },
    mood: "surprised",
    visual: <EquationVisual left={[["H2", 1], ["O2", 1]]} right={[["H2O", 1]]} />,
  },
  {
    speaker: "robo",
    text: {
      tr: "Dur, olmaz! O küçük sayı İNDİS. İndisi değiştirirsen madde değişir: H₂O su, H₂O₂ ise hidrojen peroksit! İndisler asla değiştirilemez.",
      en: "Stop, you can't! That little number is a SUBSCRIPT. Change the subscript and you change the substance: H₂O is water, but H₂O₂ is hydrogen peroxide! Subscripts can never be changed.",
      de: "Halt, das geht nicht! Die kleine Zahl ist der INDEX. Änderst du den Index, änderst du den Stoff: H₂O ist Wasser, H₂O₂ aber Wasserstoffperoxid! Indizes darf man niemals ändern.",
    },
    mood: "sad",
    visual: <IndexVisual />,
  },
  {
    speaker: "tekir",
    text: {
      tr: "Anladım! Değiştirebileceğimiz tek şey formülün önündeki büyük sayı: KATSAYI. Kaç tane molekül olduğunu söyler. 2H₂O = 2 su molekülü = 4 H ve 2 O. (Katsayı 1 ise yazılmaz.)",
      en: "Got it! The only thing we can change is the big number in front of the formula: the COEFFICIENT. It tells us how many molecules there are. 2H₂O = 2 water molecules = 4 H and 2 O. (A coefficient of 1 isn't written.)",
      de: "Verstanden! Ändern dürfen wir nur die große Zahl vor der Formel: den KOEFFIZIENTEN. Er sagt, wie viele Moleküle es sind. 2H₂O = 2 Wassermoleküle = 4 H und 2 O. (Ein Koeffizient 1 wird nicht hingeschrieben.)",
    },
    mood: "thinking",
    visual: <CoefVisual />,
  },
  {
    speaker: "robo",
    text: {
      tr: "Aynen! Deneyelim: 2H₂ + O₂ → 2H₂O. Sol: 4 H, 2 O. Sağ: 4 H, 2 O. Terazi dengede! 🎉",
      en: "Exactly! Let's try: 2H₂ + O₂ → 2H₂O. Left: 4 H, 2 O. Right: 4 H, 2 O. The scale is balanced! 🎉",
      de: "Genau! Probieren wir's: 2H₂ + O₂ → 2H₂O. Links: 4 H, 2 O. Rechts: 4 H, 2 O. Die Waage ist im Gleichgewicht! 🎉",
    },
    mood: "excited",
    visual: <EquationVisual left={[["H2", 2], ["O2", 1]]} right={[["H2O", 2]]} />,
  },
  {
    speaker: "tekir",
    text: {
      tr: "İşte tarifimiz! 4H₂ + 2O₂ → 4H₂O de dengeli ama sadeleşir; hep en küçük tam sayıları kullan. Şimdi sıra sende, az hamlede çöz! ⭐⭐⭐",
      en: "Here's our recipe! 4H₂ + 2O₂ → 4H₂O is balanced too, but it can be simplified; always use the smallest whole numbers. Now it's your turn: solve it in as few moves as you can! ⭐⭐⭐",
      de: "Das ist unser Rezept! 4H₂ + 2O₂ → 4H₂O ist auch ausgeglichen, lässt sich aber kürzen – nimm immer die kleinsten ganzen Zahlen. Jetzt bist du dran: Schaffst du es mit möglichst wenigen Zügen? ⭐⭐⭐",
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
  de: [
    {
      q: "Was bleibt bei einer chemischen Reaktion immer erhalten?",
      options: ["Die Anzahl der Moleküle", "Anzahl und Art der Atome", "Der Aggregatzustand der Stoffe", "Die Farbe der Stoffe"],
      answer: 1,
      explain: "Atome werden weder erzeugt noch vernichtet, sondern nur neu angeordnet. Die Anzahl der Moleküle kann sich dagegen ändern (2H₂ + O₂ → 2H₂O: 3 Moleküle → 2 Moleküle).",
    },
    {
      q: "Was ist beim Ausgleichen von H₂ + O₂ → H₂O NICHT erlaubt?",
      options: ["Eine 2 vor H₂O schreiben", "Eine 2 vor H₂ schreiben", "H₂O in H₂O₂ ändern", "Die Atome auf beiden Seiten zählen"],
      answer: 2,
      explain: "Einen Index darfst du nicht ändern! H₂O₂ ist ein ganz anderer Stoff (Wasserstoffperoxid). Nur die Koeffizienten dürfen geändert werden.",
    },
    {
      q: "Wie viele H-Atome stehen bei N₂ + 3H₂ → 2NH₃ auf der Produktseite?",
      options: ["3", "5", "6", "2"],
      answer: 2,
      explain: "2NH₃ = 2 × 3 H = 6 H. Die Edukte haben mit 3H₂ ebenfalls 6 H. Ausgeglichen! ✅",
    },
    {
      q: "Wie lauten die kleinsten ganzzahligen Koeffizienten für __Al + __O₂ → __Al₂O₃ (der Reihe nach)?",
      options: ["2, 3, 1", "4, 3, 2", "4, 6, 4", "2, 1, 1"],
      answer: 1,
      explain: "4Al + 3O₂ → 2Al₂O₃: Al 4 = 4, O 6 = 6. (Mit 2, 3, 1 hättest du bei O: 6 ≠ 3.)",
    },
    {
      q: "Bei CH₄ + 2O₂ → CO₂ + 2H₂O reagieren 16 g CH₄ vollständig mit 64 g O₂. Wie groß ist die Gesamtmasse der Produkte?",
      options: ["48 g", "64 g", "80 g", "96 g"],
      answer: 2,
      explain: "Massenerhaltung: 16 + 64 = 80 g. Masse der Edukte = Masse der Produkte.",
    },
    {
      q: "Wie groß ist x + y in C₃H₈ + 5O₂ → xCO₂ + yH₂O?",
      options: ["5", "6", "7", "8"],
      answer: 2,
      explain: "3 C → 3CO₂ (x = 3); 8 H → 4H₂O (y = 4). O-Probe: 6 + 4 = 10 = 5 × 2 ✅. Also x + y = 7.",
    },
    {
      q: "Was bedeutet die „3“ in 2KClO₃ → 2KCl + 3O₂?",
      options: ["Den Index von O₂", "3 O₂-Moleküle", "Insgesamt 3 Sauerstoffatome", "Die Masse von KCl"],
      answer: 1,
      explain: "Die Zahl vor einer Formel ist ein Koeffizient: 3 O₂-Moleküle, also 6 O-Atome.",
    },
    {
      q: "Ein Schüler hat 4H₂ + 2O₂ → 4H₂O geschrieben. Welche Aussage über diese Gleichung stimmt?",
      options: ["Sie ist nicht ausgeglichen", "Sie ist ausgeglichen, aber nicht mit den kleinsten ganzen Zahlen", "Sie ist völlig richtig", "Die Indizes sind falsch"],
      answer: 1,
      explain: "Die Atome stimmen (8 H, 4 O), aber alle Koeffizienten lassen sich durch 2 teilen: 2H₂ + O₂ → 2H₂O.",
    },
    {
      q: "Mit welchem ersten Schritt wird das Ausgleichen meistens leichter?",
      options: ["O₂ sofort ausgleichen", "Mit dem kompliziertesten Molekül (mit den meisten Atomen) anfangen", "Alle Koeffizienten auf 10 setzen", "Die Indizes angleichen"],
      answer: 1,
      explain: "Fang mit dem kompliziertesten Molekül an und heb dir H und O für den Schluss auf. Moleküle aus nur einem Element wie O₂ lassen sich ganz am Ende am leichtesten anpassen.",
    },
  ],
};

export default function DenklestirTopic() {
  const { lang, t, pick } = useLang();
  const speakers = makeSpeakers(lang);
  const lines: DialogueLine[] = lineDefs.map((l) => ({ ...l, text: pick(l.text) }));
  return (
    <TopicShell
      title={t("Denkleştir Bakalım!", "Balance It!", "Gleich aus!")}
      subtitle={t("Kütlenin korunumu ve denklem denkleştirme", "Conservation of mass and balancing equations", "Massenerhaltung und Reaktionsgleichungen ausgleichen")}
      emoji="⚖️"
      color="bg-mint"
      splash={(start) => (
        <Splash
          title={t("Denkleştir Bakalım! ⚖️", "Balance It! ⚖️", "Gleich aus! ⚖️")}
          tagline={t(
            "Atomlar kaybolmaz! Terazi Tekir ve Robo ile katsayıları ayarla, kimyasal denklemleri dengede tut.",
            "Atoms never vanish! Adjust the coefficients with Tabby the Scale Cat and Robo to keep chemical equations in balance.",
            "Atome verschwinden nie! Stell mit Tiger der Waagenkatze und Robo die Koeffizienten ein und bring chemische Gleichungen ins Gleichgewicht.",
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
          label: t("📖 Hikaye", "📖 Story", "📖 Geschichte"),
          content: ({ goTo }) => (
            <Dialogue speakers={speakers} lines={lines} onDone={() => goTo("oyun")} doneLabel={t("Teraziye geç! 🎮", "On to the scale! 🎮", "Ab zur Waage! 🎮")} />
          ),
        },
        {
          key: "oyun",
          label: t("🎮 Denkleştir", "🎮 Balance", "🎮 Ausgleichen"),
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
