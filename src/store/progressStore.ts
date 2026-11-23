import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { AvatarConfig, JetConfig, Language } from '../content/types';
import { RANKS, rankIndexForStars } from '../content/ranks';
import { STAGES } from '../content/stages';

export interface LessonResult {
  stars: 0 | 1 | 2 | 3;
  hintsUsed: number;
  completedAt: string;
}

export interface Settings {
  language: Language;
  music: boolean;
  sfx: boolean;
  readAloud: boolean;
  calmMode: boolean;
  dailyLimitMinutes: number | null;
}

const DEFAULT_SETTINGS: Settings = {
  language: 'en',
  music: false,
  sfx: true,
  readAloud: true,
  calmMode: false,
  dailyLimitMinutes: null,
};

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

interface ProgressState {
  callSignId: string | null;
  avatar: AvatarConfig | null;
  jet: JetConfig | null;

  lessonResults: Record<string, LessonResult>;
  unlockedStageIds: string[];
  unlockedLessonIds: string[];
  badgeIds: string[];
  cardIds: string[];
  factJournalIds: string[];

  lastPlayedDate: string | null;
  streakCount: number;

  settings: Settings;
  parentGateUnlockedAt: number | null;

  setCallSign: (callSignId: string) => void;
  setAvatar: (avatar: AvatarConfig) => void;
  setJet: (jet: JetConfig) => void;
  recordLessonResult: (lessonId: string, result: Omit<LessonResult, 'completedAt'>) => void;
  unlockLesson: (lessonId: string) => void;
  unlockStage: (stageId: string) => void;
  awardBadge: (badgeId: string) => void;
  collectCard: (cardId: string) => void;
  catchFact: (factId: string) => void;
  touchDailyStreak: () => void;
  updateSettings: (partial: Partial<Settings>) => void;
  unlockParentGate: () => void;
  lockParentGate: () => void;
  resetProgress: () => void;
  exportProgress: () => string;
  importProgress: (json: string) => boolean;

  totalStars: () => number;
  rankIndex: () => number;
  isLessonUnlocked: (lessonId: string) => boolean;
  isStageUnlocked: (stageId: string) => boolean;
}

// Stage sequencing/Stage Tests (brief §7) aren't built yet, so for now any
// stage that already has real content (lesson-driven or gallery-driven)
// ships unlocked by default; a stage stays locked on the World Map only
// while it is still explicitly marked `comingSoon`.
const DEFAULT_UNLOCKED_STAGE_IDS = STAGES.filter((s) => !s.comingSoon).map((s) => s.id);

interface PersistedProgress {
  callSignId: string | null;
  avatar: AvatarConfig | null;
  jet: JetConfig | null;
  lessonResults: Record<string, LessonResult>;
  unlockedStageIds: string[];
  unlockedLessonIds: string[];
  badgeIds: string[];
  cardIds: string[];
  factJournalIds: string[];
  lastPlayedDate: string | null;
  streakCount: number;
  settings: Settings;
}

const INITIAL_PERSISTED_STATE: PersistedProgress = {
  callSignId: null,
  avatar: null,
  jet: null,
  lessonResults: {},
  unlockedStageIds: DEFAULT_UNLOCKED_STAGE_IDS,
  unlockedLessonIds: [],
  badgeIds: [],
  cardIds: [],
  factJournalIds: [],
  lastPlayedDate: null,
  streakCount: 0,
  settings: DEFAULT_SETTINGS,
};

