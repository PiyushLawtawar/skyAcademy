import type { SceneKind } from './history';

export type MissionRole = 'eyes' | 'fighter' | 'strike' | 'sead' | 'tanker' | 'transport' | 'heli' | 'heavy-heli' | 'attack-heli';

export const ROLE_INFO: Record<MissionRole, { label: string; why: string }> = {
  eyes: { label: 'Eyes in the sky', why: 'sees far and guides everyone' },
  fighter: { label: 'Fighter / escort', why: 'guards the sky and protects the team' },
  strike: { label: 'Long-range striker', why: 'reaches the far target precisely' },
  sead: { label: 'Radar-blinder (SEAD)', why: 'switches off enemy radars first' },
  tanker: { label: 'Tanker', why: 'gives fuel so others fly further' },
  transport: { label: 'Transport plane', why: 'carries lots of people and supplies' },
  heli: { label: 'Helicopter', why: 'lands almost anywhere, even rooftops' },
  'heavy-heli': { label: 'Heavy-lift helicopter', why: 'lifts heavy loads to high places' },
  'attack-heli': { label: 'Attack helicopter', why: 'helps soldiers up close' },
};

export interface MissionAsset {
  id: string;
  aircraft: string;
  emoji: string;
  role: MissionRole;
  cost: number;
}

export const ASSETS: MissionAsset[] = [
  { id: 'netra', aircraft: 'Netra AEW&C', emoji: '👁️', role: 'eyes', cost: 2 },
  { id: 'su30-escort', aircraft: 'Su-30MKI (escort)', emoji: '🦅', role: 'fighter', cost: 3 },
  { id: 'tejas', aircraft: 'Tejas (interceptor)', emoji: '⚡', role: 'fighter', cost: 2 },
  { id: 'rafale-scalp', aircraft: 'Rafale + SCALP', emoji: '🌪️', role: 'strike', cost: 3 },
  { id: 'su30-rudram', aircraft: 'Su-30MKI + Rudram', emoji: '📶', role: 'sead', cost: 3 },
  { id: 'il78', aircraft: 'Il-78 tanker', emoji: '⛽', role: 'tanker', cost: 2 },
  { id: 'c17', aircraft: 'C-17 Globemaster', emoji: '🐋', role: 'transport', cost: 3 },
  { id: 'c130j', aircraft: 'C-130J Super Hercules', emoji: '🐘', role: 'transport', cost: 2 },
  { id: 'mi17', aircraft: 'Mi-17 helicopter', emoji: '🚁', role: 'heli', cost: 2 },
  { id: 'chinook', aircraft: 'Chinook (heavy-lift)', emoji: '🦬', role: 'heavy-heli', cost: 2 },
  { id: 'prachand', aircraft: 'LCH Prachand', emoji: '🐍', role: 'attack-heli', cost: 2 },
];

export interface MissionScenario {
  id: string;
  title: string;
  emoji: string;
  scene: SceneKind;
  type: 'Rescue' | 'Air Defence' | 'Supply' | 'Support' | 'Strike';
  brief: string;
  budget: number;
  needs: { role: MissionRole; why: string }[];
  /** Useful but optional: no penalty for taking them. */
  extras: { role: MissionRole; why: string }[];
  win: string;
}

