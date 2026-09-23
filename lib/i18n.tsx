"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

/**
 * Minimal client-side i18n (static export friendly — no locale routes).
 *   const { lang, t, pick, num } = useLang();
 *   t("Merhaba", "Hello")               → string for current language
 *   pick({ tr: questionsTr, en: questionsEn }) → any value per language
 *   num(6.02, 2)                        → "6,02" (tr) / "6.02" (en)
 */
export type Lang = "tr" | "en";
export type Localized<T> = { tr: T; en: T };

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (tr: string, en: string) => string;
  pick: <T>(v: Localized<T>) => T;
  num: (n: number, digits?: number) => string;
};

const STORAGE_KEY = "chemdemo-lang";

const format = (lang: Lang, n: number, digits?: number) =>
  n.toLocaleString(lang === "tr" ? "tr-TR" : "en-US", digits === undefined ? { maximumFractionDigits: 4 } : { minimumFractionDigits: digits, maximumFractionDigits: digits });

const LangContext = createContext<Ctx>({
  lang: "tr",
  setLang: () => {},
  t: (tr) => tr,
  pick: (v) => v.tr,
  num: (n, d) => format("tr", n, d),
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("tr");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "en" || saved === "tr") setLangState(saved);
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {}
  }, []);

  const t = useCallback((tr: string, en: string) => (lang === "en" ? en : tr), [lang]);
  const pick = useCallback(<T,>(v: Localized<T>) => v[lang], [lang]);
  const num = useCallback((n: number, digits?: number) => format(lang, n, digits), [lang]);

  return <LangContext.Provider value={{ lang, setLang, t, pick, num }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);
