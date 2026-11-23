import type { MouseEvent, ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { useProgressStore } from '../store/progressStore';
import { soundManager } from '../lib/sound';

interface BigButtonProps extends HTMLMotionProps<'button'> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  silent?: boolean;
}

const VARIANT_CLASSES: Record<NonNullable<BigButtonProps['variant']>, string> = {
  primary: 'bg-saffron text-white shadow-lg shadow-orange-300/40',
  secondary: 'bg-sky-day text-white shadow-lg shadow-sky-300/40',
  ghost: 'bg-white/80 text-slate-700 border-2 border-slate-200',
};

// Minimum 56x56px tap target, big rounded shape, no hover-only affordances —
// this is the one button component every screen should use for taps. Every
// tap also unlocks and plays the soft 'tap' sound (pass `silent` to opt out,
// e.g. when a screen already plays a more specific sound for the same tap).
export function BigButton({
  children,
  variant = 'primary',
  className = '',
  silent = false,
  onClick,
  ...rest
}: BigButtonProps) {
  const sfxEnabled = useProgressStore((s) => s.settings.sfx);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (!silent) {
      soundManager.unlock();
      soundManager.play('tap', { sfxEnabled });
    }
    onClick?.(event);
  };

  return (
    <motion.button
      {...rest}
      onClick={handleClick}
      whileTap={{ scale: 0.94 }}
      className={`min-h-14 min-w-14 rounded-3xl px-6 py-3 font-display text-lg font-semibold transition-transform active:scale-95 ${VARIANT_CLASSES[variant]} ${className}`}
    >
      {children}
    </motion.button>
  );
}
