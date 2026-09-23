import type { Metadata } from "next";
import GazlarClient from "@/components/gazlar/GazlarClient";

export const metadata: Metadata = {
  title: "Gaz Kedileri · Gas Cats · Gas-Katzen 💨 | Kimya Kedileri",
  description:
    "Pistonu it, kutuyu ısıt! Boyle, Charles, Gay-Lussac ve Avogadro yasalarını ve PV = nRT denklemini canlı gör. · Push the piston, heat the box! See Boyle's, Charles's, Gay-Lussac's and Avogadro's laws and PV = nRT in action. · Drück den Kolben, heiz die Box auf! Erlebe die Gasgesetze von Boyle-Mariotte, Charles, Gay-Lussac und Avogadro und das ideale Gasgesetz PV = nRT live.",
};

export default function Page() {
  return <GazlarClient />;
}
