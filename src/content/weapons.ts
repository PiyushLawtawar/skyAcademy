import type { TopJetShape } from '../components/art/JetArt';

// The Armoury. Every weapon/jet pairing below is publicly documented by the
// IAF, DRDO, PIB or the manufacturer; see SOURCES.md ("Armoury") for the list
// to spot-check. Ranges/speeds are given only where widely published, and
// always as kid-friendly comparisons rather than precise figures.

export type WeaponKind = 'aam-bvr' | 'aam-wvr' | 'cruise' | 'ground-bomb' | 'anti-radar' | 'anti-ship' | 'gun' | 'fuel';

export type Guidance = 'radar' | 'heat' | 'laser' | 'gps' | 'radar-signal' | 'camera' | 'none';

export interface Weapon {
  id: string;
  name: string;
  kind: WeaponKind;
  origin: string;
  flag: string;
  madeInIndia?: boolean;
  guidance: Guidance[];
  speed?: string;
  range?: string;
  /** 1–2 short sentences a 7-year-old can read. */
  kid: string;
  /** The single most exciting fact. */
  wow: string;
  /** "Go deeper" for curious 9–10 year olds. */
  deeper: string;
}

export const KIND_INFO: Record<WeaponKind, { label: string; emoji: string; short: string }> = {
  'aam-bvr': { label: 'Long-range air-to-air', emoji: '🎯', short: 'Hits planes far away, even beyond what the pilot can see.' },
  'aam-wvr': { label: 'Dogfight air-to-air', emoji: '🔥', short: 'For close-range air battles. Follows the heat of engines.' },
  cruise: { label: 'Cruise missile', emoji: '🚀', short: 'Flies very far on its own, like a tiny robot plane.' },
  'ground-bomb': { label: 'Precision bomb', emoji: '🎳', short: 'A smart bomb with fins that steer it exactly onto a target.' },
  'anti-radar': { label: 'Anti-radiation missile', emoji: '📡', short: 'Follows the signal of a radar back to where it came from.' },
  'anti-ship': { label: 'Anti-ship missile', emoji: '🚢', short: 'Skims over the sea to reach ships.' },
  gun: { label: 'Cannon', emoji: '💥', short: 'A super-fast gun inside the jet, the last-resort weapon.' },
  fuel: { label: 'Drop tank', emoji: '⛽', short: 'Extra fuel to fly further. Can be dropped when empty.' },
};

export const GUIDANCE_INFO: Record<Guidance, { label: string; emoji: string; kid: string }> = {
  radar: { label: 'Radar', emoji: '📡', kid: 'Sends out invisible radio waves and listens for the echo, like a bat.' },
  heat: { label: 'Heat-seeking', emoji: '🌡️', kid: 'Its eye sees heat, so it follows the hot jet engine.' },
  laser: { label: 'Laser', emoji: '🔦', kid: 'Follows a laser spot that a pilot shines on the target.' },
  gps: { label: 'Satellite (GPS)', emoji: '🛰️', kid: 'Uses satellites in space to know exactly where it is.' },
  'radar-signal': { label: 'Radar-signal homing', emoji: '📶', kid: 'Listens for an enemy radar and flies to it.' },
  camera: { label: 'Camera eye', emoji: '📷', kid: 'Compares what its camera sees with a stored picture.' },
  none: { label: 'Aimed by pilot', emoji: '🎯', kid: 'The pilot aims using the HUD in front of the eyes.' },
};

