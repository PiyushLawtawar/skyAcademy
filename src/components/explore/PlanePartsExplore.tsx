import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SimplePlaneDiagram, type PlanePartId } from '../diagrams/SimplePlaneDiagram';
import { getGlossaryTerm } from '../../content/glossary';
import { useProgressStore } from '../../store/progressStore';
import { pick } from '../../i18n';
import { STRINGS } from '../../i18n/strings';
import { ReadAloudButton } from '../ReadAloudButton';
import { BigButton } from '../BigButton';
import { soundManager } from '../../lib/sound';

const MIN_PARTS_TO_CONTINUE = 2;

interface PlanePartsExploreProps {
  onContinue: () => void;
}

// "Explore" step: a tappable jet so the child discovers each part themselves
// before the Check quiz names it — intuition before terminology (brief §3).
export function PlanePartsExplore({ onContinue }: PlanePartsExploreProps) {
  const language = useProgressStore((s) => s.settings.language);
  const sfxEnabled = useProgressStore((s) => s.settings.sfx);
  const [visited, setVisited] = useState<PlanePartId[]>([]);
  const [selected, setSelected] = useState<PlanePartId | null>(null);

  useEffect(() => {
    soundManager.unlock();
    soundManager.play('radarPing', { sfxEnabled });
  }, [sfxEnabled]);

  const handleTap = (partId: PlanePartId) => {
    soundManager.unlock();
    soundManager.play('tap', { sfxEnabled });
    setSelected(partId);
    setVisited((prev) => (prev.includes(partId) ? prev : [...prev, partId]));
  };

  const term = selected ? getGlossaryTerm(selected) : undefined;
  const canContinue = visited.length >= MIN_PARTS_TO_CONTINUE;

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <p className="rounded-2xl bg-white/85 px-5 py-2 text-slate-700">
        {language === 'hi' ? 'जहाज़ के किसी भी हिस्से को छूकर देखो!' : 'Tap any part of the jet to find out what it does!'}
      </p>

      <SimplePlaneDiagram visitedPartIds={visited} onPartTap={handleTap} size={300} />

      <AnimatePresence mode="wait">
        {term && (
          <motion.div
            key={term.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex w-full max-w-sm items-center justify-between gap-3 rounded-2xl bg-white/95 px-5 py-4 text-left shadow-md"
          >
            <div>
              <p className="font-display font-bold text-slate-900">{pick(term.term, language)}</p>
              <p className="text-slate-700">{pick(term.kidDefinition, language)}</p>
            </div>
            <ReadAloudButton text={pick(term.kidDefinition, language)} />
          </motion.div>
        )}
      </AnimatePresence>

      {!canContinue && (
        <p className="text-sm text-slate-600">
          {language === 'hi'
            ? `आगे बढ़ने के लिए कम से कम ${MIN_PARTS_TO_CONTINUE} हिस्से छुओ।`
            : `Tap at least ${MIN_PARTS_TO_CONTINUE} parts to continue.`}
        </p>
      )}

      <BigButton disabled={!canContinue} onClick={onContinue} className={!canContinue ? 'opacity-50' : ''}>
        {pick(STRINGS.continueButton, language)}
      </BigButton>
    </div>
  );
}
