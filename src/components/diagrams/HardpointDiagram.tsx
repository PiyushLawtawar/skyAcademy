import { motion } from 'framer-motion';

export type HardpointItemId = 'hardpoint' | 'drop-tank' | 'missile';

export const HARDPOINT_ITEM_IDS: HardpointItemId[] = ['hardpoint', 'drop-tank', 'missile'];

interface HardpointDiagramProps {
  visitedItemIds?: HardpointItemId[];
  onItemTap?: (itemId: HardpointItemId) => void;
  size?: number;
}

// A simplified underside-of-wing view with three tappable items a jet can
// carry on its hardpoints. The missile shape is abstract (a slim capsule
// with small fins) and is never shown in use — naming only, per brief §12.
export function HardpointDiagram({ visitedItemIds = [], onItemTap, size = 300 }: HardpointDiagramProps) {
  const handleTap = (id: HardpointItemId) => () => onItemTap?.(id);

  return (
    <svg
      viewBox="0 0 300 140"
      width={size}
      height={(size * 140) / 300}
      role="img"
      aria-label="Diagram of a jet's wing and the things it can carry, tap to learn more"
    >
      {/* Wing underside */}
      <path d="M20 30 L280 30 L260 55 L40 55 Z" fill="#7ec8ff" stroke="#2f6fb0" strokeWidth={2} />

      {/* Hardpoint bracket */}
      <motion.g
        role="button"
        tabIndex={0}
        aria-label="Hardpoint, tap to learn more"
        onClick={handleTap('hardpoint')}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onItemTap?.('hardpoint')}
        style={{ cursor: onItemTap ? 'pointer' : 'default' }}
      >
        <rect x="60" y="55" width="16" height="22" rx="3" fill="#9fb0c9" stroke="#5c6b8a" strokeWidth={2} />
        {visitedItemIds.includes('hardpoint') && <text x="55" y="50" fontSize="14">✅</text>}
      </motion.g>

      {/* Drop tank */}
      <motion.g
        role="button"
        tabIndex={0}
        aria-label="Drop Tank, tap to learn more"
        onClick={handleTap('drop-tank')}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onItemTap?.('drop-tank')}
        style={{ cursor: onItemTap ? 'pointer' : 'default' }}
      >
        <path
          d="M140 77 Q140 95 150 110 Q160 95 160 77 Q150 70 140 77 Z"
          fill="#eef1f6"
          stroke="#5c6b8a"
          strokeWidth={2}
        />
        {visitedItemIds.includes('drop-tank') && <text x="135" y="68" fontSize="14">✅</text>}
      </motion.g>

      {/* Missile (abstract, not shown firing or hitting anything) */}
      <motion.g
        role="button"
        tabIndex={0}
        aria-label="Missile, tap to learn more"
        onClick={handleTap('missile')}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onItemTap?.('missile')}
        style={{ cursor: onItemTap ? 'pointer' : 'default' }}
      >
        <rect x="218" y="60" width="10" height="45" rx="5" fill="#ffd166" stroke="#c9960a" strokeWidth={2} />
        <path d="M218 60 L223 50 L228 60 Z" fill="#ffd166" stroke="#c9960a" strokeWidth={2} />
        <path d="M216 100 L212 110 L218 105 Z M230 100 L234 110 L228 105 Z" fill="#c9960a" />
        {visitedItemIds.includes('missile') && <text x="205" y="50" fontSize="14">✅</text>}
      </motion.g>
    </svg>
  );
}
