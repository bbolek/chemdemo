"use client";

import { useSound } from "@/lib/sound";
import { useLang } from "@/lib/i18n";

export default function MuteButton() {
  const { muted, toggleMute, play } = useSound();
  const { t } = useLang();
  const label = muted ? t("Sesi aç", "Unmute") : t("Sesi kapat", "Mute");
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className="btn bg-white !px-3 sm:!px-4"
      onClick={() => {
        toggleMute();
        if (muted) setTimeout(() => play("pop"), 0);
      }}
    >
      {muted ? "🔇" : "🔊"}
    </button>
  );
}
