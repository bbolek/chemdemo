"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export type RoboMood = "happy" | "surprised" | "thinking" | "sad" | "excited";

export interface RoboProps {
  mood?: RoboMood;
  talking?: boolean;
  size?: number;
  flip?: boolean;
  className?: string;
  /** Hold a flask in the hand */
  holding?: "none" | "flask" | "clipboard";
  bounce?: boolean;
}

const INK = "#4a4063";

/** "Robo" — the friendly humanoid lab assistant. Pure SVG. */
export default function Robo({
  mood = "happy",
  talking = false,
  size = 170,
  flip = false,
  className = "",
  holding = "flask",
  bounce = true,
}: RoboProps) {
  const [blink, setBlink] = useState(false);
  const [mouthOpen, setMouthOpen] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 150);
    }, 3200);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!talking) return setMouthOpen(false);
    const id = setInterval(() => setMouthOpen((m) => !m), 150);
    return () => clearInterval(id);
  }, [talking]);

  const screen = "#2f2a45";
  const glow = mood === "sad" ? "#8cc8ff" : mood === "excited" ? "#ffe066" : "#7fdcb8";

  return (
    <motion.div
      className={`inline-block select-none ${className}`}
      style={{ width: size, height: size * 1.2, transform: flip ? "scaleX(-1)" : undefined }}
      animate={bounce ? { y: [0, -5, 0] } : undefined}
      transition={bounce ? { duration: 2.6, repeat: Infinity, ease: "easeInOut" } : undefined}
    >
      <svg viewBox="0 0 200 240" width="100%" height="100%" aria-hidden>
        {/* antenna */}
        <line x1="100" y1="30" x2="100" y2="10" stroke={INK} strokeWidth={4} />
        <motion.circle
          cx="100"
          cy="9"
          r="7"
          fill={glow}
          stroke={INK}
          strokeWidth={3}
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />

        {/* head */}
        <rect x="45" y="28" width="110" height="88" rx="30" fill="#e8dcff" stroke={INK} strokeWidth={4} />
        {/* ear bolts */}
        <rect x="33" y="60" width="14" height="26" rx="6" fill="#b69cff" stroke={INK} strokeWidth={3} />
        <rect x="153" y="60" width="14" height="26" rx="6" fill="#b69cff" stroke={INK} strokeWidth={3} />
        {/* face screen */}
        <rect x="58" y="42" width="84" height="60" rx="20" fill={screen} />

        {/* eyes */}
        {blink ? (
          <>
            <line x1="72" y1="66" x2="88" y2="66" stroke={glow} strokeWidth={4} strokeLinecap="round" />
            <line x1="112" y1="66" x2="128" y2="66" stroke={glow} strokeWidth={4} strokeLinecap="round" />
          </>
        ) : mood === "happy" || mood === "excited" ? (
          <>
            <path d="M72 70 Q80 58 88 70" stroke={glow} strokeWidth={4} fill="none" strokeLinecap="round" />
            <path d="M112 70 Q120 58 128 70" stroke={glow} strokeWidth={4} fill="none" strokeLinecap="round" />
          </>
        ) : mood === "sad" ? (
          <>
            <path d="M72 62 Q80 72 88 62" stroke={glow} strokeWidth={4} fill="none" strokeLinecap="round" />
            <path d="M112 62 Q120 72 128 62" stroke={glow} strokeWidth={4} fill="none" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx="80" cy={mood === "thinking" ? 62 : 66} r={mood === "surprised" ? 9 : 7} fill={glow} />
            <circle cx="120" cy={mood === "thinking" ? 62 : 66} r={mood === "surprised" ? 9 : 7} fill={glow} />
          </>
        )}
        {/* mouth */}
        {mouthOpen || mood === "surprised" ? (
          <ellipse cx="100" cy="88" rx="9" ry="6" fill={glow} />
        ) : mood === "sad" ? (
          <path d="M90 92 Q100 84 110 92" stroke={glow} strokeWidth={3} fill="none" strokeLinecap="round" />
        ) : (
          <path d="M88 86 Q100 96 112 86" stroke={glow} strokeWidth={3} fill="none" strokeLinecap="round" />
        )}
        {/* cheeks */}
        <ellipse cx="66" cy="90" rx="6" ry="3.5" fill="#ff9ebb" opacity={0.8} />
        <ellipse cx="134" cy="90" rx="6" ry="3.5" fill="#ff9ebb" opacity={0.8} />

        {/* neck */}
        <rect x="88" y="114" width="24" height="12" fill="#b69cff" stroke={INK} strokeWidth={3} />

        {/* body: lab coat */}
        <path d="M58 132 Q100 118 142 132 L150 205 Q100 215 50 205 Z" fill="white" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
        <path d="M100 126 L86 150 L100 205 L114 150 Z" fill="#d6ecff" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
        <circle cx="100" cy="162" r="6" fill="#ffe066" stroke={INK} strokeWidth={2} />
        {/* pocket w/ pen */}
        <rect x="118" y="160" width="18" height="16" rx="3" fill="white" stroke={INK} strokeWidth={2.5} />
        <line x1="124" y1="152" x2="124" y2="164" stroke="#ff9ebb" strokeWidth={4} strokeLinecap="round" />

        {/* left arm waving */}
        <motion.g
          style={{ originX: "58px", originY: "138px" }}
          animate={talking ? { rotate: [0, -18, 0] } : { rotate: 0 }}
          transition={{ duration: 0.8, repeat: talking ? Infinity : 0 }}
        >
          <path d="M58 138 Q34 160 36 184" stroke={INK} strokeWidth={16} fill="none" strokeLinecap="round" />
          <path d="M58 138 Q34 160 36 184" stroke="white" strokeWidth={10} fill="none" strokeLinecap="round" />
          <circle cx="36" cy="190" r="10" fill="#e8dcff" stroke={INK} strokeWidth={3} />
        </motion.g>

        {/* right arm with item */}
        <path d="M142 138 Q166 160 164 184" stroke={INK} strokeWidth={16} fill="none" strokeLinecap="round" />
        <path d="M142 138 Q166 160 164 184" stroke="white" strokeWidth={10} fill="none" strokeLinecap="round" />
        {holding === "flask" && (
          <g stroke={INK} strokeWidth={3} strokeLinejoin="round">
            <path d="M160 160 L160 172 L148 196 Q146 202 152 202 L184 202 Q190 202 188 196 L176 172 L176 160 Z" fill="white" />
            <path d="M152 188 L184 188 L188 196 Q190 202 184 202 L152 202 Q146 202 148 196 Z" fill="#ff9ebb" stroke="none" />
            <line x1="156" y1="160" x2="180" y2="160" />
          </g>
        )}
        {holding === "clipboard" && (
          <g stroke={INK} strokeWidth={3}>
            <rect x="152" y="166" width="32" height="40" rx="4" fill="#ffe5cc" />
            <rect x="160" y="162" width="16" height="8" rx="2" fill="#b69cff" />
            <line x1="158" y1="180" x2="178" y2="180" strokeWidth={2} />
            <line x1="158" y1="188" x2="178" y2="188" strokeWidth={2} />
            <line x1="158" y1="196" x2="172" y2="196" strokeWidth={2} />
          </g>
        )}
        <circle cx="164" cy="190" r="10" fill="#e8dcff" stroke={INK} strokeWidth={3} />

        {/* legs */}
        <rect x="72" y="206" width="20" height="24" rx="8" fill="#b69cff" stroke={INK} strokeWidth={3} />
        <rect x="108" y="206" width="20" height="24" rx="8" fill="#b69cff" stroke={INK} strokeWidth={3} />
      </svg>
    </motion.div>
  );
}
