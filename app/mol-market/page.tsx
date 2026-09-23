import type { Metadata } from "next";
import MolMarket from "@/components/mol-market/MolMarket";

export const metadata: Metadata = {
  title: "Mol Market 🧺 · Kimya Kedileri",
  description: "Kasiyer Minnoş ve Robo ile mol kavramı, Avogadro sayısı, mol kütlesi ve NK'da gaz hacmi — oyunla öğren!",
};

export default function Page() {
  return <MolMarket />;
}
