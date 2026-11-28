import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SKY_FACTS } from '../content/skyFacts';
import { useProgressStore } from '../store/progressStore';
import { soundManager } from '../lib/sound';
import { ReadAloudButton } from './ReadAloudButton';

/**
 * A "Did you know?" shooting star that drifts across the screen every so
 * often. Tap to catch it: the fact pops up and is saved to the Fact Journal.
 */
export function FactStar() {
  const calm = useProgressStore((s) => s.settings.calmMode);
  const sfx = useProgressStore((s) => s.settings.sfx);
  const caught = useProgressStore((s) => s.factJournalIds);
  const catchFact = useProgressStore((s) => s.catchFact);
  const [flying, setFlying] = useState<{ key: number; top: number } | null>(null);
  const [shown, setShown] = useState<(typeof SKY_FACTS)[number] | null>(null);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const schedule = (delay: number) => {
      t = setTimeout(() => {
        setFlying({ key: Date.now(), top: 15 + Math.random() * 45 });
        schedule(35000 + Math.random() * 25000);
      }, delay);
    };
    schedule(12000);
    return () => clearTimeout(t);
  }, []);

  const grab = () => {
    soundManager.unlock();
    soundManager.play('starCollect', { sfxEnabled: sfx });
    const fresh = SKY_FACTS.filter((f) => !caught.includes(f.id));
    const pool = fresh.length ? fresh : SKY_FACTS;
    const fact = pool[Math.floor(Math.random() * pool.length)];
    catchFact(fact.id);
    setShown(fact);
    setFlying(null);
  };

  return (
    <>
      <AnimatePresence>
        {flying && (
          <motion.button
            key={flying.key}
            aria-label="Catch the shooting star for a fun fact"
            onClick={grab}
            className="fixed left-0 z-40 flex items-center gap-1 rounded-full bg-amber-300/95 px-3 py-2 font-display text-sm font-extrabold text-amber-900 shadow-[0_0_24px_8px_rgba(252,211,77,0.6)]"
            style={{ top: `${flying.top}%` }}
            initial={{ x: '-20vw', rotate: -8 }}
            animate={{ x: '110vw', rotate: 8 }}
            exit={{ opacity: 0, scale: 1.6 }}
            transition={{ duration: calm ? 22 : 13, ease: 'linear' }}
            onAnimationComplete={() => setFlying(null)}
          >
            ⭐ Did you know?
          </motion.button>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {shown && (
          <motion.div
            className="fixed inset-x-4 bottom-6 z-50 mx-auto max-w-lg rounded-3xl bg-white p-5 shadow-2xl ring-4 ring-amber-300"
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
          >
            <p className="font-display text-sm font-extrabold uppercase tracking-wider text-amber-600">
              ⭐ Fact caught! ({caught.length}/{SKY_FACTS.length} in your journal)
            </p>
            <div className="mt-2 flex items-start gap-3">
              <p className="flex-1 text-lg font-semibold text-slate-900">{shown.text}</p>
              <ReadAloudButton text={shown.text} />
            </div>
            <button onClick={() => setShown(null)} className="mt-3 min-h-12 w-full rounded-2xl bg-saffron font-display text-lg font-bold text-white">
              Awesome! 👍
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
