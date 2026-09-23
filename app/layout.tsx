import type { Metadata } from "next";
import { Baloo_2, Nunito } from "next/font/google";
import { SoundProvider } from "@/lib/sound";
import "./globals.css";

const baloo = Baloo_2({ subsets: ["latin", "latin-ext"], variable: "--font-baloo", weight: ["500", "700", "800"] });
const nunito = Nunito({ subsets: ["latin", "latin-ext"], variable: "--font-nunito", weight: ["400", "600", "700"] });

export const metadata: Metadata = {
  title: "Kimya Kedileri 🐱⚗️",
  description: "Lise öğrencileri için kediler ve Robo ile eğlenceli, oyunlu kimya dersleri.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${baloo.variable} ${nunito.variable}`}>
      <body>
        <SoundProvider>{children}</SoundProvider>
      </body>
    </html>
  );
}
