import type { QuizQuestion } from "@/components/Quiz";

export const QUESTIONS: QuizQuestion[] = [
  {
    q: "Kinetik teoriye göre bir gazın sıcaklığı artırılırsa ne olur?",
    options: ["Taneciklerin ortalama hızı azalır", "Taneciklerin ortalama hızı ve kinetik enerjisi artar", "Tanecikler durur", "Taneciklerin kütlesi artar"],
    answer: 1,
    explain: "Sıcaklık, taneciklerin ortalama kinetik enerjisinin ölçüsüdür. Sıcaklık artınca kedicikler daha hızlı koşar!",
  },
  {
    q: "Kapalı bir kaptaki gazın basıncı neden oluşur?",
    options: ["Taneciklerin birbirini çekmesinden", "Gazın renginden", "Taneciklerin kabın çeperlerine çarpmasından", "Kabın ağırlığından"],
    answer: 2,
    explain: "Basınç, taneciklerin kabın duvarlarına çarparken uyguladığı kuvvetten doğar. Daha çok çarpışma → daha yüksek basınç.",
  },
  {
    q: "Sabit sıcaklıkta 6 L hacimli bir gazın basıncı 2 atm'dir. Hacim 3 L'ye düşürülürse basınç kaç atm olur?",
    options: ["1 atm", "2 atm", "4 atm", "6 atm"],
    answer: 2,
    explain: "Boyle: P₁·V₁ = P₂·V₂ → 2 · 6 = P₂ · 3 → P₂ = 4 atm. Hacim yarıya indi, basınç 2 katına çıktı.",
  },
  {
    q: "Sabit basınçta 27 °C'de 4 L olan bir gaz 127 °C'ye ısıtılıyor. Yeni hacim kaç L olur?",
    options: ["4,7 L", "5,33 L", "18,8 L", "3 L"],
    answer: 1,
    explain: "Charles: önce Kelvin! 27 °C = 300 K, 127 °C = 400 K. V₂ = 4 · 400 / 300 ≈ 5,33 L. (°C ile hesaplayan 18,8 L gibi yanlış bir sonuç bulur.)",
  },
  {
    q: "Hacmi değişmeyen kapalı bir kapta gazın basıncı 300 K'de 3 atm'dir. Gaz 600 K'e ısıtılırsa basınç kaç atm olur?",
    options: ["1,5 atm", "3 atm", "6 atm", "9 atm"],
    answer: 2,
    explain: "Gay-Lussac: P/T sabit. Kelvin sıcaklık 2 katına çıktı → basınç da 2 katına çıkar: 6 atm. Sıcakta lastiklerin patlama sebebi!",
  },
  {
    q: "0,5 mol ideal gaz 273 K'de 11,2 L'lik bir kaptadır. Gazın basıncı yaklaşık kaç atm'dir? (R = 0,082 L·atm/mol·K)",
    options: ["0,5 atm", "1 atm", "2 atm", "22,4 atm"],
    answer: 1,
    explain: "P = nRT / V = 0,5 · 0,082 · 273 / 11,2 ≈ 1 atm. (Normal koşullarda 1 mol gaz 22,4 L kaplar.)",
  },
  {
    q: "2 mol ideal gaz 300 K'de 4 atm basınç yapıyor. Gazın hacmi kaç L'dir? (R = 0,082 L·atm/mol·K)",
    options: ["6,15 L", "12,3 L", "24,6 L", "49,2 L"],
    answer: 1,
    explain: "V = nRT / P = 2 · 0,082 · 300 / 4 = 12,3 L.",
  },
  {
    q: "Sabit basınç ve sıcaklıkta 2 mol gaz 44,8 L hacim kaplıyor. Aynı koşullarda 3 mol gaz kaç L kaplar?",
    options: ["22,4 L", "44,8 L", "67,2 L", "89,6 L"],
    answer: 2,
    explain: "Avogadro: V/n sabit → 44,8 / 2 = 22,4 L/mol. 3 mol × 22,4 = 67,2 L.",
  },
  {
    q: "Dalgıcın ağzından çıkan hava kabarcıkları yüzeye doğru yükselirken büyür. Bunu açıklayan yasa hangisidir?",
    options: ["Boyle yasası", "Charles yasası", "Avogadro yasası", "Kütlenin korunumu"],
    answer: 0,
    explain: "Yüzeye çıktıkça suyun basıncı azalır; sıcaklık yaklaşık sabitken basınç azalınca hacim artar (Boyle).",
  },
  {
    q: "−73 °C kaç Kelvin'dir?",
    options: ["−73 K", "73 K", "200 K", "346 K"],
    answer: 2,
    explain: "K = °C + 273 → −73 + 273 = 200 K. Kelvin ölçeğinde negatif sıcaklık yoktur; en düşük değer 0 K (mutlak sıfır).",
  },
];
