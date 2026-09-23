import type { Metadata } from "next";
import DenklestirTopic from "@/components/denklestir/DenklestirTopic";

export const metadata: Metadata = {
  title: "Denkleştir Bakalım! · Balance It! · Gleich aus! ⚖️ | Kimya Kedileri",
  description:
    "Terazi Tekir ve Robo ile kütlenin korunumu ve kimyasal denklem denkleştirme oyunu. · Balance chemical equations and learn conservation of mass with Tabby the Scale Cat and Robo. · Reaktionsgleichungen ausgleichen und die Massenerhaltung entdecken – mit Tiger der Waagenkatze und Robo.",
};

export default function Page() {
  return <DenklestirTopic />;
}
