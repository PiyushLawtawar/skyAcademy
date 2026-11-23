import type { Badge } from './types';

export const BADGES: Badge[] = [
  {
    id: 'parts-expert',
    name: { en: 'Parts Expert', hi: 'पार्ट्स एक्सपर्ट' },
    description: { en: 'Named every part of a jet!', hi: 'जेट के हर हिस्से का नाम बताया!' },
    emoji: '🔧',
  },
  {
    id: 'lift-master',
    name: { en: 'Lift Master', hi: 'लिफ्ट मास्टर' },
    description: { en: 'Figured out how wings make lift.', hi: 'जाना कि पंख लिफ्ट कैसे बनाते हैं।' },
    emoji: '🪽',
  },
  {
    id: 'sound-barrier-breaker',
    name: { en: 'Sound Barrier Breaker', hi: 'ध्वनि अवरोधक भेदक' },
    description: { en: 'Learned about Mach speed!', hi: 'मैक स्पीड के बारे में सीखा!' },
    emoji: '💥',
  },
  {
    id: 'team-player',
    name: { en: 'Team Player', hi: 'टीम प्लेयर' },
    description: { en: 'Helped the whole formation.', hi: 'पूरी टीम की मदद की।' },
    emoji: '🤝',
  },
  {
    id: 'brave-heart',
    name: { en: 'Brave Heart', hi: 'ब्रेव हार्ट' },
    description: { en: 'Showed courage in a story.', hi: 'कहानी में साहस दिखाया।' },
    emoji: '❤️',
  },
  {
    id: 'hint-free-hero',
    name: { en: 'Hint-Free Hero', hi: 'हिंट-फ्री हीरो' },
    description: { en: 'Finished a quiz with no hints!', hi: 'बिना संकेत के प्रश्नोत्तरी पूरी की!' },
    emoji: '⭐',
  },
  {
    id: 'seven-day-streak',
    name: { en: '7-Day Streak', hi: '7-दिन की लकीर' },
    description: { en: 'Flew in for 7 days in a row.', hi: 'लगातार 7 दिन उड़ान भरी।' },
    emoji: '🔥',
  },
];

export function getBadge(badgeId: string): Badge | undefined {
  return BADGES.find((b) => b.id === badgeId);
}
