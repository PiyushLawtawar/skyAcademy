import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import type { SceneKind } from '../../content/history';
import { SideHelicopter, SideTransport } from './JetArt';
import { AircraftImg } from './AircraftImg';

const SKIES: Record<SceneKind, string> = {
  airlift: 'linear-gradient(#7cc4ff, #dff1ff)',
  mountains: 'linear-gradient(#5aa7e8, #d6ecff)',
  desert: 'linear-gradient(#ffb36b, #ffe4b5)',
  river: 'linear-gradient(#8fd3ff, #e6f7ff)',
  glacier: 'linear-gradient(#9cc8ef, #f1f7ff)',
  island: 'linear-gradient(#45b6fe, #c9f0ff)',
  dogfight: 'linear-gradient(#3f8fd8, #b8dcff)',
  night: 'linear-gradient(#050816, #1b2347)',
  flood: 'linear-gradient(#6b7f99, #b7c4d6)',
  sea: 'linear-gradient(#4fb0ff, #c6ecff)',
  city: 'linear-gradient(#7cc4ff, #e0f2ff)',
};

/** An animated, peaceful illustration for a War Room story panel. */
export function WarScene({ kind, height = 220 }: { kind: SceneKind; height?: number }) {
  const night = kind === 'night';
  return (
    <div className="relative w-full overflow-hidden rounded-2xl" style={{ height, background: SKIES[kind] }} aria-hidden>
      {night && (
        <>
          {Array.from({ length: 30 }, (_, i) => (
            <div key={i} className="anim-twinkle absolute h-[2px] w-[2px] rounded-full bg-white" style={{ left: `${(i * 31) % 100}%`, top: `${(i * 17) % 60}%`, animationDelay: `${i * 0.2}s` }} />
          ))}
          <div className="absolute right-8 top-6 h-10 w-10 rounded-full bg-slate-100 shadow-[0_0_30px_10px_#c7d2fe55]" />
        </>
      )}
      <Ground kind={kind} />
      <Actors kind={kind} />
    </div>
  );
}

function Ground({ kind }: { kind: SceneKind }) {
  const svg = (children: ReactNode) => (
    <svg className="absolute bottom-0 left-0 h-full w-full" viewBox="0 0 400 220" preserveAspectRatio="none">
      {children}
    </svg>
  );
  switch (kind) {
    case 'mountains':
    case 'glacier':
      return svg(
        <>
          <path d="M0 200 L60 110 L100 150 L160 60 L220 140 L270 90 L330 160 L400 100 L400 220 L0 220 Z" fill={kind === 'glacier' ? '#cbd5e1' : '#6b7c93'} />
          <path d="M160 60 L180 88 L168 92 L150 78 Z M270 90 L286 112 L274 114 L260 104 Z M60 110 L74 130 L62 132 L50 124 Z" fill="#fff" />
          <path d="M0 220 L0 190 Q100 170 200 195 T400 185 L400 220 Z" fill={kind === 'glacier' ? '#f1f5f9' : '#4b5b70'} />
        </>,
      );
    case 'desert':
      return svg(
        <>
          <path d="M0 170 Q100 140 200 170 T400 160 L400 220 L0 220 Z" fill="#e9b872" />
          <path d="M0 195 Q120 175 240 195 T400 190 L400 220 L0 220 Z" fill="#d79b52" />
          <rect x="300" y="150" width="30" height="16" fill="#8b6b3f" />
          <rect x="310" y="140" width="4" height="10" fill="#8b6b3f" />
          <path d="M312 140 L326 144 L312 148 Z" fill="#ff9933" />
        </>,
      );
    case 'river':
      return svg(
        <>
          <path d="M0 160 L400 150 L400 220 L0 220 Z" fill="#5ea85e" />
          <path d="M0 185 Q100 170 200 188 T400 180 L400 205 Q300 200 200 210 T0 208 Z" fill="#3b9ae1" />
          <path d="M40 196 Q60 192 80 196 M220 200 Q240 196 260 200" stroke="#bfe6ff" strokeWidth="2" fill="none" className="anim-dash" strokeDasharray="6 6" />
        </>,
      );
    case 'island':
    case 'sea':
      return svg(
        <>
          <rect x="0" y="160" width="400" height="60" fill="#1d8fe0" />
          <path d="M0 175 Q50 168 100 175 T200 175 T300 175 T400 175" stroke="#bfe6ff" strokeWidth="2" fill="none" className="anim-dash" strokeDasharray="8 8" />
          <ellipse cx="280" cy="165" rx="70" ry="14" fill="#f5d48a" />
          <rect x="290" y="120" width="5" height="40" fill="#8b5a2b" />
          <path d="M292 120 Q270 110 262 124 M292 120 Q312 108 322 122 M292 120 Q285 100 300 98" stroke="#22a34a" strokeWidth="6" fill="none" strokeLinecap="round" />
          <rect x="200" y="152" width="70" height="6" fill="#64748b" />
        </>,
      );
    case 'flood':
      return svg(
        <>
          <path d="M0 140 L70 70 L120 120 L190 50 L260 120 L320 80 L400 130 L400 220 L0 220 Z" fill="#556270" />
          <path d="M0 175 Q100 165 200 178 T400 170 L400 220 L0 220 Z" fill="#7a6a4f" />
          <rect x="150" y="150" width="40" height="26" fill="#cbd5e1" />
          <path d="M146 150 L170 132 L194 150 Z" fill="#b45309" />
          <circle cx="170" cy="128" r="4" fill="#fbbf24" />
        </>,
      );
    case 'night':
      return svg(
        <>
          <path d="M0 190 Q100 170 200 188 T400 182 L400 220 L0 220 Z" fill="#0b1020" />
          <rect x="60" y="196" width="280" height="8" fill="#1f2937" />
        </>,
      );
    default:
      return svg(<path d="M0 190 Q100 175 200 190 T400 185 L400 220 L0 220 Z" fill="#5ea85e" />);
  }
}

