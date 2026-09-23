"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Tiny synthesized sound kit — no audio files, everything is WebAudio.
 * Usage: const { play } = useSound(); play("pop");
 */
export type SoundName =
  | "click"
  | "pop"
  | "success"
  | "fail"
  | "splash"
  | "bubble"
  | "meow"
  | "whoosh"
  | "drip"
  | "levelup"
  | "tick";

type Ctx = { play: (name: SoundName) => void; muted: boolean; toggleMute: () => void };

const SoundContext = createContext<Ctx>({ play: () => {}, muted: false, toggleMute: () => {} });

const STORAGE_KEY = "chemdemo-muted";

export function SoundProvider({ children }: { children: ReactNode }) {
  const ctxRef = useRef<AudioContext | null>(null);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    try {
      setMuted(localStorage.getItem(STORAGE_KEY) === "1");
    } catch {}
  }, []);

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      try {
        localStorage.setItem(STORAGE_KEY, m ? "0" : "1");
      } catch {}
      return !m;
    });
  }, []);

  const play = useCallback(
    (name: SoundName) => {
      if (muted || typeof window === "undefined") return;
      try {
        if (!ctxRef.current) {
          const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          ctxRef.current = new AC();
        }
        const ac = ctxRef.current;
        if (ac.state === "suspended") void ac.resume();
        synth(ac, name);
      } catch {}
    },
    [muted],
  );

  return <SoundContext.Provider value={{ play, muted, toggleMute }}>{children}</SoundContext.Provider>;
}

export const useSound = () => useContext(SoundContext);

function tone(
  ac: AudioContext,
  { freq, to, dur, type = "sine", vol = 0.2, delay = 0 }: { freq: number; to?: number; dur: number; type?: OscillatorType; vol?: number; delay?: number },
) {
  const t = ac.currentTime + delay;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (to) osc.frequency.exponentialRampToValueAtTime(to, t + dur);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(vol, t + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(gain).connect(ac.destination);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

function noise(ac: AudioContext, { dur, vol = 0.2, freq = 1200, delay = 0 }: { dur: number; vol?: number; freq?: number; delay?: number }) {
  const t = ac.currentTime + delay;
  const buf = ac.createBuffer(1, Math.floor(ac.sampleRate * dur), ac.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  const src = ac.createBufferSource();
  src.buffer = buf;
  const filter = ac.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = freq;
  const gain = ac.createGain();
  gain.gain.value = vol;
  src.connect(filter).connect(gain).connect(ac.destination);
  src.start(t);
}

function synth(ac: AudioContext, name: SoundName) {
  switch (name) {
    case "click":
      return tone(ac, { freq: 700, dur: 0.05, type: "triangle", vol: 0.15 });
    case "tick":
      return tone(ac, { freq: 1200, dur: 0.03, type: "square", vol: 0.05 });
    case "pop":
      return tone(ac, { freq: 400, to: 900, dur: 0.1, type: "sine", vol: 0.25 });
    case "bubble":
      tone(ac, { freq: 300, to: 700, dur: 0.08, vol: 0.15 });
      return tone(ac, { freq: 500, to: 1000, dur: 0.08, vol: 0.12, delay: 0.09 });
    case "drip":
      return tone(ac, { freq: 1400, to: 500, dur: 0.12, vol: 0.2 });
    case "success":
      [523, 659, 784, 1047].forEach((f, i) => tone(ac, { freq: f, dur: 0.18, type: "triangle", vol: 0.18, delay: i * 0.08 }));
      return;
    case "levelup":
      [392, 523, 659, 784, 1047, 1319].forEach((f, i) => tone(ac, { freq: f, dur: 0.2, type: "square", vol: 0.07, delay: i * 0.07 }));
      return;
    case "fail":
      tone(ac, { freq: 300, to: 180, dur: 0.25, type: "sawtooth", vol: 0.08 });
      return tone(ac, { freq: 220, to: 120, dur: 0.3, type: "sawtooth", vol: 0.08, delay: 0.15 });
    case "splash":
      noise(ac, { dur: 0.5, vol: 0.35, freq: 900 });
      return tone(ac, { freq: 200, to: 80, dur: 0.3, vol: 0.2 });
    case "whoosh":
      return noise(ac, { dur: 0.35, vol: 0.25, freq: 2500 });
    case "meow":
      return tone(ac, { freq: 700, to: 1100, dur: 0.15, type: "triangle", vol: 0.12 }), tone(ac, { freq: 1100, to: 600, dur: 0.25, type: "triangle", vol: 0.12, delay: 0.14 });
  }
}
