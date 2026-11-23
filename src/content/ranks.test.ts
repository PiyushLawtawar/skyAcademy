import { describe, expect, it } from 'vitest';
import { RANKS, rankIndexForStars } from './ranks';

describe('rankIndexForStars', () => {
  it('starts cadets at rank 0', () => {
    expect(rankIndexForStars(0)).toBe(0);
  });

  it('promotes exactly at a threshold', () => {
    const secondRankThreshold = RANKS[1].starsRequired;
    expect(rankIndexForStars(secondRankThreshold - 1)).toBe(0);
    expect(rankIndexForStars(secondRankThreshold)).toBe(1);
  });

  it('never exceeds the top rank', () => {
    const topThreshold = RANKS[RANKS.length - 1].starsRequired;
    expect(rankIndexForStars(topThreshold + 1000)).toBe(RANKS.length - 1);
  });
});
