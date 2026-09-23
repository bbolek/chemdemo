import type { Metadata } from "next";
import GazlarClient from "@/components/gazlar/GazlarClient";

export const metadata: Metadata = {
  title: "Gaz Kedileri 💨 | Kimya Kedileri",
  description: "Pistonu it, kutuyu ısıt! Boyle, Charles, Gay-Lussac ve Avogadro yasalarını ve PV = nRT denklemini canlı gör.",
};

export default function Page() {
  return <GazlarClient />;
}
