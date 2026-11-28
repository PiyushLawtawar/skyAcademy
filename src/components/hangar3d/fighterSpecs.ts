import type { PartId } from '../../content/aircraftParts';

// Real-layout data for each 3D fighter (kept free of three.js so pages can
// check `hasModel` without pulling the 3D engine into the main bundle).
// Units: the jet is ~10 long, nose at +X, up is +Y, right wing is +Z.

interface Planform {
  rootLE: number;
  rootTE: number;
  tipLE: number;
  tipTE: number;
  span: number;
  y: number;
  crank?: { x: number; z: number };
}

export interface FighterSpec {
  name: string;
  color: string;
  rMax: number;
  widthScale: number;
  heightScale: number;
  noseStart: number;
  radomeStart: number;
  noseIntake?: boolean;
  tailR: number;
  wing: Planform;
  surfaces: 'elevons' | 'ailerons-flaps';
  canard?: { x: number; rootChord: number; tipChord: number; span: number; sweep: number; y: number };
  tailplane?: { x: number; rootChord: number; tipChord: number; span: number; sweep: number; y: number };
  fins: { count: 1 | 2; x: number; rootChord: number; tipChord: number; height: number; sweep: number; z?: number; cant?: number };
  engines: { count: 1 | 2; z?: number; r: number; nacelles?: boolean };
  intake: 'side' | 'under' | 'nose';
  intakeX: number;
  canopy: { x: number; len: number; seats: 1 | 2 };
  probe?: boolean;
  missiles: { x: number; z: number; y: number; over?: boolean }[];
  dropTank?: boolean;
}

