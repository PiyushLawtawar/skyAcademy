import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import type { Aircraft } from '../content/types';
import { useProgressStore } from '../store/progressStore';
import { pick } from '../i18n';
import { AircraftSilhouette } from './diagrams/AircraftSilhouette';
import { VeerMascot } from './VeerMascot';
import { soundManager } from '../lib/sound';

interface SilhouetteGameProps {
  target: Aircraft;
  allAircraft: Aircraft[];
  onUnlocked: () => void;
  onClose: () => void;
}

function shuffled<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// "Spot the Shape": the gate that unlocks an Aircraft Card (brief §7). Shows
// the silhouette only (no color hints, no name) and asks the child to pick
// the matching name — a wrong guess is a safe retry, never a dead end.
export function SilhouetteGame({ target, allAircraft, onUnlocked, onClose }: SilhouetteGameProps) {
  const language = useProgressStore((s) => s.settings.language);
  const sfxEnabled = useProgressStore((s) => s.settings.sfx);
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [solved, setSolved] = useState(false);

  const options = useMemo(() => {
    const distractors = shuffled(allAircraft.filter((a) => a.id !== target.id)).slice(0, 3);
    return shuffled([target, ...distractors]);
  }, [target, allAircraft]);

  const choose = (aircraftId: string) => {
    soundManager.unlock();
    if (aircraftId === target.id) {
      soundManager.play('correct', { sfxEnabled });
      setSolved(true);
      setTimeout(onUnlocked, 1000);
    } else {
      soundManager.play('almost', { sfxEnabled });
      setWrongId(aircraftId);
      setTimeout(() => setWrongId(null), 500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4">
      <div className="flex w-full max-w-sm flex-col items-center gap-4 rounded-3xl bg-white px-6 py-6 text-center shadow-2xl">
        {!solved ? (
          <>
            <VeerMascot expression="thinking" size={70} />
            <p className="font-display font-bold text-slate-800">
              {language === 'hi' ? 'इस आकार को पहचानो! यह कौन सा विमान है?' : 'Spot the shape! Which aircraft is this?'}
            </p>
            {target.photo ? (
              <img
                src={target.photo.src}
                alt=""
                className="h-40 w-full rounded-2xl object-cover blur-sm grayscale"
              />
            ) : (
              <AircraftSilhouette spec={target.silhouette} size={180} silhouetteMode />
            )}
            <div className="grid w-full grid-cols-2 gap-2">
              {options.map((opt) => (
                <motion.button
                  key={opt.id}
                  onClick={() => choose(opt.id)}
                  animate={wrongId === opt.id ? { x: [0, -6, 6, -4, 4, 0] } : undefined}
                  className="min-h-14 rounded-2xl bg-slate-100 px-3 py-2 font-display text-sm font-semibold text-slate-800"
                >
                  {pick(opt.name, language)}
                </motion.button>
              ))}
            </div>
            <button onClick={onClose} className="text-sm text-slate-500 underline">
              {language === 'hi' ? 'बाद में' : 'Maybe later'}
            </button>
          </>
        ) : (
          <>
            <VeerMascot expression="proud" size={90} />
            <p className="font-display text-lg font-bold text-slate-900">
              {language === 'hi' ? 'शानदार! कार्ड अनलॉक हुआ! 🎉' : 'Awesome! Card unlocked! 🎉'}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
