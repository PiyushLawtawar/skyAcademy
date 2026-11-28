import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ZoneShell } from '../components/zone/ZoneShell';
import { BigButton } from '../components/BigButton';
import { useProgressStore } from '../store/progressStore';
import { soundManager } from '../lib/sound';
import { spriteImage } from '../components/art/aircraftSprites';

type Phase = 'menu' | 'scramble' | 'flying' | 'done';
type Mode = 'day' | 'night';

interface EndState {
  reason: 'complete' | 'fuel' | 'shields';
  rings: number;
  ringsTotal: number;
  stars: 1 | 2 | 3;
  refuelled: boolean;
}

const MISSION_LENGTH = 12000; // world units
const CHECKLIST = ['🚨 Alarm! Run to the jet', '🪖 Helmet & G-suit on', '🔥 Engines start', '📻 "Tower, cleared for take-off!"'];

export function Sortie() {
  const sfx = useProgressStore((s) => s.settings.sfx);
  const recordLessonResult = useProgressStore((s) => s.recordLessonResult);
  const best = useProgressStore((s) => s.lessonResults['sortie:training']?.stars ?? 0);
  const [phase, setPhase] = useState<Phase>('menu');
  const [mode, setMode] = useState<Mode>('day');
  const [step, setStep] = useState(0);
  const [end, setEnd] = useState<EndState | null>(null);

  const start = (m: Mode) => {
    soundManager.unlock();
    soundManager.play('cockpitBeep', { sfxEnabled: sfx });
    setMode(m);
    setStep(0);
    setPhase('scramble');
  };

  useEffect(() => {
    if (phase !== 'scramble') return;
    if (step >= CHECKLIST.length) {
      soundManager.play('jetFlyPast', { sfxEnabled: sfx });
      const t = setTimeout(() => setPhase('flying'), 500);
      return () => clearTimeout(t);
    }
    soundManager.play(step === 2 ? 'engineStartup' : 'radarPing', { sfxEnabled: sfx });
    const t = setTimeout(() => setStep((s) => s + 1), 900);
    return () => clearTimeout(t);
  }, [phase, step, sfx]);

  const onEnd = useCallback(
    (e: EndState) => {
      setEnd(e);
      setPhase('done');
      recordLessonResult('sortie:training', { stars: e.stars, hintsUsed: 0 });
      soundManager.play(e.reason === 'complete' ? 'levelUp' : 'starCollect', { sfxEnabled: sfx });
    },
    [recordLessonResult, sfx],
  );

  return (
    <ZoneShell emoji="🕹️" title="Fly a Sortie" subtitle="Scramble, fly through the rings, refuel in mid-air, and land!" wide>
      <AnimatePresence mode="wait">
        {phase === 'menu' && (
          <motion.div key="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid gap-4 md:grid-cols-2">
            <div className="hud-panel rounded-3xl p-5 text-white">
              <h2 className="font-display text-2xl font-extrabold">🎮 How to fly</h2>
              <ul className="mt-3 space-y-2 text-slate-100">
                <li>👆 <b>Touch & drag</b> (or ↑ ↓ keys) to steer up and down.</li>
                <li>🔥 <b>Afterburner</b> = more speed, but burns fuel fast!</li>
                <li>⭕ Fly through the <b>golden rings</b>.</li>
                <li>⛈️ Avoid <b>storm clouds</b> and stay above the <b>mountains</b>.</li>
                <li>⛽ When fuel is low, a <b>tanker</b> appears. Touch its basket to refuel!</li>
              </ul>
              {best > 0 && <p className="mt-3 font-bold text-amber-300">Your best: {'⭐'.repeat(best)}</p>}
            </div>
            <div className="flex flex-col gap-3">
              <button onClick={() => start('day')} className="flex min-h-28 items-center gap-4 rounded-3xl bg-gradient-to-r from-sky-400 to-sky-600 p-5 text-left text-white shadow-lg active:scale-95">
                <span className="text-5xl">☀️</span>
                <span>
                  <span className="block font-display text-2xl font-extrabold">Training Sortie</span>
                  <span className="text-sm opacity-90">Day flight over the Himalayas</span>
                </span>
              </button>
              <button onClick={() => start('night')} className="flex min-h-28 items-center gap-4 rounded-3xl bg-gradient-to-r from-indigo-900 to-slate-900 p-5 text-left text-white shadow-lg active:scale-95">
                <span className="text-5xl">🌙</span>
                <span>
                  <span className="block font-display text-2xl font-extrabold">Night Patrol</span>
                  <span className="text-sm opacity-90">Fly with instruments under the stars</span>
                </span>
              </button>
            </div>
          </motion.div>
        )}

        {phase === 'scramble' && (
          <motion.div key="scramble" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative overflow-hidden rounded-3xl bg-slate-950 p-8 text-center text-white">
            <motion.div className="absolute inset-0 bg-red-600" animate={{ opacity: [0, 0.35, 0] }} transition={{ duration: 0.8, repeat: Infinity }} />
            <motion.p className="relative font-display text-5xl font-black tracking-widest text-red-300" animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 0.8, repeat: Infinity }}>
              SCRAMBLE!
            </motion.p>
            <div className="relative mx-auto mt-6 flex max-w-md flex-col gap-2 text-left">
              {CHECKLIST.map((c, i) => (
                <motion.p key={c} initial={{ opacity: 0, x: -20 }} animate={{ opacity: i < step ? 1 : 0.25, x: 0 }} className="rounded-xl bg-white/10 px-4 py-2 font-display text-lg font-bold">
                  {i < step ? '✅' : '⬜'} {c}
                </motion.p>
              ))}
            </div>
          </motion.div>
        )}

        {phase === 'flying' && (
          <motion.div key="flying" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <FlightCanvas mode={mode} sfx={sfx} onEnd={onEnd} />
          </motion.div>
        )}

        {phase === 'done' && end && (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass flex flex-col items-center gap-3 rounded-3xl p-6 text-center shadow-xl">
            <p className="text-6xl">{end.reason === 'complete' ? '🛬' : end.reason === 'fuel' ? '⛽' : '🛡️'}</p>
            <h2 className="font-display text-3xl font-extrabold text-slate-900">
              {end.reason === 'complete' ? 'Mission complete! Safe landing!' : end.reason === 'fuel' ? 'Bingo fuel! Returning to base.' : 'Too many bumps: returning to base.'}
            </h2>
            <p className="text-5xl">{'⭐'.repeat(end.stars)}</p>
            <p className="text-lg text-slate-700">
              Rings: <b>{end.rings}</b> / {end.ringsTotal} {end.refuelled && '· ⛽ Mid-air refuelling done!'}
            </p>
            <p className="max-w-lg rounded-2xl bg-sky-50 p-3 text-slate-700">
              {end.reason === 'fuel'
                ? 'Real pilots always watch the fuel gauge. "Bingo fuel" means just enough to get home. Next time, find the tanker!'
                : end.reason === 'shields'
                  ? 'Real pilots fly around storms and keep a safe height over mountains. Try again, cadet!'
                  : 'Real IAF pilots fly sorties like this every day to stay sharp. Brilliant flying!'}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <BigButton variant="ghost" onClick={() => setPhase('menu')}>
                Menu
              </BigButton>
              <BigButton onClick={() => start(mode)}>✈️ Fly again</BigButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ZoneShell>
  );
}

