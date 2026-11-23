import type { AircraftSilhouetteSpec } from '../../content/types';

interface AircraftSilhouetteProps {
  spec: AircraftSilhouetteSpec;
  size?: number;
  /** Flat single-color mode for the "Spot the Shape" guessing game — no shading hints. */
  silhouetteMode?: boolean;
  colorScheme?: { body: string; accent: string; stroke: string };
}

const DEFAULT_SCHEME = { body: '#eef1f6', accent: '#7ec8ff', stroke: '#5c6b8a' };
const SILHOUETTE_SCHEME = { body: '#334155', accent: '#334155', stroke: '#1e293b' };

// One parametrized, original side-view silhouette shared by every aircraft
// card, detail page and the "Spot the Shape" game. Fighter silhouettes
// reflect each jet's REAL wing/canard/tail configuration (brief §7's "have
// the code check each aircraft's real configuration" note) rather than a
// generic jet shape reused for everything.
export function AircraftSilhouette({ spec, size = 220, silhouetteMode = false, colorScheme }: AircraftSilhouetteProps) {
  const c = silhouetteMode ? SILHOUETTE_SCHEME : (colorScheme ?? DEFAULT_SCHEME);

  return (
    <svg viewBox="0 0 320 160" width={size} height={(size * 160) / 320} role="img" aria-hidden={silhouetteMode}>
      {spec.kind === 'fighter' && <FighterShape spec={spec} c={c} />}
      {spec.kind === 'transport' && <TransportShape c={c} />}
      {spec.kind === 'helicopter' && <HelicopterShape c={c} />}
      {spec.kind === 'awacs' && <AwacsShape c={c} />}
      {spec.kind === 'trainer' && <TrainerShape c={c} />}
    </svg>
  );
}

type Scheme = { body: string; accent: string; stroke: string };

function FighterShape({ spec, c }: { spec: AircraftSilhouetteSpec; c: Scheme }) {
  const isDelta = spec.wingShape !== 'swept';

  return (
    <g>
      {/* Tail fin(s) — a twin tail is drawn as two clearly separated fins
          along the spine (not overlapping), not a subtle doubling-up. */}
      <path d="M48 95 L22 24 L52 65 Z" fill={c.accent} stroke={c.stroke} strokeWidth={2} />
      {spec.tailCount === 2 && <path d="M98 95 L80 48 L104 72 Z" fill={c.accent} stroke={c.stroke} strokeWidth={2} />}

      {/* Fuselage */}
      <path
        d="M55 80 Q55 65 90 65 L245 70 Q275 73 290 80 Q275 87 245 90 L90 95 Q55 95 55 80 Z"
        fill={c.body}
        stroke={c.stroke}
        strokeWidth={2}
      />

      {/* Main wings: delta is one big triangle reaching nearly to the tail;
          swept is a long, narrow, sharply raked blade set further forward —
          deliberately exaggerated so the two read as different shapes, not
          just a minor angle change. */}
      {isDelta ? (
        <>
          <path d="M150 72 L228 10 L244 16 L188 78 Z" fill={c.accent} stroke={c.stroke} strokeWidth={2} />
          <path d="M150 88 L228 150 L244 144 L188 82 Z" fill={c.accent} stroke={c.stroke} strokeWidth={2} />
        </>
      ) : (
        <>
          <path d="M108 70 L224 38 L230 44 L146 80 Z" fill={c.accent} stroke={c.stroke} strokeWidth={2} />
          <path d="M108 90 L224 122 L230 116 L146 80 Z" fill={c.accent} stroke={c.stroke} strokeWidth={2} />
        </>
      )}

      {/* Canards — small front wings just ahead of the cockpit, sized to be
          unmistakable rather than a faint nub. */}
      {spec.hasCanards && (
        <>
          <path d="M158 67 L186 38 L196 44 L166 70 Z" fill={c.accent} stroke={c.stroke} strokeWidth={2} />
          <path d="M158 93 L186 122 L196 116 L166 90 Z" fill={c.accent} stroke={c.stroke} strokeWidth={2} />
        </>
      )}

      {/* Cockpit canopy */}
      <ellipse cx="225" cy="66" rx="20" ry="10" fill={c.stroke} opacity={0.85} />
    </g>
  );
}

