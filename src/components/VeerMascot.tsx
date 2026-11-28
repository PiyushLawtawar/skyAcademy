import { motion } from 'framer-motion';

export type VeerExpression = 'happy' | 'thinking' | 'surprised' | 'proud' | 'sleepy';

interface VeerMascotProps {
  /** Kept for API compatibility; the crest ignores it except "proud" (adds a glow). */
  expression?: VeerExpression;
  size?: number;
  calmMode?: boolean;
  className?: string;
}

/**
 * The Sky Cadet crest: a tricolour roundel on golden pilot's wings, in the
 * style of an air force flying badge (original artwork, not an official
 * IAF emblem). Replaces the earlier cartoon mascot everywhere it appeared,
 * for a more professional, real-air-force feel.
 */
export function VeerMascot({ expression = 'happy', size = 140, calmMode = false, className }: VeerMascotProps) {
  const proud = expression === 'proud';
  return (
    <motion.svg
      viewBox="0 0 240 120"
      width={size}
      height={size / 2}
      className={className}
      role="img"
      aria-label="Sky Cadet wings badge"
      animate={calmMode ? undefined : { y: [0, -3, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    >
      <defs>
        <linearGradient id="crest-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff1b8" />
          <stop offset="0.45" stopColor="#e9b949" />
          <stop offset="1" stopColor="#a8741a" />
        </linearGradient>
        <radialGradient id="crest-glow">
          <stop offset="0" stopColor="#ffd77a" stopOpacity="0.8" />
          <stop offset="1" stopColor="#ffd77a" stopOpacity="0" />
        </radialGradient>
      </defs>
      {proud && <circle cx="120" cy="60" r="60" fill="url(#crest-glow)" />}
      {[-1, 1].map((side) => (
        <g key={side} transform={side === -1 ? 'translate(240 0) scale(-1 1)' : undefined}>
          {[0, 1, 2, 3, 4].map((i) => (
            <path
              key={i}
              d={`M150 ${44 + i * 9} C ${178 + i * 4} ${38 + i * 9}, ${210 - i * 10} ${36 + i * 10}, ${236 - i * 16} ${30 + i * 12} C ${206 - i * 12} ${48 + i * 9}, ${178} ${54 + i * 8}, 150 ${56 + i * 8} Z`}
              fill="url(#crest-gold)"
              stroke="#8a5d12"
              strokeWidth="1"
            />
          ))}
        </g>
      ))}
      <circle cx="120" cy="60" r="34" fill="#8a5d12" />
      <circle cx="120" cy="60" r="31" fill="#ff9933" />
      <circle cx="120" cy="60" r="21" fill="#ffffff" />
      <circle cx="120" cy="60" r="11" fill="#138808" />
      <path d="M120 14 L126 24 L114 24 Z" fill="url(#crest-gold)" stroke="#8a5d12" strokeWidth="1" />
    </motion.svg>
  );
}
