import { useEffect, useRef } from 'react';
import { NOZZLE, spriteImage, type SpriteKind } from './art/aircraftSprites';

/**
 * The cinematic "airspace" behind every screen, drawn on one canvas:
 * time-of-day sky with sun glow or stars, soft volumetric clouds on two
 * depths, hazy Himalayan ridges, an air-defence base (rotating radar,
 * Akash-style launchers, runway lights) and choreographed scenes:
 *
 *  - SAM volley: launchers fire, a fighter pops flares and the missiles
 *    turn onto the decoys (nothing is ever hit; motors burn out and fade)
 *  - Mirage 2000 pops "angel" flares while crossing
 *  - Su-30MKI pair with contrails, Rafale afterburner climb,
 *    Tejas trio with tricolour smoke, Netra AEW&C on a high patrol
 *
 * Pauses automatically when the tab is hidden (rAF) and renders a single
 * still frame in Calm mode / prefers-reduced-motion.
 */

type TimeOfDay = 'dawn' | 'day' | 'sunset' | 'night';

const SKY: Record<TimeOfDay, [string, string, string]> = {
  dawn: ['#5b6fa8', '#f4a98a', '#ffe1c2'],
  day: ['#1d6fd1', '#4fa3ef', '#cbe7ff'],
  sunset: ['#2a2454', '#b9506d', '#ffb06b'],
  night: ['#03060f', '#0b1430', '#1c2748'],
};
const RIDGES: Record<TimeOfDay, [string, string, string]> = {
  dawn: ['#9a8db6', '#6f6390', '#3d3657'],
  day: ['#8fb4d9', '#5f86ad', '#34506e'],
  sunset: ['#7b4f82', '#4f3460', '#271a36'],
  night: ['#1a2443', '#121a33', '#080c1a'],
};

function timeOfDayNow(): TimeOfDay {
  const h = new Date().getHours();
  if (h >= 5 && h < 8) return 'dawn';
  if (h >= 8 && h < 17) return 'day';
  if (h >= 17 && h < 20) return 'sunset';
  return 'night';
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  dr: number;
  a: number;
  life: number;
  age: number;
  color: string;
  glow?: boolean;
}

interface Jet {
  kind: SpriteKind;
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  angle: number;
  burner: boolean;
  smoke?: string;
  contrail: boolean;
  flaresAt?: number[];
  age: number;
}

interface Flare {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
}

interface Missile {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  burn: number;
  target: () => { x: number; y: number } | null;
  decoyed: boolean;
}

interface Cloud {
  x: number;
  y: number;
  s: number;
  sprite: number;
  speed: number;
}

const rand = (a: number, b: number) => a + Math.random() * (b - a);

/** Pre-render soft, volumetric cloud sprites from many blurred puffs. */
function makeCloudSprites(night: boolean): HTMLCanvasElement[] {
  return [0, 1, 2, 3].map((seed) => {
    const c = document.createElement('canvas');
    c.width = 420;
    c.height = 180;
    const g = c.getContext('2d')!;
    const puffs = 14 + seed * 3;
    for (let i = 0; i < puffs; i++) {
      const t = i / puffs;
      const x = 60 + t * 300 + Math.sin(i * 12.9 + seed) * 20;
      const y = 110 - Math.sin(t * Math.PI) * (40 + seed * 6) + Math.cos(i * 7.3) * 10;
      const r = 34 + Math.sin(i * 3.1 + seed) * 12 + Math.sin(t * Math.PI) * 22;
      const grad = g.createRadialGradient(x, y - r * 0.3, r * 0.1, x, y, r);
      const top = night ? 'rgba(150,165,200,0.55)' : 'rgba(255,255,255,0.95)';
      const edge = night ? 'rgba(90,105,140,0)' : 'rgba(225,235,248,0)';
      grad.addColorStop(0, top);
      grad.addColorStop(0.6, night ? 'rgba(120,135,170,0.35)' : 'rgba(240,246,255,0.7)');
      grad.addColorStop(1, edge);
      g.fillStyle = grad;
      g.beginPath();
      g.arc(x, y, r, 0, Math.PI * 2);
      g.fill();
    }
    // flat-ish shaded base
    const base = g.createLinearGradient(0, 90, 0, 150);
    base.addColorStop(0, 'rgba(0,0,0,0)');
    base.addColorStop(1, night ? 'rgba(10,14,30,0.25)' : 'rgba(120,140,170,0.18)');
    g.globalCompositeOperation = 'source-atop';
    g.fillStyle = base;
    g.fillRect(0, 0, 420, 180);
    return c;
  });
}

