import { describe, expect, it } from 'vitest';
import credits from '../../../CREDITS.md?raw';
import { FIGHTER_SPECS, buildFighter, partsForSpec } from './fighterModel';
import { PART_EXTRAS } from '../../content/aircraftParts';
import { AIRCRAFT, getAircraft } from '../../content/aircraft';

describe('3D Hangar models', () => {
  for (const [id, spec] of Object.entries(FIGHTER_SPECS)) {
    it(`${id} builds with exactly the parts the UI lists`, () => {
      const model = buildFighter(spec);
      expect([...model.meshesByPart.keys()].sort()).toEqual([...partsForSpec(spec)].sort());
      // every listed part gets a hotspot anchor
      for (const p of partsForSpec(spec)) expect(model.anchors.has(p), `${id} anchor ${p}`).toBe(true);
      model.dispose();
    });
    it(`${id} is a real aircraft card`, () => {
      expect(getAircraft(id)).toBeDefined();
    });
  }
  it('aircraft-specific part notes only reference modelled aircraft', () => {
    for (const id of Object.keys(PART_EXTRAS)) expect(FIGHTER_SPECS[id], id).toBeDefined();
  });
});

describe('aircraft photos', () => {
  const photoFiles = Object.keys(import.meta.glob('/public/aircraft-photos/*.jpg')).map((p) => p.replace('/public/', ''));
  for (const a of AIRCRAFT) {
    it(`${a.id} has a real, credited photo`, () => {
      expect(a.photo, a.id).toBeDefined();
      const file = a.photo!.src.replace(/^\//, '');
      expect(photoFiles, file).toContain(file);
      expect(credits).toContain('`' + file.split('/').pop() + '`');
    });
  }
});
