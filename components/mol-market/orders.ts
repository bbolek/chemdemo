import { L, type El } from "./chem";
import type { CatAccessory } from "@/components/Cat";
import type { Localized } from "@/lib/i18n";

type T = Localized<string>;

export interface Customer {
  name: T;
  color: string;
  accent: string;
  accessory: CatAccessory;
}

interface Base {
  customer: Customer;
  /** Order speech */
  text: T;
  /** Robo's hint after a wrong answer */
  hint: T;
  /** Full worked solution (receipt) */
  solution: T;
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
  /** Particle counts, rendered with fmtN() in the current language */
  options: number[];
  answer: number;
}
export type Order = BasketOrder | RegisterOrder | ChoiceOrder;

const c = (name: T, color: string, accent: string, accessory: CatAccessory = "none"): Customer => ({ name, color, accent, accessory });

export const ORDERS: Order[] = [
  {
    kind: "basket",
    customer: c(L("Pamuk", "Cotton"), "#ffffff", "#ffd6e0", "bowtie"),
    text: L(
      "Merhaba! 1 mol H₂O (su) yapacağım. Sepetime kaç mol H, kaç mol O koymalısın?",
      "Hi there! I'm making 1 mol of H₂O (water). How many moles of H and how many moles of O should go in my basket?",
    ),
    need: { H: 2, O: 1 },
    hint: L(
      "H₂O formülüne bak: 2 tane H, 1 tane O var. 1 mol su için 2 mol H ve 1 mol O gerekir.",
      "Look at the formula H₂O: there are 2 H and 1 O. So 1 mol of water needs 2 mol of H and 1 mol of O.",
    ),
    solution: L("1 mol H₂O → 2 mol H + 1 mol O", "1 mol H₂O → 2 mol H + 1 mol O"),
  },
  {
    kind: "register",
    customer: c(L("Tarçın", "Cinnamon"), "#ffe5cc", "#ffb88a"),
    text: L("Su paketimin etiketi silinmiş! H₂O'nun mol kütlesi kaç g/mol?", "The label on my water pack has rubbed off! What's the molar mass of H₂O in g/mol?"),
    label: "M(H₂O) =",
    answer: 18,
    unit: "g/mol",
    hint: L("Atom kütlelerini topla: 2 tane H (2·1) + 1 tane O (16).", "Add up the atomic masses: 2 H (2×1) + 1 O (16)."),
    solution: L("M(H₂O) = 2·1 + 16 = 18 g/mol", "M(H₂O) = 2×1 + 16 = 18 g/mol"),
  },
  {
    kind: "register",
    customer: c(L("Boncuk", "Button"), "#d6ecff", "#8cc8ff", "glasses"),
    text: L("Şişemde 36 gram su var. Bu kaç mol eder?", "My bottle holds 36 grams of water. How many moles is that?"),
    label: "n =",
    answer: 2,
    unit: "mol",
    hint: L("n = m / M. Suyun mol kütlesi 18 g/mol idi: 36 / 18 = ?", "n = m / M. The molar mass of water is 18 g/mol: 36 / 18 = ?"),
    solution: L("n = m / M = 36 / 18 = 2 mol", "n = m / M = 36 / 18 = 2 mol"),
  },
  {
    kind: "basket",
    customer: c(L("Zeytin", "Olive"), "#d4f5e9", "#7fdcb8"),
    text: L("2 mol NH₃ (amonyak) yapacağım. Sepete ne kadar N ve H lazım?", "I'm making 2 mol of NH₃ (ammonia). How much N and H do I need in the basket?"),
    need: { N: 2, H: 6 },
    hint: L("1 mol NH₃'te 1 mol N ve 3 mol H var. Hepsini 2 ile çarp!", "1 mol of NH₃ contains 1 mol of N and 3 mol of H. Multiply everything by 2!"),
    solution: L("2 mol NH₃ → 2·1 = 2 mol N + 2·3 = 6 mol H", "2 mol NH₃ → 2×1 = 2 mol N + 2×3 = 6 mol H"),
  },
  {
    kind: "register",
    customer: c(L("Duman", "Smokey"), "#e4dff0", "#b69cff", "detective"),
    text: L("Gazozun köpüğü CO₂'den gelir. CO₂'nin mol kütlesi kaç g/mol?", "The fizz in soda comes from CO₂. What's the molar mass of CO₂ in g/mol?"),
    label: "M(CO₂) =",
    answer: 44,
    unit: "g/mol",
    hint: L("1 tane C (12) + 2 tane O (2·16). Topla bakalım!", "1 C (12) + 2 O (2×16). Add them up!"),
    solution: L("M(CO₂) = 12 + 2·16 = 44 g/mol", "M(CO₂) = 12 + 2×16 = 44 g/mol"),
  },
  {
    kind: "register",
    customer: c(L("Fındık", "Hazel"), "#f6d6c8", "#e0967a"),
    text: L("88 gram CO₂ aldım. Kaç mol CO₂ almış oldum?", "I bought 88 grams of CO₂. How many moles of CO₂ did I get?"),
    label: "n =",
    answer: 2,
    unit: "mol",
    hint: L("n = m / M ve M(CO₂) = 44 g/mol. 88 / 44 = ?", "n = m / M and M(CO₂) = 44 g/mol. 88 / 44 = ?"),
    solution: L("n = 88 / 44 = 2 mol CO₂", "n = 88 / 44 = 2 mol CO₂"),
  },
  {
    kind: "basket",
    customer: c(L("Tebeşir", "Chalky"), "#fff8f0", "#ffe066", "glasses"),
    text: L("1 mol CaCO₃ (kireç taşı) yapmak istiyorum. Sepetimi hazırlar mısın?", "I want to make 1 mol of CaCO₃ (limestone). Could you pack my basket?"),
    need: { Ca: 1, C: 1, O: 3 },
    hint: L("CaCO₃'ü parçala: 1 Ca, 1 C, 3 O. Küçük 3 sadece O'ya aittir!", "Break CaCO₃ apart: 1 Ca, 1 C, 3 O. The little subscript 3 belongs to O only!"),
    solution: L("1 mol CaCO₃ → 1 mol Ca + 1 mol C + 3 mol O", "1 mol CaCO₃ → 1 mol Ca + 1 mol C + 3 mol O"),
  },
  {
    kind: "register",
    customer: c(L("Limon", "Lemon"), "#fff5b8", "#ffe066", "chef"),
    text: L("Çorbama 0,5 mol NaCl (sofra tuzu) koyacağım. Kaç gram tartayım?", "I'm adding 0.5 mol of NaCl (table salt) to my soup. How many grams should I weigh out?"),
    label: "m =",
    answer: 29.25,
    unit: "g",
    hint: L("Önce M(NaCl) = 23 + 35,5 = 58,5 g/mol. Sonra m = n · M.", "First, M(NaCl) = 23 + 35.5 = 58.5 g/mol. Then m = n × M."),
    solution: L("m = n · M = 0,5 · 58,5 = 29,25 g", "m = n × M = 0.5 × 58.5 = 29.25 g"),
  },
  {
    kind: "choice",
    customer: c(L("Bulut", "Cloud"), "#d6ecff", "#ffd6e0", "goggles"),
    text: L("Balonumda 2 mol O₂ gazı var. İçinde kaç tane O₂ molekülü vardır?", "My balloon holds 2 mol of O₂ gas. How many O₂ molecules are inside?"),
    options: [6.02e23, 12.04e23, 3.01e23, 24.08e23],
    answer: 1,
    hint: L("N = n · Nₐ. Yani 2 · 6,02·10²³ = ?", "N = n × Nₐ. So 2 × 6.02×10²³ = ?"),
    solution: L("N = 2 · 6,02·10²³ = 12,04·10²³ molekül", "N = 2 × 6.02×10²³ = 12.04×10²³ molecules"),
  },
  {
    kind: "register",
    customer: c(L("Mırnav", "Princess Purr"), "#ffd6e0", "#ff9ebb", "crown"),
    text: L("Normal koşullarda (NK) 44,8 litre CH₄ gazı doldurdum. Kaç mol eder?", "I filled up 44.8 litres of CH₄ gas at STP. How many moles is that?"),
    label: "n =",
    answer: 2,
    unit: "mol",
    hint: L("NK'da 1 mol gaz 22,4 L. n = V / 22,4 → 44,8 / 22,4 = ?", "At STP, 1 mol of gas takes up 22.4 L. n = V / 22.4 → 44.8 / 22.4 = ?"),
    solution: L("n = 44,8 / 22,4 = 2 mol CH₄", "n = 44.8 / 22.4 = 2 mol CH₄"),
  },
  {
    kind: "basket",
    customer: c(L("Pas Paşa", "Sir Rusty"), "#e0967a", "#ffb88a", "bowtie"),
    text: L("Eski bisikletim paslandı! 2 mol Fe₂O₃ (pas) için ne kadar Fe ve O gerekir?", "My old bike has gone rusty! How much Fe and O are needed for 2 mol of Fe₂O₃ (rust)?"),
    need: { Fe: 4, O: 6 },
    hint: L("1 mol Fe₂O₃'te 2 mol Fe, 3 mol O var. 2 ile çarp: Fe = 2·2, O = 2·3.", "1 mol of Fe₂O₃ has 2 mol of Fe and 3 mol of O. Multiply by 2: Fe = 2×2, O = 2×3."),
    solution: L("2 mol Fe₂O₃ → 4 mol Fe + 6 mol O", "2 mol Fe₂O₃ → 4 mol Fe + 6 mol O"),
  },
  {
    kind: "register",
    customer: c(L("Profesör Tekir", "Professor Tabby"), "#e8dcff", "#ffe066", "labcoat"),
    text: L("Son sipariş, zor olanı! 9,8 gram H₂SO₄ kaç mol eder?", "Last order, and it's a tricky one! How many moles are in 9.8 grams of H₂SO₄?"),
    label: "n =",
    answer: 0.1,
    unit: "mol",
    hint: L("M(H₂SO₄) = 2·1 + 32 + 4·16 = 98 g/mol. Sonra n = 9,8 / 98.", "M(H₂SO₄) = 2×1 + 32 + 4×16 = 98 g/mol. Then n = 9.8 / 98."),
    solution: L("M = 2 + 32 + 64 = 98 g/mol → n = 9,8 / 98 = 0,1 mol", "M = 2 + 32 + 64 = 98 g/mol → n = 9.8 / 98 = 0.1 mol"),
  },
];
