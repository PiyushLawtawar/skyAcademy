import { motion, AnimatePresence } from 'framer-motion';

interface StarBurstProps {
  show: boolean;
  calmMode?: boolean;
}

// Celebration burst for correct answers / lesson completion. Respects Calm
// mode and prefers-reduced-motion (handled globally via the .calm-mode class).
export function StarBurst({ show, calmMode = false }: StarBurstProps) {
  const stars = calmMode ? ['⭐'] : ['⭐', '✨', '⭐', '✨', '⭐'];

  return (
    <AnimatePresence>
      {show && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
          {stars.map((star, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0.4, 1.2, 0.8],
                x: (i - 2) * 40,
                y: -80 - i * 10,
              }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="absolute text-4xl"
            >
              {star}
            </motion.span>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
