import { useState } from 'react';
import { motion } from 'framer-motion';
import type { QuizQuestion } from '../content/types';
import { useProgressStore } from '../store/progressStore';
import { pick } from '../i18n';
import { STRINGS } from '../i18n/strings';
import { HintButton } from './HintButton';
import { StarBurst } from './StarBurst';
import { BigButton } from './BigButton';
import { soundManager } from '../lib/sound';

interface QuizEngineProps {
  questions: QuizQuestion[];
  onFinished: (result: { hintsUsed: number }) => void;
}

type Feedback = 'idle' | 'correct' | 'wrong-retry' | 'wrong-reveal';

// "Check" step: 3–5 questions, hints hidden by default, mistakes are always
// safe — a wrong first try just asks the child to look again; a second wrong
// try reveals the answer with a short explanation, never a bare ❌ (brief §3.5, §8).
export function QuizEngine({ questions, onFinished }: QuizEngineProps) {
  const language = useProgressStore((s) => s.settings.language);
  const sfxEnabled = useProgressStore((s) => s.settings.sfx);
  const [index, setIndex] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [wrongIndex, setWrongIndex] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<Feedback>('idle');
  const [showStarBurst, setShowStarBurst] = useState(false);
  const [hintsUsedTotal, setHintsUsedTotal] = useState(0);

  const question = questions[index];
  const isLast = index === questions.length - 1;

  const goToNext = () => {
    if (isLast) {
      onFinished({ hintsUsed: hintsUsedTotal });
    } else {
      setIndex((i) => i + 1);
      setAttempts(0);
      setWrongIndex(null);
      setFeedback('idle');
    }
  };

  const choose = (optionIndex: number) => {
    if (feedback === 'correct' || feedback === 'wrong-reveal') return;
    soundManager.unlock();

    if (optionIndex === question.correctIndex) {
      soundManager.play('correct', { sfxEnabled });
      setFeedback('correct');
      setShowStarBurst(true);
      setTimeout(() => setShowStarBurst(false), 900);
      setTimeout(goToNext, 1000);
      return;
    }

    soundManager.play('almost', { sfxEnabled });
    setWrongIndex(optionIndex);
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    setFeedback(nextAttempts >= 2 ? 'wrong-reveal' : 'wrong-retry');
  };

  if (!question || !question.options || question.correctIndex === undefined) {
    return (
      <div className="rounded-2xl bg-white/90 px-5 py-4 text-center text-slate-600">
        This question type isn't supported yet.
        <BigButton className="mt-3" onClick={goToNext}>
          Skip
        </BigButton>
      </div>
    );
  }

  return (
    <div className="relative mx-auto flex max-w-md flex-col items-center gap-4 text-center">
      <p className="text-sm font-semibold text-slate-700">
        {index + 1} / {questions.length}
      </p>

      <div className="w-full rounded-3xl bg-white/95 px-5 py-5 shadow-md">
        <p className="font-display text-lg font-bold text-slate-900">{pick(question.prompt, language)}</p>
      </div>

      <div className="flex w-full flex-col gap-3">
        {question.options.map((option, i) => {
          const isCorrectOption = i === question.correctIndex;
          const isRevealedCorrect = feedback === 'wrong-reveal' && isCorrectOption;
          const isWrongTap = wrongIndex === i && feedback !== 'idle' && feedback !== 'correct';

          return (
            <motion.button
              key={i}
              onClick={() => choose(i)}
              disabled={feedback === 'correct' || feedback === 'wrong-reveal'}
              animate={isWrongTap && feedback === 'wrong-retry' ? { x: [0, -8, 8, -6, 6, 0] } : undefined}
              transition={{ duration: 0.4 }}
              className={`min-h-14 rounded-2xl px-5 py-3 text-left font-display font-semibold shadow-sm transition-colors ${
                feedback === 'correct' && isCorrectOption
                  ? 'bg-ok text-white'
                  : isRevealedCorrect
                    ? 'bg-ok text-white'
                    : isWrongTap
                      ? 'bg-almost/80 text-slate-900'
                      : 'bg-white text-slate-800'
              }`}
            >
              {pick(option, language)}
            </motion.button>
          );
        })}
      </div>

      {feedback === 'wrong-retry' && (
        <p className="rounded-xl bg-amber-50 px-4 py-2 text-amber-800">
          {language === 'hi' ? 'लगभग सही! फिर से देखो 👀' : "Almost! Let's look again 👀"}
        </p>
      )}

      {feedback === 'wrong-reveal' && (
        <div className="flex flex-col items-center gap-2">
          <p className="rounded-xl bg-sky-50 px-4 py-2 text-slate-700">{pick(question.hints.strongerClue, language)}</p>
          <BigButton onClick={goToNext}>{pick(STRINGS.continueButton, language)}</BigButton>
        </div>
      )}

      {(feedback === 'idle' || feedback === 'wrong-retry') && (
        <HintButton
          key={`${question.id}-hint`}
          hints={question.hints}
          language={language}
          onHintUsed={() => setHintsUsedTotal((n) => n + 1)}
        />
      )}

      <StarBurst show={showStarBurst} />
    </div>
  );
}
