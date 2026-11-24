import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Aircraft } from '../content/types';
import { useProgressStore } from '../store/progressStore';
import { pick } from '../i18n';
import { AircraftSilhouette } from './diagrams/AircraftSilhouette';
import { soundManager } from '../lib/sound';

interface AircraftCardProps {
  aircraft: Aircraft;
  unlocked: boolean;
  onTapLocked: () => void;
  onOpenDetail: () => void;
}

const ROLE_EMOJI: Record<Aircraft['role'], string> = {
  fighter: '✈️',
  transport: '📦',
  helicopter: '🚁',
  trainer: '🎓',
  awacs: '📡',
  tanker: '⛽',
};

// A trading-card-style flip: front shows the silhouette (locked cards stay
// grey with a lock, per brief §4's "Spot the Shape" unlock gate), back shows
// quick stats and one fun fact, with a button through to the full detail
// page (brief §6's collectible Aircraft Cards).
export function AircraftCard({ aircraft, unlocked, onTapLocked, onOpenDetail }: AircraftCardProps) {
  const language = useProgressStore((s) => s.settings.language);
  const sfxEnabled = useProgressStore((s) => s.settings.sfx);
  const [flipped, setFlipped] = useState(false);

  const handleTap = () => {
    soundManager.unlock();
    if (!unlocked) {
      soundManager.play('tap', { sfxEnabled });
      onTapLocked();
      return;
    }
    soundManager.play('tap', { sfxEnabled });
    setFlipped((f) => !f);
  };

  const firstVerifiedFact = aircraft.facts.find((f) => f.verified);

  return (
    <div className="relative h-56 w-full" style={{ perspective: 800 }}>
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Front */}
        <button
          type="button"
          onClick={handleTap}
          className="absolute inset-0 flex flex-col overflow-hidden rounded-3xl bg-slate-200 shadow-md"
          style={{ backfaceVisibility: 'hidden' }}
          aria-label={unlocked ? pick(aircraft.name, language) : 'Locked aircraft, tap to play Spot the Shape'}
        >
          {aircraft.photo ? (
            <div className="relative flex-1">
              <img
                src={aircraft.photo.src}
                alt=""
                className={`h-full w-full object-cover ${unlocked ? '' : 'scale-105 blur-[3px] grayscale contrast-125 brightness-90'}`}
                loading="lazy"
              />
              {!unlocked && <div className="absolute inset-0 flex items-center justify-center bg-slate-900/30 text-4xl">🔒</div>}
              {unlocked && (
                <p className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/80 to-transparent px-2 py-2 text-left font-display text-sm font-bold text-white">
                  {pick(aircraft.name, language)}
                </p>
              )}
            </div>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 p-3">
              <AircraftSilhouette spec={aircraft.silhouette} size={150} silhouetteMode={!unlocked} />
              {unlocked ? (
                <p className="font-display text-sm font-bold text-slate-900">{pick(aircraft.name, language)}</p>
              ) : (
                <p className="text-2xl">🔒</p>
              )}
            </div>
          )}
        </button>

        {/* Back */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-3xl bg-white/95 p-4 text-center shadow-md"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <p className="font-display text-sm font-bold text-slate-900">
            {ROLE_EMOJI[aircraft.role]} {pick(aircraft.name, language)}
          </p>
          {aircraft.madeInIndia && (
            <p className="rounded-full bg-india-green/10 px-3 py-1 text-xs font-semibold text-india-green">
              🇮🇳 {language === 'hi' ? 'मेड इन इंडिया' : 'Made in India'}
            </p>
          )}
          {firstVerifiedFact && <p className="text-xs text-slate-600">{pick(firstVerifiedFact.text, language)}</p>}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetail();
            }}
            className="min-h-10 rounded-xl bg-sky-day px-3 py-1 text-xs font-semibold text-white"
          >
            {language === 'hi' ? 'पूरी जानकारी' : 'Full details'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
