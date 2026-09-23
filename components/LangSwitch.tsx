"use client";

import { motion } from "framer-motion";
import { useLang, type Lang } from "@/lib/i18n";
import { useSound } from "@/lib/sound";

const OPTIONS: { value: Lang; label: string; flag: string }[] = [
  { value: "tr", label: "TR", flag: "🇹🇷" },
  { value: "en", label: "EN", flag: "🇬🇧" },
  { value: "de", label: "DE", flag: "🇩🇪" },
];

/** Pill toggle between Türkçe, English and Deutsch. */
export default function LangSwitch() {
  const { lang, setLang, t } = useLang();
  const { play } = useSound();

  return (
    <div role="radiogroup" aria-label={t("Dil", "Language", "Sprache")} className="relative flex rounded-full border-3 border-ink bg-white p-1 shadow-[var(--shadow-pop)]">
      {OPTIONS.map((o) => {
        const active = lang === o.value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => {
              if (active) return;
              play("pop");
              setLang(o.value);
            }}
            className="font-display relative z-10 flex items-center gap-1 rounded-full px-2 py-1 text-sm font-bold sm:px-3"
          >
            {active && (
              <motion.span
                layoutId="lang-pill"
                className="absolute inset-0 -z-10 rounded-full bg-lavender-deep"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span aria-hidden className="hidden sm:inline">
              {o.flag}
            </span>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
