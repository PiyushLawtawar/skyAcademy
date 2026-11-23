import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { STAGES } from '../content/stages';
import { RANKS } from '../content/ranks';
import { useProgressStore } from '../store/progressStore';
import { pick } from '../i18n';
import { STRINGS } from '../i18n/strings';
import { VeerMascot } from '../components/VeerMascot';
import { ScreenHeading } from '../components/ScreenHeading';
import { soundManager } from '../lib/sound';

export function WorldMap() {
  const navigate = useNavigate();
  const language = useProgressStore((s) => s.settings.language);
  const unlockedStageIds = useProgressStore((s) => s.unlockedStageIds);
  const totalStars = useProgressStore((s) => s.totalStars());
  const rankIndex = useProgressStore((s) => s.rankIndex());
  const sfxEnabled = useProgressStore((s) => s.settings.sfx);
  const rank = RANKS[rankIndex];

  const goToStage = (stageId: string) => {
    soundManager.unlock();
    soundManager.play('enginePing', { sfxEnabled });
    navigate(`/stage/${stageId}`);
  };

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8">
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <VeerMascot expression="happy" size={64} />
          <div className="rounded-2xl bg-white/90 px-4 py-2 text-left shadow-sm">
            <p className="font-display text-sm font-semibold text-slate-700">{pick(STRINGS.rankLabel, language)}</p>
            <p className="font-display text-lg font-bold text-slate-900">{pick(rank.name, language)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <p className="rounded-full bg-white/80 px-4 py-2 font-display font-semibold text-slate-700">
            ⭐ {totalStars}
          </p>
          <button
            aria-label="Settings"
            onClick={() => navigate('/settings')}
            className="flex min-h-14 min-w-14 items-center justify-center rounded-full bg-white/80 text-2xl"
          >
            ⚙️
          </button>
          <button
            aria-label="Parent Corner"
            onClick={() => navigate('/parent-corner')}
            className="flex min-h-14 min-w-14 items-center justify-center rounded-full bg-white/80 text-2xl"
          >
            👪
          </button>
        </div>
      </header>

      <ScreenHeading>{pick(STRINGS.worldMapTitle, language)}</ScreenHeading>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {STAGES.map((stage) => {
          const unlocked = unlockedStageIds.includes(stage.id);
          return (
            <motion.button
              key={stage.id}
              whileTap={unlocked ? { scale: 0.95 } : undefined}
              disabled={!unlocked}
              onClick={() => goToStage(stage.id)}
              className={`flex min-h-28 flex-col items-center justify-center gap-2 rounded-3xl p-4 shadow-md ${
                unlocked ? 'bg-white/90' : 'bg-white/40 opacity-60'
              }`}
            >
              <span className="text-4xl">{unlocked ? stage.islandEmoji : '🔒'}</span>
              <span className="font-display text-sm font-semibold text-slate-800">{pick(stage.name, language)}</span>
              {!unlocked && (
                <span className="text-xs text-slate-500">{pick(STRINGS.comingSoon, language)}</span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
