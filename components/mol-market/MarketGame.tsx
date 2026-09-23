"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import Cat, { type CatMood } from "@/components/Cat";
import Robo, { type RoboMood } from "@/components/Robo";
import { useSound } from "@/lib/sound";
import { celebrate, sparkleAt } from "@/lib/confetti";
import { useLang } from "@/lib/i18n";
import { ELEMENTS, EL, fmt, fmtN, parseDec, type El } from "./chem";
import { ORDERS, type Order } from "./orders";
import ShopScene from "./ShopScene";
import { MINNOS } from "./Story";

function Jar({ sym, onTap, active }: { sym: El; onTap: (el: HTMLElement) => void; active: boolean }) {
  const { t, pick, lang } = useLang();
  const e = EL[sym];
  const [bump, setBump] = useState(0);
  return (
    <motion.button
      type="button"
      onClick={(ev) => {
        setBump((b) => b + 1);
        onTap(ev.currentTarget);
      }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.9 }}
      animate={bump ? { rotate: [0, -10, 8, 0], y: [0, -10, 0] } : {}}
      key={bump}
      className={`relative flex flex-col items-center ${active ? "" : "opacity-90"}`}
      aria-label={`${pick(e.name)} (${e.sym}), ${fmt(e.mass, lang)} ${t("gram bölü mol", "grams per mole", "Gramm pro Mol")}`}
    >
      <svg viewBox="0 0 60 70" className="w-12 sm:w-14" aria-hidden>
        <rect x={12} y={4} width={36} height={10} rx={4} fill={e.deep} stroke="#4a4063" strokeWidth={3} />
        <rect x={6} y={13} width={48} height={52} rx={16} fill={e.color} stroke="#4a4063" strokeWidth={3} />
        <circle cx={18} cy={30} r={3} fill="white" opacity={0.9} />
        <text x={30} y={48} textAnchor="middle" fontFamily="var(--font-baloo), sans-serif" fontWeight={800} fontSize={e.sym.length > 1 ? 19 : 23} fill="#4a4063">
          {e.sym}
        </text>
        {/* tiny cute face */}
        <circle cx={24} cy={56} r={1.6} fill="#4a4063" />
        <circle cx={36} cy={56} r={1.6} fill="#4a4063" />
      </svg>
      <span className="-mt-1 whitespace-nowrap rounded-full border-2 border-ink bg-white px-1 text-[10px] font-bold leading-4 sm:px-1.5 sm:text-[11px]">{fmt(e.mass, lang)} g/mol</span>
    </motion.button>
  );
}

