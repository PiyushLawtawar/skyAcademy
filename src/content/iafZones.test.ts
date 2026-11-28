import { describe, expect, it } from 'vitest';
import { LOADOUTS, WEAPONS, getWeapon } from './weapons';
import { HISTORY } from './history';
import { CONCEPTS, LEVELS } from './concepts';
import { ASSETS, MISSIONS, scoreMission } from './missions';
import { SKY_FACTS } from './skyFacts';
import { getAircraft } from './aircraft';
import { PYLON_POOL } from '../components/art/JetArt';

const unique = (ids: string[]) => new Set(ids).size === ids.length;

describe('Armoury data', () => {
  it('has unique weapon ids', () => {
    expect(unique(WEAPONS.map((w) => w.id))).toBe(true);
  });

  it('every loadout references real weapons, a real gun and a real aircraft card', () => {
    for (const l of LOADOUTS) {
      expect(getAircraft(l.aircraftId), l.aircraftId).toBeDefined();
      expect(getWeapon(l.gunId)?.kind, `${l.name} gun`).toBe('gun');
      for (const id of l.weaponIds) expect(getWeapon(id), `${l.name} → ${id}`).toBeDefined();
      expect(l.hardpoints).toBeLessThanOrEqual(PYLON_POOL.length);
    }
  });

  it('presets only use weapons that jet can carry, and fit its hardpoints', () => {
    for (const l of LOADOUTS) {
      for (const p of l.presets) {
        expect(p.items.length, `${l.name}/${p.name}`).toBeLessThanOrEqual(l.hardpoints);
        for (const id of p.items) expect(l.weaponIds, `${l.name}/${p.name} → ${id}`).toContain(id);
      }
    }
  });
});

describe('quizzes', () => {
  const all = [...HISTORY.map((h) => ({ id: h.id, ...h.quiz })), ...CONCEPTS.map((c) => ({ id: c.id, ...c.quiz }))];
  it('every correct answer index points at a real option', () => {
    for (const q of all) {
      expect(q.correct, q.id).toBeGreaterThanOrEqual(0);
      expect(q.correct, q.id).toBeLessThan(q.options.length);
    }
  });
  it('ids are unique', () => {
    expect(unique(HISTORY.map((h) => h.id))).toBe(true);
    expect(unique(CONCEPTS.map((c) => c.id))).toBe(true);
    expect(unique(SKY_FACTS.map((f) => f.id))).toBe(true);
  });
  it('every Flight School level has concepts', () => {
    for (const l of LEVELS) expect(CONCEPTS.filter((c) => c.level === l.level).length).toBeGreaterThan(0);
  });
});

describe('Mission Planner', () => {
  it('every mission can earn 3 stars within budget using the cheapest asset per needed role', () => {
    for (const m of MISSIONS) {
      const team = m.needs.map((n) => ASSETS.filter((a) => a.role === n.role).sort((a, b) => a.cost - b.cost)[0]);
      expect(team.every(Boolean), `${m.id} has an asset for every role`).toBe(true);
      const r = scoreMission(m, team);
      expect(r.stars, m.id).toBe(3);
    }
  });

  it('missing a needed role gives 1 star, extra unneeded aircraft gives 2', () => {
    const m = MISSIONS.find((x) => x.id === 'flood')!;
    const heli = ASSETS.find((a) => a.role === 'heli')!;
    const transport = ASSETS.find((a) => a.id === 'c130j')!;
    const striker = ASSETS.find((a) => a.role === 'strike')!;
    expect(scoreMission(m, [heli]).stars).toBe(1);
    expect(scoreMission(m, [heli, transport, striker]).stars).toBe(2);
    expect(scoreMission(m, [heli, transport]).stars).toBe(3);
  });
});
