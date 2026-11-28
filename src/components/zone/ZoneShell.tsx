import { useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ReadAloudButton } from '../ReadAloudButton';
import { soundManager } from '../../lib/sound';
import { useProgressStore } from '../../store/progressStore';

interface ZoneShellProps {
  title: string;
  subtitle?: string;
  emoji: string;
  back?: string;
  children: ReactNode;
  wide?: boolean;
  right?: ReactNode;
}

/** Page frame for the IAF zones: back button, HUD-style title plate, content. */
export function ZoneShell({ title, subtitle, emoji, back = '/map', children, wide = false, right }: ZoneShellProps) {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`mx-auto flex flex-col gap-5 px-4 pb-28 pt-6 ${wide ? 'max-w-6xl' : 'max-w-4xl'}`}
    >
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => navigate(back)}
          aria-label="Go back"
          className="flex min-h-12 items-center gap-2 rounded-full bg-white/90 px-4 font-display font-bold text-slate-700 shadow active:scale-95"
        >
          ← Back
        </button>
        {right}
      </div>
      <div className="hud-panel relative overflow-hidden rounded-3xl px-5 py-4 text-white">
        <div className="anim-shimmer pointer-events-none absolute inset-0" />
        <div className="relative flex items-center gap-4">
          <span className="anim-float text-5xl" aria-hidden>
            {emoji}
          </span>
          <div className="min-w-0">
            <h1 className="font-display text-2xl font-extrabold leading-tight sm:text-3xl">{title}</h1>
            {subtitle && <p className="hud-text text-sm font-semibold sm:text-base">{subtitle}</p>}
          </div>
        </div>
      </div>
      {children}
    </motion.div>
  );
}

/** Bottom sheet / modal used for weapon, concept and story details. */
export function Sheet({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-3xl"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', damping: 24, stiffness: 260 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-3 top-3 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl font-bold text-slate-600 active:scale-95"
            >
              ✕
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** A short text block with read-aloud. */
export function SayBox({ text, className = '' }: { text: string; className?: string }) {
  return (
    <div className={`flex items-start gap-3 rounded-2xl bg-sky-50 p-4 ${className}`}>
      <p className="flex-1 text-lg leading-snug text-slate-800">{text}</p>
      <ReadAloudButton text={text} className="shrink-0" />
    </div>
  );
}

/** "Go deeper" expander for older / curious cadets. */
export function GoDeeper({ text, label = '🚀 Go deeper' }: { text: string; label?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border-2 border-indigo-100 bg-indigo-50/70">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex min-h-12 w-full items-center justify-between px-4 font-display font-bold text-indigo-800"
      >
        {label}
        <span className={`transition-transform ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="flex items-start gap-3 px-4 pb-4">
              <p className="flex-1 leading-relaxed text-slate-700">{text}</p>
              <ReadAloudButton text={text} className="shrink-0" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** One-question check with safe retries; calls onCorrect once answered right. */
export function QuickCheck({
  question,
  options,
  correct,
  explain,
  onDone,
}: {
  question: string;
  options: string[];
  correct: number;
  explain: string;
  onDone?: (firstTry: boolean) => void;
}) {
  const sfx = useProgressStore((s) => s.settings.sfx);
  const [picked, setPicked] = useState<number | null>(null);
  const [tries, setTries] = useState(0);
  const solved = picked === correct;

  const choose = (i: number) => {
    if (solved) return;
    soundManager.unlock();
    setPicked(i);
    setTries((t) => t + 1);
    if (i === correct) {
      soundManager.play('correct', { sfxEnabled: sfx });
      onDone?.(tries === 0);
    } else {
      soundManager.play('almost', { sfxEnabled: sfx });
    }
  };

  return (
    <div className="rounded-2xl bg-amber-50 p-4">
      <p className="mb-3 font-display text-lg font-bold text-slate-900">🧠 Quick check: {question}</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((o, i) => {
          const isPicked = picked === i;
          const state = isPicked ? (i === correct ? 'right' : 'almost') : solved && i === correct ? 'right' : 'idle';
          return (
            <motion.button
              key={o}
              onClick={() => choose(i)}
              animate={state === 'almost' ? { x: [0, -6, 6, -4, 0] } : {}}
              className={`min-h-14 rounded-2xl border-2 px-4 py-2 text-left font-semibold ${
                state === 'right'
                  ? 'border-emerald-500 bg-emerald-100 text-emerald-900'
                  : state === 'almost'
                    ? 'border-amber-400 bg-white text-slate-700'
                    : 'border-slate-200 bg-white text-slate-800'
              }`}
            >
              {state === 'right' ? '✅ ' : state === 'almost' ? '👀 ' : ''}
              {o}
            </motion.button>
          );
        })}
      </div>
      {picked !== null && !solved && <p className="mt-3 font-semibold text-amber-700">Almost! Let's look again 👀</p>}
      {solved && (
        <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-3 font-semibold text-emerald-800">
          ⭐ {explain}
        </motion.p>
      )}
    </div>
  );
}
