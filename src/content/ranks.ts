import type { Rank } from './types';

// Real IAF officer ranks, used as the game's level ladder.
// starsRequired is the CUMULATIVE star total needed to reach that rank.
export const RANKS: Rank[] = [
  {
    id: 'cadet',
    name: { en: 'Cadet', hi: 'कैडेट' },
    blurb: { en: 'Every great pilot starts here!', hi: 'हर महान पायलट यहीं से शुरू करता है!' },
    starsRequired: 0,
  },
  {
    id: 'flying-officer',
    name: { en: 'Flying Officer', hi: 'फ्लाइंग ऑफिसर' },
    blurb: { en: 'You can now help fly real missions.', hi: 'अब आप असली मिशनों में मदद कर सकते हैं।' },
    starsRequired: 12,
  },
  {
    id: 'flight-lieutenant',
    name: { en: 'Flight Lieutenant', hi: 'फ्लाइट लेफ्टिनेंट' },
    blurb: { en: 'You lead small missions with care.', hi: 'आप छोटे मिशनों का नेतृत्व करते हैं।' },
    starsRequired: 24,
  },
  {
    id: 'squadron-leader',
    name: { en: 'Squadron Leader', hi: 'स्क्वाड्रन लीडर' },
    blurb: { en: 'A whole squadron of jets listens to you!', hi: 'जेट्स का पूरा दल आपकी बात सुनता है!' },
    starsRequired: 40,
  },
  {
    id: 'wing-commander',
    name: { en: 'Wing Commander', hi: 'विंग कमांडर' },
    blurb: { en: 'You look after a whole wing of the sky.', hi: 'आप आसमान के एक पूरे विंग की देखभाल करते हैं।' },
    starsRequired: 60,
  },
  {
    id: 'group-captain',
    name: { en: 'Group Captain', hi: 'ग्रुप कैप्टन' },
    blurb: { en: 'You run a whole air base!', hi: 'आप एक पूरा एयर बेस चलाते हैं!' },
    starsRequired: 84,
  },
  {
    id: 'air-commodore',
    name: { en: 'Air Commodore', hi: 'एयर कमोडोर' },
    blurb: { en: 'You plan missions for many squadrons.', hi: 'आप कई स्क्वाड्रनों के लिए योजना बनाते हैं।' },
    starsRequired: 112,
  },
  {
    id: 'air-vice-marshal',
    name: { en: 'Air Vice Marshal', hi: 'एयर वाइस मार्शल' },
    blurb: { en: 'A senior leader trusted by many.', hi: 'एक वरिष्ठ नेता जिस पर सब भरोसा करते हैं।' },
    starsRequired: 144,
  },
  {
    id: 'air-marshal',
    name: { en: 'Air Marshal', hi: 'एयर मार्शल' },
    blurb: { en: 'You guide the whole Air Force region.', hi: 'आप पूरे क्षेत्र की वायु सेना का मार्गदर्शन करते हैं।' },
    starsRequired: 180,
  },
  {
    id: 'air-chief-marshal',
    name: { en: 'Air Chief Marshal', hi: 'एयर चीफ मार्शल' },
    blurb: { en: 'The top rank — you lead the whole IAF!', hi: 'सबसे ऊँचा पद — आप पूरी वायु सेना का नेतृत्व करते हैं!' },
    starsRequired: 220,
  },
];

export function rankIndexForStars(totalStars: number): number {
  let index = 0;
  for (let i = 0; i < RANKS.length; i++) {
    if (totalStars >= RANKS[i].starsRequired) index = i;
  }
  return index;
}
