import type { LocalizedText } from '../content/types';

// UI chrome strings. Lesson/content strings live alongside their content in
// src/content — this file is only for app-shell copy (buttons, screens).
// TODO(hi): a few entries below are placeholder machine translations and are
// marked for a human Hindi speaker to review before shipping.
export const STRINGS = {
  appName: { en: 'Sky Cadet Academy', hi: 'स्काई कैडेट अकादमी' },
  pickYourCallSign: { en: 'Pick your call sign!', hi: 'अपना कॉल साइन चुनें!' },
  continueButton: { en: 'Continue', hi: 'आगे बढ़ें' },
  buildYourPilot: { en: 'Build your pilot', hi: 'अपना पायलट बनाएं' },
  helmetColor: { en: 'Helmet colour', hi: 'हेलमेट का रंग' },
  visorColor: { en: 'Visor colour', hi: 'वाइज़र का रंग' },
  letsFly: { en: "Let's fly!", hi: 'चलो उड़ते हैं!' },
  worldMapTitle: { en: 'Choose your island', hi: 'अपना द्वीप चुनें' },
  comingSoon: { en: 'Coming soon', hi: 'जल्द आ रहा है' },
  settingsTitle: { en: 'Settings', hi: 'सेटिंग्स' },
  music: { en: 'Music', hi: 'संगीत' },
  soundEffects: { en: 'Sound effects', hi: 'ध्वनि प्रभाव' },
  readAloud: { en: 'Read-aloud', hi: 'पढ़कर सुनाना' },
  calmMode: { en: 'Calm mode', hi: 'शांत मोड' },
  language: { en: 'Language', hi: 'भाषा' },
  parentCorner: { en: 'Parent Corner', hi: 'पेरेंट कॉर्नर' },
  parentGatePrompt: {
    en: 'Grown-ups only! Solve this to enter:',
    hi: 'सिर्फ बड़ों के लिए! अंदर जाने के लिए हल करें:',
  },
  parentGateWrong: { en: "That's not quite it — try again!", hi: 'यह सही नहीं है — फिर कोशिश करें!' },
  yourProgress: { en: 'Your cadet’s progress', hi: 'आपके कैडेट की प्रगति' },
  exportProgress: { en: 'Export progress', hi: 'प्रगति निर्यात करें' },
  importProgress: { en: 'Import progress', hi: 'प्रगति आयात करें' },
  resetProgress: { en: 'Reset all progress', hi: 'सारी प्रगति रीसेट करें' },
  hangarEmptyState: {
    en: 'Lessons for this island are still being built. Check back soon, cadet!',
    hi: 'इस द्वीप के पाठ अभी बन रहे हैं। जल्द ही वापस देखें, कैडेट!',
  },
  rankLabel: { en: 'Rank', hi: 'पद' },
  starsLabel: { en: 'Stars', hi: 'सितारे' },
  back: { en: 'Back', hi: 'वापस' },
  next: { en: 'Next', hi: 'अगला' },
  lessonsTitle: { en: 'Lessons', hi: 'पाठ' },
  startLesson: { en: 'Start', hi: 'शुरू करें' },
  playAgainLabel: { en: 'Play again', hi: 'फिर से खेलें' },
  backToIsland: { en: 'Back to island', hi: 'द्वीप पर वापस' },
  greatFlying: { en: 'Great flying, cadet!', hi: 'शानदार उड़ान, कैडेट!' },
  newRankTitle: { en: 'You earned a new rank!', hi: 'आपको नया पद मिला!' },
} satisfies Record<string, LocalizedText>;

export type StringKey = keyof typeof STRINGS;
