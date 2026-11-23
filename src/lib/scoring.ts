// Stars system (brief §6): finishing the lesson is the baseline, finishing
// the quiz takes it to 2 stars, and finishing with zero hints used anywhere
// in the quiz takes it to the full 3. Wrong answers never cost a star — only
// hints do, and stars are never taken away once earned (enforced by
// recordLessonResult's max() in the progress store, not here).
export function computeLessonStars(hintsUsedTotal: number): 2 | 3 {
  return hintsUsedTotal === 0 ? 3 : 2;
}
