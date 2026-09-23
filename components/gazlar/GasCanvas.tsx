"use client";

import { useEffect, useRef } from "react";
import { useLang } from "@/lib/i18n";
import { useSound } from "@/lib/sound";
import { clamp, VMAX, VMIN, type GasState, type Locks } from "./gas";

interface Props {
  state: GasState;
  locks: Locks;
  onDragV?: (v: number) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  /** Hacim sınırı (balon patlama çizgisi) */
  limitV?: number;
  /** Hedef hacim çizgisi */
  targetV?: number;
  popped?: boolean;
  soundOn?: boolean;
  height?: number;
}

interface Particle {
  x: number;
  y: number;
  dx: number;
  dy: number;
  f: number;
  c: string;
  born: number;
  flung?: boolean;
}

interface Spark {
  x: number;
  y: number;
  t: number;
}

const INK = "#4a4063";
const FACES = ["#ff9ebb", "#ffe066", "#7fdcb8", "#b69cff", "#ffb88a", "#8cc8ff"];
const DX = 22;
const DY = -14;
const PISTON_H = 16;
const R_CAT = 11;

function lerpColor(a: string, b: string, t: number) {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const ch = (s: number) => [(s >> 16) & 255, (s >> 8) & 255, s & 255];
  const [r1, g1, b1] = ch(pa);
  const [r2, g2, b2] = ch(pb);
  const m = (x: number, y: number) => Math.round(x + (y - x) * t);
  return `rgb(${m(r1, r2)},${m(g1, g2)},${m(b1, b2)})`;
}