// ---------------- The flight itself (canvas) ----------------

interface Ring {
  x: number;
  y: number;
  hit: boolean;
  passed: boolean;
}
interface Storm {
  x: number;
  y: number;
  r: number;
}

function terrainAt(worldX: number, h: number): number {
  const base = h * 0.82;
  return base - (Math.sin(worldX * 0.004) * 0.5 + 0.5) * h * 0.18 - (Math.sin(worldX * 0.011 + 1.3) * 0.5 + 0.5) * h * 0.08;
}

function FlightCanvas({ mode, sfx, onEnd }: { mode: Mode; sfx: boolean; onEnd: (e: EndState) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const burnerRef = useRef(false);
  const targetY = useRef<number | null>(null);
  const keys = useRef({ up: false, down: false });
  const [burner, setBurner] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const say = useCallback((msg: string) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 1800);
  }, []);

  const toggleBurner = () => {
    burnerRef.current = !burnerRef.current;
    setBurner(burnerRef.current);
    if (burnerRef.current) {
      soundManager.playSonicBoom({ sfxEnabled: sfx });
      say('💥 Afterburner! Mach 1.4: faster than sound!');
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current!;
    const wrap = wrapRef.current!;
    const ctx = canvas.getContext('2d')!;
    let W = 0;
    let H = 0;
    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      W = wrap.clientWidth;
      H = Math.round(Math.min(560, Math.max(340, W * 0.6)));
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    // world state
    const jetX = () => W * 0.22;
    let jetY = H * 0.4;
    let vy = 0;
    let dist = 0;
    let fuel = 100;
    let shields = 3;
    let ringsHit = 0;
    let hurtCooldown = 0;
    let refuelled = false;
    let tanker: { x: number; y: number; active: boolean; state: 'approach' | 'hold' | 'leave'; hold: number } = { x: 0, y: 0, active: false, state: 'approach', hold: 0 };
    let tankerUsed = false;
    let lowFuelWarned = false;
    let shake = 0;
    const rings: Ring[] = [];
    const storms: Storm[] = [];
    for (let x = 900; x < MISSION_LENGTH - 400; x += 520 + Math.random() * 260) {
      rings.push({ x, y: 0.15 + Math.random() * 0.35, hit: false, passed: false });
    }
    for (let x = 1500; x < MISSION_LENGTH - 600; x += 1100 + Math.random() * 600) {
      storms.push({ x, y: 0.12 + Math.random() * 0.38, r: 34 + Math.random() * 14 });
    }
    const stars = Array.from({ length: 70 }, () => ({ x: Math.random(), y: Math.random() * 0.7, s: Math.random() * 1.6 + 0.4 }));
    const clouds = Array.from({ length: 8 }, (_, i) => ({ x: i * 260 + Math.random() * 100, y: 0.1 + Math.random() * 0.5, s: 0.6 + Math.random() * 0.9 }));

    let last = performance.now();
    let raf = 0;
    let ended = false;

    const finish = (reason: EndState['reason']) => {
      if (ended) return;
      ended = true;
      const ratio = ringsHit / rings.length;
      const stars: 1 | 2 | 3 = reason !== 'complete' ? 1 : ratio >= 0.75 ? 3 : ratio >= 0.4 ? 2 : 1;
      onEnd({ reason, rings: ringsHit, ringsTotal: rings.length, stars, refuelled });
    };

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const night = mode === 'night';
      const speed = burnerRef.current ? 420 : 250;

      // --- controls
      if (keys.current.up) vy -= 900 * dt;
      if (keys.current.down) vy += 900 * dt;
      if (targetY.current !== null) vy += (targetY.current - jetY) * 7 * dt;
      vy *= Math.pow(0.04, dt);
      jetY += vy * dt;
      jetY = Math.max(24, Math.min(H - 20, jetY));

      dist += speed * dt;
      const burn = burnerRef.current ? 5 : 2;
      fuel -= burn * dt;
      hurtCooldown = Math.max(0, hurtCooldown - dt);
      shake = Math.max(0, shake - dt * 3);

      // --- tanker spawns when fuel is low
      if (!tankerUsed && !tanker.active && fuel < 60) {
        tanker = { x: W + 160, y: H * 0.25, active: true, state: 'approach', hold: 0 };
        say('⛽ Tanker ahead! Fly into the basket behind it.');
      }
      if (tanker.active) {
        tanker.y = H * 0.25 + Math.sin(now / 900) * 10;
        const bx = tanker.x - 95;
        if (tanker.state === 'approach') {
          tanker.x -= 150 * dt;
          if (bx <= jetX() + 60) tanker.state = 'hold';
        } else if (tanker.state === 'hold') {
          tanker.hold += dt;
          if (tanker.hold > 9 || (refuelled && fuel >= 99.5)) tanker.state = 'leave';
        } else {
          tanker.x += 180 * dt;
        }
        const by = tanker.y + 46;
        if (Math.hypot(jetX() + 30 - bx, jetY - by) < 30) {
          fuel = Math.min(100, fuel + 30 * dt);
          if (!refuelled) {
            refuelled = true;
            soundManager.play('correct', { sfxEnabled: sfx });
            say('✅ Contact! Fuel flowing…');
          }
        }
        if (tanker.state === 'leave' && !tankerUsed) {
          tankerUsed = true;
          say(refuelled ? '⛽ Tanks full! Disconnect. Great job!' : '⛽ Tanker leaving. Watch your fuel!');
        }
        if (tanker.state === 'leave' && tanker.x - 200 > W) tanker.active = false;
      }
      if (!lowFuelWarned && fuel < 22) {
        lowFuelWarned = true;
        say('⚠️ Low fuel! Turn the afterburner off.');
        soundManager.play('cockpitBeep', { sfxEnabled: sfx });
      }

      // --- rings
      for (const r of rings) {
        const sx = r.x - dist + jetX();
        if (!r.passed && sx < jetX()) {
          r.passed = true;
          if (Math.abs(jetY - r.y * H) < 34) {
            r.hit = true;
            ringsHit++;
            soundManager.play('starCollect', { sfxEnabled: sfx });
          }
        }
      }
      // --- storms
      for (const s of storms) {
        const sx = s.x - dist + jetX();
        if (hurtCooldown === 0 && Math.hypot(sx - jetX(), s.y * H - jetY) < s.r + 10) {
          shields--;
          hurtCooldown = 1.5;
          shake = 1;
          soundManager.play('almost', { sfxEnabled: sfx });
          say('⛈️ Turbulence! Fly around storm clouds.');
        }
      }
      // --- terrain
      const ground = terrainAt(dist, H);
      if (jetY > ground - 12) {
        jetY = ground - 14;
        vy = -260;
        if (hurtCooldown === 0) {
          shields--;
          hurtCooldown = 1.5;
          shake = 1;
          soundManager.play('almost', { sfxEnabled: sfx });
          say('🏔️ PULL UP! Keep a safe height.');
        }
      }

      if (shields <= 0) finish('shields');
      else if (fuel <= 0) finish('fuel');
      else if (dist >= MISSION_LENGTH) finish('complete');

      // ---------------- draw ----------------
      ctx.save();
      if (shake > 0) ctx.translate((Math.random() - 0.5) * 10 * shake, (Math.random() - 0.5) * 10 * shake);
      const sky = ctx.createLinearGradient(0, 0, 0, H);
      if (night) {
        sky.addColorStop(0, '#030712');
        sky.addColorStop(1, '#1e1b4b');
      } else {
        sky.addColorStop(0, '#1d74d8');
        sky.addColorStop(1, '#bfe3ff');
      }
      ctx.fillStyle = sky;
      ctx.fillRect(-10, -10, W + 20, H + 20);

      if (night) {
        ctx.fillStyle = '#fff';
        for (const s of stars) {
          ctx.globalAlpha = 0.5 + 0.5 * Math.sin(now / 500 + s.x * 20);
          ctx.fillRect(((s.x * W - dist * 0.02) % W + W) % W, s.y * H, s.s, s.s);
        }
        ctx.globalAlpha = 1;
      } else {
        ctx.fillStyle = '#fff8d6';
        ctx.beginPath();
        ctx.arc(W * 0.82, H * 0.16, 30, 0, Math.PI * 2);
        ctx.fill();
      }

      // far mountains (parallax)
      ctx.fillStyle = night ? '#111827' : '#7ea6cf';
      ctx.beginPath();
      ctx.moveTo(0, H);
      for (let x = 0; x <= W; x += 8) ctx.lineTo(x, H * 0.62 - (Math.sin((x + dist * 0.2) * 0.008) * 0.5 + 0.5) * H * 0.2);
      ctx.lineTo(W, H);
      ctx.fill();

      // clouds
      ctx.fillStyle = night ? 'rgba(148,163,184,0.1)' : 'rgba(255,255,255,0.85)';
      for (const c of clouds) {
        const cx = (((c.x - dist * 0.5) % (W + 400)) + W + 400) % (W + 400) - 200;
        const cy = c.y * H;
        for (const [ox, oy, r] of [
          [0, 0, 26],
          [24, -10, 30],
          [52, 0, 24],
        ]) {
          ctx.beginPath();
          ctx.arc(cx + ox * c.s, cy + oy * c.s, r * c.s, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // near terrain (collision layer)
      ctx.fillStyle = night ? '#0b1020' : '#3f6d96';
      ctx.beginPath();
      ctx.moveTo(0, H);
      for (let x = 0; x <= W; x += 6) ctx.lineTo(x, terrainAt(dist + (x - jetX()), H));
      ctx.lineTo(W, H);
      ctx.fill();

      // storms
      for (const s of storms) {
        const sx = s.x - dist + jetX();
        if (sx < -80 || sx > W + 80) continue;
        const sy = s.y * H;
        ctx.fillStyle = night ? '#64748b' : '#475569';
        for (const [ox, oy, k] of [
          [-s.r * 0.6, 0, 0.7],
          [0, -s.r * 0.3, 1],
          [s.r * 0.6, 0, 0.75],
        ]) {
          ctx.beginPath();
          ctx.arc(sx + ox, sy + oy, s.r * k, 0, Math.PI * 2);
          ctx.fill();
        }
        if (Math.floor(now / 200) % 4 === 0) {
          ctx.strokeStyle = '#fde047';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(sx, sy + 10);
          ctx.lineTo(sx - 8, sy + 28);
          ctx.lineTo(sx + 4, sy + 28);
          ctx.lineTo(sx - 4, sy + 46);
          ctx.stroke();
        }
      }

      // rings
      for (const r of rings) {
        const sx = r.x - dist + jetX();
        if (sx < -60 || sx > W + 60) continue;
        ctx.lineWidth = 6;
        ctx.strokeStyle = r.hit ? '#22c55e' : '#fbbf24';
        ctx.shadowColor = r.hit ? '#22c55e' : '#fbbf24';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.ellipse(sx, r.y * H, 12, 36, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // tanker + hose + basket
      if (tanker.active) {
        const tx = tanker.x;
        const ty = tanker.y;
        ctx.fillStyle = '#94a3b8';
        ctx.beginPath();
        ctx.ellipse(tx, ty, 70, 14, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(tx - 70, ty - 30, 16, 30);
        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.moveTo(tx - 10, ty);
        ctx.lineTo(tx - 40, ty + 34);
        ctx.lineTo(tx + 20, ty);
        ctx.fill();
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(tx - 40, ty + 6);
        ctx.quadraticCurveTo(tx - 70, ty + 40, tx - 95, ty + 46);
        ctx.stroke();
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(tx - 95, ty + 46, 9, 0, Math.PI * 2);
        ctx.stroke();
      }

      // player jet
      drawJet(ctx, jetX(), jetY, vy, burnerRef.current, now, night, hurtCooldown > 0 && Math.floor(now / 100) % 2 === 0);

      ctx.restore();

      // ---------------- HUD ----------------
      drawHud(ctx, W, H, { speed, jetY, ground, fuel, shields, ringsHit, ringsTotal: rings.length, progress: dist / MISSION_LENGTH, pitch: vy });

      if (!ended) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const onKey = (e: KeyboardEvent, down: boolean) => {
      if (e.key === 'ArrowUp' || e.key === 'w') keys.current.up = down;
      if (e.key === 'ArrowDown' || e.key === 's') keys.current.down = down;
      if ((e.key === ' ' || e.key === 'b') && down) {
        e.preventDefault();
        burnerRef.current = !burnerRef.current;
        setBurner(burnerRef.current);
      }
    };
    const kd = (e: KeyboardEvent) => onKey(e, true);
    const ku = (e: KeyboardEvent) => onKey(e, false);
    window.addEventListener('keydown', kd);
    window.addEventListener('keyup', ku);
    soundManager.setAmbientWind(true, { sfxEnabled: sfx });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', kd);
      window.removeEventListener('keyup', ku);
      soundManager.stopAmbientWind();
      clearTimeout(toastTimer.current);
    };
  }, [mode, sfx, onEnd, say]);

  const setTargetFromEvent = (e: ReactPointerEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    targetY.current = e.clientY - rect.top;
  };

  return (
    <div className="flex flex-col gap-3">
      <div ref={wrapRef} className="relative w-full touch-none select-none overflow-hidden rounded-3xl border-4 border-slate-800 shadow-2xl">
        <canvas
          ref={canvasRef}
          className="block w-full"
          onPointerDown={(e) => {
            (e.target as HTMLElement).setPointerCapture(e.pointerId);
            setTargetFromEvent(e);
          }}
          onPointerMove={(e) => {
            if (e.buttons > 0 || e.pointerType === 'touch') setTargetFromEvent(e);
          }}
          onPointerUp={() => (targetY.current = null)}
          aria-label="Flight game. Drag up and down to steer."
        />
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="pointer-events-none absolute left-1/2 top-12 -translate-x-1/2 rounded-full bg-slate-900/85 px-4 py-2 font-display font-bold text-emerald-300"
            >
              {toast}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="flex items-center justify-center gap-3">
        <HoldButton label="⬆️" onChange={(d) => (keys.current.up = d)} />
        <button
          onClick={toggleBurner}
          aria-pressed={burner}
          className={`min-h-16 flex-1 rounded-3xl font-display text-xl font-extrabold shadow-lg active:scale-95 sm:flex-none sm:px-10 ${burner ? 'bg-orange-500 text-white' : 'bg-white text-slate-800'}`}
        >
          🔥 Afterburner {burner ? 'ON' : 'OFF'}
        </button>
        <HoldButton label="⬇️" onChange={(d) => (keys.current.down = d)} />
      </div>
    </div>
  );
}

function HoldButton({ label, onChange }: { label: string; onChange: (down: boolean) => void }) {
  return (
    <button
      className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-3xl shadow-lg active:scale-90 active:bg-sky-100"
      onPointerDown={() => onChange(true)}
      onPointerUp={() => onChange(false)}
      onPointerLeave={() => onChange(false)}
      onPointerCancel={() => onChange(false)}
      aria-label={label === '⬆️' ? 'Climb' : 'Descend'}
    >
      {label}
    </button>
  );
}

function drawJet(ctx: CanvasRenderingContext2D, x: number, y: number, vy: number, burner: boolean, now: number, night: boolean, blink: boolean) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(Math.max(-0.5, Math.min(0.5, vy / 600)));
  if (blink) ctx.globalAlpha = 0.4;
  // contrail
  const trail = ctx.createLinearGradient(-200, 0, -20, 0);
  trail.addColorStop(0, 'rgba(255,255,255,0)');
  trail.addColorStop(1, 'rgba(255,255,255,0.7)');
  ctx.fillStyle = trail;
  ctx.fillRect(-200, -2, 180, 4);
  // flame
  if (burner) {
    const f = 14 + Math.sin(now / 30) * 6;
    ctx.fillStyle = '#fb923c';
    ctx.beginPath();
    ctx.moveTo(-26, -4);
    ctx.lineTo(-26 - f * 1.6, 0);
    ctx.lineTo(-26, 4);
    ctx.fill();
    ctx.fillStyle = '#fef3c7';
    ctx.beginPath();
    ctx.moveTo(-26, -2);
    ctx.lineTo(-26 - f * 0.8, 0);
    ctx.lineTo(-26, 2);
    ctx.fill();
  }
  // detailed Tejas illustration (shared with the airspace background)
  const img = spriteImage('tejas');
  if (img.complete) ctx.drawImage(img, -50, -16, 128, 32);
  if (night) {
    ctx.fillStyle = Math.floor(now / 600) % 2 ? '#ef4444' : '#7f1d1d';
    ctx.beginPath();
    ctx.arc(-4, 13, 2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawHud(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  s: { speed: number; jetY: number; ground: number; fuel: number; shields: number; ringsHit: number; ringsTotal: number; progress: number; pitch: number },
) {
  const g = '#6ee7b7';
  ctx.save();
  ctx.strokeStyle = g;
  ctx.fillStyle = g;
  ctx.lineWidth = 1.5;
  ctx.font = '700 13px Nunito, sans-serif';
  ctx.shadowColor = g;
  ctx.shadowBlur = 6;

  // boresight
  const cx = W / 2;
  const cy = H / 2;
  ctx.beginPath();
  ctx.arc(cx, cy, 8, 0, Math.PI * 2);
  ctx.moveTo(cx - 26, cy);
  ctx.lineTo(cx - 10, cy);
  ctx.moveTo(cx + 10, cy);
  ctx.lineTo(cx + 26, cy);
  ctx.stroke();
  // pitch ladder
  const off = Math.max(-40, Math.min(40, -s.pitch / 8));
  for (const k of [-1, 1]) {
    const y = cy + k * 50 + off;
    ctx.beginPath();
    ctx.moveTo(cx - 60, y);
    ctx.lineTo(cx - 30, y);
    ctx.moveTo(cx + 30, y);
    ctx.lineTo(cx + 60, y);
    ctx.stroke();
    ctx.fillText(k < 0 ? '10' : '-10', cx + 64, y + 4);
  }

  // speed (top-left) and altitude (top-right), clear of the jet
  const mach = (s.speed / 300).toFixed(2);
  ctx.strokeRect(10, 30, 76, 28);
  ctx.fillText(`M ${mach}`, 18, 49);
  const altFt = Math.max(0, Math.round(((s.ground - s.jetY) / H) * 40000 + 1000) / 10) * 10;
  ctx.strokeRect(W - 96, 30, 86, 28);
  ctx.fillText(`${altFt.toLocaleString()} ft`, W - 90, 49);
  ctx.fillText('SPD', 12, 72);
  ctx.fillText('ALT', W - 94, 72);

  // top bar: progress
  ctx.strokeRect(W * 0.25, 10, W * 0.5, 8);
  ctx.fillRect(W * 0.25, 10, W * 0.5 * Math.min(1, s.progress), 8);
  ctx.fillText('🛫', W * 0.25 - 22, 20);
  ctx.fillText('🛬', W * 0.75 + 6, 20);

  // bottom bar: fuel (left half) + rings/shields (right half)
  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(2,6,23,0.6)';
  ctx.fillRect(0, H - 40, W, 40);
  const half = W / 2;
  ctx.fillStyle = s.fuel < 25 ? '#f87171' : g;
  ctx.fillText('FUEL', 10, H - 15);
  ctx.strokeStyle = g;
  const barW = Math.max(40, half - 64);
  ctx.strokeRect(50, H - 27, barW, 12);
  ctx.fillRect(50, H - 27, barW * Math.max(0, s.fuel / 100), 12);
  ctx.fillStyle = g;
  ctx.textAlign = 'right';
  ctx.fillText(`⭕ ${s.ringsHit}/${s.ringsTotal}  ${'🛡️'.repeat(Math.max(0, s.shields))}`, W - 10, H - 15);
  ctx.textAlign = 'left';
  ctx.restore();
}