/** Static scenery (ridges + base) rendered once per resize. */
function makeScenery(W: number, H: number, tod: TimeOfDay): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const g = c.getContext('2d')!;
  const [far, mid, near] = RIDGES[tod];
  const groundY = H * 0.93;

  const ridge = (baseY: number, amp: number, freq: number, seed: number, color: string, snow: boolean, haze: number) => {
    // Fractal ridge (midpoint displacement): big peaks with natural crags,
    // reading as Himalayan rock rather than rolling hills or saw-teeth.
    void seed;
    let line: number[] = [rand(0.3, 0.8), rand(0.5, 1), rand(0.2, 0.9), rand(0.5, 1), rand(0.3, 0.8)];
    let rough = 0.45;
    while (line.length < Math.max(64, W / (freq * 1100))) {
      const next: number[] = [];
      for (let i = 0; i < line.length - 1; i++) {
        next.push(line[i], (line[i] + line[i + 1]) / 2 + rand(-rough, rough));
      }
      next.push(line[line.length - 1]);
      line = next;
      rough *= 0.55;
    }
    const lo = Math.min(...line);
    const hi = Math.max(...line);
    const pts: [number, number][] = line.map((v, i) => [-20 + (i / (line.length - 1)) * (W + 40), baseY - ((v - lo) / (hi - lo || 1)) * amp]);
    const grad = g.createLinearGradient(0, baseY - amp * 1.3, 0, groundY);
    grad.addColorStop(0, color);
    grad.addColorStop(1, color);
    g.beginPath();
    g.moveTo(-20, groundY);
    pts.forEach(([x, y]) => g.lineTo(x, y));
    g.lineTo(W + 20, groundY);
    g.closePath();
    g.fillStyle = grad;
    g.fill();
    if (snow) {
      g.save();
      g.clip();
      const sg = g.createLinearGradient(0, baseY - amp, 0, baseY - amp * 0.62);
      sg.addColorStop(0, tod === 'night' ? 'rgba(200,210,235,0.55)' : 'rgba(255,255,255,0.95)');
      sg.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = sg;
      g.fillRect(0, 0, W, baseY);
      g.restore();
    }
    // atmospheric haze at the foot of each ridge
    const hz = g.createLinearGradient(0, baseY - amp * 0.4, 0, baseY + 20);
    hz.addColorStop(0, 'rgba(255,255,255,0)');
    hz.addColorStop(1, tod === 'night' ? `rgba(30,40,70,${haze})` : `rgba(220,235,250,${haze})`);
    g.fillStyle = hz;
    g.fillRect(0, baseY - amp * 0.4, W, amp * 0.4 + 24);
  };

  ridge(H * 0.78, H * 0.22, 0.006, 1.7, far, true, 0.55);
  ridge(H * 0.85, H * 0.15, 0.009, 4.1, mid, false, 0.4);
  ridge(H * 0.92, H * 0.08, 0.013, 7.3, near, false, 0.25);

  // airfield
  const night = tod === 'night';
  g.fillStyle = night ? '#070a14' : '#26313f';
  g.fillRect(0, groundY, W, H - groundY);
  g.fillStyle = night ? '#0f1424' : '#344255';
  g.fillRect(0, groundY + (H - groundY) * 0.35, W, (H - groundY) * 0.32);
  g.fillStyle = 'rgba(248,250,252,0.65)';
  for (let x = 12; x < W; x += 60) g.fillRect(x, groundY + (H - groundY) * 0.5, 30, 2);

  // hangars
  g.fillStyle = night ? '#121827' : '#4b5869';
  for (const hx of [W * 0.06, W * 0.12]) {
    g.beginPath();
    g.moveTo(hx, groundY);
    g.quadraticCurveTo(hx + 40, groundY - 46, hx + 80, groundY);
    g.fill();
  }
  // control tower
  const tx = W * 0.9;
  g.fillRect(tx, groundY - 70, 12, 70);
  g.fillStyle = night ? '#fbbf24' : '#9cc7ee';
  g.fillRect(tx - 10, groundY - 86, 32, 16);
  return c;
}

