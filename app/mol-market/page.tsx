import type { Metadata } from "next";
import MolMarket from "@/components/mol-market/MolMarket";

export const metadata: Metadata = {
  title: "Mol Market · Mole Market · Mol-Markt 🧺 · Kimya Kedileri",
  description:
    "Kasiyer Minnoş ve Robo ile mol kavramı, Avogadro sayısı, mol kütlesi ve NK'da gaz hacmi — oyunla öğren! · Learn the mole, Avogadro's number, molar mass and gas volume at STP with Cashier Cutie and Robo! · Lerne mit Kassiererin Mietzi und Robo Stoffmenge, Avogadro-Konstante, molare Masse und Gasvolumen bei Normbedingungen!",
};

export default function Page() {
  return <MolMarket />;
}
