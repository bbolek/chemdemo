"use client";

import { motion } from "framer-motion";
import { Face, INK, IsoBox, makeIso, onPlaneX, onPlaneY, pts } from "./iso";
import { ELEMENTS } from "./chem";
import { useLang } from "@/lib/i18n";

/** Cute isometric supermarket building for the splash screen. Pure SVG. */
export default function Storefront({ className = "" }: { className?: string }) {
  const { t, lang } = useLang();
  const P = makeIso(205, 118, 30);
  // Building: x 0..5 (front face on plane y=3), y 0..3, height 3
  const W = 5;
  const D = 3;
  const H = 3;
  const F = (u: number, v: number, off = 0): [number, number, number] => [u, D + off, v];

  const awning = Array.from({ length: 10 }, (_, k) => k * 0.5);
  const jars = ELEMENTS.slice(0, 8);

  return (
    <motion.svg
      viewBox="0 0 410 330"
      className={className}
      aria-label={t("Mol Market dükkânı", "The Mole Market shop", "Der Laden Mol-Markt")}
      overflow="visible"
      role="img"
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      <style>{`
        @keyframes mmAtomFloat { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-8px) rotate(8deg); } }
        .mm-atom { transform-box: view-box; transform-origin: 360px 62px; animation: mmAtomFloat 3s ease-in-out infinite; }
      `}</style>
      {/* ground plate */}
      <IsoBox P={P} x={-1.3} y={-1} z={-0.35} dx={7.6} dy={6.2} dz={0.35} top="#d4f5e9" left="#a9e8cf" right="#7fdcb8" />
      {/* sidewalk */}
      <Face P={P} p={[[-1.3, 3.3, 0], [6.3, 3.3, 0], [6.3, 5.2, 0], [-1.3, 5.2, 0]]} fill="#fff8f0" sw={2} />
      {Array.from({ length: 7 }, (_, k) => (
        <line key={k} x1={P(-1.3 + k * 1.1 + 1, 3.3)[0]} y1={P(-1.3 + k * 1.1 + 1, 3.3)[1]} x2={P(-1.3 + k * 1.1 + 1, 5.2)[0]} y2={P(-1.3 + k * 1.1 + 1, 5.2)[1]} stroke="#e8dcff" strokeWidth={2} />
      ))}

      {/* building body */}
      <IsoBox P={P} x={0} y={0} z={0} dx={W} dy={D} dz={H} top="#f3ecff" left="#fff8f0" right="#e8dcff" />
      {/* roof rim */}
      <IsoBox P={P} x={-0.15} y={-0.15} z={H} dx={W + 0.3} dy={D + 0.3} dz={0.25} top="#b69cff" left="#cbb8ff" right="#a58af2" />
      {/* roof sign board */}
      <IsoBox P={P} x={0.7} y={D - 0.2} z={H + 0.25} dx={3.6} dy={0.15} dz={1.05} top="#ffe066" left="#ff9ebb" right="#ff85a8" />
      <text transform={onPlaneY(P(2.5, D - 0.05, H + 0.6))} textAnchor="middle" fontFamily="var(--font-baloo), sans-serif" fontWeight={800} fontSize={lang === "tr" ? 23 : 21} textLength={98} lengthAdjust="spacingAndGlyphs" fill="white" stroke={INK} strokeWidth={1.2} paintOrder="stroke">
        {t("MOL MARKET", "MOLE MARKET", "MOL-MARKT")}
      </text>

      {/* windows on the front */}
      {[0.35, 3.35].map((u) => (
        <g key={u}>
          <Face P={P} p={[F(u, 0.55), F(u + 1.3, 0.55), F(u + 1.3, 1.95), F(u, 1.95)]} fill="#d6ecff" />
          <Face P={P} p={[F(u, 0.95), F(u + 1.3, 0.95), F(u + 1.3, 1.02), F(u, 1.02)]} fill="#b69cff" sw={1.5} />
          {jars.slice(u < 1 ? 0 : 4, u < 1 ? 4 : 8).map((e, k) => {
            const [cx, cy] = P(u + 0.2 + k * 0.3, D, 1.2);
            return (
              <g key={e.sym}>
                <rect x={cx - 4.5} y={cy - 9} width={9} height={11} rx={3} fill={e.color} stroke={INK} strokeWidth={1.4} />
                <rect x={cx - 3.5} y={cy - 12} width={7} height={3} rx={1} fill={e.deep} stroke={INK} strokeWidth={1.2} />
              </g>
            );
          })}
          {/* shine */}
          <line x1={P(u + 0.15, D, 1.85)[0]} y1={P(u + 0.15, D, 1.85)[1]} x2={P(u + 0.45, D, 1.55)[0]} y2={P(u + 0.45, D, 1.55)[1]} stroke="white" strokeWidth={3} strokeLinecap="round" />
        </g>
      ))}

      {/* door */}
      <Face P={P} p={[F(1.95, 0), F(3.05, 0), F(3.05, 1.95), F(1.95, 1.95)]} fill="#b69cff" />
      <Face P={P} p={[F(2.1, 0.9), F(2.9, 0.9), F(2.9, 1.8), F(2.1, 1.8)]} fill="#e8dcff" sw={2} />
      <circle cx={P(2.85, D, 0.5)[0]} cy={P(2.85, D, 0.5)[1]} r={3} fill="#ffe066" stroke={INK} strokeWidth={1.5} />

      {/* striped awning */}
      {awning.map((u, k) => (
        <polygon
          key={u}
          points={pts([P(u, D, 2.35), P(u + 0.5, D, 2.35), P(u + 0.5, D + 0.75, 1.95), P(u, D + 0.75, 1.95)])}
          fill={k % 2 ? "white" : "#ff9ebb"}
          stroke={INK}
          strokeWidth={2}
          strokeLinejoin="round"
        />
      ))}
      {awning.map((u, k) => {
        const [cx, cy] = P(u + 0.25, D + 0.75, 1.95);
        return <circle key={u} cx={cx} cy={cy + 1} r={6} fill={k % 2 ? "white" : "#ff9ebb"} stroke={INK} strokeWidth={2} />;
      })}

      {/* "open" plaque hanging on the door, drawn after the awning so it stays visible */}
      <line x1={P(2.2, D, 1.05)[0]} y1={P(2.2, D, 1.05)[1]} x2={P(2.5, D, 1.2)[0]} y2={P(2.5, D, 1.2)[1]} stroke={INK} strokeWidth={1.5} />
      <line x1={P(2.8, D, 1.05)[0]} y1={P(2.8, D, 1.05)[1]} x2={P(2.5, D, 1.2)[0]} y2={P(2.5, D, 1.2)[1]} stroke={INK} strokeWidth={1.5} />
      <Face P={P} p={[F(1.85, 0.68), F(3.15, 0.68), F(3.15, 1.05), F(1.85, 1.05)]} fill="#fff5b8" sw={1.8} />
      <text
        transform={onPlaneY(P(2.5, D, 0.78))}
        textAnchor="middle"
        fontFamily="var(--font-baloo), sans-serif"
        fontWeight={800}
        fontSize={lang === "de" ? 8.5 : 10}
        fill="#e0668f"
        {...(lang === "de" ? { textLength: 28, lengthAdjust: "spacingAndGlyphs" } : {})}
      >
        {t("AÇIK", "OPEN", "GEÖFFNET")}
      </text>

      {/* side wall banner */}
      <Face P={P} p={[[W, 2.6, 1.0], [W, 0.4, 1.0], [W, 0.4, 2.3], [W, 2.6, 2.3]]} fill="#fff5b8" />
      <text transform={onPlaneX(P(W, 1.5, 1.8))} textAnchor="middle" fontFamily="var(--font-baloo), sans-serif" fontWeight={800} fontSize={13} fill={INK}>
        1 mol =
      </text>
      <text transform={onPlaneX(P(W, 1.5, 1.3))} textAnchor="middle" fontFamily="var(--font-baloo), sans-serif" fontWeight={800} fontSize={12} textLength={60} lengthAdjust="spacingAndGlyphs" fill="#e0668f">
        {t("6,02·10²³ tane!", "6.02×10²³ bits!", "6,02·10²³ Stück!")}
      </text>

      {/* bushes & basket stand */}
      {[
        [-0.8, 3.9],
        [5.7, 3.8],
        [5.8, 0.6],
      ].map(([x, y], k) => {
        const [cx, cy] = P(x, y, 0);
        return (
          <g key={k} stroke={INK} strokeWidth={2}>
            <circle cx={cx - 9} cy={cy - 8} r={10} fill="#7fdcb8" />
            <circle cx={cx + 9} cy={cy - 8} r={10} fill="#7fdcb8" />
            <circle cx={cx} cy={cy - 16} r={12} fill="#a9e8cf" />
          </g>
        );
      })}
      <IsoBox P={P} x={3.4} y={3.6} z={0} dx={1.2} dy={0.6} dz={0.55} top="#ffe5cc" left="#ffb88a" right="#f59f6c" sw={2} />
      {[3.6, 3.95, 4.3].map((x, k) => {
        const [cx, cy] = P(x, 3.9, 0.55);
        return <circle key={x} cx={cx} cy={cy - 4} r={6} fill={["#ff9ebb", "#ffe066", "#8cc8ff"][k]} stroke={INK} strokeWidth={1.6} />;
      })}

      {/* floating atom above the roof */}
      {/* pivot in viewBox coords via CSS (framer originX on SVG is measured from the fill-box) */}
      <g className="mm-atom">
        <ellipse cx={360} cy={62} rx={26} ry={9} fill="none" stroke="#b69cff" strokeWidth={3} />
        <ellipse cx={360} cy={62} rx={26} ry={9} fill="none" stroke="#8cc8ff" strokeWidth={3} transform="rotate(60 360 62)" />
        <ellipse cx={360} cy={62} rx={26} ry={9} fill="none" stroke="#ff9ebb" strokeWidth={3} transform="rotate(-60 360 62)" />
        <circle cx={360} cy={62} r={7} fill="#ffe066" stroke={INK} strokeWidth={2} />
      </g>
      <motion.text x={60} y={50} fontSize={26} animate={{ y: [50, 40, 50] }} transition={{ duration: 2.6, repeat: Infinity }}>
        🪙
      </motion.text>
    </motion.svg>
  );
}