/** Launcher sites (fractions of width) shared by drawing and the SAM scene. */
const LAUNCHERS = [0.24, 0.62];

export function AirspaceCanvas({ calm }: { calm: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    const reduced = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const still = calm || reduced;

    let W = 0;
    let H = 0;
    let tod = timeOfDayNow();
    let scenery: HTMLCanvasElement | null = null;
    let cloudSprites = makeCloudSprites(tod === 'night');
    const stars = Array.from({ length: 140 }, () => ({ x: Math.random(), y: Math.random() * 0.6, s: rand(0.5, 1.8), p: rand(0, 6) }));
    let clouds: Cloud[] = [];
    const particles: Particle[] = [];
    const jets: Jet[] = [];
    const missiles: Missile[] = [];
    const flares: Flare[] = [];
    let scale = 1;

    const resize = () => {
      const dpr = Math.min(1.5, window.devicePixelRatio || 1);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      scale = Math.max(0.55, Math.min(1.15, W / 1300));
      scenery = makeScenery(W, H, tod);
      clouds = Array.from({ length: 9 }, (_, i) => ({
        x: rand(-200, W),
        y: rand(0.05, 0.62) * H,
        s: (i < 5 ? rand(0.35, 0.7) : rand(0.9, 1.6)) * scale,
        sprite: i % 4,
        speed: i < 5 ? rand(4, 9) : rand(14, 24),
      }));
    };
    resize();
    window.addEventListener('resize', resize);

    // ---------------- emitters ----------------
    // Fewer smoke particles on phones to keep scrolling smooth.
    const emit = (p: Omit<Particle, 'age'>) => {
      if (particles.length < (W < 700 ? 1300 : 2600)) particles.push({ ...p, age: 0 });
    };

    /** Emit `n` particles spread along the segment travelled this frame (no gaps). */
    const trail = (x0: number, y0: number, x1: number, y1: number, n: number, make: (x: number, y: number) => Omit<Particle, 'age'>) => {
      for (let k = 0; k < n; k++) {
        const f = (k + Math.random()) / n;
        emit(make(x0 + (x1 - x0) * f, y0 + (y1 - y0) * f));
      }
    };

    // ---------------- scenes ----------------
    const spawnJet = (kind: SpriteKind, opts: Partial<Jet> & { x: number; y: number; vx: number }) => {
      const j: Jet = { kind, vy: 0, w: 230 * scale, angle: 0, burner: false, contrail: true, age: 0, ...opts };
      jets.push(j);
      return j;
    };

    const scenes: Record<string, () => void> = {
      samVolley: () => {
        const ltr = Math.random() < 0.6;
        const y = H * rand(0.16, 0.3);
        const v = rand(230, 290) * scale;
        // seconds until the jet reaches mid-screen
        const tMid = (W * 0.5 + 260 * scale) / v;
        const jet = spawnJet(Math.random() < 0.5 ? 'mirage' : 'su30', {
          x: ltr ? -260 * scale : W + 260 * scale,
          y,
          vx: (ltr ? 1 : -1) * v,
          vy: -8,
          burner: true,
          flaresAt: [tMid + 0.2, tMid + 0.45, tMid + 0.7],
        });
        const launchAt = Math.max(0.3, tMid - 1.6);
        LAUNCHERS.forEach((lx, i) => {
          for (let k = 0; k < 2; k++) {
            setTimeout(() => {
              const sx = W * lx + (k ? 8 : -8);
              const sy = H * 0.93 - 14;
              const m: Missile = {
                x: sx,
                y: sy,
                vx: rand(-20, 20),
                vy: -140,
                age: 0,
                burn: rand(3.4, 4.2),
                decoyed: false,
                // aim at a point *behind* the jet — the decoy flares will pull them further off
                target: () => (jets.includes(jet) ? { x: jet.x - Math.sign(jet.vx) * 160 * scale, y: jet.y + 30 } : null),
              };
              missiles.push(m);
              for (let s = 0; s < 14; s++)
                emit({ x: sx, y: sy, vx: rand(-60, 60), vy: rand(-10, 20), r: rand(4, 9), dr: 14, a: 0.5, life: rand(1.5, 2.5), color: '210,210,215' });
            }, (launchAt + i * 0.38 + k * 0.26) * 1000);
          }
        });
      },
      mirageFlares: () => {
        const ltr = Math.random() < 0.5;
        const v = rand(260, 320) * scale;
        const tMid = (W * 0.45 + 260 * scale) / v;
        spawnJet('mirage', {
          x: ltr ? -260 * scale : W + 260 * scale,
          y: H * rand(0.12, 0.32),
          vx: (ltr ? 1 : -1) * v,
          vy: -12,
          burner: true,
          flaresAt: [tMid, tMid + 0.22, tMid + 0.44, tMid + 0.66],
        });
      },
      su30Pair: () => {
        const ltr = Math.random() < 0.5;
        const y = H * rand(0.1, 0.3);
        const vx = (ltr ? 1 : -1) * rand(200, 250) * scale;
        spawnJet('su30', { x: ltr ? -260 * scale : W + 260 * scale, y, vx, vy: -6 });
        spawnJet('su30', { x: ltr ? -420 * scale : W + 420 * scale, y: y + 55 * scale, vx, vy: -6, w: 210 * scale });
      },
      rafaleClimb: () => {
        const ltr = Math.random() < 0.5;
        spawnJet('rafale', {
          x: ltr ? -240 * scale : W + 240 * scale,
          y: H * 0.62,
          vx: (ltr ? 1 : -1) * 300 * scale,
          vy: -190 * scale,
          burner: true,
        });
      },
      tejasTrio: () => {
        const ltr = Math.random() < 0.5;
        const y = H * rand(0.14, 0.3);
        const vx = (ltr ? 1 : -1) * 220 * scale;
        const x0 = ltr ? -240 * scale : W + 240 * scale;
        const back = ltr ? -1 : 1;
        spawnJet('tejas', { x: x0, y, vx, smoke: '255,153,51', w: 180 * scale, contrail: false });
        spawnJet('tejas', { x: x0 + back * 150 * scale, y: y - 46 * scale, vx, smoke: '255,255,255', w: 170 * scale, contrail: false });
        spawnJet('tejas', { x: x0 + back * 150 * scale, y: y + 46 * scale, vx, smoke: '19,136,8', w: 170 * scale, contrail: false });
      },
      netra: () => {
        const ltr = Math.random() < 0.5;
        spawnJet('netra', { x: ltr ? -200 : W + 200, y: H * rand(0.06, 0.12), vx: (ltr ? 1 : -1) * 60 * scale, w: 150 * scale, contrail: false });
      },
    };
    const ORDER = ['samVolley', 'su30Pair', 'mirageFlares', 'tejasTrio', 'samVolley', 'rafaleClimb', 'netra', 'mirageFlares', 'su30Pair'];
    let sceneIdx = Math.floor(Math.random() * ORDER.length);
    // Dev-only hook for previewing a scene: window.__airspace('samVolley')
    if (import.meta.env.DEV) (window as unknown as { __airspace?: (n: string) => void }).__airspace = (n) => scenes[n]?.();
    let nextScene = 1.2;

    // ---------------- draw helpers ----------------
    const drawSky = (t: number) => {
      const [top, mid, bottom] = SKY[tod];
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, top);
      g.addColorStop(0.55, mid);
      g.addColorStop(1, bottom);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      if (tod === 'night') {
        for (const s of stars) {
          ctx.globalAlpha = 0.45 + 0.55 * Math.abs(Math.sin(t * 0.8 + s.p));
          ctx.fillStyle = '#fff';
          ctx.fillRect(s.x * W, s.y * H, s.s, s.s);
        }
        ctx.globalAlpha = 1;
        const mx = W * 0.82;
        const my = H * 0.13;
        const mg = ctx.createRadialGradient(mx, my, 10, mx, my, 120);
        mg.addColorStop(0, 'rgba(220,230,255,0.35)');
        mg.addColorStop(1, 'rgba(220,230,255,0)');
        ctx.fillStyle = mg;
        ctx.fillRect(mx - 120, my - 120, 240, 240);
        ctx.fillStyle = '#eef2ff';
        ctx.beginPath();
        ctx.arc(mx, my, 26, 0, Math.PI * 2);
        ctx.fill();
      } else {
        const sx = W * 0.8;
        const sy = tod === 'day' ? H * 0.12 : H * 0.5;
        const sg = ctx.createRadialGradient(sx, sy, 0, sx, sy, Math.max(W, H) * 0.5);
        sg.addColorStop(0, 'rgba(255,250,225,0.95)');
        sg.addColorStop(0.04, 'rgba(255,245,210,0.85)');
        sg.addColorStop(0.12, 'rgba(255,230,180,0.25)');
        sg.addColorStop(1, 'rgba(255,230,180,0)');
        ctx.fillStyle = sg;
        ctx.fillRect(0, 0, W, H);
        // faint lens flare ghosts
        const cx = W / 2;
        const cy = H / 2;
        [0.35, 0.7, 1.15].forEach((k, i) => {
          const fx = sx + (cx - sx) * k * 1.4;
          const fy = sy + (cy - sy) * k * 1.4;
          ctx.fillStyle = `rgba(255,240,210,${0.06 - i * 0.015})`;
          ctx.beginPath();
          ctx.arc(fx, fy, 30 + i * 22, 0, Math.PI * 2);
          ctx.fill();
        });
      }
    };

    const drawClouds = (near: boolean, dt: number) => {
      const sprites = cloudSprites;
      clouds.forEach((c, i) => {
        if (near !== i >= 5) return;
        c.x += c.speed * dt;
        const w = 420 * c.s;
        if (c.x > W + 40) {
          c.x = -w - rand(0, 200);
          c.y = rand(0.05, 0.62) * H;
        }
        ctx.globalAlpha = near ? 0.85 : 0.6;
        ctx.drawImage(sprites[c.sprite], c.x, c.y, w, 180 * c.s);
      });
      ctx.globalAlpha = 1;
    };

    const drawBase = (t: number) => {
      if (scenery) ctx.drawImage(scenery, 0, 0, W, H);
      const gy = H * 0.93;
      // runway edge lights chase
      for (let i = 0; i < W / 36; i++) {
        const on = (Math.floor(t * 8) - i) % 24 === 0;
        ctx.fillStyle = on ? '#fff7cc' : tod === 'night' ? 'rgba(253,230,138,0.55)' : 'rgba(254,249,195,0.5)';
        ctx.beginPath();
        ctx.arc(i * 36 + 8, gy + 4, on ? 2.6 : 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
      // rotating radar
      const rx = W * 0.42;
      const ry = gy - 26;
      ctx.fillStyle = tod === 'night' ? '#1f2937' : '#475569';
      ctx.fillRect(rx - 3, ry, 6, 26);
      const w = Math.abs(Math.cos(t * 1.6)) * 20 + 3;
      ctx.fillStyle = tod === 'night' ? '#9ca3af' : '#cbd5e1';
      ctx.beginPath();
      ctx.ellipse(rx, ry - 4, w, 9, 0, 0, Math.PI * 2);
      ctx.fill();
      // tower beacon
      if (Math.floor(t * 1.4) % 2 === 0) {
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(W * 0.9 + 6, gy - 90, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      // SAM launchers (truck + angled rails)
      LAUNCHERS.forEach((lx) => {
        const x = W * lx;
        ctx.fillStyle = tod === 'night' ? '#141a2a' : '#3f4b3a';
        ctx.fillRect(x - 34, gy - 12, 68, 12);
        ctx.fillRect(x + 22, gy - 20, 14, 10);
        ctx.save();
        ctx.translate(x - 4, gy - 12);
        ctx.rotate(-1.05);
        ctx.fillStyle = tod === 'night' ? '#1d2436' : '#56634f';
        ctx.fillRect(0, -9, 34, 18);
        ctx.fillStyle = '#e5e7eb';
        for (let k = -1; k <= 1; k++) ctx.fillRect(30, k * 5 - 1.5, 9, 3);
        ctx.restore();
      });
    };

    const drawJet = (j: Jet, t: number) => {
      const img = spriteImage(j.kind);
      const flip = j.vx < 0;
      const h = j.w / 4;
      ctx.save();
      ctx.translate(j.x, j.y);
      ctx.rotate(j.angle);
      if (flip) ctx.scale(-1, 1);
      // afterburner
      if (j.burner) {
        const nz = NOZZLE[j.kind];
        const nx = (nz.x / 400) * j.w - j.w / 2;
        const ny = (nz.y / 100) * h - h / 2;
        const len = j.w * (0.16 + Math.sin(t * 40) * 0.02);
        const fg = ctx.createLinearGradient(nx, 0, nx - len, 0);
        fg.addColorStop(0, 'rgba(255,250,220,0.95)');
        fg.addColorStop(0.3, 'rgba(255,170,70,0.85)');
        fg.addColorStop(1, 'rgba(255,90,30,0)');
        ctx.fillStyle = fg;
        ctx.beginPath();
        ctx.moveTo(nx, ny - h * 0.07);
        ctx.quadraticCurveTo(nx - len * 0.6, ny - h * 0.05, nx - len, ny);
        ctx.quadraticCurveTo(nx - len * 0.6, ny + h * 0.05, nx, ny + h * 0.07);
        ctx.fill();
        // shock diamonds
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        for (let d = 1; d <= 3; d++) {
          ctx.beginPath();
          ctx.ellipse(nx - len * d * 0.18, ny, 2.2, 1.6, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      if (img.complete) ctx.drawImage(img, -j.w / 2, -h / 2, j.w, h);
      ctx.restore();
    };

    const nozzleWorld = (j: Jet) => {
      const nz = NOZZLE[j.kind];
      const h = j.w / 4;
      const lx = ((nz.x / 400) * j.w - j.w / 2) * (j.vx < 0 ? -1 : 1);
      const ly = (nz.y / 100) * h - h / 2;
      const c = Math.cos(j.angle);
      const s = Math.sin(j.angle);
      return { x: j.x + lx * c - ly * s, y: j.y + lx * s + ly * c };
    };

    // ---------------- loop ----------------
    let last = performance.now();
    let raf = 0;
    let elapsed = 0;

    const step = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      elapsed += dt;
      const t = elapsed;

      if (!still) {
        nextScene -= dt;
        if (nextScene <= 0) {
          scenes[ORDER[sceneIdx % ORDER.length]]();
          sceneIdx++;
          nextScene = rand(5.5, 8.5);
        }
      }

      drawSky(t);
      drawClouds(false, still ? 0 : dt);

      // jets
      for (let i = jets.length - 1; i >= 0; i--) {
        const j = jets[i];
        const prevNz = nozzleWorld(j);
        j.age += dt;
        j.x += j.vx * dt;
        j.y += j.vy * dt;
        j.angle = Math.atan2(j.vy, Math.abs(j.vx)) * (j.vx < 0 ? -1 : 1);
        const nz = nozzleWorld(j);
        const segLen = Math.hypot(nz.x - prevNz.x, nz.y - prevNz.y);
        const per = Math.max(1, Math.round(segLen / (3 * scale)));
        if (j.contrail)
          trail(prevNz.x, prevNz.y, nz.x, nz.y, per, (x, y) => ({ x, y, vx: 0, vy: rand(-2, 2), r: 1.6 * scale, dr: 2.5, a: 0.32, life: 1.6, color: '255,255,255' }));
        if (j.smoke)
          trail(prevNz.x, prevNz.y, nz.x, nz.y, per, (x, y) => ({ x, y, vx: rand(-4, 4), vy: rand(-4, 4), r: 3.5 * scale, dr: 8, a: 0.5, life: 2.8, color: j.smoke! }));
        if (j.burner)
          trail(prevNz.x, prevNz.y, nz.x, nz.y, Math.ceil(per / 3), (x, y) => ({ x, y, vx: 0, vy: rand(-3, 3), r: 2 * scale, dr: 5, a: 0.14, life: 1.1, color: '235,235,240' }));
        // flares
        if (j.flaresAt?.length && j.age >= j.flaresAt[0]) {
          j.flaresAt.shift();
          for (let k = 0; k < 6; k++) {
            const side = k % 2 ? 1 : -1;
            flares.push({ x: j.x, y: j.y + 8, vx: j.vx * 0.35 + rand(-40, 40), vy: side * rand(40, 120) + 30, age: 0 });
          }
        }
        if (j.x < -600 || j.x > W + 600 || j.y < -300) jets.splice(i, 1);
      }

      // flares (bright, falling, leaving white smoke arcs → "angel" shape)
      for (let i = flares.length - 1; i >= 0; i--) {
        const f = flares[i];
        const px = f.x;
        const py = f.y;
        f.age += dt;
        f.vy += 70 * dt;
        f.vx *= Math.pow(0.45, dt);
        f.x += f.vx * dt;
        f.y += f.vy * dt;
        trail(px, py, f.x, f.y, 3, (x, y) => ({ x, y, vx: 0, vy: 0, r: 2.2 * scale, dr: 7, a: 0.38, life: 2.4, color: '245,245,248' }));
        if (f.age > 2.6) flares.splice(i, 1);
      }

      // missiles: steer (limited turn rate) toward target or nearest flare; motor burns out, then fade
      for (let i = missiles.length - 1; i >= 0; i--) {
        const m = missiles[i];
        m.age += dt;
        const burning = m.age < m.burn;
        let aim = m.target();
        if (flares.length) {
          let best: Flare | null = null;
          let bd = Infinity;
          for (const f of flares) {
            const d = Math.hypot(f.x - m.x, f.y - m.y);
            if (d < bd) {
              bd = d;
              best = f;
            }
          }
          if (best && bd < 700 * scale) {
            aim = { x: best.x, y: best.y };
            m.decoyed = true;
          }
        }
        const speed = Math.hypot(m.vx, m.vy);
        let heading = Math.atan2(m.vy, m.vx);
        if (aim && burning && m.age > 0.5) {
          const want = Math.atan2(aim.y - m.y, aim.x - m.x);
          let diff = want - heading;
          while (diff > Math.PI) diff -= Math.PI * 2;
          while (diff < -Math.PI) diff += Math.PI * 2;
          heading += Math.max(-1.3 * dt, Math.min(1.3 * dt, diff));
        }
        const newSpeed = burning ? Math.min(560 * scale, speed + 380 * dt) : speed * Math.pow(0.6, dt);
        m.vx = Math.cos(heading) * newSpeed;
        m.vy = Math.sin(heading) * newSpeed + (burning ? 0 : 40 * dt);
        const mx0 = m.x;
        const my0 = m.y;
        m.x += m.vx * dt;
        m.y += m.vy * dt;
        if (burning) {
          const n = Math.max(2, Math.round(Math.hypot(m.x - mx0, m.y - my0) / (3 * scale)));
          trail(mx0, my0, m.x, m.y, n, (x, y) => ({ x, y, vx: rand(-5, 5), vy: rand(-5, 5), r: rand(2, 3) * scale, dr: 10 * scale, a: 0.32, life: rand(2.6, 3.6), color: '226,226,230' }));
        }
        if (m.age > m.burn + 1.4 || m.y < -100 || m.x < -100 || m.x > W + 100) missiles.splice(i, 1);
      }

      // particles (smoke / contrails)
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.age += dt;
        if (p.age >= p.life) {
          particles.splice(i, 1);
          continue;
        }
        p.x += p.vx * dt;
        p.y += p.vy * dt - 3 * dt;
        p.r += p.dr * dt;
        const k = 1 - p.age / p.life;
        ctx.fillStyle = `rgba(${p.color},${p.a * k * k})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // flare cores + missile bodies on top of their smoke
      for (const f of flares) {
        const fade = Math.max(0, 1 - f.age / 2.6);
        const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, 16 * scale);
        g.addColorStop(0, `rgba(255,255,240,${fade})`);
        g.addColorStop(0.3, `rgba(255,210,120,${0.8 * fade})`);
        g.addColorStop(1, 'rgba(255,150,60,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(f.x, f.y, 16 * scale, 0, Math.PI * 2);
        ctx.fill();
      }
      for (const m of missiles) {
        const burning = m.age < m.burn;
        const fade = burning ? 1 : Math.max(0, 1 - (m.age - m.burn) / 1.4);
        ctx.save();
        ctx.globalAlpha = fade;
        ctx.translate(m.x, m.y);
        ctx.rotate(Math.atan2(m.vy, m.vx));
        const L = 22 * scale;
        if (burning) {
          const g = ctx.createRadialGradient(-L / 2, 0, 0, -L / 2, 0, 14 * scale);
          g.addColorStop(0, 'rgba(255,255,230,1)');
          g.addColorStop(0.4, 'rgba(255,170,60,0.8)');
          g.addColorStop(1, 'rgba(255,120,40,0)');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(-L / 2, 0, 14 * scale, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = '#f1f5f9';
        ctx.fillRect(-L / 2, -1.8 * scale, L, 3.6 * scale);
        ctx.fillStyle = '#334155';
        ctx.beginPath();
        ctx.moveTo(L / 2, -1.8 * scale);
        ctx.lineTo(L / 2 + 5 * scale, 0);
        ctx.lineTo(L / 2, 1.8 * scale);
        ctx.fill();
        ctx.fillRect(-L / 2, -4 * scale, 4 * scale, 8 * scale);
        ctx.restore();
      }

      for (const j of jets) drawJet(j, t);

      drawClouds(true, still ? 0 : dt);
      drawBase(t);

      // vignette for a cinematic, focused frame
      const v = ctx.createRadialGradient(W / 2, H * 0.45, Math.min(W, H) * 0.35, W / 2, H * 0.45, Math.max(W, H) * 0.8);
      v.addColorStop(0, 'rgba(0,0,0,0)');
      v.addColorStop(1, tod === 'night' ? 'rgba(0,0,0,0.5)' : 'rgba(5,20,45,0.28)');
      ctx.fillStyle = v;
      ctx.fillRect(0, 0, W, H);

      if (!still) raf = requestAnimationFrame(step);
    };

    // In still mode, wait for sprites/fonts so the single frame is complete.
    if (still) setTimeout(() => step(performance.now()), 300);
    else raf = requestAnimationFrame(step);

    const todTimer = setInterval(() => {
      const next = timeOfDayNow();
      if (next !== tod) {
        tod = next;
        cloudSprites = makeCloudSprites(tod === 'night');
        scenery = makeScenery(W, H, tod);
        if (still) step(performance.now());
      }
    }, 60_000);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(todTimer);
      window.removeEventListener('resize', resize);
    };
  }, [calm]);

  return <canvas ref={ref} className="pointer-events-none fixed inset-0 h-full w-full" aria-hidden />;
}
