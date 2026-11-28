import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { HISTORY, getHistoryEvent, type HistoryEvent } from '../content/history';
import { WarScene } from '../components/art/WarScene';
import { GoDeeper, QuickCheck, SayBox, ZoneShell } from '../components/zone/ZoneShell';
import { BigButton } from '../components/BigButton';
import { StarBurst } from '../components/StarBurst';
import { useProgressStore } from '../store/progressStore';
import { soundManager } from '../lib/sound';

const FILTERS = [
  { id: 'all', label: 'All', emoji: '🗂️' },
  { id: 'war', label: 'Wars', emoji: '🎖️' },
  { id: 'operation', label: 'Operations', emoji: '🎯' },
  { id: 'rescue', label: 'Rescues', emoji: '🛟' },
] as const;

const KIND_STYLE: Record<HistoryEvent['kind'], string> = {
  war: 'bg-rose-100 text-rose-800',
  operation: 'bg-indigo-100 text-indigo-800',
  rescue: 'bg-emerald-100 text-emerald-800',
};

export function WarRoom() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]['id']>('all');
  const lessonResults = useProgressStore((s) => s.lessonResults);
  const events = [...HISTORY].sort((a, b) => a.sortYear - b.sortYear).filter((e) => filter === 'all' || e.kind === filter);
  const done = HISTORY.filter((e) => lessonResults[`history:${e.id}`]).length;

  return (
    <ZoneShell
      emoji="🎖️"
      title="The War Room"
      subtitle="How the IAF protected India: from 1947 to today"
      right={<span className="rounded-full bg-white/90 px-4 py-2 font-display font-bold text-slate-700 shadow">📜 {done}/{HISTORY.length} stories</span>}
    >
      <SayBox text="Real stories of real pilots. Each one teaches a secret of air strategy. Tap a story to begin your briefing!" />

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`min-h-12 rounded-full px-4 font-display font-bold shadow ${filter === f.id ? 'bg-saffron text-white' : 'bg-white/90 text-slate-700'}`}
          >
            {f.emoji} {f.label}
          </button>
        ))}
      </div>

      <div className="relative">
        {/* timeline spine */}
        <div className="absolute bottom-0 left-[27px] top-0 w-1 rounded-full bg-gradient-to-b from-saffron via-white to-india-green opacity-80" />
        <div className="flex flex-col gap-4">
          {events.map((e, i) => {
            const stars = lessonResults[`history:${e.id}`]?.stars ?? 0;
            return (
              <motion.button
                key={e.id}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(i * 0.05, 0.3) }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(`/war-room/${e.id}`)}
                className="relative flex items-stretch gap-4 text-left"
              >
                <span className="z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-4 border-white bg-slate-900 text-2xl shadow-lg">
                  {e.emoji}
                </span>
                <span className="glass flex flex-1 flex-col gap-1 rounded-3xl p-4 shadow-md">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-display text-xl font-extrabold text-saffron">{e.year}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-bold uppercase ${KIND_STYLE[e.kind]}`}>{e.kind}</span>
                    {stars > 0 && <span className="ml-auto text-sm">{'⭐'.repeat(stars)}</span>}
                  </span>
                  <span className="font-display text-lg font-bold text-slate-900">{e.title}</span>
                  <span className="text-sm text-slate-600">{e.tagline}</span>
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      <p className="rounded-2xl bg-white/85 p-4 text-sm text-slate-600">
        🕊️ The Air Force's first job is to <b>protect</b> India and its people, in war and in disasters. Soldiers on every side are brave; war is always the last choice.
      </p>
    </ZoneShell>
  );
}

