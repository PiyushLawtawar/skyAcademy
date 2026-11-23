import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { SimplePlaneDiagram, PLANE_PART_IDS, type PlanePartId } from '../diagrams/SimplePlaneDiagram';
import { useProgressStore } from '../../store/progressStore';
import { speak } from '../../lib/readAloud';
import { soundManager } from '../../lib/sound';
import { pick } from '../../i18n';
import { STRINGS } from '../../i18n/strings';
import { VeerMascot } from '../VeerMascot';
import { BigButton } from '../BigButton';

const PART_CALLOUTS: Record<PlanePartId, { en: string; hi: string }> = {
  fuselage: { en: 'Tap the fuselage!', hi: 'फ्यूज़लाज को छुओ!' },
  cockpit: { en: 'Tap the cockpit!', hi: 'कॉकपिट को छुओ!' },
  wings: { en: 'Tap the wings!', hi: 'पंखों को छुओ!' },
  tail: { en: 'Tap the tail!', hi: 'पूँछ को छुओ!' },
};

function shuffled<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

interface TapThePartGameProps {
  onComplete: () => void;
}

// The "Play" step — a short, fun mini-game that uses what the child just
// discovered in Explore. Never punishing: a wrong tap just asks again.
export function TapThePartGame({ onComplete }: TapThePartGameProps) {
  const language = useProgressStore((s) => s.settings.language);
  const sfxEnabled = useProgressStore((s) => s.settings.sfx);
  const readAloudEnabled = useProgressStore((s) => s.settings.readAloud);
  const order = useMemo(() => shuffled(PLANE_PART_IDS), []);
  const [roundIndex, setRoundIndex] = useState(0);
  const [flash, setFlash] = useState<{ partId: PlanePartId; kind: 'correct' | 'almost' } | null>(null);
  const [done, setDone] = useState(false);

  const currentTarget = order[roundIndex];

  useEffect(() => {
    soundManager.setAmbientWind(true, { sfxEnabled });
    return () => soundManager.setAmbientWind(false, { sfxEnabled });
  }, [sfxEnabled]);

  useEffect(() => {
    if (done || !currentTarget) return;
    if (readAloudEnabled) speak(PART_CALLOUTS[currentTarget][language], language);
  }, [currentTarget, roundIndex, language, readAloudEnabled, done]);

  const handleTap = (partId: PlanePartId) => {
    soundManager.unlock();
    if (partId === currentTarget) {
      soundManager.play('starCollect', { sfxEnabled });
      setFlash({ partId, kind: 'correct' });
      setTimeout(() => {
        setFlash(null);
        if (roundIndex + 1 >= order.length) {
          soundManager.setAmbientWind(false, { sfxEnabled });
          soundManager.play('jetFlyPast', { sfxEnabled });
          setDone(true);
        } else {
          setRoundIndex((i) => i + 1);
        }
      }, 500);
    } else {
      soundManager.play('almost', { sfxEnabled });
      setFlash({ partId, kind: 'almost' });
      setTimeout(() => setFlash(null), 400);
    }
  };

  if (done) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <VeerMascot expression="proud" size={110} />
        <p className="rounded-2xl bg-white/90 px-5 py-3 font-display text-lg font-semibold text-slate-800">
          {language === 'hi' ? 'शानदार! तुमने सारे हिस्से ढूंढ लिए! 🎉' : 'Awesome! You found every part! 🎉'}
        </p>
        <BigButton onClick={onComplete}>{pick(STRINGS.continueButton, language)}</BigButton>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="flex items-center gap-3 rounded-2xl bg-white/90 px-5 py-3">
        <VeerMascot expression="surprised" size={56} calmMode />
        <motion.p
          key={roundIndex}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-lg font-bold text-slate-900"
        >
          {PART_CALLOUTS[currentTarget][language]}
        </motion.p>
      </div>

      <SimplePlaneDiagram
        onPartTap={handleTap}
        flashPartId={flash?.partId ?? null}
        flashKind={flash?.kind ?? null}
        size={300}
      />

      <p className="text-sm text-slate-600">
        {language === 'hi'
          ? `राउंड ${roundIndex + 1} / ${order.length}`
          : `Round ${roundIndex + 1} of ${order.length}`}
      </p>
    </div>
  );
}
