import { useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Rank } from '../content/types';
import { useProgressStore } from '../store/progressStore';
import { pick } from '../i18n';
import { STRINGS } from '../i18n/strings';
import { VeerMascot } from './VeerMascot';
import { BigButton } from './BigButton';
import { soundManager } from '../lib/sound';

interface WingsCeremonyProps {
  newRank: Rank;
  onDone: () => void;
}

// Every rank-up gets a little fanfare — the new rank badge is "pinned" on, with a
// fanfare sound and a one-line explanation of what that rank does (brief §6).
export function WingsCeremony({ newRank, onDone }: WingsCeremonyProps) {
  const language = useProgressStore((s) => s.settings.language);
  const sfxEnabled = useProgressStore((s) => s.settings.sfx);
  const calmMode = useProgressStore((s) => s.settings.calmMode);

  useEffect(() => {
    soundManager.unlock();
    soundManager.play('levelUp', { sfxEnabled });
  }, [sfxEnabled]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 180, damping: 14 }}
        className="flex max-w-sm flex-col items-center gap-4 rounded-3xl bg-white px-6 py-8 text-center shadow-2xl"
      >
        <VeerMascot expression="proud" size={120} calmMode={calmMode} />
        <p className="font-display text-xl font-bold text-saffron">{pick(STRINGS.newRankTitle, language)}</p>
        <p className="font-display text-2xl font-extrabold text-slate-900">🪽 {pick(newRank.name, language)}</p>
        <p className="text-slate-600">{pick(newRank.blurb, language)}</p>
        <BigButton onClick={onDone}>{pick(STRINGS.continueButton, language)}</BigButton>
      </motion.div>
    </motion.div>
  );
}
