import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllAircraftSorted } from '../content/aircraft';
import { useProgressStore } from '../store/progressStore';
import { pick } from '../i18n';
import { STRINGS } from '../i18n/strings';
import { getStage } from '../content/stages';
import { AircraftCard } from '../components/AircraftCard';
import { SilhouetteGame } from '../components/SilhouetteGame';
import { ScreenHeading } from '../components/ScreenHeading';
import { BigButton } from '../components/BigButton';

const STAGE_ID = 'hangar-of-fame';

// Stage 4 (brief §7): a collectible gallery instead of the Learn/Explore/
// Play/Check lesson loop — each aircraft unlocks via a "Spot the Shape" game
// rather than a quiz, then opens into a full detail page.
export function AircraftGallery() {
  const navigate = useNavigate();
  const language = useProgressStore((s) => s.settings.language);
  const cardIds = useProgressStore((s) => s.cardIds);
  const collectCard = useProgressStore((s) => s.collectCard);
  const aircraft = getAllAircraftSorted();
  const stage = getStage(STAGE_ID);
  const [gameTargetId, setGameTargetId] = useState<string | null>(null);

  const unlockedCount = aircraft.filter((a) => cardIds.includes(a.id)).length;
  const gameTarget = gameTargetId ? aircraft.find((a) => a.id === gameTargetId) : undefined;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8">
      <button
        onClick={() => navigate('/map')}
        className="self-start rounded-full bg-white/80 px-4 py-2 font-display font-semibold text-slate-700"
      >
        ← {pick(STRINGS.back, language)}
      </button>

      <ScreenHeading>
        {stage?.islandEmoji} {pick(stage?.name ?? { en: "India's Hangar of Fame", hi: 'भारत का गौरव हैंगर' }, language)}
      </ScreenHeading>

      <p className="rounded-2xl bg-white/80 px-5 py-3 text-slate-700">
        {language === 'hi'
          ? `${unlockedCount} / ${aircraft.length} विमान कार्ड इकट्ठा हुए`
          : `${unlockedCount} / ${aircraft.length} aircraft cards collected`}
      </p>

      {unlockedCount >= 2 && (
        <BigButton variant="secondary" onClick={() => navigate(`/stage/${STAGE_ID}/compare`)} className="self-center">
          ⚖️ {language === 'hi' ? 'तुलना करें' : 'Compare'}
        </BigButton>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {aircraft.map((a) => (
          <AircraftCard
            key={a.id}
            aircraft={a}
            unlocked={cardIds.includes(a.id)}
            onTapLocked={() => setGameTargetId(a.id)}
            onOpenDetail={() => navigate(`/stage/${STAGE_ID}/aircraft/${a.id}`)}
          />
        ))}
      </div>

      {gameTarget && (
        <SilhouetteGame
          target={gameTarget}
          allAircraft={aircraft}
          onClose={() => setGameTargetId(null)}
          onUnlocked={() => {
            collectCard(gameTarget.id);
            setGameTargetId(null);
          }}
        />
      )}
    </div>
  );
}
