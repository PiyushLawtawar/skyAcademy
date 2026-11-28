import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ASSETS, MISSIONS, ROLE_INFO, scoreMission, type MissionAsset, type MissionResult, type MissionScenario } from '../content/missions';
import { WarScene } from '../components/art/WarScene';
import { SayBox, ZoneShell } from '../components/zone/ZoneShell';
import { BigButton } from '../components/BigButton';
import { useProgressStore } from '../store/progressStore';
import { soundManager } from '../lib/sound';

type Phase = 'brief' | 'launch' | 'debrief';

export function MissionPlanner() {
  const lessonResults = useProgressStore((s) => s.lessonResults);
  const [mission, setMission] = useState<MissionScenario | null>(null);

  return (
    <ZoneShell emoji="🗺️" title="Mission Planner" subtitle="You are the commander. Choose the right team!" back="/map">
      {!mission ? (
        <>
          <SayBox text="Every aircraft has a special job, like players in a cricket team. Read the briefing, pick your team within the fuel budget, and launch!" />
          <div className="grid gap-3 sm:grid-cols-2">
            {MISSIONS.map((m, i) => {
              const stars = lessonResults[`mission:${m.id}`]?.stars ?? 0;
              return (
                <motion.button
                  key={m.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setMission(m)}
                  className="glass flex items-center gap-4 rounded-3xl p-4 text-left shadow-md"
                >
                  <span className="text-5xl">{m.emoji}</span>
                  <span className="flex-1">
                    <span className="block text-xs font-bold uppercase tracking-wider text-indigo-600">
                      {m.type} · Level {i + 1}
                    </span>
                    <span className="block font-display text-lg font-bold text-slate-900">{m.title}</span>
                    <span className="text-sm">{stars ? '⭐'.repeat(stars) : '☆☆☆'}</span>
                  </span>
                </motion.button>
              );
            })}
          </div>
        </>
      ) : (
        <MissionRun key={mission.id} mission={mission} onExit={() => setMission(null)} />
      )}
    </ZoneShell>
  );
}

