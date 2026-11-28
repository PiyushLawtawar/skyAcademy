// Detailed, original side-profile illustrations of IAF aircraft (nose
// pointing right, 400×100 canvas). Rendered once to <img>/canvas sprites
// and reused by the airspace background, story scenes and the Sortie game.
// Shapes follow each aircraft's real configuration (Su-30MKI: canards +
// twin fins; Mirage 2000: tailless delta; Rafale: canard-delta; Tejas:
// tailless compound delta), painted in IAF-style air-superiority greys.

export type SpriteKind = 'su30' | 'mirage' | 'rafale' | 'tejas' | 'netra';

interface Palette {
  top: string;
  mid: string;
  bottom: string;
  wingTop: string;
  wingBottom: string;
}

const PALETTES: Record<SpriteKind, Palette> = {
  su30: { top: '#b7c3d0', mid: '#8795a5', bottom: '#56616f', wingTop: '#9fabb9', wingBottom: '#6a7584' },
  mirage: { top: '#c2ccd8', mid: '#8f9db0', bottom: '#5d6a7c', wingTop: '#a9b5c4', wingBottom: '#717e8f' },
  rafale: { top: '#a9b1ba', mid: '#7d8691', bottom: '#4f5761', wingTop: '#959ea8', wingBottom: '#646c76' },
  tejas: { top: '#ccd4dd', mid: '#97a3b1', bottom: '#646f7d', wingTop: '#b3bdc8', wingBottom: '#7c8795' },
  netra: { top: '#eef1f5', mid: '#c9d0d9', bottom: '#8b95a2', wingTop: '#d5dbe3', wingBottom: '#9aa4b1' },
};

function defs(p: Palette): string {
  return `<defs>
  <linearGradient id="b" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${p.top}"/><stop offset="0.45" stop-color="${p.mid}"/><stop offset="1" stop-color="${p.bottom}"/>
  </linearGradient>
  <linearGradient id="w" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${p.wingTop}"/><stop offset="1" stop-color="${p.wingBottom}"/>
  </linearGradient>
  <linearGradient id="d" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${p.bottom}"/><stop offset="1" stop-color="#3a424d"/>
  </linearGradient>
  <linearGradient id="g" x1="0" y1="0" x2="0.4" y2="1">
    <stop offset="0" stop-color="#e3f2ff"/><stop offset="0.35" stop-color="#7fa7c9"/><stop offset="1" stop-color="#1b2a3a"/>
  </linearGradient>
  <linearGradient id="n" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#1c2128"/><stop offset="1" stop-color="#4a525c"/>
  </linearGradient>
</defs>`;
}

