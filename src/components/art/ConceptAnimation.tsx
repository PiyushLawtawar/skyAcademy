import { useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import type { AnimKey } from '../../content/concepts';

const W = 400;
const H = 220;

/** A tiny top-down/side jet glyph used inside concept diagrams. */
function Jet({ x, y, s = 1, color = '#e2e8f0', rot = 0 }: { x: number; y: number; s?: number; color?: string; rot?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <path d="M22 0 L-14 -4 L-20 -12 L-22 -12 L-18 -3 L-22 -2 L-22 2 L-18 3 L-22 12 L-20 12 L-14 4 Z" fill={color} />
      <path d="M2 -2 L-8 -16 L-12 -16 L-6 -2 Z M2 2 L-8 16 L-12 16 L-6 2 Z" fill={color} opacity={0.8} />
      <ellipse cx="10" cy="0" rx="5" ry="1.8" fill="#38bdf8" />
    </g>
  );
}

function Frame({ children, caption }: { children: ReactNode; caption?: string }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 to-slate-800">
      <svg viewBox={`0 0 ${W} ${H}`} className="block w-full" role="img" aria-label={caption ?? 'Animated diagram'}>
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M20 0 L0 0 0 20" fill="none" stroke="#1e3a5f" strokeWidth="0.6" />
          </pattern>
          <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 Z" fill="context-stroke" />
          </marker>
        </defs>
        <rect width={W} height={H} fill="url(#grid)" />
        {children}
      </svg>
      {caption && <p className="px-3 pb-2 text-center text-sm font-semibold text-emerald-300">{caption}</p>}
    </div>
  );
}

const loop = (duration: number, delay = 0) => ({ duration, delay, repeat: Infinity, ease: 'easeInOut' as const });