function MissionRun({ mission, onExit }: { mission: MissionScenario; onExit: () => void }) {
  const sfx = useProgressStore((s) => s.settings.sfx);
  const recordLessonResult = useProgressStore((s) => s.recordLessonResult);
  const [picked, setPicked] = useState<MissionAsset[]>([]);
  const [phase, setPhase] = useState<Phase>('brief');
  const [result, setResult] = useState<MissionResult | null>(null);
  const cost = picked.reduce((s, a) => s + a.cost, 0);

  const toggle = (a: MissionAsset) => {
    soundManager.unlock();
    soundManager.play('cockpitBeep', { sfxEnabled: sfx });
    setPicked((p) => (p.some((x) => x.id === a.id) ? p.filter((x) => x.id !== a.id) : [...p, a]));
  };

  const launch = () => {
    soundManager.unlock();
    soundManager.play('engineStartup', { sfxEnabled: sfx });
    const r = scoreMission(mission, picked);
    setResult(r);
    setPhase('launch');
    setTimeout(() => {
      soundManager.play(r.stars === 3 ? 'levelUp' : 'starCollect', { sfxEnabled: sfx });
      recordLessonResult(`mission:${mission.id}`, { stars: r.stars, hintsUsed: 0 });
      setPhase('debrief');
    }, 3200);
  };

  const retry = () => {
    setPicked([]);
    setResult(null);
    setPhase('brief');
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="hud-panel rounded-3xl p-4 text-white">
        <p className="hud-text text-xs font-bold uppercase tracking-widest">📋 Briefing · {mission.type}</p>
        <h2 className="font-display text-2xl font-extrabold">
          {mission.emoji} {mission.title}
        </h2>
        <p className="mt-1 text-slate-200">{mission.brief}</p>
      </div>

      <AnimatePresence mode="wait">
        {phase === 'brief' && (
          <motion.div key="brief" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-4">
            <div className="glass sticky top-2 z-20 flex items-center gap-3 rounded-2xl p-3 shadow">
              <span className="font-display font-bold text-slate-700">⛽ Fuel budget</span>
              <div className="h-4 flex-1 overflow-hidden rounded-full bg-slate-200">
                <motion.div
                  className={`h-full ${cost > mission.budget ? 'bg-rose-500' : 'bg-emerald-500'}`}
                  animate={{ width: `${Math.min(100, (cost / mission.budget) * 100)}%` }}
                />
              </div>
              <span className={`font-display font-black ${cost > mission.budget ? 'text-rose-600' : 'text-slate-800'}`}>
                {cost}/{mission.budget}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {ASSETS.map((a) => {
                const on = picked.some((x) => x.id === a.id);
                return (
                  <motion.button
                    key={a.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggle(a)}
                    aria-pressed={on}
                    className={`relative flex min-h-32 flex-col items-start gap-1 rounded-3xl border-4 p-3 text-left shadow transition ${
                      on ? 'border-saffron bg-orange-50' : 'border-transparent bg-white/95'
                    }`}
                  >
                    <span className="text-3xl">{a.emoji}</span>
                    <span className="font-display font-bold leading-tight text-slate-900">{a.aircraft}</span>
                    <span className="text-xs text-slate-500">{ROLE_INFO[a.role].label}</span>
                    <span className="mt-auto rounded-full bg-slate-100 px-2 text-xs font-bold text-slate-700">⛽ {a.cost}</span>
                    {on && <span className="absolute right-2 top-2 text-xl">✅</span>}
                  </motion.button>
                );
              })}
            </div>
            <div className="flex justify-between gap-3">
              <BigButton variant="ghost" onClick={onExit}>
                ← Missions
              </BigButton>
              <BigButton onClick={launch} disabled={picked.length === 0} className={picked.length === 0 ? 'opacity-50' : ''}>
                🚀 Launch mission
              </BigButton>
            </div>
          </motion.div>
        )}

        {phase === 'launch' && (
          <motion.div key="launch" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative">
            <WarScene kind={mission.scene} height={280} />
            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
              {picked.map((a, i) => (
                <motion.span
                  key={a.id}
                  className="absolute text-4xl"
                  style={{ top: `${15 + ((i * 17) % 60)}%` }}
                  initial={{ left: '-10%' }}
                  animate={{ left: '110%' }}
                  transition={{ duration: 2.6, delay: i * 0.25, ease: 'easeIn' }}
                >
                  {a.emoji}
                </motion.span>
              ))}
            </div>
            <p className="mt-3 text-center font-display text-2xl font-extrabold text-white drop-shadow">Mission in progress…</p>
          </motion.div>
        )}

        {phase === 'debrief' && result && (
          <motion.div key="debrief" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3">
            <div className="glass rounded-3xl p-5 text-center shadow-lg">
              <p className="text-5xl">{'⭐'.repeat(result.stars)}</p>
              <p className="mt-2 font-display text-2xl font-extrabold text-slate-900">
                {result.stars === 3 ? 'Perfect plan, Commander!' : result.stars === 2 ? 'Mission done! Can you plan it smarter?' : "Almost! Let's look at what the team needed."}
              </p>
              {result.stars >= 2 && <p className="mt-1 text-slate-700">{mission.win}</p>}
            </div>
            {mission.needs.map((n) => {
              const ok = !result.missing.includes(n);
              return (
                <div key={n.role} className={`rounded-2xl p-3 ${ok ? 'bg-emerald-50' : 'bg-amber-50'}`}>
                  <p className="font-display font-bold text-slate-900">
                    {ok ? '✅' : '👀'} {ROLE_INFO[n.role].label}
                  </p>
                  <p className="text-sm text-slate-700">{n.why}</p>
                </div>
              );
            })}
            {result.wasted.length > 0 && (
              <div className="rounded-2xl bg-sky-50 p-3">
                <p className="font-display font-bold text-slate-900">💡 Not needed this time</p>
                <p className="text-sm text-slate-700">
                  {result.wasted.map((w) => w.aircraft).join(', ')}: a great aircraft, but not for this job. Saving it means it's ready for another mission!
                </p>
              </div>
            )}
            {result.overBudget && <p className="rounded-2xl bg-rose-50 p-3 text-sm font-semibold text-rose-800">⛽ You used {result.cost} fuel, more than the budget of {mission.budget}. Real commanders must plan with limited resources.</p>}
            <div className="flex flex-wrap justify-between gap-3">
              <BigButton variant="ghost" onClick={onExit}>
                ← All missions
              </BigButton>
              <BigButton onClick={retry}>↺ Plan again</BigButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
