import type { GlossaryTerm } from './types';

export const GLOSSARY: GlossaryTerm[] = [
  {
    id: 'fuselage',
    term: { en: 'Fuselage', hi: 'फ्यूज़लाज' },
    kidDefinition: {
      en: "It's the plane's body — like the plane's tummy!",
      hi: 'यह हवाई जहाज़ का शरीर है — जैसे जहाज़ का पेट!',
    },
  },
  {
    id: 'cockpit',
    term: { en: 'Cockpit', hi: 'कॉकपिट' },
    kidDefinition: {
      en: 'Where the pilot sits, under a glass bubble called a canopy.',
      hi: 'जहाँ पायलट बैठता है, एक शीशे के बुलबुले के नीचे जिसे कैनोपी कहते हैं।',
    },
  },
  {
    id: 'wings',
    term: { en: 'Wings', hi: 'पंख' },
    kidDefinition: {
      en: 'They push air down so the plane gets pushed up — that push-up is called lift!',
      hi: 'वे हवा को नीचे धकेलते हैं, जिससे जहाज़ ऊपर उठता है — इसे लिफ्ट कहते हैं!',
    },
  },
  {
    id: 'tail',
    term: { en: 'Tail', hi: 'पूँछ' },
    kidDefinition: {
      en: 'It keeps the plane steady and helps steer the nose left, right, up and down.',
      hi: 'यह जहाज़ को स्थिर रखती है और नाक को ऊपर, नीचे, बाएँ-दाएँ मोड़ने में मदद करती है।',
    },
  },
  {
    id: 'hardpoint',
    term: { en: 'Hardpoint', hi: 'हार्डपॉइंट' },
    kidDefinition: {
      en: 'A strong spot under the wing where the jet can carry extra things it needs.',
      hi: 'पंख के नीचे एक मज़बूत जगह, जहाँ जेट अपनी ज़रूरी चीज़ें ले जाता है।',
    },
  },
  {
    id: 'drop-tank',
    term: { en: 'Drop Tank', hi: 'ड्रॉप टैंक' },
    kidDefinition: {
      en: 'An extra fuel tank on a hardpoint, so the jet can fly further.',
      hi: 'हार्डपॉइंट पर एक अतिरिक्त ईंधन टैंक, ताकि जेट और दूर तक उड़ सके।',
    },
  },
  {
    id: 'missile',
    term: { en: 'Missile', hi: 'मिसाइल' },
    kidDefinition: {
      en: "A smart flying tool a fighter jet can carry to protect India's skies.",
      hi: 'एक स्मार्ट उड़ने वाला उपकरण जिसे फाइटर जेट भारत के आसमान की रक्षा के लिए ले जाता है।',
    },
  },
];

export function getGlossaryTerm(id: string): GlossaryTerm | undefined {
  return GLOSSARY.find((g) => g.id === id);
}
