"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect, useId } from "react";
import { PH_GRADIENT, lighten, phColor } from "./ph";

const INK = "#4a4063";

/** Horizontal universal-indicator pH scale with optional marker. */
export function PhScale({ marker, labels = true, compact = false }: { marker?: number; labels?: boolean; compact?: boolean }) {
  return (
    <div className="w-full">
      <div className="relative">
        <div className={`w-full rounded-full border-3 border-ink ${compact ? "h-5" : "h-7"}`} style={{ background: `linear-gradient(90deg, ${PH_GRADIENT})` }} />
        {marker !== undefined && (
          <motion.div
            className="absolute -top-2 flex -translate-x-1/2 flex-col items-center"
            animate={{ left: `${(Math.min(14, Math.max(0, marker)) / 14) * 100}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 14 }}
          >
            <span className={`block rounded-full border-3 border-ink bg-white shadow ${compact ? "h-9 w-3" : "h-11 w-3.5"}`} />
          </motion.div>
        )}
      </div>
      {labels && (
        <>
          <div className="mt-1 flex justify-between px-0.5 font-display text-xs font-bold text-ink-soft">
            {Array.from({ length: 15 }).map((_, i) => (
              <span key={i} className={i % 2 && compact ? "hidden sm:inline" : ""}>
                {i}
              </span>
            ))}
          </div>
          <div className="mt-0.5 flex justify-between font-display text-xs font-bold sm:text-sm">
            <span className="text-[#e0485f]">◀ asidik</span>
            <span className="text-[#3f9e4d]">nötr</span>
            <span className="text-[#7a4fd0]">bazik ▶</span>
          </div>
        </>
      )}
    </div>
  );
}

/** Semicircle pH meter with a springy needle. */
export function PhMeter({ ph, size = 190, showValue = true }: { ph: number | null; size?: number; showValue?: boolean }) {
  const r = 80;
  const cx = 100;
  const cy = 100;
  const angle = ph === null ? -90 : -90 + (Math.min(14, Math.max(0, ph)) / 14) * 180;
  const segs = Array.from({ length: 28 });
  const spring = useSpring(angle, { stiffness: 60, damping: 9 });
  useEffect(() => spring.set(angle), [angle, spring]);
  const nx = useTransform(spring, (a) => cx + (r - 8) * Math.sin((a * Math.PI) / 180));
  const ny = useTransform(spring, (a) => cy - (r - 8) * Math.cos((a * Math.PI) / 180));
  return (
    <svg viewBox="0 0 200 130" width={size} height={size * 0.65} className="overflow-visible">
      <rect x="8" y="8" width="184" height="118" rx="26" fill="#fff" stroke={INK} strokeWidth="4" />
      {segs.map((_, i) => {
        const a0 = Math.PI + (i / segs.length) * Math.PI;
        const a1 = Math.PI + ((i + 1) / segs.length) * Math.PI + 0.01;
        const p = (x: number, rr: number) => [cx + rr * Math.cos(x), cy + rr * Math.sin(x)];
        const [x0, y0] = p(a0, r);
        const [x1, y1] = p(a1, r);
        const [x2, y2] = p(a1, r - 16);
        const [x3, y3] = p(a0, r - 16);
        return <path key={i} d={`M${x0} ${y0} A${r} ${r} 0 0 1 ${x1} ${y1} L${x2} ${y2} A${r - 16} ${r - 16} 0 0 0 ${x3} ${y3}Z`} fill={phColor((i + 0.5) / 2)} />;
      })}
      {[0, 7, 14].map((v) => {
        const a = Math.PI + (v / 14) * Math.PI;
        return (
          <text key={v} x={cx + (r - 28) * Math.cos(a)} y={cy + (r - 28) * Math.sin(a) + 4} textAnchor="middle" fontSize="12" fontWeight="800" fill={INK}>
            {v}
          </text>
        );
      })}
      <motion.line x1={cx} y1={cy} x2={nx} y2={ny} stroke={INK} strokeWidth="5" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r="9" fill="#ff9ebb" stroke={INK} strokeWidth="4" />
      {showValue && (
        <text x={cx} y="122" textAnchor="middle" fontSize="14" fontWeight="800" fill={INK} fontFamily="var(--font-display)">
          pH = {ph === null ? "?" : ph.toFixed(ph >= 13.95 || ph <= 0.05 ? 0 : 1)}
        </text>
      )}
    </svg>
  );
}

/** Litmus paper strip: acid → red, base → blue, neutral → stays purple. */
export function Litmus({ ph, size = 44 }: { ph: number | null; size?: number }) {
  const c = ph === null ? "#b9a3e6" : ph < 6.9 ? "#ff6b7d" : ph > 7.1 ? "#5aa8f0" : "#b9a3e6";
  return (
    <svg viewBox="0 0 30 90" width={size * 0.5} height={size * 1.5}>
      <rect x="4" y="4" width="22" height="82" rx="5" fill="#fff" stroke={INK} strokeWidth="3" />
      <motion.rect x="7" y="40" width="16" height="43" rx="3" animate={{ fill: c }} transition={{ duration: 0.8 }} />
    </svg>
  );
}

interface BeakerProps {
  color: string;
  /** 0..1 fill height */
  level?: number;
  width?: number;
  bubbles?: boolean;
  /** Change this number to trigger a splash */
  splashKey?: number;
  label?: string;
}

/** Cute pseudo-3D glass beaker with animated liquid, bubbles and splashes. */
export function Beaker({ color, level = 0.55, width = 220, bubbles = true, splashKey = 0, label }: BeakerProps) {
  const top = 40;
  const bottom = 250;
  const surf = bottom - (bottom - top - 20) * level;
  const light = lighten(color, 0.35);
  const clip = "bk" + useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 220 280" width={width} height={(width * 280) / 220} className="overflow-visible">
      <defs>
        <clipPath id={clip}>
          <path d="M40 40 L40 238 Q40 256 58 256 L162 256 Q180 256 180 238 L180 40 Z" />
        </clipPath>
      </defs>
      {/* shadow */}
      <ellipse cx="110" cy="266" rx="92" ry="11" fill={INK} opacity="0.12" />
      {/* back glass */}
      <path d="M40 40 L40 238 Q40 256 58 256 L162 256 Q180 256 180 238 L180 40 Z" fill="#ffffff" opacity="0.7" />
      <g clipPath={`url(#${clip})`}>
        <motion.rect x="30" width="160" height="260" initial={false} animate={{ y: surf, fill: color }} transition={{ duration: 1.1, ease: "easeInOut" }} />
        <motion.ellipse cx="110" rx="70" ry="9" initial={false} animate={{ cy: surf, fill: light }} transition={{ duration: 1.1, ease: "easeInOut" }} />
        {/* wobbly surface highlight */}
        <motion.path
          d="M40 0 Q75 -6 110 0 T180 0"
          stroke="#fff"
          strokeWidth="3"
          fill="none"
          opacity="0.7"
          initial={false}
          animate={{ y: surf, x: [0, -8, 0] }}
          transition={{ y: { duration: 1.1 }, x: { duration: 2.4, repeat: Infinity } }}
        />
        {bubbles &&
          Array.from({ length: 9 }).map((_, i) => (
            <motion.circle
              key={i}
              cx={55 + ((i * 37) % 110)}
              r={3 + (i % 3) * 2}
              fill="#fff"
              opacity="0.75"
              initial={{ cy: 250 }}
              animate={{ cy: [250, surf + 6], opacity: [0, 0.85, 0] }}
              transition={{ duration: 2 + (i % 4) * 0.6, repeat: Infinity, delay: i * 0.35, ease: "easeIn" }}
            />
          ))}
        {splashKey > 0 &&
          Array.from({ length: 14 }).map((_, i) => (
            <motion.circle
              key={`b${splashKey}-${i}`}
              cx={70 + ((i * 29) % 80)}
              r={4 + (i % 4) * 2}
              fill="#fff"
              stroke={INK}
              strokeWidth="1.5"
              initial={{ cy: 250, opacity: 1 }}
              animate={{ cy: surf - 4, opacity: [1, 1, 0] }}
              transition={{ duration: 0.9 + (i % 5) * 0.25, delay: (i % 6) * 0.05, ease: "easeOut" }}
            />
          ))}
      </g>
      {/* splash droplets flying out */}
      {splashKey > 0 &&
        Array.from({ length: 12 }).map((_, i) => {
          const dir = i % 2 ? 1 : -1;
          const dx = dir * (20 + ((i * 17) % 60));
          const dy = 50 + ((i * 23) % 60);
          return (
            <motion.circle
              key={`s${splashKey}-${i}`}
              r={4 + (i % 3) * 2}
              fill={color}
              stroke={INK}
              strokeWidth="2"
              initial={{ cx: 110, cy: surf, opacity: 1 }}
              animate={{ cx: [110, 110 + dx * 0.6, 110 + dx], cy: [surf, surf - dy, surf - dy * 0.3 + 30], opacity: [1, 1, 0] }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          );
        })}
      {/* front glass outline + shine */}
      <path d="M40 40 L40 238 Q40 256 58 256 L162 256 Q180 256 180 238 L180 40" fill="none" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      <ellipse cx="110" cy="40" rx="74" ry="11" fill="#ffffff" fillOpacity="0.5" stroke={INK} strokeWidth="5" />
      <path d="M180 40 Q196 36 196 28" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      <rect x="52" y="70" width="10" height="150" rx="5" fill="#fff" opacity="0.6" />
      {[0, 1, 2, 3].map((k) => (
        <line key={k} x1="150" x2="170" y1={100 + k * 38} y2={100 + k * 38} stroke={INK} strokeWidth="3" strokeLinecap="round" opacity="0.5" />
      ))}
      {label && (
        <g>
          <rect x={110 - Math.max(38, label.length * 4.6 + 12)} y="198" width={Math.max(76, label.length * 9.2 + 24)} height="30" rx="10" fill="#fff" stroke={INK} strokeWidth="3" />
          <text x="110" y="219" textAnchor="middle" fontSize="15" fontWeight="800" fill={INK} fontFamily="var(--font-display)">
            {label}
          </text>
        </g>
      )}
    </svg>
  );
}