const roundel = (x: number, y: number, r = 5.5) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="#ff9933"/><circle cx="${x}" cy="${y}" r="${r * 0.66}" fill="#fff"/><circle cx="${x}" cy="${y}" r="${r * 0.33}" fill="#138808"/>`;

/** Tricolour fin flash, slanted to follow a swept fin. */
const finFlash = (x: number, y: number, h = 10, slant = 9) => {
  const w = 3.6;
  return ['#ff9933', '#ffffff', '#138808']
    .map((c, i) => {
      const x0 = x + i * w;
      return `<path d="M${x0} ${y} L${x0 + w} ${y} L${x0 + w + slant} ${y + h} L${x0 + slant} ${y + h} Z" fill="${c}"/>`;
    })
    .join('');
};

const panel = (d: string) => `<path d="${d}" fill="none" stroke="#0b1220" stroke-opacity="0.16" stroke-width="0.8"/>`;

/** Small store hanging under a wing (missile with dark seeker + fins). */
const missile = (x: number, y: number, len = 34) =>
  `<g><rect x="${x}" y="${y}" width="${len}" height="3.6" rx="1.8" fill="#e8ecf1"/><path d="M${x + len} ${y} Q${x + len + 6} ${y + 1.8} ${x + len} ${y + 3.6} Z" fill="#59616b"/><path d="M${x} ${y} L${x - 4} ${y - 3} L${x + 6} ${y} Z M${x} ${y + 3.6} L${x - 4} ${y + 6.6} L${x + 6} ${y + 3.6} Z" fill="#7a838e"/><rect x="${x + len * 0.45}" y="${y - 2}" width="6" height="2" fill="#7a838e"/></g>`;

const wingRoundel = (x: number, y: number) =>
  `<ellipse cx="${x}" cy="${y}" rx="6" ry="3" fill="#ff9933"/><ellipse cx="${x}" cy="${y}" rx="4" ry="2" fill="#fff"/><ellipse cx="${x}" cy="${y}" rx="2" ry="1" fill="#138808"/>`;

// Each aircraft is drawn as seen from slightly below and to the side — the
// view from the ground at an air show — so the wing planform (delta,
// canards, swept) is visible and each jet is recognisable at a glance.
const BODIES: Record<SpriteKind, string> = {
  su30: `
  <path d="M244 50 L132 22 L104 22 L112 50 Z" fill="url(#d)"/>
  <path d="M320 48 L302 36 L292 36 L298 48 Z" fill="url(#d)"/>
  <path d="M82 50 L54 32 L42 32 L52 50 Z" fill="url(#d)"/>
  <path d="M100 44 L62 12 L48 12 L54 46 Z" fill="url(#d)"/>
  <path d="M262 60 L250 76 L120 78 L58 76 L58 62 Z" fill="url(#b)"/>
  <path d="M262 60 L272 62 L262 78 L250 77 Z" fill="#1c232c"/>
  <path d="M398 55 C386 50 360 45 330 43 C300 41 250 40 200 41 C150 42 110 44 70 47 L40 50 L40 60 L120 64 C200 66 290 64 330 61 C360 59 386 58 398 55 Z" fill="url(#b)"/>
  <path d="M398 55 C388 51 374 48 362 47 L362 59 C376 58 389 57 398 55 Z" fill="#5d6977" opacity="0.55"/>
  <path d="M58 64 L36 65 L34 76 L58 77 Z" fill="url(#n)"/>
  <path d="M42 52 L12 55 L42 58 Z" fill="url(#b)"/>
  <path d="M244 62 L134 96 L104 96 L112 66 Z" fill="url(#w)" stroke="#4b5563" stroke-opacity="0.3"/>
  ${wingRoundel(138, 84)}
  ${missile(150, 86, 30)}${missile(176, 76, 36)}
  <path d="M84 62 L54 84 L40 84 L52 64 Z" fill="url(#w)"/>
  <path d="M320 58 L300 74 L290 74 L298 58 Z" fill="url(#w)"/>
  <path d="M118 44 L78 6 L60 6 L68 47 Z" fill="url(#b)"/>
  ${finFlash(70, 12, 10, 9)}
  <path d="M332 43 C322 30 290 27 258 32 C248 34 244 38 242 42 Z" fill="url(#g)"/>
  <path d="M292 29 L294 42" stroke="#2c3540" stroke-width="1.4"/>
  <path d="M300 31 C285 30 270 31 260 34" stroke="#fff" stroke-opacity="0.55" stroke-width="1.2" fill="none"/>
  <circle cx="336" cy="43" r="2.4" fill="#d6dee8"/>
  ${roundel(190, 52)}
  ${panel('M300 44 L300 62 M240 42 L240 64 M150 43 L150 64 M120 45 L120 64 M360 47 L360 59')}
  <path d="M215 44 C238 47 252 54 232 58 C212 60 196 50 215 44 Z" fill="#0b1220" opacity="0.07"/>
  <path d="M398 55 L400 55" stroke="#2c3540" stroke-width="1.2"/>`,

  mirage: `
  <path d="M270 50 L96 20 L74 20 L62 50 Z" fill="url(#d)"/>
  <path d="M122 48 L72 6 L54 6 L60 51 Z" fill="url(#b)"/>
  <path d="M398 57 C376 52 348 48 322 47 C292 46 250 46 200 47 L82 50 L56 53 L56 64 L120 68 C200 70 290 68 330 64 C364 62 385 60 398 57 Z" fill="url(#b)"/>
  <path d="M398 57 C388 53 374 50 362 49 L362 61 C377 60 389 59 398 57 Z" fill="#5d6977" opacity="0.5"/>
  <path d="M292 50 L272 50 L262 65 L288 65 Z" fill="url(#d)"/>
  <path d="M276 52 L266 57 L276 62 Z" fill="#c9d1db"/>
  <path d="M60 55 L40 56 L40 64 L60 65 Z" fill="url(#n)"/>
  <path d="M270 64 L98 96 L74 96 L62 66 Z" fill="url(#w)" stroke="#4b5563" stroke-opacity="0.3"/>
  ${wingRoundel(112, 84)}
  ${missile(84, 94, 30)}${missile(150, 80, 34)}
  ${finFlash(64, 12, 11, 10)}
  <path d="M334 47 C322 32 292 31 278 47 Z" fill="url(#g)"/>
  <path d="M318 36 C304 34 292 37 286 42" stroke="#fff" stroke-opacity="0.55" stroke-width="1.2" fill="none"/>
  <path d="M340 46 L372 39" stroke="#3a424d" stroke-width="2.2" stroke-linecap="round"/>
  ${roundel(200, 57)}
  ${panel('M300 47 L300 66 M230 47 L230 68 M160 48 L160 68 M100 50 L100 66 M362 49 L362 61')}
  <path d="M398 57 L400 57" stroke="#2c3540" stroke-width="1.2"/>`,

  rafale: `
  <path d="M242 52 L104 22 L84 22 L70 52 Z" fill="url(#d)"/>
  <path d="M292 50 L270 36 L260 36 L264 50 Z" fill="url(#d)"/>
  <path d="M128 49 L88 12 L68 12 L72 51 Z" fill="url(#b)"/>
  <path d="M398 58 C376 53 348 49 324 48 C292 47 240 47 190 48 L78 51 L62 55 L62 63 L130 67 C210 70 300 68 336 64 C366 62 386 60 398 58 Z" fill="url(#b)"/>
  <path d="M398 58 C388 54 375 51 364 50 L364 61 C378 60 389 60 398 58 Z" fill="#4a525c" opacity="0.5"/>
  <path d="M262 64 L224 66 L228 75 L264 72 Z" fill="url(#d)"/>
  <path d="M264 64 L270 66 L264 72 Z" fill="#1c232c"/>
  <path d="M64 55 L46 56 L46 62 L64 63 Z" fill="url(#n)"/>
  <path d="M242 64 L106 96 L84 96 L70 66 Z" fill="url(#w)" stroke="#3f464f" stroke-opacity="0.3"/>
  ${wingRoundel(120, 84)}
  ${missile(92, 94, 30)}${missile(150, 80, 40)}
  <path d="M292 62 L270 78 L260 78 L264 62 Z" fill="url(#w)"/>
  ${finFlash(78, 17, 10, 9)}
  <path d="M332 48 C320 34 290 33 276 48 Z" fill="url(#g)"/>
  <path d="M316 37 C302 35 290 38 284 43" stroke="#fff" stroke-opacity="0.55" stroke-width="1.2" fill="none"/>
  <path d="M344 50 L372 45" stroke="#3a424d" stroke-width="2.2" stroke-linecap="round"/>
  ${roundel(196, 56)}
  ${panel('M300 48 L300 66 M240 48 L240 68 M170 49 L170 67 M110 51 L110 65')}
  <path d="M398 58 L400 58" stroke="#2c3540" stroke-width="1.2"/>`,

  tejas: `
  <path d="M284 52 L196 40 L118 22 L98 22 L98 52 Z" fill="url(#d)"/>
  <path d="M152 50 L114 10 L92 10 L98 52 Z" fill="url(#b)"/>
  <path d="M398 60 C378 54 350 50 330 49 C300 48 250 48 200 49 L104 52 L88 55 L88 64 L150 67 C220 70 300 68 340 64 C370 62 388 61 398 60 Z" fill="url(#b)"/>
  <path d="M398 60 C389 56 377 53 366 52 L366 62 C379 62 390 61 398 60 Z" fill="#5d6977" opacity="0.45"/>
  <path d="M286 62 L262 62 L258 71 L283 71 Z" fill="url(#d)"/>
  <path d="M286 62 L290 64 L283 71 Z" fill="#1c232c"/>
  <path d="M90 55 L74 56 L74 63 L90 64 Z" fill="url(#n)"/>
  <path d="M284 64 L196 76 L120 96 L98 96 L98 66 Z" fill="url(#w)" stroke="#4b5563" stroke-opacity="0.3"/>
  ${wingRoundel(132, 86)}
  ${missile(106, 94, 28)}${missile(170, 79, 32)}
  ${finFlash(102, 16, 11, 10)}
  <path d="M336 49 C324 36 297 35 285 49 Z" fill="url(#g)"/>
  <path d="M320 39 C306 37 295 40 290 44" stroke="#fff" stroke-opacity="0.55" stroke-width="1.2" fill="none"/>
  <path d="M344 51 L368 46" stroke="#3a424d" stroke-width="2" stroke-linecap="round"/>
  ${roundel(210, 58)}
  ${panel('M310 49 L310 66 M250 49 L250 68 M190 50 L190 67 M130 52 L130 65')}
  <path d="M398 60 L400 60" stroke="#2c3540" stroke-width="1.2"/>`,

  netra: `
  <path d="M262 50 L206 28 L190 28 L182 50 Z" fill="url(#d)"/>
  <path d="M120 46 L96 14 L84 14 L92 48 Z" fill="url(#b)"/>
  <path d="M112 15 L74 13 L72 17 L110 19 Z" fill="url(#w)"/>
  <path d="M392 58 C384 50 366 47 340 47 L110 48 L80 54 L84 62 L150 66 L340 66 C370 66 388 63 392 58 Z" fill="url(#b)"/>
  <path d="M372 50 C366 48 358 48 352 49 L356 54 L374 54 Z" fill="url(#g)"/>
  <rect x="150" y="36" width="140" height="7" rx="3" fill="#dfe5ec" stroke="#8b95a2" stroke-width="0.8"/>
  <rect x="200" y="43" width="6" height="5" fill="#8b95a2"/><rect x="240" y="43" width="6" height="5" fill="#8b95a2"/>
  <path d="M262 62 L206 94 L190 94 L178 64 Z" fill="url(#w)"/>
  <rect x="112" y="44" width="34" height="10" rx="5" fill="url(#d)"/>
  ${roundel(300, 57, 5)}
  ${finFlash(92, 20, 9, 6)}`,
};

const svgCache = new Map<SpriteKind, string>();

export function spriteSvg(kind: SpriteKind): string {
  let s = svgCache.get(kind);
  if (!s) {
    s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 100" width="800" height="200">${defs(PALETTES[kind])}${BODIES[kind]}</svg>`;
    svgCache.set(kind, s);
  }
  return s;
}

export function spriteUrl(kind: SpriteKind): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(spriteSvg(kind))}`;
}

const imgCache = new Map<SpriteKind, HTMLImageElement>();

/** Shared decoded <img> for canvas drawing (check `.complete` before use). */
export function spriteImage(kind: SpriteKind): HTMLImageElement {
  let img = imgCache.get(kind);
  if (!img) {
    img = new Image();
    img.src = spriteUrl(kind);
    imgCache.set(kind, img);
  }
  return img;
}

/** Where the engine nozzle sits on the 400×100 sprite (for afterburner / smoke). */
export const NOZZLE: Record<SpriteKind, { x: number; y: number }> = {
  su30: { x: 34, y: 70 },
  mirage: { x: 40, y: 60 },
  rafale: { x: 46, y: 59 },
  tejas: { x: 74, y: 60 },
  netra: { x: 112, y: 49 },
};
