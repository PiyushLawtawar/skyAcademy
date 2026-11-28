import type { ReactNode } from 'react';

// Original, stylised aircraft drawings used for fly-pasts, the Armoury and the
// Sortie game. Shapes only — no real markings beyond a simple tricolour roundel.

/** Side profile of a big transport plane (C-17 / C-130 family look), nose right. */
export function SideTransport({ width = 200, body = '#9aa8b8' }: { width?: number; body?: string }) {
  return (
    <svg viewBox="0 0 240 90" width={width} height={(width * 90) / 240} aria-hidden>
      <path d="M14 40 L30 6 L50 6 L58 38 Z" fill={body} />
      <rect x="20" y="8" width="44" height="6" rx="2" fill={body} />
      <path d="M14 38 Q40 30 120 30 Q205 30 232 50 Q210 66 120 66 L30 62 Q16 56 14 38 Z" fill={body} />
      <path d="M90 44 L160 44 L118 82 Z" fill="#b8c4d2" />
      <rect x="112" y="56" width="22" height="9" rx="4" fill="#64748b" />
      <path d="M200 38 Q214 40 222 46 L204 46 Z" fill="#5fd3ff" />
      <circle cx="70" cy="46" r="6" fill="#ff9933" />
      <circle cx="70" cy="46" r="4" fill="#fff" />
      <circle cx="70" cy="46" r="2" fill="#138808" />
    </svg>
  );
}

/** Side profile of a helicopter with a spinning main rotor. */
export function SideHelicopter({ width = 130, body = '#5b7a5b' }: { width?: number; body?: string }) {
  return (
    <svg viewBox="0 0 160 80" width={width} height={(width * 80) / 160} aria-hidden>
      <g className="anim-rotor" style={{ transformOrigin: '90px 14px' }}>
        <rect x="20" y="12" width="140" height="4" rx="2" fill="#334155" />
      </g>
      <rect x="86" y="14" width="8" height="10" fill="#334155" />
      <path d="M8 34 L60 38 L60 46 L8 40 Z" fill={body} />
      <circle cx="10" cy="36" r="8" fill="none" stroke="#334155" strokeWidth="2" className="anim-rotor-fast" style={{ transformOrigin: '10px 36px' }} />
      <path d="M56 30 Q80 20 120 24 Q150 30 150 46 Q140 60 110 60 L70 58 Q54 50 56 30 Z" fill={body} />
      <path d="M120 28 Q140 32 146 44 L122 44 Z" fill="#5fd3ff" opacity={0.85} />
      <rect x="80" y="64" width="60" height="3" rx="1.5" fill="#334155" />
      <rect x="90" y="58" width="3" height="7" fill="#334155" />
      <rect x="126" y="58" width="3" height="7" fill="#334155" />
    </svg>
  );
}

export type TopJetShape = {
  wing: 'delta' | 'swept' | 'cranked';
  canards?: boolean;
  twinTail?: boolean;
  tailplanes?: boolean;
  /** Visual length multiplier (Su-30MKI is big, Tejas is small). */
  scale?: number;
};

export interface PylonPoint {
  x: number;
  y: number;
}

/** Fixed pool of pylon positions on the 400×400 top-view canvas, in fill order. */
export const PYLON_POOL: PylonPoint[] = [
  { x: 62, y: 300 },
  { x: 338, y: 300 },
  { x: 105, y: 282 },
  { x: 295, y: 282 },
  { x: 200, y: 232 },
  { x: 145, y: 262 },
  { x: 255, y: 262 },
  { x: 84, y: 292 },
  { x: 316, y: 292 },
  { x: 178, y: 180 },
  { x: 222, y: 180 },
  { x: 200, y: 290 },
  { x: 125, y: 272 },
  { x: 275, y: 272 },
];

