import type { Metadata } from "next";
import { Baloo_2, Nunito } from "next/font/google";
import { SoundProvider } from "@/lib/sound";
import { LangProvider } from "@/lib/i18n";
import "./globals.css";

const baloo = Baloo_2({ subsets: ["latin", "latin-ext"], variable: "--font-baloo", weight: ["500", "700", "800"] });
const nunito = Nunito({ subsets: ["latin", "latin-ext"], variable: "--font-nunito", weight: ["400", "600", "700"] });

export const metadata: Metadata = {
  title: "Kimya Kedileri · Chemistry Cats 🐱⚗️",
  description: "Lise öğrencileri için kediler ve Robo ile eğlenceli, oyunlu kimya dersleri. Playful chemistry lessons with cats for high school students.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${baloo.variable} ${nunito.variable}`}>
      <body>
        <LangProvider>
          <SoundProvider>{children}</SoundProvider>
        </LangProvider>
      </body>
    </html>
  );
}
