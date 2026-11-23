import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { LocalizedText } from '../content/types';
import { useProgressStore } from '../store/progressStore';
import { pick } from '../i18n';
import { STRINGS } from '../i18n/strings';
import { VeerMascot } from './VeerMascot';
import { ReadAloudButton } from './ReadAloudButton';
import { BigButton } from './BigButton';

interface StoryPlayerProps {
  panels: LocalizedText[];
  onFinished: () => void;
}

// "Learn" step: a short animated story told by Veer, 3–5 panels, read-aloud
// on every panel, big Next/Back targets — no panel longer than ~2 sentences.
export function StoryPlayer({ panels, onFinished }: StoryPlayerProps) {
  const language = useProgressStore((s) => s.settings.language);
  const [index, setIndex] = useState(0);
  const panel = panels[index];
  const isLast = index === panels.length - 1;

  const next = () => {
    if (isLast) onFinished();
    else setIndex((i) => i + 1);
  };
  const back = () => setIndex((i) => Math.max(0, i - 1));

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-5 text-center">
      <VeerMascot expression="happy" size={110} />

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.25 }}
          className="flex w-full items-center justify-between gap-3 rounded-3xl bg-white/95 px-5 py-5 shadow-md"
        >
          <p className="text-left font-display text-lg font-semibold text-slate-800">{pick(panel, language)}</p>
          <ReadAloudButton text={pick(panel, language)} />
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center gap-2">
        {panels.map((_, i) => (
          <span
            key={i}
            className={`h-2 w-2 rounded-full ${i === index ? 'bg-saffron' : 'bg-white/60'}`}
            aria-hidden="true"
          />
        ))}
      </div>

      <div className="flex w-full justify-between gap-3">
        <BigButton variant="ghost" onClick={back} className={index === 0 ? 'invisible' : ''}>
          ← {pick(STRINGS.back, language)}
        </BigButton>
        <BigButton onClick={next}>{isLast ? pick(STRINGS.continueButton, language) : pick(STRINGS.next, language)}</BigButton>
      </div>
    </div>
  );
}
