import { motion } from 'framer-motion';

export type PlanePartId = 'fuselage' | 'cockpit' | 'wings' | 'tail';

export const PLANE_PART_IDS: PlanePartId[] = ['fuselage', 'cockpit', 'wings', 'tail'];

interface SimplePlaneDiagramProps {
  /** Parts the child has already discovered/visited — drawn with a checkmark. */
  visitedPartIds?: PlanePartId[];
  /** The part currently being asked about in a game — drawn with a pulsing glow. */
  targetPartId?: PlanePartId | null;
  /** A part that was just tapped correctly/incorrectly, for a brief flash. */
  flashPartId?: PlanePartId | null;
  flashKind?: 'correct' | 'almost' | null;
  onPartTap?: (partId: PlanePartId) => void;
  size?: number;
}

const PART_LABELS: Record<PlanePartId, string> = {
  fuselage: 'Fuselage',
  cockpit: 'Cockpit',
  wings: 'Wings',
  tail: 'Tail',
};

// A stylised, original side-view jet silhouette (nose to the right) with four
// tappable regions. Shared by the Explore toy and the Play mini-game so both
// use the exact same shapes a child has already learned to recognise.
export function SimplePlaneDiagram({
  visitedPartIds = [],
  targetPartId = null,
  flashPartId = null,
  flashKind = null,
  onPartTap,
  size = 320,
}: SimplePlaneDiagramProps) {
  const fillFor = (partId: PlanePartId, base: string) => {
    if (flashPartId === partId) return flashKind === 'correct' ? '#2fbf71' : '#ffb648';
    if (targetPartId === partId) return '#ffd166';
    return base;
  };

  const handleTap = (partId: PlanePartId) => () => onPartTap?.(partId);

  return (
    <svg
      viewBox="0 0 320 160"
      width={size}
      height={(size * 160) / 320}
      role="img"
      aria-label="Diagram of a jet you can tap to learn its parts"
    >
      {/* Tail (fin + stabiliser) */}
      <motion.g
        role="button"
        tabIndex={0}
        aria-label={`${PART_LABELS.tail}, tap to learn more`}
        onClick={handleTap('tail')}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onPartTap?.('tail')}
        style={{ cursor: onPartTap ? 'pointer' : 'default' }}
        animate={targetPartId === 'tail' ? { scale: [1, 1.08, 1] } : undefined}
        transition={{ duration: 1, repeat: targetPartId === 'tail' ? Infinity : 0 }}
      >
        <path d="M55 95 L30 30 L55 60 Z" fill={fillFor('tail', '#9fb0c9')} stroke="#5c6b8a" strokeWidth={2} />
        <path d="M55 70 L25 55 L55 85 Z" fill={fillFor('tail', '#c2d0e4')} stroke="#5c6b8a" strokeWidth={2} />
        {visitedPartIds.includes('tail') && <text x="35" y="45" fontSize="14">✅</text>}
      </motion.g>

      {/* Fuselage */}
      <motion.g
        role="button"
        tabIndex={0}
        aria-label={`${PART_LABELS.fuselage}, tap to learn more`}
        onClick={handleTap('fuselage')}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onPartTap?.('fuselage')}
        style={{ cursor: onPartTap ? 'pointer' : 'default' }}
        animate={targetPartId === 'fuselage' ? { scale: [1, 1.05, 1] } : undefined}
        transition={{ duration: 1, repeat: targetPartId === 'fuselage' ? Infinity : 0 }}
      >
        <path
          d="M55 80 Q55 65 90 65 L245 70 Q275 73 290 80 Q275 87 245 90 L90 95 Q55 95 55 80 Z"
          fill={fillFor('fuselage', '#eef1f6')}
          stroke="#5c6b8a"
          strokeWidth={2}
        />
        {visitedPartIds.includes('fuselage') && <text x="150" y="85" fontSize="14">✅</text>}
      </motion.g>

      {/* Wings (delta) */}
      <motion.g
        role="button"
        tabIndex={0}
        aria-label={`${PART_LABELS.wings}, tap to learn more`}
        onClick={handleTap('wings')}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onPartTap?.('wings')}
        style={{ cursor: onPartTap ? 'pointer' : 'default' }}
        animate={targetPartId === 'wings' ? { scale: [1, 1.05, 1] } : undefined}
        transition={{ duration: 1, repeat: targetPartId === 'wings' ? Infinity : 0 }}
      >
        <path d="M160 72 L220 15 L235 20 L180 78 Z" fill={fillFor('wings', '#7ec8ff')} stroke="#2f6fb0" strokeWidth={2} />
        <path d="M160 88 L220 145 L235 140 L180 82 Z" fill={fillFor('wings', '#7ec8ff')} stroke="#2f6fb0" strokeWidth={2} />
        {visitedPartIds.includes('wings') && <text x="195" y="35" fontSize="14">✅</text>}
      </motion.g>

      {/* Cockpit canopy */}
      <motion.g
        role="button"
        tabIndex={0}
        aria-label={`${PART_LABELS.cockpit}, tap to learn more`}
        onClick={handleTap('cockpit')}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onPartTap?.('cockpit')}
        style={{ cursor: onPartTap ? 'pointer' : 'default' }}
        animate={targetPartId === 'cockpit' ? { scale: [1, 1.1, 1] } : undefined}
        transition={{ duration: 1, repeat: targetPartId === 'cockpit' ? Infinity : 0 }}
      >
        <ellipse
          cx="225"
          cy="66"
          rx="22"
          ry="11"
          fill={fillFor('cockpit', '#ffd166')}
          stroke="#c9960a"
          strokeWidth={2}
          opacity={0.9}
        />
        {visitedPartIds.includes('cockpit') && <text x="215" y="45" fontSize="14">✅</text>}
      </motion.g>
    </svg>
  );
}

export { PART_LABELS };
