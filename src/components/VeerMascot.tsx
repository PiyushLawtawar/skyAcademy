import { motion } from 'framer-motion';

export type VeerExpression = 'happy' | 'thinking' | 'surprised' | 'proud' | 'sleepy';

interface VeerMascotProps {
  expression?: VeerExpression;
  size?: number;
  calmMode?: boolean;
  className?: string;
}

// Veer, the bar-headed goose mascot: an original character, drawn as inline
// SVG so wings/eyes can animate independently. No existing cartoon's style is
// referenced here — shape only, built from simple primitives.
export function VeerMascot({ expression = 'happy', size = 140, calmMode = false, className }: VeerMascotProps) {
  const blink = expression === 'sleepy';
  const eyeHeight = blink ? 1 : 7;
  const wingFlap = calmMode ? 0 : 6;
  const bodyBob = calmMode ? 0 : 3;

  return (
    <motion.svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={`Veer the mascot goose, looking ${expression}`}
      animate={calmMode ? undefined : { y: [0, -bodyBob, 0] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Left wing */}
      <motion.path
        d="M55 110 Q20 95 15 130 Q35 150 65 135 Z"
        fill="#dfe4ee"
        stroke="#b9c1d1"
        strokeWidth={2}
        animate={calmMode ? undefined : { rotate: [0, -wingFlap, 0] }}
        style={{ transformOrigin: '60px 118px' }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Right wing */}
      <motion.path
        d="M145 110 Q180 95 185 130 Q165 150 135 135 Z"
        fill="#dfe4ee"
        stroke="#b9c1d1"
        strokeWidth={2}
        animate={calmMode ? undefined : { rotate: [0, wingFlap, 0] }}
        style={{ transformOrigin: '140px 118px' }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Tricolour scarf */}
      <path d="M70 128 Q100 145 130 128 L130 142 Q100 158 70 142 Z" fill="#FF9933" />
      <path d="M70 136 Q100 152 130 136 L130 148 Q100 163 70 148 Z" fill="#FFFFFF" />
      <path d="M70 143 Q100 158 130 143 L130 154 Q100 169 70 154 Z" fill="#138808" />

      {/* Body */}
      <ellipse cx="100" cy="115" rx="45" ry="52" fill="#eef1f6" stroke="#c7cedd" strokeWidth={2} />

      {/* Flying helmet */}
      <path d="M62 78 Q100 40 138 78 Q138 98 128 100 Q100 85 72 100 Q62 98 62 78 Z" fill="#5c6b8a" />
      <circle cx="100" cy="76" r="5" fill="#3c4760" />

      {/* Goggles */}
      <circle cx="82" cy="88" r="15" fill="#2a3246" stroke="#ffcf6b" strokeWidth={3} />
      <circle cx="118" cy="88" r="15" fill="#2a3246" stroke="#ffcf6b" strokeWidth={3} />
      <rect x="92" y="83" width="16" height="6" rx="3" fill="#ffcf6b" />

      {/* Eyes (goggle lenses) */}
      <motion.ellipse
        cx="82"
        cy="88"
        rx="6"
        ry={eyeHeight}
        fill="#fefefe"
        animate={calmMode ? undefined : { ry: [eyeHeight, 1, eyeHeight] }}
        transition={{ duration: 3.2, repeat: Infinity, repeatDelay: 1.6 }}
      />
      <motion.ellipse
        cx="118"
        cy="88"
        rx="6"
        ry={eyeHeight}
        fill="#fefefe"
        animate={calmMode ? undefined : { ry: [eyeHeight, 1, eyeHeight] }}
        transition={{ duration: 3.2, repeat: Infinity, repeatDelay: 1.6 }}
      />
      <circle cx="82" cy="88" r="2.4" fill="#2a3246" />
      <circle cx="118" cy="88" r="2.4" fill="#2a3246" />

      {/* Beak (bill) */}
      <path d="M92 104 Q100 118 108 104 Q100 112 92 104 Z" fill="#FF9933" stroke="#d97c1f" strokeWidth={1.5} />

      {/* Feet */}
      <path d="M85 165 L80 178 M85 165 L90 178" stroke="#FF9933" strokeWidth={3} strokeLinecap="round" />
      <path d="M115 165 L110 178 M115 165 L120 178" stroke="#FF9933" strokeWidth={3} strokeLinecap="round" />
    </motion.svg>
  );
}