export function ConceptAnimation({ anim }: { anim: AnimKey }) {
  switch (anim) {
    case 'forces':
      return <ForcesToy />;
    case 'axes':
      return <AxesToy />;
    case 'engine':
      return (
        <Frame caption="Suck → Squeeze → Bang → Blow">
          <path d="M40 80 L330 95 L360 110 L330 125 L40 140 Z" fill="#475569" />
          {[['SUCK', 70, '#38bdf8'], ['SQUEEZE', 150, '#a78bfa'], ['BANG', 230, '#f97316'], ['BLOW', 320, '#facc15']].map(([t, x, c], i) => (
            <motion.text key={t as string} x={x as number} y={70} fill={c as string} fontSize="15" fontWeight="800" textAnchor="middle" animate={{ opacity: [0.3, 1, 0.3] }} transition={loop(2.4, i * 0.6)}>
              {t}
            </motion.text>
          ))}
          {[110, 130, 150, 170].map((x) => (
            <motion.rect key={x} x={x} y={92} width="6" height="36" rx="2" fill="#cbd5e1" animate={{ scaleY: [1, 0.6, 1] }} style={{ transformOrigin: `${x + 3}px 110px` }} transition={loop(0.3)} />
          ))}
          <motion.ellipse cx="230" cy="110" rx="26" ry="12" fill="#f97316" animate={{ opacity: [0.5, 1, 0.5], rx: [20, 28, 20] }} transition={loop(0.5)} />
          {Array.from({ length: 6 }, (_, i) => (
            <motion.circle key={i} r="3" fill="#7dd3fc" cy={100 + (i % 3) * 10} animate={{ cx: [0, 60, 120] }} transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity, ease: 'linear' }} />
          ))}
          <motion.path d="M360 104 L400 110 L360 116 Z" fill="#facc15" animate={{ scaleX: [1, 1.6, 1] }} style={{ transformOrigin: '360px 110px' }} transition={loop(0.25)} />
        </Frame>
      );
    case 'mach':
      return (
        <Frame caption="Faster than sound → the waves pile up into a shock cone (sonic boom!)">
          {Array.from({ length: 6 }, (_, i) => (
            <motion.circle key={i} cy={110} fill="none" stroke="#38bdf8" strokeWidth="2" initial={{ r: 0, cx: 320, opacity: 1 }} animate={{ r: [0, 120], opacity: [0.9, 0] }} transition={{ duration: 2.4, delay: i * 0.4, repeat: Infinity, ease: 'linear' }} style={{ translateX: -i * 45 }} />
          ))}
          <path d="M330 110 L120 20 M330 110 L120 200" stroke="#f472b6" strokeWidth="3" strokeDasharray="8 6" className="anim-dash" />
          <Jet x={330} y={110} s={1.6} />
          <text x="20" y="30" fill="#f472b6" fontSize="14" fontWeight="800">Mach cone</text>
        </Frame>
      );
    case 'gforce':
      return <GForceToy />;
    case 'radar':
      return (
        <Frame caption="The beam sweeps round… echoes light up as blips">
          {[40, 80, 120].map((r) => (
            <circle key={r} cx="200" cy="200" r={r * 1.4} fill="none" stroke="#065f46" strokeWidth="1.5" />
          ))}
          <g className="anim-sweep" style={{ transformOrigin: '200px 200px' }}>
            <path d="M200 200 L200 30 A170 170 0 0 1 300 62 Z" fill="#10b981" opacity="0.35" />
          </g>
          {[
            [140, 90, 0],
            [270, 110, 1],
            [230, 60, 2],
          ].map(([x, y, i]) => (
            <motion.circle key={i} cx={x} cy={y} r="6" fill="#6ee7b7" animate={{ opacity: [0, 1, 0.2] }} transition={{ duration: 3, delay: i * 0.8, repeat: Infinity }} />
          ))}
        </Frame>
      );
    case 'bvr':
      return (
        <Frame caption="Radar sees far → missile flies beyond visual range">
          <Jet x={50} y={110} s={1.4} />
          <motion.path d="M70 110 Q200 40 340 100" fill="none" stroke="#3b82f6" strokeWidth="3" strokeDasharray="6 6" className="anim-dash" />
          <motion.g animate={{ offsetDistance: ['0%', '100%'] }} transition={{ duration: 2.6, repeat: Infinity, ease: 'easeIn' }} style={{ offsetPath: "path('M70 110 Q200 40 340 100')" }}>
            <rect x="-8" y="-2" width="16" height="4" rx="2" fill="#93c5fd" />
          </motion.g>
          <Jet x={355} y={100} s={1.1} color="#94a3b8" rot={180} />
          <path d="M60 60 L60 160" stroke="#64748b" strokeDasharray="4 4" />
          <text x="40" y="180" fill="#94a3b8" fontSize="11">what eyes see</text>
          <text x="180" y="200" fill="#93c5fd" fontSize="13" fontWeight="800">100+ km</text>
        </Frame>
      );
    case 'flares':
      return (
        <Frame caption="Hot flares pull the heat-seeker away">
          <motion.g animate={{ x: [0, 40] }} transition={loop(3)}>
            <Jet x={200} y={70} s={1.5} rot={-10} />
          </motion.g>
          {Array.from({ length: 8 }, (_, i) => (
            <motion.circle key={i} r="5" fill="#fde047" initial={{ cx: 180, cy: 80 }} animate={{ cx: [180, 120 - i * 10], cy: [80, 150 + (i % 3) * 15], opacity: [1, 0] }} transition={{ duration: 1.8, delay: i * 0.2, repeat: Infinity }} style={{ filter: 'drop-shadow(0 0 6px #f59e0b)' }} />
          ))}
          <motion.g animate={{ x: [0, -60], y: [0, 40] }} transition={loop(3)}>
            <rect x="40" y="150" width="20" height="4" rx="2" fill="#2dd4bf" transform="rotate(-20 50 152)" />
          </motion.g>
        </Frame>
      );
    case 'stealth':
      return (
        <Frame caption="Normal jet: echo comes back. Stealth jet: echo bounces away">
          <circle cx="40" cy="110" r="14" fill="#10b981" />
          <text x="22" y="145" fill="#6ee7b7" fontSize="11">radar</text>
          <motion.path d="M55 100 L250 60" stroke="#38bdf8" strokeWidth="3" markerEnd="url(#arrow)" animate={{ opacity: [0.2, 1, 0.2] }} transition={loop(1.6)} />
          <motion.path d="M250 60 L60 98" stroke="#f472b6" strokeWidth="3" strokeDasharray="5 5" markerEnd="url(#arrow)" animate={{ opacity: [0, 1, 0] }} transition={loop(1.6, 0.4)} />
          <Jet x={270} y={58} s={1.3} color="#94a3b8" rot={180} />
          <motion.path d="M55 120 L260 160" stroke="#38bdf8" strokeWidth="3" markerEnd="url(#arrow)" animate={{ opacity: [0.2, 1, 0.2] }} transition={loop(1.6)} />
          <motion.path d="M260 160 L360 210" stroke="#a3e635" strokeWidth="3" strokeDasharray="5 5" markerEnd="url(#arrow)" animate={{ opacity: [0, 1, 0] }} transition={loop(1.6, 0.4)} />
          <path d="M290 160 L250 148 L262 160 L250 172 Z" fill="#1f2937" stroke="#64748b" />
        </Frame>
      );
    case 'refuel':
      return (
        <Frame caption="The fighter's probe connects to the tanker's basket">
          <g>
            <rect x="40" y="50" width="160" height="28" rx="14" fill="#94a3b8" />
            <path d="M90 64 L150 64 L120 110 Z" fill="#cbd5e1" />
            <path d="M40 64 L20 40 L40 40 Z" fill="#94a3b8" />
          </g>
          <motion.path d="M190 72 Q240 100 270 120" stroke="#e2e8f0" strokeWidth="3" fill="none" animate={{ d: ['M190 72 Q240 100 270 120', 'M190 72 Q240 108 270 124', 'M190 72 Q240 100 270 120'] }} transition={loop(2)} />
          <circle cx="272" cy="122" r="8" fill="none" stroke="#f59e0b" strokeWidth="3" />
          <motion.g animate={{ x: [60, 0, 0, 60] }} transition={{ duration: 5, repeat: Infinity, times: [0, 0.4, 0.8, 1] }}>
            <Jet x={300} y={130} s={1.6} rot={180} />
          </motion.g>
          <text x="250" y="200" fill="#fbbf24" fontSize="14" fontWeight="800">⛽ fuel flowing!</text>
        </Frame>
      );
    case 'awacs':
      return (
        <Frame caption="High up, the AWACS sees far beyond the hills">
          <path d="M0 200 L80 120 L140 170 L220 100 L300 180 L400 140 L400 220 L0 220 Z" fill="#334155" />
          <motion.circle cx="200" cy="50" r="40" fill="#10b981" opacity="0.12" animate={{ r: [30, 190] , opacity: [0.35, 0]}} transition={{ duration: 3, repeat: Infinity }} />
          <rect x="150" y="44" width="100" height="14" rx="7" fill="#e2e8f0" />
          <ellipse cx="200" cy="38" rx="28" ry="6" fill="#f97316" className="anim-pulse" />
          <Jet x={60} y={170} s={0.8} color="#fda4af" rot={0} />
          <Jet x={350} y={160} s={0.8} color="#fda4af" rot={180} />
        </Frame>
      );
    case 'ooda':
      return (
        <Frame caption="Go round the loop faster than the other side">
          {['OBSERVE 👀', 'ORIENT 🧭', 'DECIDE 🤔', 'ACT ⚡'].map((t, i) => {
            const a = (i / 4) * Math.PI * 2 - Math.PI / 2;
            return (
              <motion.text key={t} x={200 + Math.cos(a) * 120} y={115 + Math.sin(a) * 75} fill="#e2e8f0" fontSize="15" fontWeight="800" textAnchor="middle" animate={{ fill: ['#e2e8f0', '#facc15', '#e2e8f0'] }} transition={{ duration: 4, delay: i, repeat: Infinity }}>
                {t}
              </motion.text>
            );
          })}
          <ellipse cx="200" cy="110" rx="90" ry="50" fill="none" stroke="#38bdf8" strokeWidth="3" strokeDasharray="10 8" className="anim-dash" />
          <g className="anim-sweep" style={{ transformOrigin: '200px 110px', animationDuration: '4s' }}>
            <circle cx="290" cy="110" r="7" fill="#facc15" />
          </g>
        </Frame>
      );
    case 'sead':
      return (
        <Frame caption="Find the enemy radar → follow its signal → switch it off">
          <rect x="300" y="170" width="40" height="20" fill="#475569" />
          <motion.path d="M320 170 L320 150" stroke="#94a3b8" strokeWidth="3" />
          {[0, 1, 2].map((i) => (
            <motion.circle key={i} cx="320" cy="150" fill="none" stroke="#f87171" strokeWidth="2" animate={{ r: [0, 60], opacity: [1, 0] }} transition={{ duration: 2, delay: i * 0.6, repeat: Infinity }} />
          ))}
          <Jet x={70} y={60} s={1.3} />
          <motion.g animate={{ offsetDistance: ['0%', '100%'] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeIn' }} style={{ offsetPath: "path('M90 70 Q220 60 318 152')" }}>
            <rect x="-8" y="-2" width="16" height="4" rx="2" fill="#c084fc" />
          </motion.g>
          <text x="20" y="200" fill="#c084fc" fontSize="12" fontWeight="800">Anti-radiation missile</text>
        </Frame>
      );
    case 'package':
      return (
        <Frame caption="Eyes → Radar-blinders → Escorts → Strikers → Tanker">
          {[
            ['👁️ AWACS', 60, 40, '#a7f3d0'],
            ['📶 SEAD', 140, 80, '#c084fc'],
            ['🛡️ Escort', 220, 60, '#93c5fd'],
            ['🎯 Strike', 260, 120, '#fca5a5'],
            ['⛽ Tanker', 80, 150, '#fde68a'],
          ].map(([t, x, y, c], i) => (
            <motion.g key={t as string} animate={{ x: [0, 30, 0] }} transition={loop(4, i * 0.3)}>
              <Jet x={x as number} y={y as number} s={1} color={c as string} />
              <text x={(x as number) - 20} y={(y as number) + 28} fill={c as string} fontSize="12" fontWeight="800">
                {t}
              </text>
            </motion.g>
          ))}
        </Frame>
      );
    case 'ew':
      return (
        <Frame caption="Jamming fills the radar screen with noise">
          <circle cx="80" cy="110" r="50" fill="#052e16" stroke="#10b981" />
          {Array.from({ length: 40 }, (_, i) => (
            <motion.circle key={i} cx={50 + ((i * 37) % 60)} cy={80 + ((i * 23) % 60)} r="1.6" fill="#6ee7b7" animate={{ opacity: [0, 1, 0] }} transition={{ duration: 0.4, delay: (i % 10) * 0.05, repeat: Infinity }} />
          ))}
          <Jet x={300} y={100} s={1.5} rot={180} />
          {[0, 1, 2, 3].map((i) => (
            <motion.path key={i} d="M280 100 Q240 80 200 100 T120 100" stroke="#facc15" strokeWidth="2" fill="none" animate={{ opacity: [0, 1, 0], x: [0, -20] }} transition={{ duration: 1, delay: i * 0.25, repeat: Infinity }} />
          ))}
        </Frame>
      );
    case 'drones':
      return (
        <Frame caption="A swarm of drones moves together like a flock of birds">
          {Array.from({ length: 12 }, (_, i) => (
            <motion.g key={i} animate={{ x: [0, 40, -20, 0], y: [0, -15, 10, 0] }} transition={loop(5, i * 0.1)}>
              <g transform={`translate(${120 + (i % 4) * 45} ${60 + Math.floor(i / 4) * 45})`}>
                <rect x="-8" y="-2" width="16" height="4" rx="2" fill="#cbd5e1" />
                <rect x="-2" y="-8" width="4" height="16" rx="2" fill="#94a3b8" />
                <circle r="2" fill="#38bdf8" />
              </g>
            </motion.g>
          ))}
        </Frame>
      );
    case 'network':
      return (
        <Frame caption="Everyone shares one live picture">
          {[
            [70, 60, '📡'],
            [330, 60, '👁️'],
            [70, 170, '🛩️'],
            [330, 170, '🚢'],
            [200, 115, '🏢'],
          ].map(([x, y, e]) => (
            <text key={e as string} x={x as number} y={(y as number) + 8} fontSize="26" textAnchor="middle">
              {e}
            </text>
          ))}
          {[
            [70, 60],
            [330, 60],
            [70, 170],
            [330, 170],
          ].map(([x, y], i) => (
            <line key={i} x1={x} y1={y} x2={200} y2={115} stroke="#38bdf8" strokeWidth="2" strokeDasharray="6 6" className="anim-dash" />
          ))}
          <motion.circle cx="200" cy="115" r="30" fill="none" stroke="#facc15" animate={{ r: [24, 50], opacity: [1, 0] }} transition={{ duration: 1.6, repeat: Infinity }} />
        </Frame>
      );
    case 'scramble':
      return (
        <Frame caption="Alarm → run → start engines → take off in minutes!">
          <motion.rect width={W} height={H} fill="#ef4444" animate={{ opacity: [0, 0.15, 0] }} transition={{ duration: 1, repeat: Infinity }} />
          <rect x="0" y="180" width={W} height="20" fill="#334155" />
          {Array.from({ length: 8 }, (_, i) => (
            <rect key={i} x={i * 50 + 10} y="189" width="24" height="2" fill="#f8fafc" />
          ))}
          <motion.g animate={{ x: [-60, 140, 420], y: [0, 0, -140], rotate: [0, 0, -18] }} transition={{ duration: 3.2, repeat: Infinity, times: [0, 0.5, 1], ease: 'easeIn' }}>
            <Jet x={40} y={172} s={1.5} />
          </motion.g>
          <motion.text x="200" y="60" textAnchor="middle" fill="#fecaca" fontSize="26" fontWeight="900" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 0.8, repeat: Infinity }}>
            SCRAMBLE!
          </motion.text>
        </Frame>
      );
    case 'cas':
      return (
        <Frame caption="Ground controller guides the jet to help the soldiers">
          <path d="M0 180 Q200 160 400 180 L400 220 L0 220 Z" fill="#3f6212" />
          <text x="60" y="185" fontSize="22">🪖🪖</text>
          <motion.path d="M90 170 Q160 90 230 40" stroke="#facc15" strokeWidth="2" strokeDasharray="4 6" fill="none" className="anim-dash" />
          <text x="100" y="150" fill="#fde68a" fontSize="12" fontWeight="800">📻 "Help needed!"</text>
          <motion.g animate={{ x: [-80, 420] }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}>
            <Jet x={0} y={60} s={1.4} />
          </motion.g>
        </Frame>
      );
    case 'eject':
      return (
        <Frame caption="Canopy off → rocket seat → parachute opens">
          <motion.g animate={{ x: [0, 160] }} transition={loop(4)}>
            <Jet x={100} y={160} s={1.8} />
          </motion.g>
          <motion.g animate={{ y: [140, 30, 60], opacity: [0, 1, 1] }} transition={{ duration: 4, repeat: Infinity, times: [0, 0.4, 1] }}>
            <path d="M180 0 Q200 -30 220 0 Z" fill="#f97316" transform="translate(0 20)" />
            <line x1="182" y1="20" x2="200" y2="48" stroke="#e2e8f0" />
            <line x1="218" y1="20" x2="200" y2="48" stroke="#e2e8f0" />
            <text x="190" y="62" fontSize="18">🧑‍✈️</text>
          </motion.g>
        </Frame>
      );
  }
}

