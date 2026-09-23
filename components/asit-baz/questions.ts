import type { QuizQuestion } from "@/components/Quiz";

export const QUESTIONS: QuizQuestion[] = [
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
];
