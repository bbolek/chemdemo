import type { Metadata } from "next";
import AsitBazTopic from "@/components/asit-baz/AsitBazTopic";

export const metadata: Metadata = {
  title: "Asit mi Baz mı? · Kimya Kedileri",
  description: "Dedektif Mırmır ile pH skalası, indikatörler, titrasyon ve nötrleşme.",
};

export default function Page() {
  return <AsitBazTopic />;
}