export const WEAPONS: Weapon[] = [
  {
    id: 'astra',
    name: 'Astra Mk1',
    kind: 'aam-bvr',
    origin: 'India (DRDO)',
    flag: '🇮🇳',
    madeInIndia: true,
    guidance: ['radar'],
    range: 'More than 100 km. That is like flying from Delhi to Meerut and back!',
    kid: "India's own long-range air-to-air missile. It can catch a plane the pilot can't even see yet.",
    wow: '"Astra" means "weapon" in Sanskrit, and it was designed and built right here in India!',
    deeper:
      'Astra is a "Beyond Visual Range" (BVR) missile. The jet\'s radar finds the target first, then Astra flies most of the way using its own guidance and switches on its own radar seeker near the end. It has been fired from the Su-30MKI and the Tejas.',
  },
  {
    id: 'brahmos-a',
    name: 'BrahMos-A',
    kind: 'cruise',
    origin: 'India + Russia (BrahMos Aerospace)',
    flag: '🇮🇳🇷🇺',
    madeInIndia: true,
    guidance: ['gps', 'radar'],
    speed: 'About Mach 2.8, nearly 3 times the speed of sound!',
    range: 'Hundreds of kilometres',
    kid: 'One of the fastest cruise missiles in the world. The Su-30MKI carries it under its belly.',
    wow: 'Its name joins two rivers: the Brahmaputra (India) and the Moskva (Russia)!',
    deeper:
      'The air-launched BrahMos weighs about 2.5 tonnes, so heavy that only the big Su-30MKI was modified to carry it. It was first fired from a Su-30MKI in November 2017. Being supersonic makes it very hard to stop.',
  },
  {
    id: 'meteor',
    name: 'Meteor',
    kind: 'aam-bvr',
    origin: 'Europe (MBDA)',
    flag: '🇪🇺',
    guidance: ['radar'],
    range: 'Well over 100 km',
    kid: "Rafale's super long-range missile. It has a special engine that breathes air!",
    wow: 'Meteor uses a ramjet. It keeps its engine running the whole way, so it is still fast at the very end.',
    deeper:
      'Most missiles burn their rocket for a few seconds and then glide. Meteor\'s ramjet "throttles" like a jet engine, giving it a huge "no-escape zone", the area where a target cannot turn away fast enough to escape.',
  },
  {
    id: 'mica',
    name: 'MICA',
    kind: 'aam-bvr',
    origin: 'France (MBDA)',
    flag: '🇫🇷',
    guidance: ['radar', 'heat'],
    kid: 'A clever missile that comes in two versions: one with a radar eye and one with a heat eye.',
    wow: 'Same body, two different "eyes", so the enemy cannot easily guess which one is coming!',
    deeper:
      'MICA-EM uses radar, MICA-IR uses an infrared (heat) seeker. It can be used both close-in and at medium range. It arms the Rafale and the upgraded Mirage 2000.',
  },
  {
    id: 'r-73',
    name: 'R-73',
    kind: 'aam-wvr',
    origin: 'Russia (Vympel)',
    flag: '🇷🇺',
    guidance: ['heat'],
    kid: 'A dogfight missile. The pilot can aim it just by looking at the target through a special helmet!',
    wow: 'It can turn so sharply that it can hit planes off to the side, not only straight ahead.',
    deeper:
      'The R-73 uses "thrust vectoring": its rocket exhaust can be steered, making it very agile. Combined with a helmet-mounted sight, the pilot looks at the target, the missile locks on, and fires. It is carried by the Su-30MKI, MiG-29, MiG-21 Bison and early Tejas.',
  },
  {
    id: 'r-77',
    name: 'R-77 (RVV-AE)',
    kind: 'aam-bvr',
    origin: 'Russia (Vympel)',
    flag: '🇷🇺',
    guidance: ['radar'],
    kid: 'A medium-range missile with its own radar in its nose.',
    wow: 'It has unusual lattice "grid fins" at the back that look like a waffle!',
    deeper:
      'Its own active radar seeker means the pilot can fire it and turn away ("fire and forget"). Carried by the Su-30MKI, MiG-29 and MiG-21 Bison.',
  },
  {
    id: 'r-27',
    name: 'R-27',
    kind: 'aam-bvr',
    origin: 'Russia (Vympel)',
    flag: '🇷🇺',
    guidance: ['radar', 'heat'],
    kid: 'An older medium-range missile with radar and heat versions.',
    wow: 'It was one of the first missiles carried by India\'s MiG-29s in the 1980s.',
    deeper: 'Radar-guided versions need the launching jet to keep its radar pointed at the target until close to impact ("semi-active" guidance).',
  },
  {
    id: 'magic-2',
    name: 'Magic II',
    kind: 'aam-wvr',
    origin: 'France (Matra)',
    flag: '🇫🇷',
    guidance: ['heat'],
    kid: 'A heat-seeking dogfight missile.',
    wow: 'On the Jaguar, it sits ON TOP of the wings! Very few jets in the world do that.',
    deeper: 'Jaguar\'s over-wing pylons keep the under-wing space free for bombs and fuel tanks, a smart way to carry more.',
  },
  {
    id: 'super-530d',
    name: 'Super 530D',
    kind: 'aam-bvr',
    origin: 'France (Matra)',
    flag: '🇫🇷',
    guidance: ['radar'],
    kid: 'A big, fast medium-range missile for the Mirage 2000.',
    wow: 'It was designed to climb and catch high-flying targets.',
    deeper: 'It uses semi-active radar, so the Mirage\'s radar lights up the target for it.',
  },
  {
    id: 'python-5',
    name: 'Python-5',
    kind: 'aam-wvr',
    origin: 'Israel (Rafael)',
    flag: '🇮🇱',
    guidance: ['heat', 'camera'],
    kid: 'A very agile dogfight missile with a "camera-like" heat eye.',
    wow: 'It can be fired at a target behind the jet’s wing line, and still turn around to find it!',
    deeper: 'Its imaging infrared seeker sees a heat picture, which makes it hard to fool with flares. It was test-fired from Tejas in 2021.',
  },
  {
    id: 'derby',
    name: 'Derby',
    kind: 'aam-bvr',
    origin: 'Israel (Rafael)',
    flag: '🇮🇱',
    guidance: ['radar'],
    kid: 'A medium-range radar missile used on the Tejas.',
    wow: 'Tejas fired Derby and hit its target in tests. Proof that India\'s own jet works with many weapons!',
    deeper: 'Derby has an active radar seeker, so it is "fire and forget".',
  },
  {
    id: 'scalp',
    name: 'SCALP',
    kind: 'cruise',
    origin: 'Europe (MBDA)',
    flag: '🇪🇺',
    guidance: ['gps', 'camera'],
    range: 'More than 250 km',
    kid: 'A long-range, stealthy cruise missile carried by the Rafale.',
    wow: 'It flies low and hugs the ground to stay hidden, then uses a camera to find its exact target.',
    deeper:
      'Also called Storm Shadow in the UK. It navigates by satellite and terrain maps, and its shape is designed to be hard for radar to see. The Rafale can launch it from very far away, staying safe.',
  },
  {
    id: 'hammer',
    name: 'HAMMER',
    kind: 'ground-bomb',
    origin: 'France (Safran)',
    flag: '🇫🇷',
    guidance: ['gps', 'laser'],
    kid: 'A bomb with wings, a rocket and a smart brain added on, so it can glide a long way to its target.',
    wow: 'HAMMER is a "kit": it turns a simple bomb into a precision weapon.',
    deeper: 'Bought for Rafale. Its rocket booster lets it be dropped far from the target, which keeps the jet away from air defences.',
  },
  {
    id: 'spice-2000',
    name: 'SPICE 2000',
    kind: 'ground-bomb',
    origin: 'Israel (Rafael)',
    flag: '🇮🇱',
    guidance: ['gps', 'camera'],
    kid: 'A precision glide bomb that matches what its camera sees with a stored photo.',
    wow: 'Mirage 2000s used SPICE bombs in the 2019 Balakot air strike.',
    deeper: 'Its wings let it glide for many kilometres. It compares the live camera image with a picture loaded before take-off to hit the exact spot.',
  },
  {
    id: 'lgb',
    name: 'Laser-Guided Bomb',
    kind: 'ground-bomb',
    origin: 'Various',
    flag: '🌐',
    guidance: ['laser'],
    kid: 'A bomb that follows a laser spot shone on the target.',
    wow: 'In Kargil (1999), Mirage 2000s used laser-guided bombs to hit targets high in the mountains.',
    deeper: 'A targeting pod under the jet shines an invisible laser on the target. The bomb\'s nose sees the reflected spot and moves its fins to steer onto it.',
  },
  {
    id: 'rudram',
    name: 'Rudram-1',
    kind: 'anti-radar',
    origin: 'India (DRDO)',
    flag: '🇮🇳',
    madeInIndia: true,
    guidance: ['radar-signal', 'gps'],
    kid: "India's first anti-radiation missile. It listens for an enemy radar and flies straight to it.",
    wow: 'It can remember where a radar was, even if the radar switches off to hide!',
    deeper:
      'Silencing enemy radars is called SEAD (Suppression of Enemy Air Defences). Rudram-1 was tested from a Su-30MKI in October 2020. "Rudra" is a name of Lord Shiva.',
  },
  {
    id: 'kh-31',
    name: 'Kh-31',
    kind: 'anti-ship',
    origin: 'Russia',
    flag: '🇷🇺',
    guidance: ['radar', 'radar-signal'],
    kid: 'A very fast missile used against ships and radars.',
    wow: 'It has a ramjet too, so it is supersonic for most of its flight.',
    deeper: 'Su-30MKI can carry it. Versions exist to attack ships (radar seeker) and radars (signal-homing).',
  },
  {
    id: 'gsh-30-1',
    name: 'GSh-30-1 (30 mm)',
    kind: 'gun',
    origin: 'Russia',
    flag: '🇷🇺',
    guidance: ['none'],
    kid: 'A built-in cannon, hidden near the cockpit.',
    wow: 'It is one of the lightest 30 mm aircraft cannons ever made.',
    deeper: 'Fitted in the Su-30MKI and MiG-29. Guns are for very close fights when missiles can\'t be used.',
  },
  {
    id: 'gsh-23',
    name: 'GSh-23 (23 mm)',
    kind: 'gun',
    origin: 'Russia',
    flag: '🇷🇺',
    guidance: ['none'],
    kid: 'A twin-barrel cannon tucked under the jet.',
    wow: 'Two barrels take turns firing, which makes it shoot very fast.',
    deeper: 'Fitted to the MiG-21 Bison and the Tejas.',
  },
  {
    id: 'rafale-gun',
    name: '30M791 (30 mm)',
    kind: 'gun',
    origin: 'France (Nexter)',
    flag: '🇫🇷',
    guidance: ['none'],
    kid: "Rafale's built-in cannon, one of the fastest-firing 30 mm guns.",
    wow: 'It can fire about 2,500 rounds a minute!',
    deeper: 'It sits in the right side of the Rafale\'s body near the wing root.',
  },
  {
    id: 'defa-554',
    name: 'DEFA 554 ×2 (30 mm)',
    kind: 'gun',
    origin: 'France',
    flag: '🇫🇷',
    guidance: ['none'],
    kid: 'The Mirage 2000 has two cannons under its belly.',
    wow: 'Two guns = double the punch in a close dogfight.',
    deeper: 'They are mounted under the air intakes.',
  },
  {
    id: 'aden',
    name: 'ADEN ×2 (30 mm)',
    kind: 'gun',
    origin: 'UK',
    flag: '🇬🇧',
    guidance: ['none'],
    kid: 'The Jaguar has two 30 mm cannons.',
    wow: 'ADEN guns were designed in Britain back in the 1950s and are still flying!',
    deeper: 'The Jaguar is a deep-strike jet, so its guns are mostly for self-protection.',
  },
  {
    id: 'drop-tank',
    name: 'Drop Tank',
    kind: 'fuel',
    origin: 'Various',
    flag: '⛽',
    guidance: ['none'],
    kid: 'An extra fuel tank under the wing or belly, so the jet can fly further.',
    wow: 'Pilots can let go of empty tanks in flight to make the jet lighter and faster.',
    deeper: 'Fuel lets a jet stay on patrol longer, which is just as important as weapons. That is why tankers and drop tanks are called "force multipliers".',
  },
];

