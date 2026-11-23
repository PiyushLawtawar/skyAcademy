export type Language = 'en' | 'hi';

export interface LocalizedText {
  en: string;
  hi: string;
}

export interface Rank {
  id: string;
  name: LocalizedText;
  blurb: LocalizedText;
  starsRequired: number;
}

export interface CallSignOption {
  id: string;
  label: LocalizedText;
  emoji: string;
}

export interface AvatarConfig {
  helmetColor: string;
  visorColor: string;
  badgeId: string | null;
}

export interface JetConfig {
  name: string | null;
  bodyColor: string;
  stripeColor: string;
  stickers: string[];
}

export interface QuestionHint {
  nudge: LocalizedText;
  strongerClue: LocalizedText;
}

export type QuestionType =
  | 'multiple-choice'
  | 'tap-the-part'
  | 'match-pairs'
  | 'order-the-steps'
  | 'true-false'
  | 'identify-silhouette'
  | 'drag-force-arrow';

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  prompt: LocalizedText;
  options?: LocalizedText[];
  correctIndex?: number;
  hints: QuestionHint;
}

export interface GlossaryTerm {
  id: string;
  term: LocalizedText;
  kidDefinition: LocalizedText;
}

export interface Fact {
  id: string;
  tag: string;
  text: LocalizedText;
  verified: boolean;
  source?: string;
}

export interface Lesson {
  id: string;
  stageId: string;
  order: number;
  title: LocalizedText;
  storyPanels: LocalizedText[];
  /** Looked up in the Explore component registry (Lesson.tsx); null skips the step. */
  exploreActivityId: string | null;
  /** Looked up in the Play component registry (Lesson.tsx); null skips the step. */
  miniGameId: string | null;
  quiz: QuizQuestion[];
  factIds: string[];
  glossaryTermIds: string[];
  /** A hero/aircraft card id to add to the collection when this lesson is completed. */
  heroCardId?: string;
  comingSoon?: boolean;
}

export type OlqFamily = 'thinking' | 'team' | 'leader' | 'heart';

export interface OfficerQuality {
  id: string;
  family: OlqFamily;
  name: LocalizedText;
  kidDescription: LocalizedText;
}

export interface Stage {
  id: string;
  order: number;
  name: LocalizedText;
  islandEmoji: string;
  description: LocalizedText;
  lessonIds: string[];
  comingSoon?: boolean;
}

export interface Badge {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  emoji: string;
}

export type AircraftRole = 'fighter' | 'transport' | 'helicopter' | 'trainer' | 'awacs' | 'tanker';

export interface AircraftFact {
  text: LocalizedText;
  verified: boolean;
  source?: string;
}

export interface AircraftSilhouetteSpec {
  kind: 'fighter' | 'transport' | 'helicopter' | 'awacs' | 'trainer';
  /** Fighters only — real configuration, shown accurately (brief §7, Stage 1 canard note). */
  wingShape?: 'delta' | 'swept';
  hasCanards?: boolean;
  tailCount?: 1 | 2;
}

export interface Aircraft {
  id: string;
  order: number;
  name: LocalizedText;
  role: AircraftRole;
  madeInIndia: boolean;
  maker: LocalizedText;
  /** Omit any stat that isn't confidently verified — never show a guessed number. */
  crew?: number;
  topSpeedKmh?: number;
  topSpeedMach?: number;
  speedComparison?: LocalizedText;
  standoutFeature: LocalizedText;
  facts: AircraftFact[];
  silhouette: AircraftSilhouetteSpec;
  retired?: boolean;
}
