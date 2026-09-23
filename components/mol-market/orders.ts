import type { El } from "./chem";
import type { CatAccessory } from "@/components/Cat";

export interface Customer {
  name: string;
  color: string;
  accent: string;
  accessory: CatAccessory;
}

interface Base {
  customer: Customer;
  /** Order speech */
  text: string;
  /** Robo's hint after a wrong answer */
  hint: string;
  /** Full worked solution (receipt) */
  solution: string;
}

export interface BasketOrder extends Base {
  kind: "basket";
  need: Partial<Record<El, number>>;
}
export interface RegisterOrder extends Base {
  kind: "register";
  answer: number;
  unit: string;
  label: string;
}
export interface ChoiceOrder extends Base {
  kind: "choice";
  options: string[];
  answer: number;
}
export type Order = BasketOrder | RegisterOrder | ChoiceOrder;

const c = (name: string, color: string, accent: string, accessory: CatAccessory = "none"): Customer => ({ name, color, accent, accessory });

export const ORDERS: Order[] = [
  {
    kind: "basket",
    customer: c("Pamuk", "#ffffff", "#ffd6e0", "bowtie"),
    text: "Merhaba! 1 mol H₂O (su) yapacağım. Sepetime kaç mol H, kaç mol O koymalısın?",
    need: { H: 2, O: 1 },
    hint: "H₂O formülüne bak: 2 tane H, 1 tane O var. 1 mol su için 2 mol H ve 1 mol O gerekir.",
    solution: "1 mol H₂O → 2 mol H + 1 mol O",
  },
  {
    kind: "register",
    customer: c("Tarçın", "#ffe5cc", "#ffb88a"),
    text: "Su paketimin etiketi silinmiş! H₂O'nun mol kütlesi kaç g/mol?",
    label: "M(H₂O) =",
    answer: 18,
    unit: "g/mol",
    hint: "Atom kütlelerini topla: 2 tane H (2·1) + 1 tane O (16).",
    solution: "M(H₂O) = 2·1 + 16 = 18 g/mol",
  },
  {
    kind: "register",
    customer: c("Boncuk", "#d6ecff", "#8cc8ff", "glasses"),
    text: "Şişemde 36 gram su var. Bu kaç mol eder?",
    label: "n =",
    answer: 2,
    unit: "mol",
    hint: "n = m / M. Suyun mol kütlesi 18 g/mol idi: 36 / 18 = ?",
    solution: "n = m / M = 36 / 18 = 2 mol",
  },
  {
    kind: "basket",
    customer: c("Zeytin", "#d4f5e9", "#7fdcb8"),
    text: "2 mol NH₃ (amonyak) yapacağım. Sepete ne kadar N ve H lazım?",
    need: { N: 2, H: 6 },
    hint: "1 mol NH₃'te 1 mol N ve 3 mol H var. Hepsini 2 ile çarp!",
    solution: "2 mol NH₃ → 2·1 = 2 mol N + 2·3 = 6 mol H",
  },
  {
    kind: "register",
    customer: c("Duman", "#e4dff0", "#b69cff", "detective"),
    text: "Gazozun köpüğü CO₂'den gelir. CO₂'nin mol kütlesi kaç g/mol?",
    label: "M(CO₂) =",
    answer: 44,
    unit: "g/mol",
    hint: "1 tane C (12) + 2 tane O (2·16). Topla bakalım!",
    solution: "M(CO₂) = 12 + 2·16 = 44 g/mol",
  },
  {
    kind: "register",
    customer: c("Fındık", "#f6d6c8", "#e0967a"),
    text: "88 gram CO₂ aldım. Kaç mol CO₂ almış oldum?",
    label: "n =",
    answer: 2,
    unit: "mol",
    hint: "n = m / M ve M(CO₂) = 44 g/mol. 88 / 44 = ?",
    solution: "n = 88 / 44 = 2 mol CO₂",
  },
  {
    kind: "basket",
    customer: c("Tebeşir", "#fff8f0", "#ffe066", "glasses"),
    text: "1 mol CaCO₃ (kireç taşı) yapmak istiyorum. Sepetimi hazırlar mısın?",
    need: { Ca: 1, C: 1, O: 3 },
    hint: "CaCO₃'ü parçala: 1 Ca, 1 C, 3 O. Küçük 3 sadece O'ya aittir!",
    solution: "1 mol CaCO₃ → 1 mol Ca + 1 mol C + 3 mol O",
  },
  {
    kind: "register",
    customer: c("Limon", "#fff5b8", "#ffe066", "chef"),
    text: "Çorbama 0,5 mol NaCl (sofra tuzu) koyacağım. Kaç gram tartayım?",
    label: "m =",
    answer: 29.25,
    unit: "g",
    hint: "Önce M(NaCl) = 23 + 35,5 = 58,5 g/mol. Sonra m = n · M.",
    solution: "m = n · M = 0,5 · 58,5 = 29,25 g",
  },
  {
    kind: "choice",
    customer: c("Bulut", "#d6ecff", "#ffd6e0", "goggles"),
    text: "Balonumda 2 mol O₂ gazı var. İçinde kaç tane O₂ molekülü vardır?",
    options: ["6,02·10²³", "12,04·10²³", "3,01·10²³", "24,08·10²³"],
    answer: 1,
    hint: "N = n · Nₐ. Yani 2 · 6,02·10²³ = ?",
    solution: "N = 2 · 6,02·10²³ = 12,04·10²³ molekül",
  },
  {
    kind: "register",
    customer: c("Mırnav", "#ffd6e0", "#ff9ebb", "crown"),
    text: "Normal koşullarda (NK) 44,8 litre CH₄ gazı doldurdum. Kaç mol eder?",
    label: "n =",
    answer: 2,
    unit: "mol",
    hint: "NK'da 1 mol gaz 22,4 L. n = V / 22,4 → 44,8 / 22,4 = ?",
    solution: "n = 44,8 / 22,4 = 2 mol CH₄",
  },
  {
    kind: "basket",
    customer: c("Pas Paşa", "#e0967a", "#ffb88a", "bowtie"),
    text: "Eski bisikletim paslandı! 2 mol Fe₂O₃ (pas) için ne kadar Fe ve O gerekir?",
    need: { Fe: 4, O: 6 },
    hint: "1 mol Fe₂O₃'te 2 mol Fe, 3 mol O var. 2 ile çarp: Fe = 2·2, O = 2·3.",
    solution: "2 mol Fe₂O₃ → 4 mol Fe + 6 mol O",
  },
  {
    kind: "register",
    customer: c("Profesör Tekir", "#e8dcff", "#ffe066", "labcoat"),
    text: "Son sipariş, zor olanı! 9,8 gram H₂SO₄ kaç mol eder?",
    label: "n =",
    answer: 0.1,
    unit: "mol",
    hint: "M(H₂SO₄) = 2·1 + 32 + 4·16 = 98 g/mol. Sonra n = 9,8 / 98.",
    solution: "M = 2 + 32 + 64 = 98 g/mol → n = 9,8 / 98 = 0,1 mol",
  },
];