export interface Loadout {
  /** Matches the aircraft id in aircraft.ts so we can link to its card. */
  aircraftId: string;
  name: string;
  emoji: string;
  shape: TopJetShape;
  color: string;
  hardpoints: number;
  gunId: string;
  weaponIds: string[];
  role: string;
  presets: { name: string; emoji: string; mission: string; items: string[] }[];
  note: string;
}

export const LOADOUTS: Loadout[] = [
  {
    aircraftId: 'su-30mki',
    name: 'Su-30MKI',
    emoji: '🦅',
    shape: { wing: 'swept', canards: true, twinTail: true, tailplanes: true, scale: 1.05 },
    color: '#8b9bb4',
    hardpoints: 12,
    gunId: 'gsh-30-1',
    weaponIds: ['astra', 'r-77', 'r-27', 'r-73', 'brahmos-a', 'rudram', 'kh-31', 'lgb', 'drop-tank'],
    role: 'Heavy multi-role fighter: the backbone of the IAF.',
    presets: [
      { name: 'Air Defence', emoji: '🛡️', mission: 'Guard the sky for a long patrol.', items: ['astra', 'astra', 'r-77', 'r-77', 'r-73', 'r-73', 'r-27', 'r-27'] },
      { name: 'Deep Strike', emoji: '🚀', mission: 'Hit a far-away target from very far away.', items: ['brahmos-a', 'r-73', 'r-73', 'astra', 'astra'] },
      { name: 'Radar Hunter', emoji: '📡', mission: 'Switch off the enemy\'s "eyes" first (SEAD).', items: ['rudram', 'rudram', 'astra', 'astra', 'r-73', 'r-73'] },
    ],
    note: 'With 12 hardpoints, the Su-30MKI can carry around 8 tonnes of weapons and fuel. That is heavier than an elephant!',
  },
  {
    aircraftId: 'rafale',
    name: 'Rafale',
    emoji: '🌪️',
    shape: { wing: 'delta', canards: true, scale: 0.95 },
    color: '#8996a8',
    hardpoints: 14,
    gunId: 'rafale-gun',
    weaponIds: ['meteor', 'mica', 'scalp', 'hammer', 'drop-tank'],
    role: 'Omni-role fighter: can do many jobs in the same flight.',
    presets: [
      { name: 'Air Dominance', emoji: '👑', mission: 'Win control of the sky.', items: ['meteor', 'meteor', 'meteor', 'meteor', 'mica', 'mica', 'drop-tank'] },
      { name: 'Long-Range Strike', emoji: '🎯', mission: 'Reach a target hundreds of km away.', items: ['scalp', 'scalp', 'meteor', 'meteor', 'mica', 'mica', 'drop-tank'] },
      { name: 'Precision Support', emoji: '🎳', mission: 'Help soldiers on the ground.', items: ['hammer', 'hammer', 'hammer', 'hammer', 'mica', 'mica', 'drop-tank'] },
    ],
    note: '"Rafale" means "gust of wind" in French. India\'s Rafales also carry special India-specific upgrades.',
  },
  {
    aircraftId: 'tejas',
    name: 'Tejas',
    emoji: '⚡',
    shape: { wing: 'cranked', scale: 0.82 },
    color: '#9aa8ba',
    hardpoints: 8,
    gunId: 'gsh-23',
    weaponIds: ['astra', 'derby', 'python-5', 'r-73', 'lgb', 'drop-tank'],
    role: 'Light, nimble fighter, designed and built in India.',
    presets: [
      { name: 'Quick Intercept', emoji: '⚡', mission: 'Scramble fast and guard the border.', items: ['astra', 'astra', 'derby', 'python-5', 'python-5', 'drop-tank'] },
      { name: 'Ground Support', emoji: '🪖', mission: 'Help soldiers with precise bombs.', items: ['lgb', 'lgb', 'python-5', 'python-5', 'drop-tank'] },
    ],
    note: 'Tejas has no tail-planes at all. Its big "compound delta" wing does the job instead!',
  },
  {
    aircraftId: 'mirage-2000',
    name: 'Mirage 2000',
    emoji: '💎',
    shape: { wing: 'delta', scale: 0.9 },
    color: '#93a2b5',
    hardpoints: 9,
    gunId: 'defa-554',
    weaponIds: ['mica', 'magic-2', 'super-530d', 'lgb', 'spice-2000', 'drop-tank'],
    role: 'Precision-strike and air-defence fighter. The hero of Kargil.',
    presets: [
      { name: 'Precision Strike', emoji: '🎯', mission: 'Hit a small target exactly.', items: ['spice-2000', 'spice-2000', 'mica', 'mica', 'drop-tank'] },
      { name: 'Air Defence', emoji: '🛡️', mission: 'Protect the airbase.', items: ['mica', 'mica', 'mica', 'mica', 'magic-2', 'magic-2', 'drop-tank'] },
    ],
    note: 'Mirage 2000s used laser-guided bombs in Kargil (1999) and SPICE bombs at Balakot (2019).',
  },
  {
    aircraftId: 'mig-29',
    name: 'MiG-29',
    emoji: '🐺',
    shape: { wing: 'swept', twinTail: true, tailplanes: true, scale: 0.92 },
    color: '#8ea0b2',
    hardpoints: 7,
    gunId: 'gsh-30-1',
    weaponIds: ['r-77', 'r-27', 'r-73', 'drop-tank'],
    role: 'Agile air-superiority fighter, a top dogfighter.',
    presets: [{ name: 'Dogfight', emoji: '🔥', mission: 'Win close air battles.', items: ['r-73', 'r-73', 'r-77', 'r-77', 'r-27', 'r-27', 'drop-tank'] }],
    note: 'Its engines have special doors that close on the ground, so it doesn\'t swallow stones on rough runways!',
  },
  {
    aircraftId: 'jaguar',
    name: 'Jaguar',
    emoji: '🐆',
    shape: { wing: 'swept', tailplanes: true, scale: 0.92 },
    color: '#8a9a88',
    hardpoints: 7,
    gunId: 'aden',
    weaponIds: ['magic-2', 'lgb', 'drop-tank'],
    role: 'Deep-penetration strike jet: flies low and fast under radar.',
    presets: [{ name: 'Low-Level Strike', emoji: '🏔️', mission: 'Fly low under radar to a far target.', items: ['magic-2', 'magic-2', 'lgb', 'lgb', 'drop-tank', 'drop-tank'] }],
    note: 'In India it was also called "Shamsher" (sword of justice). HAL built many of them in India.',
  },
  {
    aircraftId: 'mig-21-bison',
    name: 'MiG-21 Bison',
    emoji: '🐃',
    shape: { wing: 'delta', tailplanes: true, scale: 0.8 },
    color: '#9aa5b4',
    hardpoints: 5,
    gunId: 'gsh-23',
    weaponIds: ['r-77', 'r-73', 'drop-tank'],
    role: 'Retired legend: interceptor that served 62 years.',
    presets: [{ name: 'Intercept', emoji: '⚡', mission: 'Climb fast and stop an intruder.', items: ['r-77', 'r-77', 'r-73', 'r-73', 'drop-tank'] }],
    note: 'Retired in September 2025 after 62 years with the IAF.',
  },
];

export function getWeapon(id: string): Weapon | undefined {
  return WEAPONS.find((w) => w.id === id);
}

export function getLoadout(aircraftId: string): Loadout | undefined {
  return LOADOUTS.find((l) => l.aircraftId === aircraftId);
}
