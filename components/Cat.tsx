"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export type CatMood = "happy" | "surprised" | "thinking" | "sad" | "wink" | "love";
export type CatAccessory = "none" | "glasses" | "labcoat" | "detective" | "chef" | "bowtie" | "crown" | "goggles";

export interface CatProps {
  /** Fur color */
  color?: string;
  /** Inner ear / belly accent */
  accent?: string;
  mood?: CatMood;
  accessory?: CatAccessory;
  /** Animate mouth as if speaking */
  talking?: boolean;
  size?: number;
  /** Mirror horizontally */
  flip?: boolean;
  className?: string;
  /** Idle bounce */
  bounce?: boolean;
}

const INK = "#4a4063";

/** Chubby, cute SVG cat. All pure SVG, no assets. */
export default function Cat({
  color = "#ffd6e0",
  accent = "#ff9ebb",
  mood = "happy",
  accessory = "none",
  talking = false,
  size = 160,
  flip = false,
  className = "",
  bounce = true,
}: CatProps) {
  const [blink, setBlink] = useState(false);
  const [mouthOpen, setMouthOpen] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 140);
    }, 2800 + Math.random() * 1500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!talking) return setMouthOpen(false);
    const id = setInterval(() => setMouthOpen((m) => !m), 140);
    return () => clearInterval(id);
  }, [talking]);

  const eyesClosed = blink || mood === "love";

  return (
    <motion.div
      className={`inline-block select-none ${className}`}
      style={{ width: size, height: size, transform: flip ? "scaleX(-1)" : undefined }}
      animate={bounce ? { y: [0, -6, 0] } : undefined}
      transition={bounce ? { duration: 2.2, repeat: Infinity, ease: "easeInOut" } : undefined}
    >
      <svg viewBox="0 0 200 200" width="100%" height="100%" overflow="visible" aria-hidden>
        {/* tail */}
        <g className="cat-tail">
          <path d="M140 160 C 184 152, 186 110, 168 98" fill="none" stroke={INK} strokeWidth={16} strokeLinecap="round" />
          <path d="M140 160 C 184 152, 186 110, 168 98" fill="none" stroke={color} strokeWidth={10} strokeLinecap="round" />
        </g>

        {/* body */}
        <ellipse cx="100" cy="158" rx="52" ry="36" fill={color} stroke={INK} strokeWidth={4} />
        {accessory === "labcoat" && (
          <g>
            <path d="M52 150 Q100 200 148 150 L148 175 Q100 200 52 175 Z" fill="white" stroke={INK} strokeWidth={3} />
            <line x1="100" y1="160" x2="100" y2="192" stroke={INK} strokeWidth={3} />
            <circle cx="92" cy="172" r="2.5" fill={INK} />
            <circle cx="92" cy="182" r="2.5" fill={INK} />
          </g>
        )}
        {accessory !== "labcoat" && <ellipse cx="100" cy="166" rx="26" ry="18" fill={accent} opacity={0.45} />}
        {/* paws */}
        <ellipse cx="78" cy="190" rx="14" ry="8" fill={color} stroke={INK} strokeWidth={4} />
        <ellipse cx="122" cy="190" rx="14" ry="8" fill={color} stroke={INK} strokeWidth={4} />

        {/* ears */}
        <path d="M52 62 L58 12 L96 42 Z" fill={color} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
        <path d="M148 62 L142 12 L104 42 Z" fill={color} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
        <path d="M60 52 L63 25 L85 43 Z" fill={accent} />
        <path d="M140 52 L137 25 L115 43 Z" fill={accent} />

        {/* head */}
        <ellipse cx="100" cy="88" rx="62" ry="54" fill={color} stroke={INK} strokeWidth={4} />

        {/* eyes */}
        {mood === "love" ? (
          <>
            <Heart x={75} y={82} />
            <Heart x={125} y={82} />
          </>
        ) : eyesClosed ? (
          <>
            <path d="M66 84 Q75 90 84 84" stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" />
            <path d="M116 84 Q125 90 134 84" stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" />
          </>
        ) : mood === "wink" ? (
          <>
            <Eye cx={75} cy={82} r={10} />
            <path d="M116 84 Q125 76 134 84" stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" />
          </>
        ) : mood === "happy" ? (
          <>
            <path d="M66 86 Q75 74 84 86" stroke={INK} strokeWidth={5} fill="none" strokeLinecap="round" />
            <path d="M116 86 Q125 74 134 86" stroke={INK} strokeWidth={5} fill="none" strokeLinecap="round" />
          </>
        ) : (
          <>
            <Eye cx={75} cy={82} r={mood === "surprised" ? 12 : 10} lookUp={mood === "thinking"} />
            <Eye cx={125} cy={82} r={mood === "surprised" ? 12 : 10} lookUp={mood === "thinking"} />
          </>
        )}
        {mood === "sad" && (
          <>
            <path d="M62 68 L86 74" stroke={INK} strokeWidth={3} strokeLinecap="round" />
            <path d="M138 68 L114 74" stroke={INK} strokeWidth={3} strokeLinecap="round" />
            <ellipse cx="140" cy="100" rx="4" ry="7" fill="#8cc8ff" />
          </>
        )}

        {/* blush */}
        <ellipse cx="60" cy="104" rx="11" ry="6" fill="#ff9ebb" opacity={0.6} />
        <ellipse cx="140" cy="104" rx="11" ry="6" fill="#ff9ebb" opacity={0.6} />

        {/* nose + mouth */}
        <path d="M95 98 L105 98 L100 104 Z" fill="#ff7aa2" stroke={INK} strokeWidth={2} strokeLinejoin="round" />
        {mouthOpen || mood === "surprised" ? (
          <ellipse cx="100" cy="114" rx="8" ry={mouthOpen ? 8 : 6} fill="#ff7aa2" stroke={INK} strokeWidth={3} />
        ) : mood === "sad" ? (
          <path d="M90 116 Q100 108 110 116" stroke={INK} strokeWidth={3} fill="none" strokeLinecap="round" />
        ) : mood === "thinking" ? (
          <path d="M92 112 L108 112" stroke={INK} strokeWidth={3} strokeLinecap="round" />
        ) : (
          <path d="M88 108 Q94 116 100 108 Q106 116 112 108" stroke={INK} strokeWidth={3} fill="none" strokeLinecap="round" />
        )}

        {/* whiskers */}
        <g stroke={INK} strokeWidth={2} strokeLinecap="round" opacity={0.7}>
          <line x1="40" y1="96" x2="18" y2="90" />
          <line x1="40" y1="104" x2="18" y2="106" />
          <line x1="160" y1="96" x2="182" y2="90" />
          <line x1="160" y1="104" x2="182" y2="106" />
        </g>

        <Accessory kind={accessory} />
      </svg>
    </motion.div>
  );
}

