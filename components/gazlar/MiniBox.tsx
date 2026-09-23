"use client";

import { motion } from "framer-motion";
import CatHead, { CAT_COLORS } from "./CatHead";

/** Kediciklerin rastgele zıpladığı küçük kutu (framer-motion ile) */
export default function MiniBox({
  count = 8,
  speed = 1,
  width = 220,
  height = 130,
  hot = false,
  label,
}: {
  count?: number;
  speed?: number;
  width?: number;
  height?: number;
  hot?: boolean;
  label?: string;
}) {
  const pad = 16;
  return (
    <div className="relative inline-block max-w-full overflow-hidden rounded-2xl border-[3px] border-ink bg-white/80" style={{ width, height }}>
      {Array.from({ length: count }).map((_, k) => {
        const xs = [0, 1, 2, 3].map((j) => pad + (((k * 53 + j * 97) % 100) / 100) * (width - 2 * pad) - 12);
        const ys = [0, 1, 2, 3].map((j) => pad + (((k * 71 + j * 41 + 13) % 100) / 100) * (height - 2 * pad) - 12);
        return (
          <motion.div
            key={k}
            className="absolute top-0 left-0"
            animate={{ x: [...xs, xs[0]], y: [...ys, ys[0]], rotate: [0, 15, -10, 5, 0] }}
            transition={{ duration: (3.2 + (k % 3)) / speed, repeat: Infinity, ease: "linear" }}
          >
            <CatHead size={24} color={CAT_COLORS[k % CAT_COLORS.length]} hot={hot} />
          </motion.div>
        );
      })}
      {label && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-ink px-2 py-0.5 text-xs font-bold whitespace-nowrap text-white">{label}</span>}
    </div>
  );
}