export function WarStory() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const event = eventId ? getHistoryEvent(eventId) : undefined;
  const sfx = useProgressStore((s) => s.settings.sfx);
  const recordLessonResult = useProgressStore((s) => s.recordLessonResult);
  const [page, setPage] = useState(0);
  const [burst, setBurst] = useState(false);

  if (!event) {
    return (
      <ZoneShell emoji="❓" title="Story not found" back="/war-room">
        <BigButton onClick={() => navigate('/war-room')}>Back to War Room</BigButton>
      </ZoneShell>
    );
  }

  const storyPages = event.panels.length;
  const onDebrief = page >= storyPages;
  const panel = event.panels[Math.min(page, storyPages - 1)];
  const sorted = [...HISTORY].sort((a, b) => a.sortYear - b.sortYear);
  const next = sorted[sorted.findIndex((e) => e.id === event.id) + 1];

  const go = (delta: number) => {
    soundManager.unlock();
    soundManager.play(delta > 0 ? 'jetFlyPast' : 'tap', { sfxEnabled: sfx });
    setPage((p) => Math.max(0, Math.min(storyPages, p + delta)));
  };

  return (
    <ZoneShell emoji={event.emoji} title={event.title} subtitle={`${event.year} · ${event.tagline}`} back="/war-room">
      {/* progress like a flight path */}
      <div className="flex items-center gap-1">
        {Array.from({ length: storyPages + 1 }, (_, i) => (
          <div key={i} className={`h-2 flex-1 rounded-full ${i <= page ? 'bg-saffron' : 'bg-white/60'}`} />
        ))}
        <span className="ml-2 text-xl">{onDebrief ? '🛬' : '✈️'}</span>
      </div>

      <AnimatePresence mode="wait">
        {!onDebrief ? (
          <motion.div key={page} initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }} className="glass flex flex-col gap-4 rounded-3xl p-4 shadow-lg">
            <WarScene kind={panel.scene ?? event.scene} height={230} />
            <SayBox text={panel.text} />
            <div className="flex justify-between gap-3">
              <BigButton variant="ghost" onClick={() => go(-1)} disabled={page === 0} className={page === 0 ? 'invisible' : ''}>
                ← Back
              </BigButton>
              <BigButton onClick={() => go(1)}>{page === storyPages - 1 ? 'Debrief 🎖️' : 'Next →'}</BigButton>
            </div>
          </motion.div>
        ) : (
          <motion.div key="debrief" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
            <div className="hud-panel rounded-3xl p-5 text-white">
              <p className="hud-text font-display text-sm font-bold uppercase tracking-widest">Mission debrief</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {event.numbers.map((n) => (
                  <div key={n.label} className="rounded-2xl bg-white/10 p-3 text-center">
                    <p className="font-display text-2xl font-extrabold text-saffron">{n.value}</p>
                    <p className="text-xs text-slate-200">{n.label}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 font-display font-bold">✈️ Aircraft that flew</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {event.aircraft.map((a) => (
                  <span key={a} className="rounded-full bg-white/15 px-3 py-1 text-sm font-semibold">
                    {a}
                  </span>
                ))}
              </div>
            </div>

            {event.hero && (
              <div className="rounded-3xl bg-gradient-to-br from-amber-200 via-orange-100 to-white p-5 shadow-lg">
                <p className="font-display text-sm font-bold uppercase tracking-wider text-orange-800">🏅 Hero card</p>
                <p className="font-display text-2xl font-extrabold text-slate-900">{event.hero.name}</p>
                {event.hero.award && <p className="font-semibold text-orange-800">Awarded the {event.hero.award}</p>}
                <p className="mt-2 text-slate-800">{event.hero.story}</p>
              </div>
            )}

            <div className="rounded-3xl bg-indigo-600 p-5 text-white shadow-lg">
              <p className="font-display text-sm font-bold uppercase tracking-wider text-indigo-200">♟️ Strategy secret</p>
              <p className="font-display text-2xl font-extrabold">{event.strategy.title}</p>
              <p className="mt-1 text-indigo-50">{event.strategy.text}</p>
            </div>

            <GoDeeper text={event.deeper} label="📚 Tell me more (for curious cadets)" />

            <QuickCheck
              key={event.id}
              question={event.quiz.q}
              options={event.quiz.options}
              correct={event.quiz.correct}
              explain={event.quiz.explain}
              onDone={(firstTry) => {
                recordLessonResult(`history:${event.id}`, { stars: firstTry ? 3 : 2, hintsUsed: firstTry ? 0 : 1 });
                soundManager.play('starCollect', { sfxEnabled: sfx });
                setBurst(true);
                setTimeout(() => setBurst(false), 1600);
              }}
            />
            <div className="pointer-events-none fixed inset-0 z-40"><StarBurst show={burst} /></div>

            <div className="flex flex-wrap justify-between gap-3">
              <BigButton variant="ghost" onClick={() => setPage(0)}>
                ↺ Read again
              </BigButton>
              {next ? (
                <BigButton onClick={() => (setPage(0), navigate(`/war-room/${next.id}`))}>Next story: {next.year} →</BigButton>
              ) : (
                <BigButton onClick={() => navigate('/war-room')}>Back to War Room</BigButton>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ZoneShell>
  );
}