export const FIGHTER_SPECS: Record<string, FighterSpec> = {
  'su-30mki': {
    name: 'Su-30MKI',
    color: '#8d9aab',
    rMax: 0.55,
    widthScale: 1.5,
    heightScale: 0.85,
    noseStart: 2.0,
    radomeStart: 3.7,
    tailR: 0.3,
    // big curved leading-edge extension running forward almost to the cockpit
    wing: { rootLE: 2.35, crank: { x: 0.35, z: 1.45 }, rootTE: -2.9, tipLE: -2.3, tipTE: -3.15, span: 3.5, y: -0.05 },
    surfaces: 'ailerons-flaps',
    canard: { x: 2.95, rootChord: 0.75, tipChord: 0.3, span: 1.35, sweep: 0.55, y: 0.12 },
    tailplane: { x: -3.3, rootChord: 1.3, tipChord: 0.5, span: 2.25, sweep: 0.9, y: -0.08 },
    fins: { count: 2, x: -2.4, rootChord: 1.7, tipChord: 0.7, height: 1.9, sweep: 1.1, z: 0.62, cant: 0.12 },
    engines: { count: 2, z: 0.55, r: 0.32, nacelles: true },
    intake: 'under',
    intakeX: 0.7,
    canopy: { x: 2.5, len: 2.1, seats: 2 },
    missiles: [
      { x: -1.2, z: 3.5, y: -0.08 },
      { x: -0.7, z: 2.55, y: -0.32 },
      { x: -0.3, z: 1.75, y: -0.36 },
    ],
  },
  rafale: {
    name: 'Rafale',
    color: '#808a95',
    rMax: 0.5,
    widthScale: 1.15,
    heightScale: 0.95,
    noseStart: 2.3,
    radomeStart: 3.9,
    tailR: 0.3,
    wing: { rootLE: 0.4, rootTE: -4.2, tipLE: -3.4, tipTE: -4.25, span: 3.5, y: -0.15 },
    surfaces: 'elevons',
    canard: { x: 2.0, rootChord: 1.0, tipChord: 0.4, span: 1.3, sweep: 0.8, y: 0.1 },
    fins: { count: 1, x: -2.4, rootChord: 2.0, tipChord: 0.6, height: 1.8, sweep: 1.4 },
    engines: { count: 2, z: 0.27, r: 0.26 },
    intake: 'under',
    intakeX: 1.1,
    canopy: { x: 2.55, len: 1.6, seats: 1 },
    probe: true,
    missiles: [
      { x: -3.9, z: 3.5, y: -0.12 },
      { x: -2.0, z: 2.45, y: -0.36 },
      { x: -1.3, z: 1.5, y: -0.4 },
    ],
    dropTank: true,
  },
  tejas: {
    name: 'Tejas',
    color: '#a3afbd',
    rMax: 0.48,
    widthScale: 1.0,
    heightScale: 1.0,
    noseStart: 2.4,
    radomeStart: 3.9,
    tailR: 0.32,
    wing: { rootLE: 1.6, crank: { x: -0.7, z: 1.25 }, tipLE: -3.4, tipTE: -4.1, rootTE: -4.4, span: 3.05, y: -0.12 },
    surfaces: 'elevons',
    fins: { count: 1, x: -1.5, rootChord: 2.6, tipChord: 0.7, height: 2.2, sweep: 1.8 },
    engines: { count: 1, r: 0.36 },
    intake: 'side',
    intakeX: 1.3,
    canopy: { x: 2.65, len: 1.5, seats: 1 },
    probe: true,
    missiles: [
      { x: -3.6, z: 2.9, y: -0.3 },
      { x: -2.0, z: 1.9, y: -0.33 },
    ],
    dropTank: true,
  },
  'mirage-2000': {
    name: 'Mirage 2000',
    color: '#98a7ba',
    rMax: 0.5,
    widthScale: 1.0,
    heightScale: 1.0,
    noseStart: 2.2,
    radomeStart: 3.8,
    tailR: 0.32,
    wing: { rootLE: 0.6, rootTE: -4.3, tipLE: -3.9, tipTE: -4.4, span: 3.15, y: -0.15 },
    surfaces: 'elevons',
    fins: { count: 1, x: -2.0, rootChord: 2.4, tipChord: 0.6, height: 2.0, sweep: 1.8 },
    engines: { count: 1, r: 0.36 },
    intake: 'side',
    intakeX: 1.7,
    canopy: { x: 2.6, len: 1.5, seats: 1 },
    probe: true,
    missiles: [
      { x: -2.7, z: 2.2, y: -0.32 },
      { x: -1.7, z: 1.35, y: -0.36 },
    ],
    dropTank: true,
  },
  'mig-29': {
    name: 'MiG-29',
    color: '#90a1b4',
    rMax: 0.5,
    widthScale: 1.55,
    heightScale: 0.85,
    noseStart: 2.0,
    radomeStart: 3.7,
    tailR: 0.3,
    wing: { rootLE: 2.0, crank: { x: 0.2, z: 1.15 }, tipLE: -2.4, tipTE: -3.1, rootTE: -2.7, span: 3.3, y: -0.05 },
    surfaces: 'ailerons-flaps',
    tailplane: { x: -3.2, rootChord: 1.4, tipChord: 0.5, span: 2.1, sweep: 0.9, y: -0.08 },
    fins: { count: 2, x: -2.0, rootChord: 1.6, tipChord: 0.6, height: 1.6, sweep: 1.0, z: 0.75, cant: 0.15 },
    engines: { count: 2, z: 0.6, r: 0.3, nacelles: true },
    intake: 'under',
    intakeX: 1.0,
    canopy: { x: 2.6, len: 1.5, seats: 1 },
    missiles: [
      { x: -1.3, z: 2.9, y: -0.3 },
      { x: -0.8, z: 2.15, y: -0.32 },
      { x: -0.4, z: 1.55, y: -0.35 },
    ],
  },
  jaguar: {
    name: 'Jaguar',
    color: '#7e8d7a',
    rMax: 0.45,
    widthScale: 1.25,
    heightScale: 1.0,
    noseStart: 2.0,
    radomeStart: 4.0,
    tailR: 0.28,
    wing: { rootLE: -0.4, rootTE: -2.6, tipLE: -2.2, tipTE: -2.9, span: 2.6, y: 0.3 },
    surfaces: 'ailerons-flaps',
    tailplane: { x: -3.2, rootChord: 1.3, tipChord: 0.5, span: 1.9, sweep: 0.9, y: -0.1 },
    fins: { count: 1, x: -2.2, rootChord: 2.0, tipChord: 0.7, height: 1.6, sweep: 1.3 },
    engines: { count: 2, z: 0.25, r: 0.24 },
    intake: 'side',
    intakeX: 1.6,
    canopy: { x: 2.4, len: 1.4, seats: 1 },
    probe: true,
    missiles: [{ x: -1.5, z: 1.6, y: 0.62, over: true }],
    dropTank: true,
  },
  'mig-21-bison': {
    name: 'MiG-21 Bison',
    color: '#9aa7b7',
    rMax: 0.42,
    widthScale: 1.0,
    heightScale: 1.0,
    noseStart: 4.4,
    radomeStart: 4.6,
    noseIntake: true,
    tailR: 0.34,
    wing: { rootLE: -0.4, rootTE: -3.6, tipLE: -3.1, tipTE: -3.5, span: 2.45, y: -0.05 },
    surfaces: 'ailerons-flaps',
    tailplane: { x: -3.6, rootChord: 1.1, tipChord: 0.4, span: 1.4, sweep: 0.8, y: 0 },
    fins: { count: 1, x: -1.6, rootChord: 2.4, tipChord: 0.7, height: 1.7, sweep: 1.5 },
    engines: { count: 1, r: 0.34 },
    intake: 'nose',
    intakeX: 5,
    canopy: { x: 2.3, len: 1.4, seats: 1 },
    missiles: [
      { x: -2.1, z: 1.75, y: -0.3 },
      { x: -1.6, z: 1.2, y: -0.32 },
    ],
  },
  'hawk-mk132': {
    name: 'Hawk Mk132',
    color: '#d3d9e1',
    rMax: 0.45,
    widthScale: 1.0,
    heightScale: 1.0,
    noseStart: 2.0,
    radomeStart: 4.0,
    tailR: 0.28,
    wing: { rootLE: 0.2, rootTE: -1.8, tipLE: -1.4, tipTE: -2.3, span: 3.6, y: -0.3 },
    surfaces: 'ailerons-flaps',
    tailplane: { x: -3.4, rootChord: 1.2, tipChord: 0.5, span: 1.7, sweep: 0.7, y: 0.1 },
    fins: { count: 1, x: -2.4, rootChord: 2.0, tipChord: 0.7, height: 1.6, sweep: 1.3 },
    engines: { count: 1, r: 0.3 },
    intake: 'side',
    intakeX: 1.3,
    canopy: { x: 2.4, len: 2.1, seats: 2 },
    missiles: [],
  },
};

/** Which tappable parts a given layout has (matches what buildFighter creates). */
export function partsForSpec(spec: FighterSpec): PartId[] {
  const parts: PartId[] = ['radome', 'pitot', 'canopy', 'intake', 'fuselage', 'wing'];
  parts.push(...(spec.surfaces === 'elevons' ? (['elevon'] as PartId[]) : (['aileron', 'flaps'] as PartId[])));
  if (spec.canard) parts.push('canard');
  if (spec.tailplane) parts.push('tailplane');
  parts.push('fin', 'rudder', 'engine', 'gear');
  if (spec.missiles.length) parts.push('missile');
  if (spec.dropTank || spec.missiles.some((m) => Math.abs(m.z) < spec.wing.span - 0.1)) parts.push('pylon');
  if (spec.dropTank) parts.push('droptank');
  if (spec.probe) parts.push('probe');
  return parts;
}

export function hasModel(aircraftId: string): boolean {
  return aircraftId in FIGHTER_SPECS;
}