function drawCatFace(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string, hot: boolean, cold: boolean) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = color;
  ctx.strokeStyle = INK;
  ctx.lineWidth = 1.6;
  // kulaklar
  ctx.beginPath();
  ctx.moveTo(-r * 0.92, -r * 0.2);
  ctx.lineTo(-r * 0.72, -r * 1.25);
  ctx.lineTo(-r * 0.12, -r * 0.82);
  ctx.moveTo(r * 0.92, -r * 0.2);
  ctx.lineTo(r * 0.72, -r * 1.25);
  ctx.lineTo(r * 0.12, -r * 0.82);
  ctx.fill();
  ctx.stroke();
  // kafa
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  // yanaklar
  if (hot) {
    ctx.fillStyle = "rgba(255,90,130,0.55)";
    ctx.beginPath();
    ctx.arc(-r * 0.55, r * 0.25, r * 0.2, 0, Math.PI * 2);
    ctx.arc(r * 0.55, r * 0.25, r * 0.2, 0, Math.PI * 2);
    ctx.fill();
  }
  // gözler
  ctx.fillStyle = INK;
  if (cold) {
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(-r * 0.5, -r * 0.1);
    ctx.lineTo(-r * 0.2, -r * 0.1);
    ctx.moveTo(r * 0.2, -r * 0.1);
    ctx.lineTo(r * 0.5, -r * 0.1);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.arc(-r * 0.36, -r * 0.1, r * 0.15, 0, Math.PI * 2);
    ctx.arc(r * 0.36, -r * 0.1, r * 0.15, 0, Math.PI * 2);
    ctx.fill();
  }
  // ağız (w)
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(-r * 0.13, r * 0.28, r * 0.13, 0, Math.PI);
  ctx.arc(r * 0.13, r * 0.28, r * 0.13, 0, Math.PI);
  ctx.stroke();
  ctx.restore();
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** 2.5B (izometrik görünümlü) gaz kutusu: kedi yüzlü tanecikler, piston, ısıtıcı/soğutucu. */
export default function GasCanvas(props: Props) {
  const { height = 380 } = props;
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const propsRef = useRef(props);
  propsRef.current = props;
  const { play } = useSound();
  const playRef = useRef(play);
  const { lang, t } = useLang();
  const langRef = useRef(lang);
  langRef.current = lang;
  playRef.current = play;
  const dragging = useRef(false);
  const geo = useRef({ yb: 0, Hmax: 1, pY: 0, cx: 0 });

  useEffect(() => {
    const canvas = canvasRef.current!;
    const wrap = wrapRef.current!;
    const ctx = canvas.getContext("2d")!;
    let cw = wrap.clientWidth;
    const ch = height;
    let dpr = 1;
    const resize = () => {
      cw = wrap.clientWidth;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(cw * dpr);
      canvas.height = Math.round(ch * dpr);
      canvas.style.width = `${cw}px`;
      canvas.style.height = `${ch}px`;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const parts: Particle[] = [];
    const sparks: Spark[] = [];
    const hitTimes: number[] = [];
    const flash = { l: 0, r: 0, b: 0, t: 0 };
    let dispV = propsRef.current.state.V;
    let dispT = propsRef.current.state.T;
    let pistonFly = 0;
    let lastTick = 0;
    let last = performance.now();
    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      if (!visible) return;
      const p = propsRef.current;
      const { state, locks } = p;
      const lg = langRef.current;
      const L = (tr: string, en: string, de: string) => (lg === "en" ? en : lg === "de" ? de : tr);
      const numStr = (x: number) => x.toLocaleString(lg === "en" ? "en-US" : lg === "de" ? "de-DE" : "tr-TR");

      // geometri
      const bw = Math.min(cw - 44 - DX, 430);
      const bx0 = (cw - bw - DX) / 2;
      const bx1 = bx0 + bw;
      const yb = ch - 70;
      const ytop = 58;
      const Hmax = yb - ytop;
      const vy = (v: number) => yb - (v / VMAX) * Hmax;

      dispV += (state.V - dispV) * Math.min(1, dt * (dragging.current ? 25 : 6));
      dispT += (state.T - dispT) * Math.min(1, dt * 5);
      if (p.popped) pistonFly += dt * 600;
      else pistonFly = 0;
      const pY = vy(dispV) - pistonFly;
      geo.current = { yb, Hmax, pY, cx: bx0 + bw / 2 };

      // tanecik sayısını eşitle
      while (parts.length < state.cats) {
        const a = Math.random() * Math.PI * 2;
        parts.push({
          x: bx0 + R_CAT + Math.random() * (bw - 2 * R_CAT),
          y: Math.max(pY + R_CAT, yb - R_CAT - Math.random() * Math.max(1, yb - pY - 2 * R_CAT)),
          dx: Math.cos(a),
          dy: Math.sin(a),
          f: 0.55 + Math.random() * 0.9,
          c: FACES[parts.length % FACES.length],
          born: now,
        });
      }
      while (parts.length > state.cats) {
        const q = parts.pop()!;
        sparks.push({ x: q.x, y: q.y, t: now });
      }

      const base = 95 * Math.sqrt(dispT / 100);
      let hits = 0;
      for (const q of parts) {
        const s = base * q.f * dt;
        if (p.popped) {
          if (!q.flung) {
            q.flung = true;
            q.dy = -Math.abs(q.dy) - 0.8;
            q.dx *= 1.6;
          }
          q.x += q.dx * s * 2.2;
          q.y += q.dy * s * 2.2;
          continue;
        }
        if (q.flung) {
          const a = Math.random() * Math.PI * 2;
          q.flung = false;
          q.dx = Math.cos(a);
          q.dy = Math.sin(a);
          q.x = bx0 + R_CAT + Math.random() * (bw - 2 * R_CAT);
          q.y = yb - R_CAT - Math.random() * Math.max(1, yb - pY - 2 * R_CAT);
          q.born = now;
        }
        q.x += q.dx * s;
        q.y += q.dy * s;
        const hit = (w: keyof typeof flash, x: number, y: number) => {
          hits++;
          flash[w] = Math.min(1, flash[w] + 0.22);
          if (sparks.length < 24 && Math.random() < 0.35) sparks.push({ x, y, t: now });
        };
        if (q.x < bx0 + R_CAT) {
          q.x = bx0 + R_CAT;
          q.dx = Math.abs(q.dx);
          hit("l", bx0, q.y);
        } else if (q.x > bx1 - R_CAT) {
          q.x = bx1 - R_CAT;
          q.dx = -Math.abs(q.dx);
          hit("r", bx1, q.y);
        }
        if (q.y > yb - R_CAT) {
          q.y = yb - R_CAT;
          q.dy = -Math.abs(q.dy);
          hit("b", q.x, yb);
        } else if (q.y < pY + R_CAT) {
          q.y = Math.min(pY + R_CAT, yb - R_CAT);
          q.dy = Math.abs(q.dy);
          hit("t", q.x, pY);
        }
      }
      for (let k = 0; k < hits; k++) hitTimes.push(now);
      while (hitTimes.length && hitTimes[0] < now - 1000) hitTimes.shift();
      if (hits && p.soundOn && now - lastTick > 140) {
        lastTick = now;
        playRef.current("tick");
      }
      (Object.keys(flash) as (keyof typeof flash)[]).forEach((k) => (flash[k] = Math.max(0, flash[k] - dt * 2.5)));

      // ---------- çizim ----------
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cw, ch);

      const heat = state.trend > 0 ? 1 : clamp((state.T - 420) / 280, 0, 0.9);
      const cold = state.trend < 0 ? 1 : clamp((230 - state.T) / 130, 0, 0.9);

      // ısıtıcı tabanı
      const cx = bx0 + bw / 2 + DX / 2;
      ctx.fillStyle = "#e8dcff";
      ctx.strokeStyle = INK;
      ctx.lineWidth = 3;
      roundRect(ctx, cx - 90, ch - 22, 180, 16, 8);
      ctx.fill();
      ctx.stroke();
      if (heat > 0.05) {
        for (let k = 0; k < 7; k++) {
          const fx = cx - 72 + k * 24;
          const fl = (22 + 16 * Math.sin(now / 90 + k * 1.7)) * (0.4 + heat * 0.8);
          const g = ctx.createLinearGradient(0, ch - 22 - fl, 0, ch - 22);
          g.addColorStop(0, "rgba(255,224,102,0.9)");
          g.addColorStop(1, "rgba(255,120,110,0.95)");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.moveTo(fx - 8, ch - 22);
          ctx.quadraticCurveTo(fx - 9, ch - 22 - fl * 0.5, fx, ch - 22 - fl);
          ctx.quadraticCurveTo(fx + 9, ch - 22 - fl * 0.5, fx + 8, ch - 22);
          ctx.fill();
        }
      }
      if (cold > 0.05) {
        ctx.globalAlpha = Math.min(1, 0.3 + cold);
        for (let k = 0; k < 4; k++) {
          const ix = cx - 70 + k * 40;
          const iy = ch - 44 + Math.sin(now / 400 + k) * 2;
          ctx.fillStyle = "#d6ecff";
          ctx.strokeStyle = "#8cc8ff";
          ctx.lineWidth = 2;
          roundRect(ctx, ix, iy, 26, 22, 6);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = "rgba(255,255,255,0.9)";
          roundRect(ctx, ix + 4, iy + 4, 8, 5, 2);
          ctx.fill();
        }
        ctx.fillStyle = "#8cc8ff";
        ctx.font = "14px system-ui";
        for (let k = 0; k < 5; k++) {
          const sx = cx - 80 + k * 40 + Math.sin(now / 500 + k) * 6;
          const sy = ch - 50 - ((now / 20 + k * 37) % 30);
          ctx.fillText("❄", sx, sy);
        }
        ctx.globalAlpha = 1;
      }

      // arka yüz
      const topY = ytop - 20;
      ctx.lineWidth = 2;
      ctx.strokeStyle = "rgba(74,64,99,0.35)";
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.beginPath();
      ctx.rect(bx0 + DX, topY + DY, bw, yb - topY);
      ctx.fill();
      ctx.stroke();
      // bağlantı çizgileri
      ctx.beginPath();
      ctx.moveTo(bx0, yb);
      ctx.lineTo(bx0 + DX, yb + DY);
      ctx.moveTo(bx1, yb);
      ctx.lineTo(bx1 + DX, yb + DY);
      ctx.moveTo(bx0, topY);
      ctx.lineTo(bx0 + DX, topY + DY);
      ctx.moveTo(bx1, topY);
      ctx.lineTo(bx1 + DX, topY + DY);
      ctx.stroke();

      // gazın bulunduğu bölge (sıcaklığa göre renk)
      const tt = clamp((dispT - 100) / 600, 0, 1);
      const gasCol = tt < 0.5 ? lerpColor("#cfe7ff", "#f3eeff", tt * 2) : lerpColor("#f3eeff", "#ffd9c7", (tt - 0.5) * 2);
      const gy = Math.max(pY, topY);
      ctx.fillStyle = gasCol;
      ctx.fillRect(bx0, gy, bw, yb - gy);
      // taban yüzeyi (izometrik)
      ctx.fillStyle = "rgba(182,156,255,0.25)";
      ctx.beginPath();
      ctx.moveTo(bx0, yb);
      ctx.lineTo(bx0 + DX, yb + DY);
      ctx.lineTo(bx1 + DX, yb + DY);
      ctx.lineTo(bx1, yb);
      ctx.fill();

      // hedef / sınır çizgileri
      const dash = (v: number, color: string, label: string) => {
        const y = vy(v);
        ctx.save();
        ctx.setLineDash([8, 6]);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(bx0 - 6, y);
        ctx.lineTo(bx1 + DX + 4, y + DY / 2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.font = "bold 12px system-ui";
        ctx.fillStyle = color;
        ctx.textAlign = "right";
        ctx.fillText(label, bx1 - 4, y - 5);
        ctx.restore();
      };
      if (p.targetV) dash(p.targetV, "#2fae7f", `🎯 ${L("hedef", "target", "Ziel")} ${numStr(p.targetV)} L`);
      if (p.limitV) dash(p.limitV, "#ff5a7a", `💥 ${L("patlama sınırı", "burst limit", "Platzgrenze")} ${numStr(p.limitV)} L`);

      // tanecikler
      const hot = dispT > 450;
      const coldFace = dispT < 200;
      for (const q of parts) {
        const age = Math.min(1, (now - q.born) / 300);
        const r = R_CAT * (age < 1 ? 0.3 + 0.7 * Math.sin((age * Math.PI) / 2) * 1.1 : 1);
        drawCatFace(ctx, q.x, q.y, r, q.c, hot, coldFace);
      }

      // kıvılcımlar
      for (let k = sparks.length - 1; k >= 0; k--) {
        const s = sparks[k];
        const a = (now - s.t) / 350;
        if (a >= 1) {
          sparks.splice(k, 1);
          continue;
        }
        ctx.strokeStyle = `rgba(255,120,160,${1 - a})`;
        ctx.lineWidth = 2;
        const rr = 4 + a * 10;
        ctx.beginPath();
        for (let j = 0; j < 4; j++) {
          const an = (j * Math.PI) / 2 + Math.PI / 4;
          ctx.moveTo(s.x + Math.cos(an) * rr * 0.5, s.y + Math.sin(an) * rr * 0.5);
          ctx.lineTo(s.x + Math.cos(an) * rr, s.y + Math.sin(an) * rr);
        }
        ctx.stroke();
      }

      // piston
      if (pY > -40) {
        const top = pY - PISTON_H;
        // çubuk / ağırlık / kilit
        if (!locks.V && !locks.pFixed) {
          ctx.fillStyle = "#b69cff";
          ctx.strokeStyle = INK;
          ctx.lineWidth = 2.5;
          const rx = bx0 + bw / 2 + DX / 2 - 6;
          ctx.fillRect(rx, 4 - pistonFly, 12, top + DY / 2 - 4);
          ctx.strokeRect(rx, 4 - pistonFly, 12, top + DY / 2 - 4);
          roundRect(ctx, rx - 30, Math.max(2, top - 34), 72, 20, 10);
          ctx.fillStyle = "#ff9ebb";
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = INK;
          ctx.font = "bold 12px system-ui";
          ctx.textAlign = "center";
          ctx.fillText(L("⇕ sürükle", "⇕ drag", "⇕ ziehen"), rx + 6, Math.max(2, top - 34) + 14);
        }
        // üst yüz
        ctx.fillStyle = "#e8dcff";
        ctx.strokeStyle = INK;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(bx0, top);
        ctx.lineTo(bx0 + DX, top + DY);
        ctx.lineTo(bx1 + DX, top + DY);
        ctx.lineTo(bx1, top);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        // yan yüz
        ctx.fillStyle = "#b69cff";
        ctx.beginPath();
        ctx.moveTo(bx1, top);
        ctx.lineTo(bx1 + DX, top + DY);
        ctx.lineTo(bx1 + DX, pY + DY);
        ctx.lineTo(bx1, pY);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        // ön yüz (çarpışınca parlar)
        ctx.fillStyle = lerpColor("#c9b6ff", "#ff9ebb", flash.t);
        ctx.fillRect(bx0, top, bw, PISTON_H);
        ctx.strokeRect(bx0, top, bw, PISTON_H);
        if (locks.pFixed) {
          // sabit basınç: pistonun üstünde ağırlık
          const wx = bx0 + bw / 2 + DX / 2;
          ctx.fillStyle = "#ffe066";
          ctx.beginPath();
          ctx.moveTo(wx - 34, top + DY / 2);
          ctx.lineTo(wx - 26, top + DY / 2 - 26);
          ctx.lineTo(wx + 26, top + DY / 2 - 26);
          ctx.lineTo(wx + 34, top + DY / 2);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = INK;
          ctx.font = "bold 12px system-ui";
          ctx.textAlign = "center";
          ctx.fillText(L("sabit P", "fixed P", "P konst."), wx, top + DY / 2 - 9);
        }
        if (locks.V && !locks.pFixed) {
          ctx.font = "18px system-ui";
          ctx.textAlign = "center";
          ctx.fillText("🔒", bx0 - 2, top + 2);
          ctx.fillText("🔒", bx1 + DX + 4, top + DY + 4);
        }
      }

      // ön cam kenarları + duvar parlamaları
      ctx.lineCap = "round";
      const wall = (x1: number, y1: number, x2: number, y2: number, f: number) => {
        ctx.strokeStyle = lerpColor("#4a4063", "#ff4f8b", f);
        ctx.lineWidth = 4 + f * 3;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      };
      wall(bx0, topY, bx0, yb, flash.l);
      wall(bx1, topY, bx1, yb, flash.r);
      wall(bx0, yb, bx1, yb, flash.b);
      // cam parıltısı
      ctx.strokeStyle = "rgba(255,255,255,0.8)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(bx0 + 10, topY + 16);
      ctx.lineTo(bx0 + 10, topY + 60);
      ctx.stroke();

      // çarpışma sayacı
      ctx.textAlign = "left";
      ctx.font = "bold 13px system-ui";
      ctx.fillStyle = INK;
      const rate = hitTimes.length;
      ctx.fillText(`💥 ${rate} ${L("çarpışma/sn", "collisions/s", "Stöße/s")}`, 10, 18);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [height]);

  const canDrag = !props.locks.V && !props.locks.pFixed && !props.popped;

  const yToV = (clientY: number) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const y = clientY - rect.top;
    const { yb, Hmax } = geo.current;
    return clamp(((yb - y - 0) / Hmax) * VMAX, VMIN, VMAX);
  };

  const onDown = (e: React.PointerEvent) => {
    if (!canDrag) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const y = e.clientY - rect.top;
    if (y > geo.current.pY + 30) return;
    dragging.current = true;
    (e.target as Element).setPointerCapture(e.pointerId);
    propsRef.current.onDragStart?.();
    propsRef.current.onDragV?.(yToV(e.clientY + PISTON_H / 2));
  };
  const onMove = (e: React.PointerEvent) => {
    const c = canvasRef.current!;
    if (!dragging.current) {
      const y = e.clientY - c.getBoundingClientRect().top;
      c.style.cursor = canDrag && y <= geo.current.pY + 30 ? "ns-resize" : "default";
      return;
    }
    propsRef.current.onDragV?.(yToV(e.clientY + PISTON_H / 2));
  };
  const onUp = () => {
    if (!dragging.current) return;
    dragging.current = false;
    propsRef.current.onDragEnd?.();
  };

  return (
    <div ref={wrapRef} className="relative w-full" style={{ height }}>
      <canvas
        ref={canvasRef}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        style={{ touchAction: canDrag ? "none" : "auto", display: "block" }}
        aria-label={t("Gaz kutusu: kedi tanecikler, piston ve ısıtıcı", "Gas box: cat particles, piston and heater", "Gas-Box: Katzenteilchen, Kolben und Heizung")}
        role="img"
      />
    </div>
  );
}
