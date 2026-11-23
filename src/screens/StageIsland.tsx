import { useNavigate, useParams } from 'react-router-dom';
import { getStage } from '../content/stages';
import { getLessonsForStage } from '../content/lessons';
import { useProgressStore } from '../store/progressStore';
import { pick } from '../i18n';
import { STRINGS } from '../i18n/strings';
import { BigButton } from '../components/BigButton';
import { VeerMascot } from '../components/VeerMascot';
import { ScreenHeading } from '../components/ScreenHeading';

// Lists the real lessons for a stage (data-driven from src/content/lessons.ts)
// with a Start button and stars earned so far. Stages that don't have any
// lesson content yet (most of them, in this build phase) fall back to the
// "still being built" placeholder.
export function StageIsland() {
  const navigate = useNavigate();
  const { stageId } = useParams<{ stageId: string }>();
  const language = useProgressStore((s) => s.settings.language);
  const lessonResults = useProgressStore((s) => s.lessonResults);
  const stage = stageId ? getStage(stageId) : undefined;
  const lessons = stageId ? getLessonsForStage(stageId) : [];

  if (!stage) {
    return (
      <div className="mx-auto max-w-xl px-4 py-10 text-center">
        <p>Unknown island.</p>
        <BigButton onClick={() => navigate('/map')}>{pick(STRINGS.back, language)}</BigButton>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-6 px-4 py-10 text-center">
      <button
        onClick={() => navigate('/map')}
        className="self-start rounded-full bg-white/80 px-4 py-2 font-display font-semibold text-slate-700"
      >
        ← {pick(STRINGS.back, language)}
      </button>
      <VeerMascot expression="thinking" size={110} />
      <ScreenHeading>
        {stage.islandEmoji} {pick(stage.name, language)}
      </ScreenHeading>
      <p className="rounded-2xl bg-white/80 px-5 py-3 text-slate-700">{pick(stage.description, language)}</p>

      {lessons.length === 0 ? (
        <p className="rounded-2xl bg-white/80 px-5 py-4 text-slate-600">{pick(STRINGS.hangarEmptyState, language)}</p>
      ) : (
        <div className="flex w-full flex-col gap-3">
          {lessons.map((lesson) => {
            const stars = lessonResults[lesson.id]?.stars ?? 0;
            return (
              <div
                key={lesson.id}
                className="flex items-center justify-between gap-3 rounded-2xl bg-white/90 px-5 py-4 shadow-sm"
              >
                <div className="text-left">
                  <p className="font-display font-bold text-slate-900">{pick(lesson.title, language)}</p>
                  <p className="text-sm text-slate-500">
                    {'⭐'.repeat(stars)}
                    {'☆'.repeat(3 - stars)}
                  </p>
                </div>
                <BigButton onClick={() => navigate(`/stage/${stage.id}/lesson/${lesson.id}`)}>
                  {pick(STRINGS.startLesson, language)}
                </BigButton>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