function Actors({ kind }: { kind: SceneKind }) {
  // Actors move in % of the scene width so they cross any screen size; the
  // first pass starts part-way across so the scene is never empty.
  const fly = (delay = 0, duration = 9, top = '20%', reverse = false) => ({
    className: 'absolute',
    style: { top, scaleX: reverse ? -1 : 1 },
    initial: { left: reverse ? '70%' : '10%' },
    animate: { left: reverse ? ['70%', '-35%'] : ['10%', '110%'] },
    transition: { duration, delay: delay * 0.3, repeat: Infinity, repeatType: 'loop' as const, ease: 'linear' as const },
  });

  switch (kind) {
    case 'airlift':
      return (
        <>
          <motion.div {...fly(0, 12, '18%')}>
            <SideTransport width={170} />
          </motion.div>
          <motion.div {...fly(5, 12, '42%')}>
            <SideTransport width={130} body="#a7b3c2" />
          </motion.div>
        </>
      );
    case 'dogfight':
      return (
        <>
          <motion.div {...fly(0, 5, '20%')} animate={{ left: ['-20%', '110%'], y: [0, -30, 20, 0] }}>
            <AircraftImg kind="mirage" width={170} burner />
          </motion.div>
          <motion.div {...fly(1.2, 5, '45%')} animate={{ left: ['-30%', '110%'], y: [0, 25, -20, 0] }}>
            <AircraftImg kind="su30" width={160} burner />
          </motion.div>
        </>
      );
    case 'mountains':
    case 'glacier':
      return (
        <>
          <motion.div {...fly(0, 8, '12%')}>
            <AircraftImg kind="mirage" width={160} burner />
          </motion.div>
          <motion.div {...fly(2, 16, '38%', true)}>
            <SideHelicopter width={100} />
          </motion.div>
        </>
      );
    case 'desert':
      return (
        <>
          <motion.div {...fly(0, 6, '22%')}>
            <AircraftImg kind="tejas" width={150} burner />
          </motion.div>
          <motion.div {...fly(0.6, 6, '32%')}>
            <AircraftImg kind="tejas" width={140} burner />
          </motion.div>
          <div className="absolute right-[10%] top-[6%] h-16 w-16 rounded-full bg-yellow-200 shadow-[0_0_40px_20px_#fde68a88]" />
        </>
      );
    case 'river':
      return (
        <>
          <motion.div {...fly(0, 14, '25%')}>
            <SideHelicopter width={100} />
          </motion.div>
          <motion.div {...fly(4, 14, '45%')}>
            <SideHelicopter width={85} body="#6b8f6b" />
          </motion.div>
        </>
      );
    case 'island':
    case 'sea':
      return (
        <motion.div {...fly(0, 11, '20%')}>
          <SideTransport width={160} />
        </motion.div>
      );
    case 'flood':
      return (
        <motion.div className="absolute left-[38%] top-[18%]" animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity }}>
          <SideHelicopter width={120} />
          <div className="mx-auto -mt-1 ml-[70px] h-14 w-[2px] bg-slate-700" />
          <div className="ml-[64px] text-lg">🧍</div>
        </motion.div>
      );
    case 'night':
      return (
        <motion.div {...fly(0, 10, '30%')}>
          <AircraftImg kind="su30" width={170} burner />
        </motion.div>
      );
    default:
      return (
        <motion.div {...fly(0, 18, '20%')}>
          <AircraftImg kind="netra" width={150} />
        </motion.div>
      );
  }
}
