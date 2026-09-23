import type { Metadata } from "next";
import DenklestirTopic from "@/components/denklestir/DenklestirTopic";

export const metadata: Metadata = {
  title: "Denkleştir Bakalım! ⚖️ | Kimya Kedileri",
  description: "Terazi Tekir ve Robo ile kütlenin korunumu ve kimyasal denklem denkleştirme oyunu.",
};

export default function Page() {
  return <DenklestirTopic />;
}
