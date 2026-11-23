import type { OfficerQuality } from './types';

// The 15 Officer Like Qualities used in real SSB selection, reframed as kid
// -friendly "Officer Super Powers" (brief, Stage 6). The full Officer
// Training Ground game stage comes later — this data model exists now so
// Stage 5 hero stories can end with a real "Which Officer Power did they
// show?" question instead of a made-up trait.
export const OFFICER_QUALITIES: OfficerQuality[] = [
  {
    id: 'effective-intelligence',
    family: 'thinking',
    name: { en: 'Effective Intelligence', hi: 'प्रभावी बुद्धिमत्ता' },
    kidDescription: { en: 'Smart problem solving.', hi: 'समस्याओं का समझदारी से हल निकालना।' },
  },
  {
    id: 'reasoning-ability',
    family: 'thinking',
    name: { en: 'Reasoning Ability', hi: 'तर्क शक्ति' },
    kidDescription: { en: 'Asking why and how.', hi: 'क्यों और कैसे पूछना।' },
  },
  {
    id: 'organising-ability',
    family: 'thinking',
    name: { en: 'Organising Ability', hi: 'संगठन क्षमता' },
    kidDescription: { en: 'Planning things neatly.', hi: 'चीज़ों को करीने से योजना बनाना।' },
  },
  {
    id: 'power-of-expression',
    family: 'thinking',
    name: { en: 'Power of Expression', hi: 'अभिव्यक्ति शक्ति' },
    kidDescription: { en: 'Speaking clearly.', hi: 'स्पष्ट रूप से बोलना।' },
  },
  {
    id: 'social-adjustment',
    family: 'team',
    name: { en: 'Social Adjustment', hi: 'सामाजिक सामंजस्य' },
    kidDescription: { en: 'Getting along with everyone.', hi: 'सबके साथ घुल-मिल जाना।' },
  },
  {
    id: 'cooperation',
    family: 'team',
    name: { en: 'Cooperation', hi: 'सहयोग' },
    kidDescription: { en: 'Helping your team.', hi: 'अपनी टीम की मदद करना।' },
  },
  {
    id: 'sense-of-responsibility',
    family: 'team',
    name: { en: 'Sense of Responsibility', hi: 'उत्तरदायित्व की भावना' },
    kidDescription: { en: 'Doing your job even when no one is watching.', hi: 'कोई न देख रहा हो तब भी अपना काम करना।' },
  },
  {
    id: 'initiative',
    family: 'leader',
    name: { en: 'Initiative', hi: 'पहल' },
    kidDescription: { en: 'Starting good things yourself.', hi: 'खुद अच्छी शुरुआत करना।' },
  },
  {
    id: 'self-confidence',
    family: 'leader',
    name: { en: 'Self-Confidence', hi: 'आत्मविश्वास' },
    kidDescription: { en: 'Believing in yourself.', hi: 'खुद पर विश्वास रखना।' },
  },
  {
    id: 'speed-of-decision',
    family: 'leader',
    name: { en: 'Speed of Decision', hi: 'निर्णय की गति' },
    kidDescription: { en: 'Choosing wisely without too much delay.', hi: 'बिना देर किए समझदारी से फैसला लेना।' },
  },
  {
    id: 'ability-to-influence-the-group',
    family: 'leader',
    name: { en: 'Ability to Influence the Group', hi: 'समूह को प्रभावित करने की क्षमता' },
    kidDescription: { en: 'Helping others do good.', hi: 'दूसरों को अच्छा करने में मदद करना।' },
  },
  {
    id: 'liveliness',
    family: 'heart',
    name: { en: 'Liveliness', hi: 'जीवंतता' },
    kidDescription: { en: 'Staying cheerful.', hi: 'खुशमिज़ाज रहना।' },
  },
  {
    id: 'determination',
    family: 'heart',
    name: { en: 'Determination', hi: 'दृढ़ संकल्प' },
    kidDescription: { en: 'Never giving up.', hi: 'कभी हार न मानना।' },
  },
  {
    id: 'courage',
    family: 'heart',
    name: { en: 'Courage', hi: 'साहस' },
    kidDescription: { en: 'Doing the right thing even when it is hard.', hi: 'मुश्किल होने पर भी सही काम करना।' },
  },
  {
    id: 'stamina',
    family: 'heart',
    name: { en: 'Stamina', hi: 'सहनशक्ति' },
    kidDescription: { en: 'Staying strong and healthy.', hi: 'मज़बूत और स्वस्थ रहना।' },
  },
];

export function getOfficerQuality(id: string): OfficerQuality | undefined {
  return OFFICER_QUALITIES.find((q) => q.id === id);
}
