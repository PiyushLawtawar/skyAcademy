import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CONCEPTS, LEVELS, type Concept } from '../content/concepts';
import { ConceptAnimation } from '../components/art/ConceptAnimation';
import { GoDeeper, QuickCheck, SayBox, Sheet, ZoneShell } from '../components/zone/ZoneShell';
import { StarBurst } from '../components/StarBurst';
import { useProgressStore } from '../store/progressStore';
import { soundManager } from '../lib/sound';

export function FlightSchool() {
  const navigate = useNavigate();
  const sfx = useProgressStore((s) => s.settings.sfx);
  const lessonResults = useProgressStore((s) => s.lessonResults);
  const recordLessonResult = useProgressStore((s) => s.recordLessonResult);
  const [open, setOpen] = useState<Concept | null>(null);
  const [burst, setBurst] = useState(false);

  const done = (c: Concept) => lessonResults[`concept:${c.id}`]?.stars ?? 0;
  const totalDone = CONCEPTS.filter((c) => done(c) > 0).length;

  const openConcept = (c: Concept) => {
    soundManager.unlock();
    soundManager.play('radarPing', { sfxEnabled: sfx });
    setOpen(c);
  };

  return (
    <ZoneShell
      emoji="🎓"
      title="Flight School"
      subtitle="From how wings work… to how air battles are won"
      wide
      right={<span className="rounded-full bg-white/90 px-4 py-2 font-display font-bold text-slate-700 shadow">🎓 {totalDone}/{CONCEPTS.length} learned</span>}
    >
      {LEVELS.map((lvl) => {
        const concepts = CONCEPTS.filter((c) => c.level === lvl.level);
        const learned = concepts.filter((c) => done(c) > 0).length;
        return (
          <section key={lvl.level} className="flex flex-col gap-3">
            <div className={`flex items-center gap-4 rounded-3xl bg-gradient-to-r ${lvl.color} p-4 text-white shadow-lg`}>
              <span className="text-4xl">{lvl.emoji}</span>
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-widest opacity-80">Level {lvl.level}</p>
                <h2 className="font-display text-2xl font-extrabold">{lvl.name}</h2>
                <p className="text-sm opacity-90">{lvl.blurb}</p>
              </div>
              <div className="text-right">
                <p className="font-display text-2xl font-black">
                  {learned}/{concepts.length}
                </p>
                <div className="mt-1 h-2 w-24 overflow-hidden rounded-full bg-white/30">
                  <div className="h-full bg-white" style={{ width: `${(learned / concepts.length) * 100}%` }} />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {concepts.map((c, i) => {
                const stars = done(c);
                return (
                  <motion.button
                    key={c.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => openConcept(c)}
                    className={`glass relative flex min-h-36 flex-col items-start gap-1 rounded-3xl p-4 text-left shadow-md ${stars ? 'ring-2 ring-emerald-400' : ''}`}
                  >
                    <span className="text-4xl">{c.emoji}</span>
                    <span className="font-display font-bold leading-tight text-slate-900">{c.title}</span>
                    <span className="mt-auto text-sm">{stars ? '⭐'.repeat(stars) : <span className="text-slate-400">Tap to learn</span>}</span>
                  </motion.button>
                );
              })}
              {lvl.level === 3 && (
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => navigate('/mission-planner')}
                  className="flex min-h-36 flex-col items-start gap-1 rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-700 p-4 text-left text-white shadow-lg"
                >
                  <span className="text-4xl">🗺️</span>
                  <span className="font-display font-bold">Try it: Mission Planner</span>
                  <span className="mt-auto text-sm opacity-90">Build your own strike package →</span>
                </motion.button>
              )}
            </div>
          </section>
        );
      })}

      <Sheet open={!!open} onClose={() => setOpen(null)}>
        {open && (
          <div className="flex flex-col gap-4">
            <div className="pr-12">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Level {open.level} · {LEVELS[open.level - 1].name}
              </p>
              <h2 className="font-display text-3xl font-extrabold text-slate-900">
                {open.emoji} {open.title}
              </h2>
            </div>
            <ConceptAnimation anim={open.anim} />
            <SayBox text={open.kid} />
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-amber-50 p-4">
                <p className="font-display font-bold text-amber-900">🧸 It's like…</p>
                <p className="text-slate-800">{open.analogy}</p>
              </div>
              <div className="rounded-2xl bg-emerald-50 p-4">
                <p className="font-display font-bold text-emerald-900">🇮🇳 In the real IAF</p>
                <p className="text-slate-800">{open.realIaf}</p>
              </div>
            </div>
            <GoDeeper text={open.deeper} />
            <QuickCheck
              key={open.id}
              question={open.quiz.q}
              options={open.quiz.options}
              correct={open.quiz.correct}
              explain={open.quiz.explain}
              onDone={(firstTry) => {
                recordLessonResult(`concept:${open.id}`, { stars: firstTry ? 3 : 2, hintsUsed: firstTry ? 0 : 1 });
                soundManager.play('starCollect', { sfxEnabled: sfx });
                setBurst(true);
                setTimeout(() => setBurst(false), 1500);
              }}
            />
          </div>
        )}
      </Sheet>
      <div className="pointer-events-none fixed inset-0 z-[60]">
        <StarBurst show={burst} />
      </div>
    </ZoneShell>
  );
}
