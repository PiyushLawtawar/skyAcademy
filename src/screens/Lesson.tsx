import { useEffect, useState, type ComponentType } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getLesson } from '../content/lessons';
import { RANKS } from '../content/ranks';
import type { Rank } from '../content/types';
import { useProgressStore } from '../store/progressStore';
import { computeLessonStars } from '../lib/scoring';
import { soundManager } from '../lib/sound';
import { pick } from '../i18n';
import { STRINGS } from '../i18n/strings';
import { StoryPlayer } from '../components/StoryPlayer';
import { PlanePartsExplore } from '../components/explore/PlanePartsExplore';
import { HardpointsExplore } from '../components/explore/HardpointsExplore';
import { TapThePartGame } from '../components/play/TapThePartGame';
import { QuizEngine } from '../components/QuizEngine';
import { WingsCeremony } from '../components/WingsCeremony';
import { StarBurst } from '../components/StarBurst';
import { VeerMascot } from '../components/VeerMascot';
import { BigButton } from '../components/BigButton';
import { ScreenHeading } from '../components/ScreenHeading';

type Step = 'learn' | 'explore' | 'play' | 'check' | 'summary' | 'replay-play';

// Each lesson names its explore/mini-game by id in content/lessons.ts; a null
// id (used by lessons with nothing to explore/play, e.g. hero stories) skips
// that step entirely rather than every lesson needing every step.
const EXPLORE_COMPONENTS: Record<string, ComponentType<{ onContinue: () => void }>> = {
  'plane-parts-explore': PlanePartsExplore,
  'hardpoints-explore': HardpointsExplore,
};

const PLAY_COMPONENTS: Record<string, ComponentType<{ onComplete: () => void }>> = {
  'tap-the-part-game': TapThePartGame,
};

// Orchestrates the Learn → [Explore] → [Play] → Check loop (brief §3) for one
// lesson, then a Summary screen that lets the child jump straight back into
// the mini-game for fun, replay-safe since stars are never re-lowered.
export function Lesson() {
  const navigate = useNavigate();
  const { stageId, lessonId } = useParams<{ stageId: string; lessonId: string }>();
  const lesson = lessonId ? getLesson(lessonId) : undefined;

  const language = useProgressStore((s) => s.settings.language);
  const sfxEnabled = useProgressStore((s) => s.settings.sfx);
  const recordLessonResult = useProgressStore((s) => s.recordLessonResult);
  const collectCard = useProgressStore((s) => s.collectCard);

  const [step, setStep] = useState<Step>('learn');
  const [result, setResult] = useState<{ stars: 2 | 3; hintsUsed: number } | null>(null);
  const [newRank, setNewRank] = useState<Rank | null>(null);
  const [showWingsCeremony, setShowWingsCeremony] = useState(false);
  const [newCardId, setNewCardId] = useState<string | null>(null);

  // Intentionally keyed on lessonId only, so this fires once per lesson
  // mount rather than every time the sfx setting is toggled.
  useEffect(() => {
    soundManager.unlock();
    soundManager.play('engineStartup', { sfxEnabled });
  }, [lessonId]);

  if (!lesson || !stageId) {
    return (
      <div className="mx-auto max-w-xl px-4 py-10 text-center">
        <p>Unknown lesson.</p>
        <BigButton onClick={() => navigate('/map')}>{pick(STRINGS.back, language)}</BigButton>
      </div>
    );
  }

  const ExploreComponent = lesson.exploreActivityId ? EXPLORE_COMPONENTS[lesson.exploreActivityId] : null;
  const PlayComponent = lesson.miniGameId ? PLAY_COMPONENTS[lesson.miniGameId] : null;

  const backToIsland = () => navigate(`/stage/${stageId}`);

  const goAfterLearn = () => setStep(ExploreComponent ? 'explore' : PlayComponent ? 'play' : 'check');
  const goAfterExplore = () => setStep(PlayComponent ? 'play' : 'check');

  const finishQuiz = ({ hintsUsed }: { hintsUsed: number }) => {
    const rankBefore = useProgressStore.getState().rankIndex();
    const stars = computeLessonStars(hintsUsed);
    recordLessonResult(lesson.id, { stars, hintsUsed });
    const rankAfter = useProgressStore.getState().rankIndex();

    if (lesson.heroCardId) {
      collectCard(lesson.heroCardId);
      setNewCardId(lesson.heroCardId);
    }

    setResult({ stars, hintsUsed });
    if (rankAfter > rankBefore) {
      setNewRank(RANKS[rankAfter]);
      setShowWingsCeremony(true);
    }
    setStep('summary');
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-8">
      {step !== 'summary' && step !== 'replay-play' && (
        <button
          onClick={backToIsland}
          className="self-start rounded-full bg-white/80 px-4 py-2 font-display font-semibold text-slate-700"
        >
          ← {pick(STRINGS.back, language)}
        </button>
      )}

      {step === 'learn' && <StoryPlayer panels={lesson.storyPanels} onFinished={goAfterLearn} />}

      {step === 'explore' && ExploreComponent && <ExploreComponent onContinue={goAfterExplore} />}

      {step === 'play' && PlayComponent && <PlayComponent onComplete={() => setStep('check')} />}

      {step === 'check' && <QuizEngine questions={lesson.quiz} onFinished={finishQuiz} />}

      {step === 'replay-play' && PlayComponent && <PlayComponent onComplete={() => setStep('summary')} />}

      {step === 'summary' && result && (
        <div className="flex flex-col items-center gap-5 text-center">
          <VeerMascot expression="proud" size={120} />
          <ScreenHeading>{pick(STRINGS.greatFlying, language)}</ScreenHeading>
          <div className="relative text-5xl">
            {'⭐'.repeat(result.stars)}
            {'☆'.repeat(3 - result.stars)}
            <StarBurst show />
          </div>
          {newCardId && (
            <p className="rounded-2xl bg-white/90 px-5 py-3 font-display font-semibold text-slate-800">
              🎴 {language === 'hi' ? 'नया कार्ड मिला!' : 'New card unlocked!'}
            </p>
          )}
          {result.stars < 3 && (
            <p className="max-w-sm rounded-2xl bg-white/85 px-5 py-3 text-slate-700">
              {language === 'hi'
                ? 'संकेत सीखने में मदद करते हैं! अगली बार बिना संकेत के तीसरा सितारा पाने की कोशिश करो ⭐'
                : 'Hints help you learn! Try hint-free next time for a 3rd star ⭐'}
            </p>
          )}
          <div className="flex flex-wrap justify-center gap-3">
            {PlayComponent && (
              <BigButton variant="secondary" onClick={() => setStep('replay-play')}>
                🎮 {pick(STRINGS.playAgainLabel, language)}
              </BigButton>
            )}
            <BigButton onClick={backToIsland}>{pick(STRINGS.backToIsland, language)}</BigButton>
          </div>
        </div>
      )}

      {showWingsCeremony && newRank && (
        <WingsCeremony newRank={newRank} onDone={() => setShowWingsCeremony(false)} />
      )}
    </div>
  );
}
