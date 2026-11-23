import { describe, expect, it } from 'vitest';
import { computeLessonStars } from './scoring';

describe('computeLessonStars', () => {
  it('awards 3 stars for a hint-free run', () => {
    expect(computeLessonStars(0)).toBe(3);
  });

  it('awards 2 stars as soon as any hint is used', () => {
    expect(computeLessonStars(1)).toBe(2);
    expect(computeLessonStars(5)).toBe(2);
  });
});