export const MISSIONS: MissionScenario[] = [
  {
    id: 'flood',
    title: 'Flood Rescue in Assam',
    emoji: '🌊',
    scene: 'flood',
    type: 'Rescue',
    brief: 'Heavy rain! Villages are flooded and families are waiting on rooftops. The nearest road is broken. Food and medicine are needed too.',
    budget: 6,
    needs: [
      { role: 'heli', why: 'Only helicopters can hover and lift people off rooftops.' },
      { role: 'transport', why: 'A transport plane brings tonnes of food, boats and medicine to the nearest airport.' },
    ],
    extras: [{ role: 'heavy-heli', why: 'A Chinook can carry big loads like boats and generators.' }],
    win: 'Families are safe and supplies have arrived. Great rescue, commander!',
  },
  {
    id: 'blip',
    title: 'Unknown Blip at Night',
    emoji: '🌙',
    scene: 'night',
    type: 'Air Defence',
    brief: 'Radar shows an unknown aircraft flying towards the border at night. It is not answering the radio. Find it, identify it, and guide it away safely.',
    budget: 5,
    needs: [
      { role: 'eyes', why: 'AWACS tracks the blip far beyond what ground radar can see.' },
      { role: 'fighter', why: 'Fighters scramble to intercept and identify it up close.' },
    ],
    extras: [],
    win: 'It was a lost aircraft! Your fighters guided it to land safely. Calm and quick: perfect air defence.',
  },
  {
    id: 'ladakh',
    title: 'Supply the High Mountain Post',
    emoji: '🏔️',
    scene: 'glacier',
    type: 'Supply',
    brief: 'Soldiers at a post high in Ladakh need food, fuel and a heavy generator before winter snow closes the roads.',
    budget: 4,
    needs: [
      { role: 'transport', why: 'A C-130J can land on short, high mountain airstrips like Daulat Beg Oldi.' },
      { role: 'heavy-heli', why: 'A Chinook can lift the heavy generator up to the post where no plane can land.' },
    ],
    extras: [],
    win: 'The post has everything it needs for winter. The IAF is the lifeline of the mountains!',
  },
  {
    id: 'cas',
    title: 'Help the Soldiers!',
    emoji: '🪖',
    scene: 'mountains',
    type: 'Support',
    brief: 'Our soldiers in a valley are under attack from a hill. They need help quickly and precisely, because they are very close by.',
    budget: 5,
    needs: [{ role: 'attack-heli', why: 'Attack helicopters like Prachand can fly low, see clearly and help precisely.' }],
    extras: [
      { role: 'fighter', why: 'A fighter overhead keeps the sky safe for the helicopters.' },
      { role: 'eyes', why: 'AWACS keeps watch for any enemy aircraft.' },
    ],
    win: 'The soldiers are safe! Careful teamwork with the ground controller made it work.',
  },
  {
    id: 'deep-strike',
    title: 'The Long-Range Mission',
    emoji: '🎯',
    scene: 'night',
    type: 'Strike',
    brief: 'A target is far away, protected by radars and enemy fighters. Plan a full strike package so everyone comes home safely.',
    budget: 13,
    needs: [
      { role: 'eyes', why: 'AWACS spots enemy fighters early and guides your team.' },
      { role: 'sead', why: 'Radar-blinders switch off enemy air defences first.' },
      { role: 'fighter', why: 'Escorts protect the strikers from enemy fighters.' },
      { role: 'strike', why: 'The striker launches a precise long-range missile.' },
      { role: 'tanker', why: 'It is far: the tanker refuels everyone so they can get home.' },
    ],
    extras: [],
    win: 'Target hit, everyone home! You planned a real strike package, just like an Air Marshal.',
  },
];

export interface MissionResult {
  stars: 1 | 2 | 3;
  cost: number;
  overBudget: boolean;
  missing: { role: MissionRole; why: string }[];
  wasted: MissionAsset[];
}

/** Scoring rewards good planning: right roles, no waste, within budget. */
export function scoreMission(mission: MissionScenario, picked: MissionAsset[]): MissionResult {
  const cost = picked.reduce((s, a) => s + a.cost, 0);
  const roles = new Set(picked.map((a) => a.role));
  const missing = mission.needs.filter((n) => !roles.has(n.role));
  const useful = new Set([...mission.needs, ...mission.extras].map((n) => n.role));
  const wasted = picked.filter((a) => !useful.has(a.role));
  const overBudget = cost > mission.budget;
  const stars: 1 | 2 | 3 = missing.length > 0 ? 1 : wasted.length > 0 || overBudget ? 2 : 3;
  return { stars, cost, overBudget, missing, wasted };
}