function extractPersisted(state: ProgressState): PersistedProgress {
  return {
    callSignId: state.callSignId,
    avatar: state.avatar,
    jet: state.jet,
    lessonResults: state.lessonResults,
    unlockedStageIds: state.unlockedStageIds,
    unlockedLessonIds: state.unlockedLessonIds,
    badgeIds: state.badgeIds,
    cardIds: state.cardIds,
    factJournalIds: state.factJournalIds,
    lastPlayedDate: state.lastPlayedDate,
    streakCount: state.streakCount,
    settings: state.settings,
  };
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      ...INITIAL_PERSISTED_STATE,
      parentGateUnlockedAt: null,

      setCallSign: (callSignId) => set({ callSignId }),
      setAvatar: (avatar) => set({ avatar }),
      setJet: (jet) => set({ jet }),

      recordLessonResult: (lessonId, result) =>
        set((state) => {
          const existing = state.lessonResults[lessonId];
          const stars = Math.max(existing?.stars ?? 0, result.stars) as 0 | 1 | 2 | 3;
          return {
            lessonResults: {
              ...state.lessonResults,
              [lessonId]: { stars, hintsUsed: result.hintsUsed, completedAt: new Date().toISOString() },
            },
            unlockedLessonIds: state.unlockedLessonIds.includes(lessonId)
              ? state.unlockedLessonIds
              : [...state.unlockedLessonIds, lessonId],
          };
        }),

      unlockLesson: (lessonId) =>
        set((state) =>
          state.unlockedLessonIds.includes(lessonId)
            ? state
            : { unlockedLessonIds: [...state.unlockedLessonIds, lessonId] },
        ),

      unlockStage: (stageId) =>
        set((state) =>
          state.unlockedStageIds.includes(stageId)
            ? state
            : { unlockedStageIds: [...state.unlockedStageIds, stageId] },
        ),

      awardBadge: (badgeId) =>
        set((state) => (state.badgeIds.includes(badgeId) ? state : { badgeIds: [...state.badgeIds, badgeId] })),

      collectCard: (cardId) =>
        set((state) => (state.cardIds.includes(cardId) ? state : { cardIds: [...state.cardIds, cardId] })),

      catchFact: (factId) =>
        set((state) =>
          state.factJournalIds.includes(factId) ? state : { factJournalIds: [...state.factJournalIds, factId] },
        ),

      touchDailyStreak: () =>
        set((state) => {
          const today = todayKey();
          if (state.lastPlayedDate === today) return state;
          const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
          const continuesStreak = state.lastPlayedDate === yesterday;
          return {
            lastPlayedDate: today,
            streakCount: continuesStreak ? state.streakCount + 1 : 1,
          };
        }),

      updateSettings: (partial) => set((state) => ({ settings: { ...state.settings, ...partial } })),

      unlockParentGate: () => set({ parentGateUnlockedAt: Date.now() }),
      lockParentGate: () => set({ parentGateUnlockedAt: null }),

      resetProgress: () => set({ ...INITIAL_PERSISTED_STATE, parentGateUnlockedAt: get().parentGateUnlockedAt }),

      exportProgress: () => {
        const snapshot = extractPersisted(get());
        return JSON.stringify({ version: 1, data: snapshot }, null, 2);
      },

      importProgress: (json) => {
        try {
          const parsed = JSON.parse(json);
          const data = parsed?.data ?? parsed;
          if (!data || typeof data !== 'object') return false;
          set({
            callSignId: data.callSignId ?? null,
            avatar: data.avatar ?? null,
            jet: data.jet ?? null,
            lessonResults: data.lessonResults ?? {},
            unlockedStageIds: data.unlockedStageIds ?? DEFAULT_UNLOCKED_STAGE_IDS,
            unlockedLessonIds: data.unlockedLessonIds ?? [],
            badgeIds: data.badgeIds ?? [],
            cardIds: data.cardIds ?? [],
            factJournalIds: data.factJournalIds ?? [],
            lastPlayedDate: data.lastPlayedDate ?? null,
            streakCount: data.streakCount ?? 0,
            settings: { ...DEFAULT_SETTINGS, ...(data.settings ?? {}) },
          });
          return true;
        } catch {
          return false;
        }
      },

      totalStars: () => {
        const results = get().lessonResults;
        return Object.values(results).reduce((sum, r) => sum + r.stars, 0);
      },

      rankIndex: () => rankIndexForStars(get().totalStars()),

      isLessonUnlocked: (lessonId) => get().unlockedLessonIds.includes(lessonId),
      isStageUnlocked: (stageId) => get().unlockedStageIds.includes(stageId),
    }),
    {
      name: 'sky-cadet-academy-progress',
      version: 1,
      storage: createJSONStorage(() => safeLocalStorage()),
      partialize: extractPersisted,
    },
  ),
);

// Falls back to an in-memory store if localStorage is unavailable (private
// browsing, storage quota, disabled cookies) so the app never crashes — the
// child just won't have progress saved between sessions in that case.
function safeLocalStorage(): Storage {
  try {
    const testKey = '__sky_cadet_storage_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return window.localStorage;
  } catch {
    const memory = new Map<string, string>();
    return {
      getItem: (key) => memory.get(key) ?? null,
      setItem: (key, value) => void memory.set(key, value),
      removeItem: (key) => void memory.delete(key),
      clear: () => memory.clear(),
      key: (index) => Array.from(memory.keys())[index] ?? null,
      get length() {
        return memory.size;
      },
    } satisfies Storage;
  }
}

export { RANKS };
