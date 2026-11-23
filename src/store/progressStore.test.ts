import { beforeEach, describe, expect, it } from 'vitest';
import { useProgressStore } from './progressStore';

function resetStore() {
  useProgressStore.persist.clearStorage();
  useProgressStore.getState().resetProgress();
}

describe('progress store', () => {
  beforeEach(resetStore);

  it('starts with every stage that has content unlocked, and nothing else', () => {
    const state = useProgressStore.getState();
    expect(state.unlockedStageIds).toContain('hangar');
    expect(state.unlockedStageIds).not.toContain('sky-lab');
    expect(state.totalStars()).toBe(0);
  });

  it('records lesson stars and never lowers them on a worse retry', () => {
    const { recordLessonResult } = useProgressStore.getState();
    recordLessonResult('hangar-1', { stars: 2, hintsUsed: 1 });
    recordLessonResult('hangar-1', { stars: 1, hintsUsed: 2 });

    const result = useProgressStore.getState().lessonResults['hangar-1'];
    expect(result.stars).toBe(2);
  });

  it('unlocks a lesson the first time it is completed', () => {
    const { recordLessonResult, isLessonUnlocked } = useProgressStore.getState();
    expect(isLessonUnlocked('hangar-1')).toBe(false);
    recordLessonResult('hangar-1', { stars: 3, hintsUsed: 0 });
    expect(useProgressStore.getState().isLessonUnlocked('hangar-1')).toBe(true);
  });

  it('round-trips progress through export/import', () => {
    const { recordLessonResult, awardBadge, exportProgress, importProgress } = useProgressStore.getState();
    recordLessonResult('hangar-1', { stars: 3, hintsUsed: 0 });
    awardBadge('parts-expert');

    const json = exportProgress();
    useProgressStore.getState().resetProgress();
    expect(useProgressStore.getState().totalStars()).toBe(0);

    const ok = importProgress(json);
    expect(ok).toBe(true);
    expect(useProgressStore.getState().totalStars()).toBe(3);
    expect(useProgressStore.getState().badgeIds).toContain('parts-expert');
  });

  it('rejects malformed import JSON without throwing', () => {
    const { importProgress } = useProgressStore.getState();
    expect(importProgress('not json')).toBe(false);
  });

  it('builds a one-day streak on the first visit and extends it the next day', () => {
    const { touchDailyStreak } = useProgressStore.getState();
    touchDailyStreak();
    expect(useProgressStore.getState().streakCount).toBe(1);

    useProgressStore.setState({ lastPlayedDate: new Date(Date.now() - 86400000).toISOString().slice(0, 10) });
    touchDailyStreak();
    expect(useProgressStore.getState().streakCount).toBe(2);
  });
});
