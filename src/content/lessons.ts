import type { Lesson } from './types';

// Phase 3 slice: the first real lesson, proving the full Learn → Explore →
// Play → Check loop end to end. More Hangar lessons (engine, landing gear,
// cockpit instruments...) follow the same shape.
export const LESSONS: Lesson[] = [
  {
    id: 'hangar-parts-1',
    stageId: 'hangar',
    order: 1,
    title: { en: 'Parts of a Plane', hi: 'जहाज़ के हिस्से' },
    storyPanels: [
      {
        en: "Hi, I'm Veer! Let's learn about aeroplanes together.",
        hi: 'नमस्ते, मैं वीर हूँ! चलो मिलकर हवाई जहाज़ के बारे में जानें।',
      },
      {
        en: 'Every plane has special parts that help it fly high.',
        hi: 'हर जहाज़ में खास हिस्से होते हैं जो उसे उड़ने में मदद करते हैं।',
      },
      {
        en: "This is the fuselage — the plane's long body, like its tummy!",
        hi: 'यह है फ्यूज़लाज — जहाज़ का लंबा शरीर, जैसे उसका पेट!',
      },
      {
        en: 'The wings push air down, and that push lifts the plane up!',
        hi: 'पंख हवा को नीचे धकेलते हैं, और इससे जहाज़ ऊपर उठता है!',
      },
      {
        en: "The tail keeps the plane steady and turns its nose.",
        hi: 'पूँछ जहाज़ को स्थिर रखती है और उसकी नाक मोड़ती है।',
      },
    ],
    exploreActivityId: 'plane-parts-explore',
    miniGameId: 'tap-the-part-game',
    quiz: [
      {
        id: 'hangar-parts-1-q1',
        type: 'multiple-choice',
        prompt: { en: "Which part is like the plane's tummy?", hi: 'कौन सा हिस्सा जहाज़ का पेट जैसा है?' },
        options: [
          { en: 'Fuselage', hi: 'फ्यूज़लाज' },
          { en: 'Wings', hi: 'पंख' },
          { en: 'Tail', hi: 'पूँछ' },
          { en: 'Cockpit', hi: 'कॉकपिट' },
        ],
        correctIndex: 0,
        hints: {
          nudge: {
            en: 'Think about the long middle part of the plane.',
            hi: 'जहाज़ के लंबे बीच वाले हिस्से के बारे में सोचो।',
          },
          strongerClue: {
            en: "It's not the glass bubble, and it's not at the very back.",
            hi: 'यह शीशे का बुलबुला नहीं है, और यह सबसे पीछे भी नहीं है।',
          },
        },
      },
      {
        id: 'hangar-parts-1-q2',
        type: 'multiple-choice',
        prompt: { en: 'What do the wings help the plane do?', hi: 'पंख जहाज़ की क्या मदद करते हैं?' },
        options: [
          { en: 'Make lift and fly up', hi: 'लिफ्ट बनाना और ऊपर उड़ना' },
          { en: 'Make a loud noise', hi: 'ज़ोर से शोर करना' },
          { en: 'Help the pilot talk', hi: 'पायलट को बात करने में मदद करना' },
          { en: 'Carry the fuel only', hi: 'सिर्फ ईंधन ले जाना' },
        ],
        correctIndex: 0,
        hints: {
          nudge: { en: 'Remember the Sky Lab wind-tunnel idea — air pushed down...', hi: 'याद करो — हवा नीचे धकेली जाती है...' },
          strongerClue: {
            en: "It's the force that pushes the plane up, called lift.",
            hi: 'यह वह बल है जो जहाज़ को ऊपर धकेलता है, जिसे लिफ्ट कहते हैं।',
          },
        },
      },
      {
        id: 'hangar-parts-1-q3',
        type: 'true-false',
        prompt: {
          en: 'True or false: the cockpit is where the pilot sits.',
          hi: 'सही या गलत: कॉकपिट वह जगह है जहाँ पायलट बैठता है।',
        },
        options: [
          { en: 'True', hi: 'सही' },
          { en: 'False', hi: 'गलत' },
        ],
        correctIndex: 0,
        hints: {
          nudge: { en: 'Think about the glass bubble on top of the plane.', hi: 'जहाज़ के ऊपर के शीशे के बुलबुले के बारे में सोचो।' },
          strongerClue: { en: 'That glass bubble is called the canopy.', hi: 'उस शीशे के बुलबुले को कैनोपी कहते हैं।' },
        },
      },
    ],
    factIds: [],
    glossaryTermIds: ['fuselage', 'cockpit', 'wings', 'tail'],
  },
  {
    id: 'hangar-hardpoints-1',
    stageId: 'hangar',
    order: 2,
    title: { en: 'Hardpoints & Payload', hi: 'हार्डपॉइंट और सामान' },
    storyPanels: [
      {
        en: 'A fighter jet can carry extra things under its wings.',
        hi: 'एक फाइटर जेट अपने पंखों के नीचे अतिरिक्त चीज़ें ले जा सकता है।',
      },
      {
        en: 'Those strong carrying spots are called hardpoints.',
        hi: 'उन मज़बूत जगहों को हार्डपॉइंट कहते हैं।',
      },
      {
        en: 'A drop tank on a hardpoint carries extra fuel, so the jet flies further.',
        hi: 'हार्डपॉइंट पर लगा ड्रॉप टैंक अतिरिक्त ईंधन ले जाता है, ताकि जेट और दूर उड़ सके।',
      },
      {
        en: 'Hardpoints can also carry a missile, a smart tool that protects the sky.',
        hi: 'हार्डपॉइंट एक मिसाइल भी ले जा सकते हैं, जो आसमान की रक्षा करने वाला एक स्मार्ट उपकरण है।',
      },
      {
        en: "India makes its own missiles, like Astra, and shares BrahMos with Russia!",
        hi: 'भारत अपनी खुद की मिसाइलें बनाता है, जैसे अस्त्र, और रूस के साथ मिलकर ब्रह्मोस बनाता है!',
      },
    ],
    exploreActivityId: 'hardpoints-explore',
    miniGameId: null,
    quiz: [
      {
        id: 'hangar-hardpoints-1-q1',
        type: 'multiple-choice',
        prompt: {
          en: 'What do we call the strong spot under a wing that carries extra things?',
          hi: 'पंख के नीचे की उस मज़बूत जगह को क्या कहते हैं जो अतिरिक्त चीज़ें ले जाती है?',
        },
        options: [
          { en: 'Hardpoint', hi: 'हार्डपॉइंट' },
          { en: 'Cockpit', hi: 'कॉकपिट' },
          { en: 'Fuselage', hi: 'फ्यूज़लाज' },
          { en: 'Radome', hi: 'रेडोम' },
        ],
        correctIndex: 0,
        hints: {
          nudge: { en: 'It sounds like something strong and firm.', hi: 'यह कुछ मज़बूत और दृढ़ जैसा लगता है।' },
          strongerClue: {
            en: "It's not a part of the plane's body — it's a mounting spot under the wing.",
            hi: 'यह जहाज़ के शरीर का हिस्सा नहीं है — यह पंख के नीचे लगाने की जगह है।',
          },
        },
      },
      {
        id: 'hangar-hardpoints-1-q2',
        type: 'multiple-choice',
        prompt: { en: 'What does a drop tank carry?', hi: 'ड्रॉप टैंक क्या ले जाता है?' },
        options: [
          { en: 'Extra fuel', hi: 'अतिरिक्त ईंधन' },
          { en: 'Extra pilots', hi: 'अतिरिक्त पायलट' },
          { en: 'Snacks', hi: 'नाश्ता' },
          { en: 'Radar signals', hi: 'रडार संकेत' },
        ],
        correctIndex: 0,
        hints: {
          nudge: { en: 'Think about what helps a jet fly a longer distance.', hi: 'सोचो किससे जेट ज़्यादा दूर तक उड़ पाता है।' },
          strongerClue: { en: "It's the same thing a car needs to go further too!", hi: 'यह वही चीज़ है जो कार को भी दूर जाने के लिए चाहिए!' },
        },
      },
      {
        id: 'hangar-hardpoints-1-q3',
        type: 'true-false',
        prompt: {
          en: 'True or false: India makes its own missile called Astra.',
          hi: 'सही या गलत: भारत अपनी खुद की मिसाइल बनाता है जिसे अस्त्र कहते हैं।',
        },
        options: [
          { en: 'True', hi: 'सही' },
          { en: 'False', hi: 'गलत' },
        ],
        correctIndex: 0,
        hints: {
          nudge: { en: 'Remember the "Made in India" story Veer just told you.', hi: 'वीर ने अभी जो "मेड इन इंडिया" कहानी बताई, उसे याद करो।' },
          strongerClue: { en: 'Astra is an air-to-air missile made right here in India.', hi: 'अस्त्र एक एयर-टू-एयर मिसाइल है जो यहीं भारत में बनी है।' },
        },
      },
    ],
    factIds: [],
    glossaryTermIds: ['hardpoint', 'drop-tank', 'missile'],
  },
  {
    id: 'iaf-story-arjan-singh',
    stageId: 'iaf-story',
    order: 1,
    title: { en: 'Marshal Arjan Singh', hi: 'मार्शल अर्जन सिंह' },
    storyPanels: [
      {
        en: 'Long ago, a brave officer named Arjan Singh joined the Air Force.',
        hi: 'बहुत पहले, अर्जन सिंह नाम के एक बहादुर अधिकारी वायु सेना में शामिल हुए।',
      },
      {
        en: 'He worked hard for many years and always stayed calm under pressure.',
        hi: 'उन्होंने कई सालों तक मेहनत की और हमेशा मुश्किल समय में भी शांत रहे।',
      },
      {
        en: 'Arjan Singh reached the very top rank — Marshal of the Air Force!',
        hi: 'अर्जन सिंह सबसे ऊँचे पद तक पहुँचे — मार्शल ऑफ द एयर फोर्स!',
      },
      {
        en: 'He is the only officer ever to reach this special five-star rank.',
        hi: 'वे इस खास पाँच-सितारा पद तक पहुँचने वाले एकमात्र अधिकारी हैं।',
      },
      {
        en: 'His calm, steady leadership inspired every pilot who flew with him.',
        hi: 'उनके शांत और स्थिर नेतृत्व ने हर उस पायलट को प्रेरित किया जो उनके साथ उड़ा।',
      },
    ],
    exploreActivityId: null,
    miniGameId: null,
    quiz: [
      {
        id: 'iaf-story-arjan-singh-q1',
        type: 'multiple-choice',
        prompt: { en: 'What special rank did Arjan Singh reach?', hi: 'अर्जन सिंह किस खास पद तक पहुँचे?' },
        options: [
          { en: 'Marshal of the Air Force', hi: 'मार्शल ऑफ द एयर फोर्स' },
          { en: 'Flying Officer', hi: 'फ्लाइंग ऑफिसर' },
          { en: 'Group Captain', hi: 'ग्रुप कैप्टन' },
          { en: 'Wing Commander', hi: 'विंग कमांडर' },
        ],
        correctIndex: 0,
        hints: {
          nudge: { en: 'It is the very top of the rank ladder.', hi: 'यह पद की सीढ़ी के सबसे ऊपर है।' },
          strongerClue: { en: 'Only one officer in IAF history has ever held this five-star rank.', hi: 'वायु सेना के इतिहास में केवल एक ही अधिकारी इस पाँच-सितारा पद पर रहे हैं।' },
        },
      },
      {
        id: 'iaf-story-arjan-singh-q2',
        type: 'multiple-choice',
        prompt: {
          en: 'Which Officer Power did Arjan Singh show as a calm, trusted leader?',
          hi: 'एक शांत, भरोसेमंद नेता के रूप में अर्जन सिंह ने कौन सी अधिकारी शक्ति दिखाई?',
        },
        options: [
          { en: 'Ability to Influence the Group', hi: 'समूह को प्रभावित करने की क्षमता' },
          { en: 'Stamina', hi: 'सहनशक्ति' },
          { en: 'Cooperation', hi: 'सहयोग' },
          { en: 'Reasoning Ability', hi: 'तर्क शक्ति' },
        ],
        correctIndex: 0,
        hints: {
          nudge: { en: 'Think about how he inspired every pilot around him.', hi: 'सोचो कि उन्होंने अपने आस-पास के हर पायलट को कैसे प्रेरित किया।' },
          strongerClue: { en: 'It is the leader power about helping others do good.', hi: 'यह वह नेता-शक्ति है जो दूसरों को अच्छा करने में मदद करती है।' },
        },
      },
    ],
    factIds: [],
    glossaryTermIds: [],
    heroCardId: 'hero-arjan-singh',
  },
  {
    id: 'iaf-story-rakesh-sharma',
    stageId: 'iaf-story',
    order: 2,
    title: { en: 'Rakesh Sharma: To Space and Back', hi: 'राकेश शर्मा: अंतरिक्ष की यात्रा' },
    storyPanels: [
      {
        en: 'Rakesh Sharma was a brave IAF pilot who loved flying high.',
        hi: 'राकेश शर्मा एक बहादुर वायु सेना पायलट थे जिन्हें ऊँचा उड़ना बहुत पसंद था।',
      },
      {
        en: 'In 1984, he flew all the way into space!',
        hi: '1984 में, वे पूरे रास्ते अंतरिक्ष तक उड़ गए!',
      },
      {
        en: 'He became the very first Indian to ever see Earth from space.',
        hi: 'वे अंतरिक्ष से पृथ्वी को देखने वाले पहले भारतीय बने।',
      },
      {
        en: "When asked how India looked, he said 'Saare Jahan Se Achha' — better than the whole world!",
        hi: 'जब उनसे पूछा गया कि भारत कैसा दिखता है, तो उन्होंने कहा "सारे जहाँ से अच्छा"!',
      },
      {
        en: 'His courage showed that IAF pilots can reach the most amazing heights.',
        hi: 'उनके साहस ने दिखाया कि वायु सेना के पायलट सबसे अद्भुत ऊँचाइयों तक पहुँच सकते हैं।',
      },
    ],
    exploreActivityId: null,
    miniGameId: null,
    quiz: [
      {
        id: 'iaf-story-rakesh-sharma-q1',
        type: 'multiple-choice',
        prompt: { en: 'What amazing thing did Rakesh Sharma do in 1984?', hi: '1984 में राकेश शर्मा ने क्या अद्भुत काम किया?' },
        options: [
          { en: 'Flew into space', hi: 'अंतरिक्ष में उड़े' },
          { en: 'Built a new jet', hi: 'एक नया जेट बनाया' },
          { en: 'Became a teacher', hi: 'शिक्षक बने' },
          { en: 'Painted the sky', hi: 'आसमान को रंगा' },
        ],
        correctIndex: 0,
        hints: {
          nudge: { en: 'Think about going further up than any plane can fly.', hi: 'किसी भी जहाज़ से ज़्यादा ऊपर जाने के बारे में सोचो।' },
          strongerClue: { en: 'He became the first Indian to do this amazing thing.', hi: 'वे यह अद्भुत काम करने वाले पहले भारतीय बने।' },
        },
      },
      {
        id: 'iaf-story-rakesh-sharma-q2',
        type: 'multiple-choice',
        prompt: {
          en: 'Which Officer Power did Rakesh Sharma show by going somewhere so new?',
          hi: 'इतनी नई जगह जाकर राकेश शर्मा ने कौन सी अधिकारी शक्ति दिखाई?',
        },
        options: [
          { en: 'Courage', hi: 'साहस' },
          { en: 'Stamina', hi: 'सहनशक्ति' },
          { en: 'Social Adjustment', hi: 'सामाजिक सामंजस्य' },
          { en: 'Organising Ability', hi: 'संगठन क्षमता' },
        ],
        correctIndex: 0,
        hints: {
          nudge: { en: 'Think of the heart power about doing hard, brave things.', hi: 'मुश्किल और बहादुरी भरे काम करने वाली हृदय-शक्ति के बारे में सोचो।' },
          strongerClue: { en: 'It is the same power a firefighter or an astronaut needs.', hi: 'यह वही शक्ति है जो एक फायरफाइटर या अंतरिक्ष यात्री को चाहिए।' },
        },
      },
    ],
    factIds: [],
    glossaryTermIds: [],
    heroCardId: 'hero-rakesh-sharma',
  },
];

export function getLessonsForStage(stageId: string): Lesson[] {
  return LESSONS.filter((l) => l.stageId === stageId).sort((a, b) => a.order - b.order);
}

export function getLesson(lessonId: string): Lesson | undefined {
  return LESSONS.find((l) => l.id === lessonId);
}