function Eye({ cx, cy, r, lookUp = false }: { cx: number; cy: number; r: number; lookUp?: boolean }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={INK} />
      <circle cx={cx + 3} cy={cy - (lookUp ? 5 : 3)} r={r * 0.35} fill="white" />
      <circle cx={cx - 3} cy={cy + 3} r={r * 0.15} fill="white" />
    </g>
  );
}

function Heart({ x, y }: { x: number; y: number }) {
  return (
    <path
      transform={`translate(${x - 10} ${y - 9})`}
      d="M10 18 L2 9 A5 5 0 0 1 10 3 A5 5 0 0 1 18 9 Z"
      fill="#ff7aa2"
      stroke={INK}
      strokeWidth={2}
    />
  );
}

function Accessory({ kind }: { kind: CatAccessory }) {
  switch (kind) {
    case "glasses":
      return (
        <g fill="rgba(255,255,255,0.35)" stroke={INK} strokeWidth={3}>
          <circle cx="75" cy="83" r="16" />
          <circle cx="125" cy="83" r="16" />
          <line x1="91" y1="83" x2="109" y2="83" />
        </g>
      );
    case "goggles":
      return (
        <g>
          <rect x="44" y="66" width="112" height="10" fill="#7fdcb8" stroke={INK} strokeWidth={3} rx="4" />
          <circle cx="75" cy="83" r="17" fill="rgba(140,200,255,0.35)" stroke={INK} strokeWidth={4} />
          <circle cx="125" cy="83" r="17" fill="rgba(140,200,255,0.35)" stroke={INK} strokeWidth={4} />
        </g>
      );
    case "detective":
      return (
        <g stroke={INK} strokeWidth={3} strokeLinejoin="round">
          <path d="M40 46 Q100 30 160 46 L150 36 Q100 0 50 36 Z" fill="#c9a27e" />
          <path d="M60 36 Q100 26 140 36" fill="none" stroke="#8a6a4d" strokeWidth={5} />
        </g>
      );
    case "chef":
      return (
        <g stroke={INK} strokeWidth={3}>
          <rect x="65" y="28" width="70" height="20" fill="white" rx="4" />
          <circle cx="75" cy="18" r="16" fill="white" />
          <circle cx="100" cy="10" r="18" fill="white" />
          <circle cx="125" cy="18" r="16" fill="white" />
        </g>
      );
    case "bowtie":
      return (
        <g stroke={INK} strokeWidth={3} strokeLinejoin="round">
          <path d="M100 136 L78 126 L78 148 Z" fill="#b69cff" />
          <path d="M100 136 L122 126 L122 148 Z" fill="#b69cff" />
          <circle cx="100" cy="137" r="5" fill="#ffe066" />
        </g>
      );
    case "crown":
      return (
        <path
          d="M70 40 L72 12 L86 28 L100 6 L114 28 L128 12 L130 40 Z"
          fill="#ffe066"
          stroke={INK}
          strokeWidth={3}
          strokeLinejoin="round"
        />
      );
    default:
      return null;
  }
}
