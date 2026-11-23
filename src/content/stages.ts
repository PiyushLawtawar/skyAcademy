import type { Stage } from './types';

// Stage metadata drives the World Map. Lesson content for each stage is added
// in later build phases (see project README) — this scaffold wires up the
// unlock/progress rules so lessons can be dropped in without touching code.
export const STAGES: Stage[] = [
  {
    id: 'hangar',
    order: 1,
    name: { en: 'The Hangar', hi: 'हैंगर' },
    islandEmoji: '🛠️',
    description: {
      en: 'Learn every part of an aeroplane.',
      hi: 'हवाई जहाज़ के हर हिस्से के बारे में जानें।',
    },
    lessonIds: ['hangar-parts-1', 'hangar-hardpoints-1'],
  },
  {
    id: 'sky-lab',
    order: 2,
    name: { en: 'Sky Lab', hi: 'स्काई लैब' },
    islandEmoji: '🧪',
    description: { en: 'Discover how planes fly.', hi: 'जानें कि हवाई जहाज़ कैसे उड़ते हैं।' },
    lessonIds: [],
    comingSoon: true,
  },
  {
    id: 'fighter-academy',
    order: 3,
    name: { en: 'Fighter Academy', hi: 'फाइटर अकादमी' },
    islandEmoji: '✈️',
    description: { en: 'What makes fighter jets special.', hi: 'फाइटर जेट्स को खास क्या बनाता है।' },
    lessonIds: [],
    comingSoon: true,
  },
  {
    id: 'hangar-of-fame',
    order: 4,
    name: { en: "India's Hangar of Fame", hi: 'भारत का गौरव हैंगर' },
    islandEmoji: '🏆',
    description: { en: "Meet India's amazing aircraft.", hi: 'भारत के शानदार विमानों से मिलें।' },
    // Gallery-driven (src/content/aircraft.ts), not lesson-driven — see
    // AircraftGallery.tsx, which this stage id routes to instead of StageIsland.
    lessonIds: [],
  },
  {
    id: 'iaf-story',
    order: 5,
    name: { en: 'The IAF Story', hi: 'वायु सेना की कहानी' },
    islandEmoji: '📖',
    description: { en: 'Heroes and pride of the sky.', hi: 'आसमान के वीर और गर्व।' },
    lessonIds: ['iaf-story-arjan-singh', 'iaf-story-rakesh-sharma'],
  },
  {
    id: 'women-of-iaf',
    order: 6,
    name: { en: 'Women of the IAF', hi: 'वायु सेना की वीरांगनाएँ' },
    islandEmoji: '🌟',
    description: { en: 'Girls can fly fighters too!', hi: 'लड़कियाँ भी फाइटर उड़ा सकती हैं!' },
    lessonIds: [],
    comingSoon: true,
  },
  {
    id: 'mission-control',
    order: 7,
    name: { en: 'Mission Control', hi: 'मिशन कंट्रोल' },
    islandEmoji: '🗺️',
    description: { en: 'Plan missions as a team.', hi: 'टीम के साथ मिशन की योजना बनाएं।' },
    lessonIds: [],
    comingSoon: true,
  },
  {
    id: 'officer-training',
    order: 8,
    name: { en: 'Officer Training Ground', hi: 'अधिकारी प्रशिक्षण मैदान' },
    islandEmoji: '🎖️',
    description: { en: 'Discover your Officer Super Powers.', hi: 'अपनी अधिकारी महाशक्तियाँ खोजें।' },
    lessonIds: [],
    comingSoon: true,
  },
  {
    id: 'wings-exam',
    order: 9,
    name: { en: 'Wings Exam', hi: 'विंग्स परीक्षा' },
    islandEmoji: '🪽',
    description: { en: 'The Final Sortie — earn your wings!', hi: 'अंतिम परीक्षा — अपने विंग्स कमाएं!' },
    lessonIds: [],
    comingSoon: true,
  },
];

export function getStage(stageId: string): Stage | undefined {
  return STAGES.find((s) => s.id === stageId);
}
