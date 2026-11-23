import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { QuestionHint, Language } from '../content/types';
import { pick } from '../i18n';
import { useProgressStore } from '../store/progressStore';
import { soundManager } from '../lib/sound';

interface HintButtonProps {
  hints: QuestionHint;
  language: Language;
  onHintUsed: () => void;
}

// Tiered hint system: hidden by default, tap once for a nudge, tap again for
// a stronger clue. Never reveals the answer outright. Using a hint is tracked
// by the caller (via onHintUsed) so the lesson awards 2 stars instead of 3.
export function HintButton({ hints, language, onHintUsed }: HintButtonProps) {
  const sfxEnabled = useProgressStore((s) => s.settings.sfx);
  const [tier, setTier] = useState<0 | 1 | 2>(0);

  const reveal = () => {
    if (tier >= 2) return;
    soundManager.unlock();
    soundManager.play('cockpitBeep', { sfxEnabled });
    onHintUsed();
    setTier((t) => (t === 0 ? 1 : 2));
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        onClick={reveal}
        disabled={tier >= 2}
        className="min-h-14 rounded-2xl bg-yellow-100 px-4 py-2 font-display text-base font-semibold text-yellow-800 active:scale-95 disabled:opacity-60"
      >
        💡 Ask Veer for a hint
      </button>
      <AnimatePresence>
        {tier >= 1 && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl bg-yellow-50 px-4 py-2 text-base text-yellow-900"
          >
            {pick(hints.nudge, language)}
          </motion.p>
        )}
        {tier === 2 && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl bg-yellow-50 px-4 py-2 text-base text-yellow-900"
          >
            {pick(hints.strongerClue, language)}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
