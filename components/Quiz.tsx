"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useSound } from "@/lib/sound";
import { celebrate } from "@/lib/confetti";
import Cat from "./Cat";
import { useLang } from "@/lib/i18n";

export interface QuizQuestion {
  q: string;
  options: string[];
  /** index of correct option */
  answer: number;
  /** shown after answering */
  explain: string;
}

interface Props {
  questions: QuizQuestion[];
  catColor?: string;
  onFinish?: (score: number) => void;
}

/** Multiple-choice quiz with cat reactions and a final score screen. */
export default function Quiz({ questions, catColor = "#ffe5cc", onFinish }: Props) {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const { play } = useSound();
  const { t } = useLang();

  const q = questions[i];

  const pick = (k: number) => {
    if (picked !== null) return;
    setPicked(k);
    if (k === q.answer) {
      setScore((s) => s + 1);
      play("success");
    } else play("fail");
  };

  const next = () => {
    play("click");
    if (i < questions.length - 1) {
      setI(i + 1);
      setPicked(null);
    } else {
      setDone(true);
      const final = score;
      if (final >= questions.length * 0.6) {
        play("levelup");
        celebrate();
      }
      onFinish?.(final);
    }
  };

  const restart = () => {
    setI(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  };

  if (done) {
    const ratio = score / questions.length;
    return (
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="card mx-auto flex max-w-xl flex-col items-center gap-4 p-8 text-center">
        <Cat color={catColor} mood={ratio >= 0.6 ? "love" : "sad"} accessory="crown" size={150} />
        <h3 className="text-3xl font-bold">
          {score} / {questions.length}
        </h3>
        <p className="text-lg">
          {ratio === 1
            ? t("Mükemmel! Sen tam bir kimya kedisisin! 🏆", "Perfect! You are a true chemistry cat! 🏆")
            : ratio >= 0.6
              ? t("Harika iş! Biraz daha pratikle zirvedesin! ✨", "Great job! A bit more practice and you're at the top! ✨")
              : t("Olsun, tekrar deneyelim! Hata yapmak da öğrenmenin parçası 💪", "No worries, let's try again! Mistakes are part of learning 💪")}
        </p>
        <button type="button" className="btn bg-mint-deep" onClick={restart}>
          {t("Tekrar Dene 🔁", "Try Again 🔁")}
        </button>
      </motion.div>
    );
  }

  const correct = picked === q.answer;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      <div className="flex items-center justify-between font-display font-bold text-ink-soft">
        <span>
          {t("Soru", "Question")} {i + 1} / {questions.length}
        </span>
        <span>⭐ {score}</span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full border-2 border-ink bg-white">
        <motion.div className="h-full bg-pink-deep" animate={{ width: `${((i + (picked !== null ? 1 : 0)) / questions.length) * 100}%` }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={i} initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -40, opacity: 0 }} className="card p-6">
          <h3 className="mb-4 text-xl font-bold md:text-2xl">{q.q}</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {q.options.map((o, k) => {
              const state = picked === null ? "idle" : k === q.answer ? "right" : k === picked ? "wrong" : "dim";
              return (
                <motion.button
                  key={k}
                  type="button"
                  whileHover={picked === null ? { scale: 1.03 } : undefined}
                  whileTap={picked === null ? { scale: 0.97 } : undefined}
                  animate={state === "wrong" ? { x: [0, -8, 8, -6, 6, 0] } : state === "right" ? { scale: [1, 1.08, 1] } : {}}
                  onClick={() => pick(k)}
                  className={`rounded-2xl border-3 border-ink p-4 text-left text-lg font-semibold transition-colors ${
                    state === "right" ? "bg-mint-deep" : state === "wrong" ? "bg-pink-deep" : state === "dim" ? "bg-white opacity-50" : "bg-lavender hover:bg-lavender-deep/60"
                  }`}
                >
                  {o}
                </motion.button>
              );
            })}
          </div>

          {picked !== null && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-5 flex items-center gap-3">
              <Cat color={catColor} mood={correct ? "happy" : "sad"} size={80} bounce={false} />
              <div className="flex-1">
                <p className="font-display text-lg font-bold">{correct ? t("Doğru! 🎉", "Correct! 🎉") : t("Hmm, olmadı 🙀", "Hmm, not quite 🙀")}</p>
                <p>{q.explain}</p>
              </div>
              <button type="button" className="btn bg-lemon-deep" onClick={next}>
                {i < questions.length - 1 ? t("Sonraki →", "Next →") : t("Sonuç 🏁", "Results 🏁")}
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
