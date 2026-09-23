"use client";

import { useSound } from "@/lib/sound";

export default function MuteButton() {
  const { muted, toggleMute, play } = useSound();
  return (
    <button
      type="button"
      aria-label={muted ? "Sesi aç" : "Sesi kapat"}
      title={muted ? "Sesi aç" : "Sesi kapat"}
      className="btn bg-white !px-4"
      onClick={() => {
        toggleMute();
        if (muted) setTimeout(() => play("pop"), 0);
      }}
    >
      {muted ? "🔇" : "🔊"}
    </button>
  );
}
