import type { Metadata } from "next";
import AsitBazTopic from "@/components/asit-baz/AsitBazTopic";

export const metadata: Metadata = {
  title: "Asit mi Baz mı? · Acid or Base? · Säure oder Base? · Kimya Kedileri",
  description:
    "Dedektif Mırmır ile pH skalası, indikatörler, titrasyon ve nötrleşme. · The pH scale, indicators, titration and neutralization with Detective Purr. · pH-Wert, Indikatoren, Titration und Neutralisation mit Detektiv Schnurr.",
};

export default function Page() {
  return <AsitBazTopic />;
}