/** Top-down view of a fighter, nose up, on a 400×400 canvas. */
export function TopJet({ shape, color = '#7f93ad', children }: { shape: TopJetShape; color?: string; children?: ReactNode }) {
  const dark = '#4b5d78';
  const wingPath =
    shape.wing === 'delta'
      ? 'M200 120 L40 310 L360 310 Z'
      : shape.wing === 'cranked'
        ? 'M200 130 L150 200 L40 300 L50 318 L350 318 L360 300 L250 200 Z'
        : 'M190 170 L50 290 L50 312 L190 262 L210 262 L350 312 L350 290 L210 170 Z';

  return (
    <svg viewBox="0 0 400 400" className="h-full w-full" role="img" aria-label="Top view of the fighter jet">
      <defs>
        <linearGradient id="tj-body" x1="0" x2="1">
          <stop offset="0" stopColor={dark} />
          <stop offset="0.5" stopColor={color} />
          <stop offset="1" stopColor={dark} />
        </linearGradient>
      </defs>
      <g transform={`translate(200 210) scale(${shape.scale ?? 1}) translate(-200 -210)`}>
        <path d={wingPath} fill={color} stroke={dark} strokeWidth={2} />
        {shape.tailplanes && <path d="M200 320 L130 362 L130 374 L270 374 L270 362 Z" fill={color} stroke={dark} strokeWidth={2} />}
        {shape.canards && <path d="M200 118 L140 150 L142 160 L258 160 L260 150 Z" fill={color} stroke={dark} strokeWidth={2} />}
        {/* fuselage */}
        <path d="M200 18 Q222 70 224 150 L226 360 Q200 380 174 360 L176 150 Q178 70 200 18 Z" fill="url(#tj-body)" stroke={dark} strokeWidth={2} />
        {/* canopy */}
        <ellipse cx="200" cy="92" rx="11" ry="30" fill="#5fd3ff" opacity={0.85} />
        {/* tail fin(s) */}
        {shape.twinTail ? (
          <>
            <rect x="176" y="300" width="8" height="70" rx="3" fill={dark} />
            <rect x="216" y="300" width="8" height="70" rx="3" fill={dark} />
          </>
        ) : (
          <rect x="196" y="296" width="8" height="78" rx="3" fill={dark} />
        )}
        {/* roundels */}
        {[132, 268].map((cx) => (
          <g key={cx}>
            <circle cx={cx} cy="246" r="9" fill="#ff9933" />
            <circle cx={cx} cy="246" r="6" fill="#fff" />
            <circle cx={cx} cy="246" r="3" fill="#138808" />
          </g>
        ))}
      </g>
      {children}
    </svg>
  );
}

const STORE_COLORS: Record<string, string> = {
  'aam-bvr': '#3b82f6',
  'aam-wvr': '#14b8a6',
  cruise: '#ef4444',
  'ground-bomb': '#f59e0b',
  'anti-radar': '#a855f7',
  'anti-ship': '#0ea5e9',
  fuel: '#94a3b8',
  gun: '#64748b',
};

export function storeColor(kind: string): string {
  return STORE_COLORS[kind] ?? '#94a3b8';
}

/**
 * Where each kind of store prefers to hang (indexes into PYLON_POOL): heavy
 * cruise missiles and tanks go on the belly/inboard pylons, dogfight
 * missiles out on the wingtips, like real loadouts.
 */
const PYLON_PREFERENCE: Record<string, number[]> = {
  cruise: [4, 11, 5, 6],
  'anti-ship': [4, 11, 5, 6, 12, 13],
  fuel: [11, 4, 5, 6, 12, 13],
  'ground-bomb': [5, 6, 12, 13, 2, 3, 11],
  'anti-radar': [5, 6, 12, 13, 2, 3],
  'aam-wvr': [0, 1, 7, 8, 2, 3],
  'aam-bvr': [2, 3, 9, 10, 7, 8, 12, 13, 0, 1],
};

/** Assign each loaded store (in load order) to a free pylon index. */
export function assignPylons(kinds: string[], hardpoints: number): number[] {
  const used = new Set<number>();
  return kinds.map((kind) => {
    const prefs = (PYLON_PREFERENCE[kind] ?? []).filter((i) => i < hardpoints);
    const all = [...prefs, ...Array.from({ length: hardpoints }, (_, i) => i)];
    const slot = all.find((i) => !used.has(i)) ?? -1;
    used.add(slot);
    return slot;
  });
}

/** A tiny top-view store (missile, bomb or tank) drawn at a pylon point. */
export function PylonStore({ x, y, kind }: { x: number; y: number; kind: string }) {
  const c = storeColor(kind);
  if (kind === 'fuel') {
    return <ellipse cx={x} cy={y} rx={9} ry={30} fill={c} stroke="#475569" strokeWidth={2} />;
  }
  if (kind === 'ground-bomb') {
    return (
      <g>
        <ellipse cx={x} cy={y} rx={8} ry={24} fill={c} stroke="#7c4a03" strokeWidth={2} />
        <path d={`M${x - 10} ${y + 22} L${x + 10} ${y + 22} L${x} ${y + 12} Z`} fill="#7c4a03" />
      </g>
    );
  }
  const len = kind === 'cruise' ? 46 : 34;
  return (
    <g>
      <rect x={x - 4} y={y - len / 2} width={8} height={len} rx={4} fill={c} stroke="#1e293b" strokeWidth={1.5} />
      <path d={`M${x - 4} ${y - len / 2 + 2} Q${x} ${y - len / 2 - 8} ${x + 4} ${y - len / 2 + 2} Z`} fill="#e2e8f0" />
      <path d={`M${x - 10} ${y + len / 2} L${x + 10} ${y + len / 2} L${x} ${y + len / 2 - 10} Z`} fill="#1e293b" />
    </g>
  );
}
