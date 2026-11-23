import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HardpointDiagram, type HardpointItemId } from '../diagrams/HardpointDiagram';
import { getGlossaryTerm } from '../../content/glossary';
import { useProgressStore } from '../../store/progressStore';
import { pick } from '../../i18n';
import { STRINGS } from '../../i18n/strings';
import { ReadAloudButton } from '../ReadAloudButton';
import { BigButton } from '../BigButton';
import { soundManager } from '../../lib/sound';

const MIN_ITEMS_TO_CONTINUE = 2;

interface HardpointsExploreProps {
  onContinue: () => void;
}

// "Explore" step for the hardpoints lesson: what a jet can carry under its
// wings, named factually and never shown in use (brief §12 tone rule).
export function HardpointsExplore({ onContinue }: HardpointsExploreProps) {
  const language = useProgressStore((s) => s.settings.language);
  const sfxEnabled = useProgressStore((s) => s.settings.sfx);
  const [visited, setVisited] = useState<HardpointItemId[]>([]);
  const [selected, setSelected] = useState<HardpointItemId | null>(null);

  useEffect(() => {
    soundManager.unlock();
    soundManager.play('radarPing', { sfxEnabled });
  }, [sfxEnabled]);

  const handleTap = (itemId: HardpointItemId) => {
    soundManager.unlock();
    soundManager.play('tap', { sfxEnabled });
    setSelected(itemId);
    setVisited((prev) => (prev.includes(itemId) ? prev : [...prev, itemId]));
  };

  const term = selected ? getGlossaryTerm(selected) : undefined;
  const canContinue = visited.length >= MIN_ITEMS_TO_CONTINUE;

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <p className="rounded-2xl bg-white/85 px-5 py-2 text-slate-700">
        {language === 'hi'
          ? 'पंख के नीचे की चीज़ों को छूकर देखो!'
          : 'Tap what the jet carries under its wing!'}
      </p>

      <HardpointDiagram visitedItemIds={visited} onItemTap={handleTap} size={300} />

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
            ? `आगे बढ़ने के लिए कम से कम ${MIN_ITEMS_TO_CONTINUE} चीज़ें छुओ।`
            : `Tap at least ${MIN_ITEMS_TO_CONTINUE} things to continue.`}
        </p>
      )}

      <BigButton disabled={!canContinue} onClick={onContinue} className={!canContinue ? 'opacity-50' : ''}>
        {pick(STRINGS.continueButton, language)}
      </BigButton>
    </div>
  );
}
