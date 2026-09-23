import type { QuizQuestion } from "@/components/Quiz";
import type { Localized } from "@/lib/i18n";

const TR: QuizQuestion[] = [
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

const EN: QuizQuestion[] = [
  {
    q: "According to kinetic theory, what happens when the temperature of a gas is increased?",
    options: ["The particles' average speed decreases", "The particles' average speed and kinetic energy increase", "The particles stop moving", "The particles' mass increases"],
    answer: 1,
    explain: "Temperature is a measure of the particles' average kinetic energy. Raise the temperature and the kitty particles run faster!",
  },
  {
    q: "What causes the pressure of a gas in a closed container?",
    options: ["The particles attracting each other", "The colour of the gas", "The particles colliding with the container walls", "The weight of the container"],
    answer: 2,
    explain: "Pressure comes from the force the particles exert when they hit the container walls. More collisions → higher pressure.",
  },
  {
    q: "At constant temperature, a gas with a volume of 6 L has a pressure of 2 atm. If the volume is reduced to 3 L, what is the new pressure?",
    options: ["1 atm", "2 atm", "4 atm", "6 atm"],
    answer: 2,
    explain: "Boyle: P₁·V₁ = P₂·V₂ → 2 · 6 = P₂ · 3 → P₂ = 4 atm. The volume halved, so the pressure doubled.",
  },
  {
    q: "At constant pressure, 4 L of gas at 27 °C is heated to 127 °C. What is the new volume?",
    options: ["4.7 L", "5.33 L", "18.8 L", "3 L"],
    answer: 1,
    explain: "Charles: kelvin first! 27 °C = 300 K, 127 °C = 400 K. V₂ = 4 · 400 / 300 ≈ 5.33 L. (Using °C gives a wrong answer like 18.8 L.)",
  },
  {
    q: "A gas in a sealed, rigid container has a pressure of 3 atm at 300 K. If it is heated to 600 K, what is the pressure?",
    options: ["1.5 atm", "3 atm", "6 atm", "9 atm"],
    answer: 2,
    explain: "Gay-Lussac: P/T is constant. The kelvin temperature doubled → the pressure doubles too: 6 atm. That's why tyres can burst in the heat!",
  },
  {
    q: "0.5 mol of an ideal gas is in an 11.2 L container at 273 K. What is its pressure, approximately? (R = 0.082 L·atm/mol·K)",
    options: ["0.5 atm", "1 atm", "2 atm", "22.4 atm"],
    answer: 1,
    explain: "P = nRT / V = 0.5 · 0.082 · 273 / 11.2 ≈ 1 atm. (At STP, 1 mol of gas occupies 22.4 L.)",
  },
  {
    q: "2 mol of an ideal gas exerts a pressure of 4 atm at 300 K. What is its volume? (R = 0.082 L·atm/mol·K)",
    options: ["6.15 L", "12.3 L", "24.6 L", "49.2 L"],
    answer: 1,
    explain: "V = nRT / P = 2 · 0.082 · 300 / 4 = 12.3 L.",
  },
  {
    q: "At constant pressure and temperature, 2 mol of gas occupies 44.8 L. What volume does 3 mol occupy under the same conditions?",
    options: ["22.4 L", "44.8 L", "67.2 L", "89.6 L"],
    answer: 2,
    explain: "Avogadro: V/n is constant → 44.8 / 2 = 22.4 L/mol. 3 mol × 22.4 = 67.2 L.",
  },
  {
    q: "Air bubbles breathed out by a diver get bigger as they rise to the surface. Which law explains this?",
    options: ["Boyle's law", "Charles's law", "Avogadro's law", "Conservation of mass"],
    answer: 0,
    explain: "The water pressure drops as the bubbles rise; at roughly constant temperature, lower pressure means larger volume (Boyle).",
  },
  {
    q: "What is −73 °C in kelvin?",
    options: ["−73 K", "73 K", "200 K", "346 K"],
    answer: 2,
    explain: "K = °C + 273 → −73 + 273 = 200 K. There are no negative temperatures on the kelvin scale; the lowest is 0 K (absolute zero).",
  },
];

export const QUESTIONS: Localized<QuizQuestion[]> = { tr: TR, en: EN };