function ForcesToy() {
  const [throttle, setThrottle] = useState(60);
  const [angle, setAngle] = useState(5);
  const lift = Math.min(100, throttle * 0.6 + angle * 5);
  const weight = 55;
  const drag = 20 + angle * 3 + throttle * 0.15;
  const climb = Math.max(-60, Math.min(60, (lift - weight) * 1.6));
  const stall = angle > 14;
  return (
    <div className="flex flex-col gap-3">
      <Frame caption={stall ? '⚠️ Too steep! The wing stalls and lift drops.' : climb > 5 ? '⬆️ Lift is bigger than Weight: climbing!' : climb < -5 ? '⬇️ Weight wins: going down!' : '➡️ Balanced: flying level'}>
        <motion.g animate={{ y: stall ? 50 : -climb, rotate: stall ? 20 : -angle }} transition={{ type: 'spring', damping: 14 }} style={{ transformOrigin: '200px 110px' }}>
          <Jet x={200} y={110} s={2.4} />
          <line x1="200" y1="110" x2="200" y2={110 - (stall ? lift * 0.3 : lift) * 0.9} stroke="#22c55e" strokeWidth="6" markerEnd="url(#arrow)" />
          <line x1="200" y1="110" x2="200" y2={110 + weight * 0.9} stroke="#f97316" strokeWidth="6" markerEnd="url(#arrow)" />
          <line x1="230" y1="110" x2={230 + throttle * 1.1} y2="110" stroke="#3b82f6" strokeWidth="6" markerEnd="url(#arrow)" />
          <line x1="170" y1="110" x2={170 - drag * 1.1} y2="110" stroke="#ef4444" strokeWidth="6" markerEnd="url(#arrow)" />
        </motion.g>
        <text x="10" y="20" fill="#22c55e" fontSize="13" fontWeight="800">LIFT ↑</text>
        <text x="10" y="38" fill="#f97316" fontSize="13" fontWeight="800">WEIGHT ↓</text>
        <text x="330" y="20" fill="#3b82f6" fontSize="13" fontWeight="800">THRUST →</text>
        <text x="330" y="38" fill="#ef4444" fontSize="13" fontWeight="800">← DRAG</text>
      </Frame>
      <label className="flex items-center gap-3 font-display font-bold text-slate-800">
        🔥 Throttle
        <input type="range" min={0} max={100} value={throttle} onChange={(e) => setThrottle(+e.target.value)} className="h-10 flex-1 accent-orange-500" />
      </label>
      <label className="flex items-center gap-3 font-display font-bold text-slate-800">
        📐 Wing angle
        <input type="range" min={0} max={18} value={angle} onChange={(e) => setAngle(+e.target.value)} className="h-10 flex-1 accent-sky-500" />
      </label>
    </div>
  );
}