function TransportShape({ c }: { c: Scheme }) {
  return (
    <g>
      {/* High-mounted wing */}
      <path d="M110 55 L270 40 L270 48 L120 65 Z" fill={c.accent} stroke={c.stroke} strokeWidth={2} />
      <path d="M110 95 L270 112 L270 104 L120 90 Z" fill={c.accent} stroke={c.stroke} strokeWidth={2} />

      {/* Boxy fuselage */}
      <path
        d="M45 70 Q45 62 65 62 L255 68 Q280 70 290 80 Q280 90 255 92 L65 98 Q45 98 45 90 Z"
        fill={c.body}
        stroke={c.stroke}
        strokeWidth={2}
      />

      {/* T-tail */}
      <path d="M55 90 L35 125 L55 108 Z" fill={c.accent} stroke={c.stroke} strokeWidth={2} />
      <path d="M30 120 L55 112 L58 118 L33 128 Z" fill={c.accent} stroke={c.stroke} strokeWidth={2} />

      {/* Engine pods */}
      <rect x="140" y="63" width="22" height="9" rx="4" fill={c.stroke} />
      <rect x="190" y="58" width="22" height="9" rx="4" fill={c.stroke} />
      <rect x="140" y="92" width="22" height="9" rx="4" fill={c.stroke} />
      <rect x="190" y="98" width="22" height="9" rx="4" fill={c.stroke} />
    </g>
  );
}

function HelicopterShape({ c }: { c: Scheme }) {
  return (
    <g>
      {/* Main rotor */}
      <rect x="40" y="38" width="220" height="4" rx="2" fill={c.stroke} />
      <rect x="140" y="30" width="8" height="18" rx="3" fill={c.stroke} />

      {/* Tail boom */}
      <path d="M190 75 L270 55 L275 60 L198 83 Z" fill={c.body} stroke={c.stroke} strokeWidth={2} />
      {/* Tail rotor */}
      <rect x="265" y="40" width="4" height="26" rx="2" fill={c.stroke} />

      {/* Cabin */}
      <path
        d="M80 60 Q80 48 110 48 L195 55 Q205 60 205 75 Q205 90 190 92 L105 98 Q80 96 80 80 Z"
        fill={c.body}
        stroke={c.stroke}
        strokeWidth={2}
      />
      <ellipse cx="110" cy="70" rx="18" ry="14" fill={c.stroke} opacity={0.85} />

      {/* Skids */}
      <path d="M90 98 L190 98 M95 98 L95 108 M185 98 L185 108" stroke={c.stroke} strokeWidth={3} fill="none" />
    </g>
  );
}

function AwacsShape({ c }: { c: Scheme }) {
  return (
    <g>
      {/* Wings */}
      <path d="M120 58 L250 42 L250 50 L128 68 Z" fill={c.accent} stroke={c.stroke} strokeWidth={2} />
      <path d="M120 92 L250 108 L250 100 L128 82 Z" fill={c.accent} stroke={c.stroke} strokeWidth={2} />

      {/* Fuselage */}
      <path
        d="M50 72 Q50 64 75 64 L240 70 Q265 73 275 80 Q265 87 240 90 L75 96 Q50 96 50 88 Z"
        fill={c.body}
        stroke={c.stroke}
        strokeWidth={2}
      />

      {/* Tail */}
      <path d="M60 88 L40 118 L62 100 Z" fill={c.accent} stroke={c.stroke} strokeWidth={2} />

      {/* Rotodome — the recognisable "eyes in the sky" disc on a pylon */}
      <rect x="150" y="48" width="6" height="14" fill={c.stroke} />
      <ellipse cx="153" cy="42" rx="26" ry="9" fill={c.accent} stroke={c.stroke} strokeWidth={2} />
    </g>
  );
}

function TrainerShape({ c }: { c: Scheme }) {
  return (
    <g>
      {/* Propeller disc */}
      <ellipse cx="285" cy="80" rx="3" ry="22" fill={c.stroke} opacity={0.6} />

      {/* Straight low-mounted wing */}
      <path d="M150 95 L235 130 L235 120 L158 88 Z" fill={c.accent} stroke={c.stroke} strokeWidth={2} />
      <path d="M150 65 L235 30 L235 40 L158 72 Z" fill={c.accent} stroke={c.stroke} strokeWidth={2} />

      {/* Small fuselage */}
      <path
        d="M70 72 Q70 64 95 64 L270 76 Q278 80 270 84 L95 96 Q70 96 70 88 Z"
        fill={c.body}
        stroke={c.stroke}
        strokeWidth={2}
      />
      <ellipse cx="150" cy="78" rx="14" ry="8" fill={c.stroke} opacity={0.85} />

      {/* Single tail */}
      <path d="M78 80 L50 48 L82 70 Z" fill={c.accent} stroke={c.stroke} strokeWidth={2} />
      <path d="M78 86 L50 100 L82 90 Z" fill={c.accent} stroke={c.stroke} strokeWidth={2} />
    </g>
  );
}