function Coins({ burst }: { burst: number }) {
  return (
    <AnimatePresence>
      {burst > 0 && (
        <motion.div key={burst} className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center" initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ delay: 1, duration: 0.4 }}>
          {Array.from({ length: 9 }, (_, k) => (
            <motion.span
              key={k}
              className="absolute text-3xl"
              initial={{ x: 0, y: 0, scale: 0.4 }}
              animate={{ x: (k - 4) * 28, y: [0, -110 - (k % 3) * 25, -40], scale: 1, rotate: 360 }}
              transition={{ duration: 1.1, ease: "easeOut" }}
            >
              🪙
            </motion.span>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** "." is the internal decimal token; it is shown as "," in Turkish and German. */
const KEYS = ["7", "8", "9", "4", "5", "6", "1", "2", "3", ".", "0", "⌫"];

export default function MarketGame({ onNext }: { onNext: () => void }) {
  const { play } = useSound();
  const { t, pick, lang } = useLang();
  const dec = (s: string) => (lang === "en" ? s : s.replace(".", ","));
  const [idx, setIdx] = useState(0);
  const [present, setPresent] = useState(true);
  const [paid, setPaid] = useState(false);
  const [tries, setTries] = useState(0);
  const [basket, setBasket] = useState<Partial<Record<El, number>>>({});
  const [input, setInput] = useState("");
  const [picked, setPicked] = useState<number | null>(null);
  const [coins, setCoins] = useState(0);
  const [burst, setBurst] = useState(0);
  const [ka, setKa] = useState(0);
  const [shake, setShake] = useState(0);
  const [done, setDone] = useState(false);
  const [peek, setPeek] = useState<El | null>(null);
  const payRef = useRef<HTMLDivElement>(null);

  const order: Order = ORDERS[idx];
  const wrongOnce = tries > 0 && !paid;

  const customerMood: CatMood = paid ? "love" : tries > 0 ? "sad" : "happy";
  const minnosMood: CatMood = paid ? "wink" : tries > 0 ? "thinking" : "happy";
  const roboMood: RoboMood = paid ? "excited" : tries > 0 ? "thinking" : "happy";

  const win = useCallback(() => {
    const gain = tries === 0 ? 3 : 1;
    setPaid(true);
    setCoins((c) => c + gain);
    setBurst((b) => b + 1);
    setKa((k) => k + 1);
    play("success");
    setTimeout(() => play("pop"), 250);
    sparkleAt(payRef.current);
  }, [tries, play]);

  const lose = useCallback(() => {
    setTries((n) => n + 1);
    setShake((s) => s + 1);
    play("fail");
  }, [play]);

  const checkBasket = () => {
    const need = (order as { need?: Partial<Record<El, number>> }).need ?? {};
    const keys = new Set([...Object.keys(need), ...Object.keys(basket)] as El[]);
    const ok = [...keys].every((k) => (need[k] ?? 0) === (basket[k] ?? 0));
    if (ok) win();
    else lose();
  };

  const checkRegister = () => {
    if (order.kind !== "register") return;
    const v = parseDec(input);
    if (input && Number.isFinite(v) && Math.abs(v - order.answer) < 1e-6 + Math.abs(order.answer) * 1e-3) win();
    else lose();
  };

  const pickChoice = (k: number) => {
    if (order.kind !== "choice" || paid) return;
    setPicked(k);
    if (k === order.answer) win();
    else lose();
  };

  const tapJar = (sym: El, el: HTMLElement) => {
    if (order.kind === "basket" && !paid) {
      play("pop");
      setBasket((b) => ({ ...b, [sym]: (b[sym] ?? 0) + 1 }));
      sparkleAt(el);
    } else {
      play("bubble");
      setPeek(sym);
    }
  };

  const press = useCallback(
    (k: string) => {
      if (paid) return;
      play("tick");
      setInput((s) => {
        if (k === "⌫") return s.slice(0, -1);
        if (k === "C") return "";
        if (k === "." && s.includes(".")) return s;
        if (s.length >= 7) return s;
        return s + k;
      });
    },
    [paid, play],
  );

  // keyboard support for the cash register
  useEffect(() => {
    if (order.kind !== "register" || paid) return;
    const h = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key)) press(e.key);
      else if (e.key === "," || e.key === ".") press(".");
      else if (e.key === "Backspace") press("⌫");
      else if (e.key === "Enter") checkRegister();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  });

  const nextCustomer = () => {
    play("whoosh");
    if (idx === ORDERS.length - 1) {
      setPresent(false);
      setTimeout(() => {
        setDone(true);
        play("levelup");
        celebrate();
      }, 900);
      return;
    }
    setPresent(false);
    setTimeout(() => {
      setIdx((i) => i + 1);
      setPaid(false);
      setTries(0);
      setBasket({});
      setInput("");
      setPicked(null);
      setPeek(null);
      setPresent(true);
      play("meow");
    }, 1000);
  };

  const restart = () => {
    setIdx(0);
    setPaid(false);
    setTries(0);
    setBasket({});
    setInput("");
    setPicked(null);
    setCoins(0);
    setDone(false);
    setPresent(true);
  };

  const max = ORDERS.length * 3;

  if (done) {
    const stars = coins >= max * 0.85 ? 3 : coins >= max * 0.55 ? 2 : 1;
    return (
      <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="card mx-auto flex max-w-xl flex-col items-center gap-4 bg-lavender p-8 text-center">
        <div className="flex items-end gap-2">
          <Cat color={MINNOS.color} accent={MINNOS.accent} accessory="chef" mood="love" size={130} />
          <Robo mood="excited" holding="clipboard" size={110} />
        </div>
        <h3 className="text-3xl font-extrabold">{t("Dükkân kapandı! 🌙", "Shop's closed! 🌙", "Feierabend im Laden! 🌙")}</h3>
        <p className="text-xl">
          {t("Kasada", "The till holds", "In der Kasse sind")} <b>{coins}</b> / {max} 🪙{t(" var.", ".", ".")}
        </p>
        <p className="text-4xl">{"⭐".repeat(stars)}</p>
        <p className="text-lg">
          {stars === 3
            ? t("Efsane kasiyer! Mol hesabında üstüne yok!", "Legendary cashier! Nobody does mole maths better!", "Kassen-Legende! Beim Mol-Rechnen macht dir keiner was vor!")
            : stars === 2
              ? t("Çok iyi! Birkaç ipucuyla harika iş çıkardın.", "Great job! With a few hints you did brilliantly.", "Sehr gut! Mit ein paar Tipps hast du das super gemacht.")
              : t("Güzel başlangıç! Bir tur daha oynarsan ustalaşırsın.", "Nice start! Play one more round and you'll be a pro.", "Guter Anfang! Noch eine Runde, und du bist Profi.")}
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <button type="button" className="btn bg-white" onClick={restart}>
            {t("Tekrar Oyna 🔁", "Play Again 🔁", "Nochmal spielen 🔁")}
          </button>
          <button type="button" className="btn bg-lemon-deep" onClick={onNext}>
            {t("Mol Dönüştürücü ⚖️ →", "Mole Converter ⚖️ →", "Mol-Umrechner ⚖️ →")}
          </button>
        </div>
      </motion.div>
    );
  }

  const basketItems = (Object.entries(basket) as [El, number][]).filter(([, n]) => n > 0);

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-4 lg:grid-cols-[1.05fr_1fr]">
      {/* LEFT: shop scene + order ticket */}
      <div className="flex flex-col gap-3">
        <div className="card relative overflow-hidden bg-gradient-to-b from-sky to-cream p-1">
          <div className="absolute left-3 top-3 z-10 flex gap-2">
            <span className="rounded-full border-2 border-ink bg-white px-3 py-0.5 font-display text-sm font-bold">
              {t("Müşteri", "Customer", "Kunde")} {idx + 1} / {ORDERS.length}
            </span>
          </div>
          <motion.div key={coins} animate={{ scale: [1, 1.25, 1] }} className="absolute right-3 top-3 z-10 rounded-full border-2 border-ink bg-lemon-deep px-3 py-0.5 font-display text-sm font-bold">
            🪙 {coins}
          </motion.div>
          <ShopScene
            customer={present ? order.customer : null}
            customerKey={idx}
            customerMood={customerMood}
            minnosMood={minnosMood}
            roboMood={roboMood}
            ka={ka}
            bubble={
              paid
                ? t("Teşekkürler! 💜", "Thank you! 💜", "Danke schön! 💜")
                : order.kind === "basket"
                  ? t("🧺 Sepet!", "🧺 Basket!", "🧺 Korb!")
                  : order.kind === "choice"
                    ? t("🤔 Kaç tane?", "🤔 How many?", "🤔 Wie viele?")
                    : t("🧮 Hesap!", "🧮 Let's count!", "🧮 Rechnen!")
            }
          />
        </div>

        <AnimatePresence mode="wait">
          {present && (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 14, rotate: -1 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: 0.4 }}
              className="card relative bg-white p-4"
              style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent 0 27px, #f3ecff 27px 29px)" }}
            >
              <span className="font-display text-sm font-bold text-ink-soft">
                🧾 {t("Sipariş fişi", "Order slip", "Bestellzettel")} · {pick(order.customer.name)}{" "}
                {order.kind === "basket"
                  ? t("· sepet hazırla", "· pack the basket", "· Korb packen")
                  : order.kind === "choice"
                    ? t("· doğru olanı seç", "· pick the right one", "· Richtiges wählen")
                    : t("· kasada hesapla", "· work it out at the till", "· an der Kasse rechnen")}
              </span>
              <p className="text-lg font-semibold leading-snug md:text-xl">{pick(order.text)}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {wrongOnce && (
            <motion.div key={`hint-${tries}`} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="card flex items-center gap-3 bg-sky p-3">
              <Robo mood="thinking" holding="clipboard" size={60} bounce={false} />
              <div className="flex-1">
                <p className="font-display font-bold">{t("Robo'nun ipucu 💡", "Robo's hint 💡", "Robos Tipp 💡")}</p>
                <p>{pick(order.hint)}</p>
                {tries >= 2 && (
                  <p className="mt-1 font-semibold text-ink-soft">
                    {t("Çözüm", "Solution", "Lösung")}: {pick(order.solution)}
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* RIGHT: shelves + basket/register */}
      <div className="flex flex-col gap-3">
        <div className="card bg-peach p-3">
          <div className="mb-1 flex items-center justify-between">
            <h3 className="font-display text-lg font-bold">{t("🫙 Element rafı", "🫙 Element shelf", "🫙 Elementregal")}</h3>
            <span className="text-right text-xs font-semibold text-ink-soft sm:text-sm">
              {order.kind === "basket" && !paid ? t("Kavanoza dokun = 1 mol ekle", "Tap a jar = add 1 mol", "Glas antippen = 1 mol dazu") : t("Kavanoza dokun = etiketi oku", "Tap a jar = read its label", "Glas antippen = Etikett lesen")}
            </span>
          </div>
          <div className="relative">
            <div className="grid grid-cols-5 gap-x-1 gap-y-2 rounded-2xl pb-1">
              {ELEMENTS.map((e) => (
                <div key={e.sym} className="flex justify-center">
                  <Jar sym={e.sym} active={order.kind === "basket"} onTap={(el) => tapJar(e.sym, el)} />
                </div>
              ))}
            </div>
            {/* wooden shelf planks */}
            <div className="pointer-events-none absolute inset-x-0 top-[calc(50%-10px)] -z-0 h-2 rounded-full bg-peach-deep/60" />
          </div>
          <AnimatePresence>
            {peek && order.kind !== "basket" && (
              <motion.p key={peek} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-2 rounded-xl border-2 border-ink bg-white px-3 py-1 text-center font-semibold">
                {pick(EL[peek].name)} ({peek}): 1 mol = {fmt(EL[peek].mass, lang)} g → M = {fmt(EL[peek].mass, lang)} g/mol
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <motion.div ref={payRef} key={`pay-${shake}`} animate={shake ? { x: [0, -10, 10, -6, 6, 0] } : {}} transition={{ duration: 0.4 }} className="card relative overflow-visible bg-lavender p-4">
          <Coins burst={burst} />
          {order.kind === "basket" && (
            <div className="flex flex-col gap-3">
              <h3 className="font-display text-lg font-bold">{t("🧺 Müşterinin sepeti", "🧺 Customer's basket", "🧺 Korb der Kundschaft")}</h3>
              <div className="flex min-h-[64px] flex-wrap items-center gap-2 rounded-2xl border-2 border-dashed border-ink/40 bg-white/70 p-2">
                {basketItems.length === 0 && <span className="px-2 text-ink-soft">{t("Sepet boş. Raftan kavanoz seç!", "The basket is empty. Pick jars from the shelf!", "Der Korb ist leer. Nimm Gläser aus dem Regal!")}</span>}
                <AnimatePresence>
                  {basketItems.map(([s, n]) => (
                    <motion.div
                      key={s}
                      layout
                      initial={{ scale: 0, y: -30 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0 }}
                      className="flex items-center gap-1 rounded-full border-2 border-ink py-0.5 pl-3 pr-1 font-display font-bold"
                      style={{ background: EL[s].color }}
                    >
                      <motion.span key={n} animate={{ scale: [1.4, 1] }}>
                        {n} mol {s}
                      </motion.span>
                      {!paid && (
                        <button
                          type="button"
                          aria-label={t(`${s} azalt`, `Remove one ${s}`, `Ein ${s} entfernen`)}
                          className="ml-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-ink bg-white text-lg leading-none"
                          onClick={() => {
                            play("click");
                            setBasket((b) => ({ ...b, [s]: Math.max(0, (b[s] ?? 0) - 1) }));
                          }}
                        >
                          −
                        </button>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              {!paid && (
                <div className="flex flex-wrap justify-end gap-2">
                  <button type="button" className="btn bg-white !py-2" onClick={() => (play("click"), setBasket({}))}>
                    {t("Boşalt 🗑️", "Empty 🗑️", "Leeren 🗑️")}
                  </button>
                  <button type="button" className="btn bg-mint-deep !py-2" onClick={checkBasket}>
                    {t("Kasaya ver ✓", "Ring it up ✓", "Abkassieren ✓")}
                  </button>
                </div>
              )}
            </div>
          )}

          {order.kind === "register" && (
            <div className="flex flex-col gap-3">
              <h3 className="font-display text-lg font-bold">{t("🧮 Yazar kasa", "🧮 Cash register", "🧮 Registrierkasse")}</h3>
              <div className="flex items-center justify-between gap-2 rounded-2xl border-3 border-ink bg-[#2f3a4a] px-4 py-3 font-mono text-2xl text-[#b8ffdc] shadow-inner">
                <span className="text-base text-[#b8ffdc]/70">{order.label}</span>
                <span className="flex-1 text-right tracking-wider">
                  {paid ? fmt(order.answer, lang) : dec(input) || "_"}
                </span>
                <span className="text-base">{order.unit}</span>
              </div>
              {!paid && (
                <div className="grid grid-cols-4 gap-2">
                  {KEYS.map((k, i) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => press(k)}
                      className="btn !rounded-2xl bg-white !px-0 !py-2 text-xl"
                      style={{ gridColumn: `${(i % 3) + 1}`, gridRow: `${Math.floor(i / 3) + 1}` }}
                    >
                      {dec(k)}
                    </button>
                  ))}
                  <button type="button" className="btn !rounded-2xl bg-pink !px-0 !py-2" style={{ gridColumn: 4, gridRow: 1 }} onClick={() => press("C")}>
                    C
                  </button>
                  <button type="button" className="btn !rounded-2xl bg-mint-deep !px-0 !py-2 text-lg" style={{ gridColumn: 4, gridRow: "2 / span 3" }} onClick={checkRegister}>
                    {t("Öde", "Pay", "Zahlen")}
                    <br />✓
                  </button>
                </div>
              )}
            </div>
          )}

          {order.kind === "choice" && (
            <div className="flex flex-col gap-3">
              <h3 className="font-display text-lg font-bold">{t("🧮 Kasa ekranı: doğru sayıyı seç", "🧮 Till screen: pick the right number", "🧮 Kassendisplay: Wähle die richtige Zahl")}</h3>
              <div className="grid grid-cols-2 gap-2">
                {order.options.map((o, k) => (
                  <motion.button
                    key={o}
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => pickChoice(k)}
                    className={`rounded-2xl border-3 border-ink p-3 font-display text-lg font-bold ${
                      paid && k === order.answer ? "bg-mint-deep" : picked === k && k !== order.answer ? "bg-pink-deep" : "bg-white"
                    }`}
                  >
                    {fmtN(o, lang)}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {paid && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mt-3 flex flex-col gap-2 rounded-2xl border-2 border-ink bg-white p-3">
              <p className="font-display text-lg font-bold">
                ✅ Ka-ching! +{tries === 0 ? 3 : 1} 🪙
              </p>
              <p className="font-semibold">🧾 {pick(order.solution)}</p>
              <button type="button" className="btn self-end bg-lemon-deep" onClick={nextCustomer}>
                {idx === ORDERS.length - 1 ? t("Dükkânı kapat 🌙", "Close the shop 🌙", "Laden schließen 🌙") : t("Sıradaki müşteri →", "Next customer →", "Nächster Kunde →")}
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
