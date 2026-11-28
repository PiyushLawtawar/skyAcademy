import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { STAGES } from '../content/stages';
import { RANKS } from '../content/ranks';
import { CALL_SIGNS } from '../content/callsigns';
import { HISTORY } from '../content/history';
import { CONCEPTS } from '../content/concepts';
import { MISSIONS } from '../content/missions';
import { SKY_FACTS } from '../content/skyFacts';
import { useProgressStore } from '../store/progressStore';
import { pick } from '../i18n';
import { STRINGS } from '../i18n/strings';
import { VeerMascot } from '../components/VeerMascot';
import { ReadAloudButton } from '../components/ReadAloudButton';
import { AircraftImg } from '../components/art/AircraftImg';
import { soundManager } from '../lib/sound';

interface Zone {
  id: string;
  path: string;
  emoji: string;
  title: string;
  blurb: string;
  gradient: string;
  progress?: string;
  big?: boolean;
}

export function WorldMap() {
  const navigate = useNavigate();
  const language = useProgressStore((s) => s.settings.language);
  const unlockedStageIds = useProgressStore((s) => s.unlockedStageIds);
  const totalStars = useProgressStore((s) => s.totalStars());
  const rankIndex = useProgressStore((s) => s.rankIndex());
  const sfxEnabled = useProgressStore((s) => s.settings.sfx);
  const callSignId = useProgressStore((s) => s.callSignId);
  const streak = useProgressStore((s) => s.streakCount);
  const results = useProgressStore((s) => s.lessonResults);
  const explored = useProgressStore((s) => s.exploredIds);
  const rank = RANKS[rankIndex];
  const nextRank = RANKS[rankIndex + 1];
  const callSign = CALL_SIGNS.find((c) => c.id === callSignId);

  const count = (prefix: string) => Object.keys(results).filter((k) => k.startsWith(prefix)).length;
  const [dailyFact] = useState(() => SKY_FACTS[Math.floor(Date.now() / 86400000) % SKY_FACTS.length]);

  const zones: Zone[] = [
    { id: 'sortie', path: '/sortie', emoji: '🕹️', title: 'Fly a Sortie', blurb: 'Scramble! Take the controls of a fighter jet.', gradient: 'from-sky-500 via-blue-600 to-indigo-700', progress: results['sortie:training'] ? '⭐'.repeat(results['sortie:training'].stars) : 'New!', big: true },
    { id: 'hangar-3d', path: '/hangar-3d', emoji: '🛩️', title: '3D Hangar', blurb: 'Spin a jet in 3D. Tap any part to zoom in!', gradient: 'from-cyan-600 via-sky-800 to-slate-900', progress: `${explored.filter((e) => e.startsWith('part:')).length} parts explored`, big: true },
    { id: 'armoury', path: '/armoury', emoji: '🚀', title: 'The Armoury', blurb: 'Missiles & weapons of every fighter jet', gradient: 'from-slate-700 via-slate-800 to-slate-950', progress: `${explored.filter((e) => e.startsWith('weapon:')).length} studied` },
    { id: 'war-room', path: '/war-room', emoji: '🎖️', title: 'The War Room', blurb: 'IAF in India\'s wars: 1947 → today', gradient: 'from-rose-600 via-red-700 to-orange-700', progress: `${count('history:')}/${HISTORY.length}` },
    { id: 'flight-school', path: '/flight-school', emoji: '🎓', title: 'Flight School', blurb: 'From lift & Mach to air strategy', gradient: 'from-violet-500 via-purple-600 to-indigo-700', progress: `${count('concept:')}/${CONCEPTS.length}` },
    { id: 'mission-planner', path: '/mission-planner', emoji: '🗺️', title: 'Mission Planner', blurb: 'Be the commander. Pick the team!', gradient: 'from-emerald-500 via-teal-600 to-cyan-700', progress: `${count('mission:')}/${MISSIONS.length}` },
    { id: 'hangar-of-fame', path: '/stage/hangar-of-fame', emoji: '🏆', title: 'Hangar of Fame', blurb: 'Collect cards of India\'s aircraft', gradient: 'from-amber-400 via-orange-500 to-rose-500' },
    { id: 'join', path: '/join-iaf', emoji: '🇮🇳', title: 'Join the IAF', blurb: 'Your path from school to the cockpit', gradient: 'from-orange-500 via-amber-500 to-green-600', big: true },
  ];

  const go = (path: string) => {
    soundManager.unlock();
    soundManager.play('enginePing', { sfxEnabled });
    navigate(path);
  };

  const rankProgress = nextRank ? Math.min(100, ((totalStars - rank.starsRequired) / (nextRank.starsRequired - rank.starsRequired)) * 100) : 100;

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 pb-32 pt-5">
      {/* Cockpit-style header */}
      <header className="hud-panel flex flex-wrap items-center gap-3 rounded-3xl p-3 text-white">
        <VeerMascot expression="happy" size={62} />
        <div className="min-w-0 flex-1 basis-[55%]">
          <p className="hud-text text-xs font-bold uppercase tracking-widest">Call sign</p>
          <p className="truncate font-display text-xl font-extrabold">
            {callSign?.emoji} {callSign ? pick(callSign.label, language) : 'Cadet'}
          </p>
          <div className="mt-1 flex items-center gap-2">
            <span className="rounded-full bg-saffron px-2 py-0.5 font-display text-xs font-bold">🎖️ {pick(rank.name, language)}</span>
            {nextRank && (
              <div className="h-2 w-24 overflow-hidden rounded-full bg-white/20" title={`Next: ${pick(nextRank.name, language)}`}>
                <div className="h-full bg-amber-300" style={{ width: `${rankProgress}%` }} />
              </div>
            )}
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="rounded-2xl bg-white/10 px-3 py-2 text-center font-display font-bold">
            ⭐ {totalStars}
          </span>
          <span className="rounded-2xl bg-white/10 px-3 py-2 text-center font-display font-bold">🔥 {streak}</span>
          <button aria-label="Settings" onClick={() => navigate('/settings')} className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-2xl">
            ⚙️
          </button>
          <button aria-label="Parent Corner" onClick={() => navigate('/parent-corner')} className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-2xl">
            👪
          </button>
        </div>
      </header>

      {/* Briefing */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-sky-50 to-orange-50 p-5 shadow-xl">
        <motion.div className="pointer-events-none absolute -right-10 top-6 opacity-90" animate={{ x: [0, -30, 0], y: [0, -6, 0] }} transition={{ duration: 6, repeat: Infinity }}>
          <AircraftImg kind="su30" width={230} burner />
        </motion.div>
        <p className="font-display text-sm font-extrabold uppercase tracking-widest text-saffron">📋 Morning briefing</p>
        <h1 className="mt-1 max-w-[70%] font-display text-3xl font-black leading-tight text-slate-900 sm:text-4xl">Welcome to the Air Base, pilot!</h1>
        <div className="mt-3 flex max-w-2xl items-start gap-3 rounded-2xl bg-white/90 p-3 shadow-sm">
          <span className="text-2xl">💡</span>
          <p className="flex-1 font-semibold text-slate-700">
            <span className="text-saffron">Fact of the day:</span> {dailyFact.text}
          </p>
          <ReadAloudButton text={dailyFact.text} />
        </div>
      </motion.section>

      {/* Command centre */}
      <section>
        <h2 className="mb-3 inline-block rounded-2xl bg-white/90 px-4 py-2 font-display text-2xl font-extrabold text-slate-900 shadow">✈️ IAF Command Centre</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {zones.map((z, i) => (
            <motion.button
              key={z.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.08 * i, type: 'spring', damping: 16 }}
              whileHover={{ y: -6 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => go(z.path)}
              className={`relative flex min-h-44 flex-col items-start overflow-hidden rounded-3xl bg-gradient-to-br ${z.gradient} p-4 text-left text-white shadow-xl ${z.big ? 'col-span-2 md:col-span-1' : ''}`}
            >
              <div className="anim-shimmer pointer-events-none absolute inset-0" />
              <span className="absolute -bottom-6 -right-4 text-[110px] leading-none opacity-20" aria-hidden>
                {z.emoji}
              </span>
              <span className="anim-float text-5xl" style={{ animationDelay: `${i * 0.4}s` }}>
                {z.emoji}
              </span>
              <span className="mt-2 font-display text-xl font-extrabold leading-tight drop-shadow">{z.title}</span>
              <span className="text-sm font-semibold opacity-90">{z.blurb}</span>
              {z.progress && <span className="mt-auto rounded-full bg-black/25 px-3 py-1 pt-1 text-xs font-bold">{z.progress}</span>}
            </motion.button>
          ))}
        </div>
      </section>

      {/* Academy islands */}
      <section>
        <h2 className="mb-3 inline-block rounded-2xl bg-white/90 px-4 py-2 font-display text-2xl font-extrabold text-slate-900 shadow">🏝️ {pick(STRINGS.worldMapTitle, language)}</h2>
        <div className="relative">
          <svg className="pointer-events-none absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100" aria-hidden>
            <path d="M10 10 C 40 0, 60 30, 90 18 S 60 60, 30 50 S 20 90, 85 92" fill="none" stroke="white" strokeWidth="0.8" strokeDasharray="2 2" className="anim-dash" opacity="0.8" />
          </svg>
          <div className="relative grid grid-cols-2 gap-5 sm:grid-cols-3">
            {STAGES.filter((s) => s.id !== 'hangar-of-fame').map((stage, i) => {
              const unlocked = unlockedStageIds.includes(stage.id);
              return (
                <motion.button
                  key={stage.id}
                  whileTap={unlocked ? { scale: 0.95 } : undefined}
                  disabled={!unlocked}
                  onClick={() => go(`/stage/${stage.id}`)}
                  className="group flex flex-col items-center"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4 + (i % 3), repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
                >
                  <span className={`relative flex h-24 w-full max-w-44 flex-col items-center justify-center rounded-[40%] shadow-xl ${unlocked ? 'bg-gradient-to-b from-emerald-300 to-emerald-600' : 'bg-gradient-to-b from-slate-300 to-slate-500 opacity-70'}`}>
                    <span className="text-4xl">{unlocked ? stage.islandEmoji : '🔒'}</span>
                    <span className="absolute -bottom-3 h-6 w-3/4 rounded-b-full bg-amber-800/60" />
                  </span>
                  <span className="mt-4 rounded-full bg-white/90 px-3 py-1 text-center font-display text-sm font-bold text-slate-800 shadow">{pick(stage.name, language)}</span>
                  {!unlocked && <span className="mt-1 rounded-full bg-black/30 px-2 text-xs text-white">{pick(STRINGS.comingSoon, language)}</span>}
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
