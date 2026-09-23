"use client";

import { motion, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";

const INK = "#4a4063";

interface Props {
  /** degrees; positive = right pan goes down */
  angle: number;
  /** render pan contents given the usable pan area (px) */
  left: (w: number, h: number) => ReactNode;
  right: (w: number, h: number) => ReactNode;
  balanced: boolean;
  /** shown sitting on the pivot */
  topper?: ReactNode;
  panHeight?: number;
}

/** Big hanging balance scale. Beam tilts with a spring, pans stay upright and follow the beam ends. */
export default function Scale({ angle, left, right, balanced, topper, panHeight = 170 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(600);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setW(el.clientWidth));
    ro.observe(el);
    setW(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  const spring = useSpring(0, { stiffness: 70, damping: 7, mass: 1.2 });
  useEffect(() => {
    spring.set(angle);
  }, [angle, spring]);

  const beamY = 78;
  const half = w * 0.29;
  const panW = Math.min(w * 0.39, 320);
  const height = beamY + half * Math.sin((14 * Math.PI) / 180) + panHeight + 34;

  const dy = useTransform(spring, (a) => half * Math.sin((a * Math.PI) / 180));
  const dx = useTransform(spring, (a) => half * (1 - Math.cos((a * Math.PI) / 180)));
  const leftY = useTransform(dy, (v) => beamY - v);
  const rightY = useTransform(dy, (v) => beamY + v);
  const leftX = useTransform(dx, (v) => w / 2 - half + v - panW / 2);
  const rightX = useTransform(dx, (v) => w / 2 + half - v - panW / 2);
  const rotate = spring;

  return (
    <div ref={ref} className="relative w-full select-none" style={{ height }}>
      {/* stand */}
      <div className="absolute bottom-0 left-1/2 h-5 w-40 -translate-x-1/2 rounded-full border-3 border-ink bg-lavender-deep" style={{ borderWidth: 3 }} />
      <div className="absolute left-1/2 w-4 -translate-x-1/2 rounded-full bg-lavender" style={{ top: beamY, bottom: 12, border: `3px solid ${INK}` }} />

      {/* balance dial */}
      <div className="absolute left-1/2 -translate-x-1/2" style={{ bottom: 22 }}>
        <svg width="84" height="46" viewBox="0 0 84 46">
          <path d="M4 42 A38 38 0 0 1 80 42 Z" fill="white" stroke={INK} strokeWidth={3} />
          <path d="M30 10 A38 38 0 0 1 54 10" stroke="#7fdcb8" strokeWidth={6} fill="none" />
          <Needle rotate={rotate} balanced={balanced} />
        </svg>
      </div>

      {/* beam */}
      <motion.div
        className="absolute rounded-full"
        style={{
          left: w / 2 - half - 14,
          width: half * 2 + 28,
          top: beamY - 9,
          height: 18,
          rotate,
          background: balanced ? "#7fdcb8" : "#ffe066",
          border: `3px solid ${INK}`,
          boxShadow: "0 4px 0 rgb(74 64 99 / .2)",
        }}
      >
        <span className="absolute left-2 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-ink" />
        <span className="absolute right-2 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-ink" />
      </motion.div>
      {/* pivot */}
      <div className="absolute left-1/2 h-7 w-7 -translate-x-1/2 rounded-full bg-pink-deep" style={{ top: beamY - 14, border: `3px solid ${INK}` }} />
      {topper && (
        <div className="absolute left-1/2 -translate-x-1/2" style={{ top: 0, bottom: `calc(100% - ${beamY - 10}px)` }}>
          <div className="flex h-full items-end">{topper}</div>
        </div>
      )}

      <Pan x={leftX} y={leftY} w={panW} h={panHeight} balanced={balanced} color="#d6ecff">
        {left}
      </Pan>
      <Pan x={rightX} y={rightY} w={panW} h={panHeight} balanced={balanced} color="#ffd6e0">
        {right}
      </Pan>
    </div>
  );
}

function Needle({ rotate, balanced }: { rotate: MotionValue<number>; balanced: boolean }) {
  const r = useTransform(rotate, (a) => a * 3);
  return (
    <motion.g style={{ rotate: r, originX: "42px", originY: "42px" }}>
      <line x1="42" y1="42" x2="42" y2="10" stroke={balanced ? "#3fb58a" : "#ff6f91"} strokeWidth={4} strokeLinecap="round" />
      <circle cx="42" cy="42" r="5" fill={INK} />
    </motion.g>
  );
}

function Pan({ x, y, w, h, children, balanced, color }: { x: MotionValue<number>; y: MotionValue<number>; w: number; h: number; children: (w: number, h: number) => ReactNode; balanced: boolean; color: string }) {
  const plateH = 22;
  return (
    <motion.div className="absolute" style={{ left: x, top: y, width: w, height: h }}>
      <svg className="pointer-events-none absolute inset-0" width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <line x1={w / 2} y1={0} x2={10} y2={h - plateH / 2} stroke={INK} strokeWidth={2.5} strokeDasharray="1 0" opacity={0.55} />
        <line x1={w / 2} y1={0} x2={w - 10} y2={h - plateH / 2} stroke={INK} strokeWidth={2.5} opacity={0.55} />
        <circle cx={w / 2} cy={4} r={6} fill="white" stroke={INK} strokeWidth={3} />
      </svg>
      <div className="absolute inset-x-3 flex flex-wrap-reverse content-start items-end justify-center gap-x-1 gap-y-0.5" style={{ bottom: plateH - 4, top: 28 }}>
        {children(w - 24, h - 28 - (plateH - 4))}
      </div>
      <div
        className="absolute bottom-0 left-0 right-0 rounded-b-[999px] rounded-t-lg transition-colors"
        style={{ height: plateH, background: balanced ? "#7fdcb8" : color, border: `3px solid ${INK}`, boxShadow: "0 5px 0 rgb(74 64 99 / .15)" }}
      />
    </motion.div>
  );
}