function AxesToy() {
  const [mode, setMode] = useState<'pitch' | 'roll' | 'yaw'>('pitch');
  const anim = mode === 'pitch' ? { rotateX: [0, 35, -35, 0] } : mode === 'roll' ? { rotateZ: [0, 40, -40, 0] } : { rotateY: [0, 40, -40, 0] };
  return (
    <div className="flex flex-col gap-3">
      <div className="flex h-56 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-sky-400 to-sky-200" style={{ perspective: 600 }}>
        <motion.div key={mode} animate={anim} transition={{ duration: 3, repeat: Infinity }} className="text-8xl" style={{ transformStyle: 'preserve-3d' }}>
          {mode === 'yaw' ? '🛩️' : '✈️'}
        </motion.div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {(
          [
            ['pitch', '⬆️⬇️ Pitch', 'Elevator'],
            ['roll', '🔄 Roll', 'Ailerons'],
            ['yaw', '⬅️➡️ Yaw', 'Rudder'],
          ] as const
        ).map(([m, label, part]) => (
          <button key={m} onClick={() => setMode(m)} className={`min-h-14 rounded-2xl font-display font-bold ${mode === m ? 'bg-saffron text-white' : 'bg-slate-100 text-slate-700'}`}>
            {label}
            <span className="block text-xs font-semibold opacity-80">{part}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function GForceToy() {
  const [g, setG] = useState(1);
  return (
    <div className="flex flex-col gap-3">
      <div className="relative flex h-56 items-center justify-center overflow-hidden rounded-2xl bg-slate-900">
        <motion.div animate={{ scaleY: 1 - (g - 1) * 0.05, y: (g - 1) * 3 }} className="text-7xl" style={{ filter: g >= 8 ? 'grayscale(0.7) brightness(0.7)' : 'none' }}>
          🧑‍✈️
        </motion.div>
        <div className="absolute right-4 top-4 text-right">
          <p className="font-display text-4xl font-black text-amber-300">{g}G</p>
          <p className="text-sm text-slate-300">You feel {g}× heavier</p>
        </div>
        {g >= 7 && <div className="absolute inset-0" style={{ boxShadow: `inset 0 0 ${g * 12}px ${g * 6}px #000` }} />}
        {g >= 7 && <p className="absolute bottom-3 text-sm font-bold text-amber-200">Vision narrowing… G-suit squeezing! 💪</p>}
      </div>
      <label className="flex items-center gap-3 font-display font-bold text-slate-800">
        ↪️ Turn harder
        <input type="range" min={1} max={9} value={g} onChange={(e) => setG(+e.target.value)} className="h-10 flex-1 accent-amber-500" />
      </label>
    </div>
  );
}
