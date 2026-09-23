"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

/**
 * Minimal client-side i18n (static export friendly — no locale routes).
 *   const { lang, t, pick, num } = useLang();
 *   t("Merhaba", "Hello", "Hallo")      → string for current language
 *   pick({ tr: qTr, en: qEn, de: qDe }) → any value per language
 *   num(6.02, 2)                        → "6,02" (tr, de) / "6.02" (en)
 */
export type Lang = "tr" | "en" | "de";
export type Localized<T> = { tr: T; en: T; de: T };
export const LANGS: Lang[] = ["tr", "en", "de"];
const LOCALE: Record<Lang, string> = { tr: "tr-TR", en: "en-US", de: "de-DE" };

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (tr: string, en: string, de: string) => string;
  pick: <T>(v: Localized<T>) => T;
  num: (n: number, digits?: number) => string;
};

const STORAGE_KEY = "chemdemo-lang";

const format = (lang: Lang, n: number, digits?: number) =>
  n.toLocaleString(LOCALE[lang], digits === undefined ? { maximumFractionDigits: 4 } : { minimumFractionDigits: digits, maximumFractionDigits: digits });

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
      if (saved && (LANGS as string[]).includes(saved)) setLangState(saved as Lang);
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

  const t = useCallback((tr: string, en: string, de: string) => (lang === "en" ? en : lang === "de" ? de : tr), [lang]);
  const pick = useCallback(<T,>(v: Localized<T>) => v[lang], [lang]);
  const num = useCallback((n: number, digits?: number) => format(lang, n, digits), [lang]);

  return <LangContext.Provider value={{ lang, setLang, t, pick, num }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);
