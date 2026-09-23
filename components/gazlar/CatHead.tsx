/** Küçük gaz kedisi kafası (SVG) — hikâye ve giriş ekranı için. */
export default function CatHead({ size = 28, color = "#ff9ebb", hot = false }: { size?: number; color?: string; hot?: boolean }) {
  return (
    <svg viewBox="-14 -18 28 32" width={size} height={size * (32 / 28)} aria-hidden>
      <path d="M-12 -3 L-10 -16 L-2 -11 Z M12 -3 L10 -16 L2 -11 Z" fill={color} stroke="#4a4063" strokeWidth={2} strokeLinejoin="round" />
      <circle r={12} fill={color} stroke="#4a4063" strokeWidth={2} />
      {hot && (
        <>
          <circle cx={-6.5} cy={3} r={2.4} fill="#ff5a82" opacity={0.5} />
          <circle cx={6.5} cy={3} r={2.4} fill="#ff5a82" opacity={0.5} />
        </>
      )}
      <circle cx={-4.3} cy={-1.5} r={1.8} fill="#4a4063" />
      <circle cx={4.3} cy={-1.5} r={1.8} fill="#4a4063" />
      <path d="M-3 3.2 q1.5 2 3 0 q1.5 2 3 0" fill="none" stroke="#4a4063" strokeWidth={1.4} strokeLinecap="round" />
    </svg>
  );
}

export const CAT_COLORS = ["#ff9ebb", "#ffe066", "#7fdcb8", "#b69cff", "#ffb88a", "#8cc8ff"];
