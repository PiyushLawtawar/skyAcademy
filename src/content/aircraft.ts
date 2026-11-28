import type { Aircraft } from './types';

// First six-aircraft slice of Stage 4 (India's Hangar of Fame), one per major
// role family except trainer/tanker (left for a later pass). Every numeric
// spec here was checked against an official or manufacturer source during
// this change — see SOURCES.md for the per-aircraft citations. Any number
// that couldn't be confidently verified (e.g. Netra's crew/speed) is left
// out entirely rather than guessed, per the brief's accuracy guardrail.
export const AIRCRAFT: Aircraft[] = [
  {
    id: 'tejas',
    order: 1,
    photo: {
      src: '/aircraft-photos/tejas.jpg',
      credit: 'Government of India',
      license: 'GODL-India',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Tejas_MK1_in_service_for_7_years.jpg',
    },
    name: { en: 'Tejas (LCA)', hi: 'तेजस (एलसीए)' },
    role: 'fighter',
    madeInIndia: true,
    maker: { en: 'HAL (India)', hi: 'HAL (भारत)' },
    crew: 1,
    topSpeedMach: 1.6,
    speedComparison: {
      en: 'Faster than the speed of sound — about one and a half times as fast!',
      hi: 'ध्वनि की गति से भी तेज़ — लगभग डेढ़ गुना तेज़!',
    },
    standoutFeature: {
      en: 'One of the lightest, most nimble fighters in the world.',
      hi: 'दुनिया के सबसे हल्के और फुर्तीले फाइटर जेट्स में से एक।',
    },
    facts: [
      {
        text: { en: 'Tejas is designed and built in India by HAL — a true homegrown fighter!', hi: 'तेजस भारत में HAL द्वारा डिज़ाइन और निर्मित है — एक सच्चा स्वदेशी फाइटर!' },
        verified: true,
        source: 'https://www.ddpmod.gov.in',
      },
      {
        text: { en: 'It can fly at Mach 1.6 — faster than the speed of sound.', hi: 'यह मैक 1.6 की गति से उड़ सकता है — ध्वनि की गति से भी तेज़।' },
        verified: true,
        source: 'https://www.ddpmod.gov.in',
      },
      {
        text: { en: 'A two-seat trainer version of Tejas teaches new pilots to fly it.', hi: 'तेजस का एक दो-सीट वाला ट्रेनर संस्करण नए पायलटों को उड़ाना सिखाता है।' },
        verified: true,
        source: 'https://www.hal-india.co.in',
      },
    ],
    silhouette: { kind: 'fighter', wingShape: 'delta', hasCanards: false, tailCount: 1 },
  },
  {
    id: 'su-30mki',
    order: 2,
    photo: {
      src: '/aircraft-photos/su30mki.jpg',
      credit: 'Sanil Nath',
      license: 'CC BY 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Su-30MKI.jpg',
    },
    name: { en: 'Su-30MKI', hi: 'सुखोई-30एमकेआई' },
    role: 'fighter',
    madeInIndia: false,
    maker: { en: 'Sukhoi (Russia), built in India under licence by HAL', hi: 'सुखोई (रूस), भारत में HAL द्वारा लाइसेंस के तहत निर्मित' },
    crew: 2,
    topSpeedMach: 2,
    speedComparison: {
      en: 'About twice the speed of sound at high altitude!',
      hi: 'ऊँचाई पर ध्वनि की गति से लगभग दोगुना तेज़!',
    },
    standoutFeature: {
      en: 'A powerful two-seat fighter with canards and twin tails for extra control.',
      hi: 'कैनार्ड और दो पूँछों वाला एक शक्तिशाली दो-सीट फाइटर, जो अतिरिक्त नियंत्रण देता है।',
    },
    facts: [
      {
        text: { en: 'Su-30MKI has two seats — a pilot and a weapon systems officer fly together.', hi: 'सुखोई-30एमकेआई में दो सीटें हैं — एक पायलट और एक हथियार प्रणाली अधिकारी साथ उड़ते हैं।' },
        verified: true,
        source: 'https://www.bharat-rakshak.com',
      },
      {
        text: { en: 'Many Su-30MKI jets are built right here in India by HAL, under licence from Russia.', hi: 'कई सुखोई-30एमकेआई जेट यहीं भारत में HAL द्वारा रूस के लाइसेंस के तहत बनाए जाते हैं।' },
        verified: true,
        source: 'https://www.airforce-technology.com',
      },
      {
        text: { en: 'It has small front wings called canards, which make it extra agile.', hi: 'इसमें कैनार्ड नाम के छोटे आगे के पंख हैं, जो इसे और फुर्तीला बनाते हैं।' },
        verified: true,
      },
    ],
    silhouette: { kind: 'fighter', wingShape: 'swept', hasCanards: true, tailCount: 2 },
  },
  {
    id: 'rafale',
    order: 3,
    photo: {
      src: '/aircraft-photos/rafale.jpg',
      credit: 'Dylan Agbagni',
      license: 'CC0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Indian_Air_Force_Rafale.jpg',
    },
    name: { en: 'Rafale', hi: 'राफेल' },
    role: 'fighter',
    madeInIndia: false,
    maker: { en: 'Dassault Aviation (France)', hi: 'दसॉल्ट एविएशन (फ्रांस)' },
    crew: 1,
    topSpeedMach: 1.8,
    speedComparison: {
      en: 'Nearly twice the speed of sound!',
      hi: 'ध्वनि की गति से लगभग दोगुना तेज़!',
    },
    standoutFeature: {
      en: 'A modern French fighter with small canards for sharp handling.',
      hi: 'छोटे कैनार्ड वाला एक आधुनिक फ्रांसीसी फाइटर, जो तीक्ष्ण नियंत्रण देता है।',
    },
    facts: [
      {
        text: { en: 'Rafale can fly at about Mach 1.8 — nearly twice the speed of sound.', hi: 'राफेल लगभग मैक 1.8 की गति से उड़ सकता है — ध्वनि की गति से लगभग दोगुना तेज़।' },
        verified: true,
      },
      {
        text: { en: 'It has small canard wings near the cockpit, just like the Su-30MKI.', hi: 'इसके कॉकपिट के पास छोटे कैनार्ड पंख हैं, बिल्कुल सुखोई-30एमकेआई की तरह।' },
        verified: true,
      },
      {
        text: { en: 'The Indian Air Force flies both single-seat and two-seat Rafale jets.', hi: 'भारतीय वायु सेना एक-सीट और दो-सीट, दोनों तरह के राफेल जेट उड़ाती है।' },
        verified: true,
      },
    ],
    silhouette: { kind: 'fighter', wingShape: 'delta', hasCanards: true, tailCount: 1 },
  },
  {
    id: 'c17-globemaster',
    order: 4,
    photo: {
      src: '/aircraft-photos/c17.jpg',
      credit: 'SD Singh',
      license: 'Public domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:C_17_Globemaster_of_Indian_Air_Force.jpg',
    },
    name: { en: 'C-17 Globemaster III', hi: 'सी-17 ग्लोबमास्टर III' },
    role: 'transport',
    madeInIndia: false,
    maker: { en: 'Boeing (USA)', hi: 'बोइंग (अमेरिका)' },
    crew: 3,
    topSpeedMach: 0.74,
    speedComparison: {
      en: 'Cruises just under the speed of sound, like a big airliner.',
      hi: 'एक बड़े यात्री विमान की तरह, ध्वनि की गति से थोड़ा कम उड़ता है।',
    },
    standoutFeature: {
      en: 'A giant that can carry heavy loads and still land on short runways.',
      hi: 'एक विशालकाय विमान जो भारी सामान ले जा सकता है और फिर भी छोटे रनवे पर उतर सकता है।',
    },
    facts: [
      {
        text: { en: 'C-17 needs a crew of three: two pilots and a loadmaster.', hi: 'सी-17 को तीन लोगों के दल की ज़रूरत होती है: दो पायलट और एक लोडमास्टर।' },
        verified: true,
        source: 'https://www.af.mil',
      },
      {
        text: { en: 'It cruises at about Mach 0.74 — just under the speed of sound.', hi: 'यह लगभग मैक 0.74 की गति से उड़ता है — ध्वनि की गति से थोड़ा कम।' },
        verified: true,
        source: 'https://www.af.mil',
      },
      {
        text: {
          en: 'The IAF uses C-17s to carry troops, vehicles and supplies — including during floods and disasters.',
          hi: 'वायु सेना सी-17 का उपयोग सैनिकों, वाहनों और सामान ले जाने के लिए करती है — बाढ़ और आपदाओं के दौरान भी।',
        },
        verified: true,
      },
    ],
    silhouette: { kind: 'transport' },
  },
  {
    id: 'hal-dhruv',
    order: 5,
    photo: {
      src: '/aircraft-photos/dhruv.jpg',
      credit: 'Arpingstone',
      license: 'Public domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Indian_air_force_dhruv_helicopter_j4042_arp.jpg',
    },
    name: { en: 'ALH Dhruv', hi: 'ध्रुव (ALH)' },
    role: 'helicopter',
    madeInIndia: true,
    maker: { en: 'HAL (India)', hi: 'HAL (भारत)' },
    crew: 2,
    topSpeedKmh: 250,
    speedComparison: {
      en: 'About as fast as a race car, but in the sky!',
      hi: 'एक रेस कार जितनी तेज़, लेकिन आसमान में!',
    },
    standoutFeature: {
      en: 'A homegrown helicopter that can fly over mountains, seas and cities alike.',
      hi: 'एक स्वदेशी हेलीकॉप्टर जो पहाड़ों, समुद्रों और शहरों के ऊपर समान रूप से उड़ सकता है।',
    },
    facts: [
      {
        text: { en: 'Dhruv is designed and built in India by HAL.', hi: 'ध्रुव भारत में HAL द्वारा डिज़ाइन और निर्मित है।' },
        verified: true,
        source: 'https://www.hal-india.co.in',
      },
      {
        text: { en: 'It cruises at about 250 km/h.', hi: 'यह लगभग 250 किमी/घंटा की गति से उड़ता है।' },
        verified: true,
        source: 'https://www.hal-india.co.in',
      },
      {
        text: {
          en: 'Dhruv can carry people, stretchers for the injured, or supplies — perfect for rescue missions.',
          hi: 'ध्रुव लोगों, घायलों के लिए स्ट्रेचर, या सामान ले जा सकता है — बचाव मिशन के लिए एकदम सही।',
        },
        verified: true,
      },
      {
        text: {
          en: 'The Sarang Helicopter Display Team flies specially painted Dhruvs in beautiful air show formations.',
          hi: 'सारंग हेलीकॉप्टर प्रदर्शन टीम एयर शो में खूबसूरत फॉर्मेशन में खास रंग वाले ध्रुव उड़ाती है।',
        },
        verified: true,
      },
    ],
    silhouette: { kind: 'helicopter' },
  },
  {
    id: 'netra-awacs',
    order: 6,
    photo: {
      src: '/aircraft-photos/netra.jpg',
      credit: 'Indian Air Force',
      license: 'GODL-India',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:IAF_Netra_AEW%26C_releasing_flares.jpg',
    },
    name: { en: 'Netra AEW&C', hi: 'नेत्र (AEW&C)' },
    role: 'awacs',
    madeInIndia: true,
    maker: { en: 'DRDO (India), on a Brazilian-made jet', hi: 'DRDO (भारत), एक ब्राज़ीलियाई जेट पर' },
    standoutFeature: {
      en: "An 'eyes in the sky' jet that watches a huge area of airspace at once.",
      hi: 'एक "आसमान की आँखें" जेट, जो एक साथ आसमान के एक बड़े हिस्से पर नज़र रखता है।',
    },
    facts: [
      {
        text: { en: "Netra's radar dome on top can watch the sky in almost every direction.", hi: 'नेत्र के ऊपर का रडार गुंबद लगभग हर दिशा में आसमान देख सकता है।' },
        verified: true,
        source: 'https://www.drdo.gov.in',
      },
      {
        text: {
          en: "Its radar and computers were built in India by DRDO, mounted on a jet body made in Brazil.",
          hi: 'इसके रडार और कंप्यूटर भारत में DRDO द्वारा बनाए गए हैं, जो ब्राज़ील में बने एक जेट पर लगे हैं।',
        },
        verified: true,
        source: 'https://www.drdo.gov.in',
      },
      {
        text: {
          en: 'Netra helps guide and protect other aircraft by spotting what is in the sky from far away.',
          hi: 'नेत्र दूर से आसमान में मौजूद चीज़ों को देखकर अन्य विमानों का मार्गदर्शन और सुरक्षा करने में मदद करता है।',
        },
        verified: true,
      },
    ],
    silhouette: { kind: 'awacs' },
  },
  {
    id: 'pc7-mk2',
    order: 7,
    photo: {
      src: '/aircraft-photos/pc7.jpg',
      credit: 'Nisarg Vyas',
      license: 'GFDL 1.2',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:Pilatus_PC-7_Mk_II_of_Indian_Air_Force_en_route_to_Dundigal_AFA,_Hyderabad.PNG',
    },
    name: { en: 'Pilatus PC-7 Mk II', hi: 'पिलाटस पीसी-7 एमके II' },
    role: 'trainer',
    madeInIndia: false,
    maker: { en: 'Pilatus Aircraft (Switzerland)', hi: 'पिलाटस एयरक्राफ्ट (स्विट्ज़रलैंड)' },
    crew: 2,
    topSpeedKmh: 450,
    speedComparison: {
      en: 'About as fast as a small private plane.',
      hi: 'एक छोटे निजी विमान जितनी तेज़।',
    },
    standoutFeature: {
      en: 'The very first aircraft every IAF cadet learns to fly.',
      hi: 'वह पहला विमान जिसे हर वायु सेना कैडेट उड़ाना सीखता है।',
    },
    facts: [
      {
        text: { en: 'PC-7 Mk II is the basic trainer every IAF pilot flies first.', hi: 'पीसी-7 एमके II वह बुनियादी ट्रेनर है जिसे हर वायु सेना पायलट सबसे पहले उड़ाता है।' },
        verified: true,
        source: 'https://www.airforce-technology.com/projects/pc-7-mkii-basic-trainer/',
      },
      {
        text: { en: 'It seats two — a cadet in front and an instructor behind.', hi: 'इसमें दो सीटें हैं — आगे एक कैडेट और पीछे एक प्रशिक्षक।' },
        verified: true,
      },
      {
        text: {
          en: "The IAF's PC-7 Mk II fleet has flown over 12,000 training hours.",
          hi: 'वायु सेना के पीसी-7 एमके II बेड़े ने 12,000 से अधिक प्रशिक्षण घंटे उड़ान भरी है।',
        },
        verified: true,
      },
    ],
    silhouette: { kind: 'trainer' },
  },
  {
    id: 'hawk-mk132',
    order: 8,
    photo: {
      src: '/aircraft-photos/hawk.jpg',
      credit: 'Government of India',
      license: 'GODL-India',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:IAF_Surya_Kiran_Aero_India_2023.jpg',
    },
    name: { en: 'Hawk Mk132', hi: 'हॉक एमके132' },
    role: 'trainer',
    madeInIndia: false,
    maker: { en: 'BAE Systems (UK), built in India under licence by HAL', hi: 'बीएई सिस्टम्स (यूके), भारत में HAL द्वारा लाइसेंस के तहत निर्मित' },
    crew: 2,
    topSpeedMach: 0.84,
    speedComparison: {
      en: 'Just under the speed of sound.',
      hi: 'ध्वनि की गति से थोड़ा कम।',
    },
    standoutFeature: {
      en: 'An advanced jet trainer that also dazzles crowds at air shows.',
      hi: 'एक उन्नत जेट ट्रेनर जो एयर शो में दर्शकों को भी मंत्रमुग्ध करता है।',
    },
    facts: [
      {
        text: {
          en: 'Hawk is the advanced jet trainer pilots fly before moving on to fighters.',
          hi: 'हॉक वह उन्नत जेट ट्रेनर है जिसे पायलट फाइटर जेट उड़ाने से पहले उड़ाते हैं।',
        },
        verified: true,
      },
      {
        text: { en: 'Many Hawks are built in India by HAL, under licence from BAE Systems.', hi: 'कई हॉक भारत में HAL द्वारा बीएई सिस्टम्स के लाइसेंस के तहत बनाए जाते हैं।' },
        verified: true,
      },
      {
        text: {
          en: 'The Surya Kiran Aerobatic Team flies specially painted Hawks in dazzling air shows.',
          hi: 'सूर्य किरण एयरोबैटिक टीम एयर शो में खास रंग वाले हॉक जेट उड़ाती है।',
        },
        verified: true,
        source: 'https://www.flightglobal.com/india-requests-more-hawks-for-aerobatic-display-team/107053.article',
      },
    ],
    silhouette: { kind: 'fighter', wingShape: 'swept', hasCanards: false, tailCount: 1 },
  },
  {
    id: 'il-78-tanker',
    order: 9,
    photo: {
      src: '/aircraft-photos/il78.jpg',
      credit: 'SSgt Matthew Hannen, USAF',
      license: 'Public domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Indian_Air_Force_Ilyushin_Il-78MKI.jpg',
    },
    name: { en: 'Il-78 (MARS)', hi: 'इल्यूशिन-78 (MARS)' },
    role: 'tanker',
    madeInIndia: false,
    maker: { en: 'Ilyushin (Russia)', hi: 'इल्यूशिन (रूस)' },
    crew: 6,
    standoutFeature: {
      en: 'A flying fuel station that lets fighter jets refuel in mid-air.',
      hi: 'एक उड़ता हुआ ईंधन स्टेशन, जो फाइटर जेट्स को हवा में ही ईंधन भरने देता है।',
    },
    facts: [
      {
        text: { en: 'Il-78 needs a crew of six to fly it and manage mid-air refuelling.', hi: 'इल्यूशिन-78 को उड़ाने और हवा में ईंधन भरने के लिए छह लोगों के दल की ज़रूरत होती है।' },
        verified: true,
      },
      {
        text: {
          en: 'It can refuel other aircraft in the air, so they can fly much further without landing.',
          hi: 'यह अन्य विमानों को हवा में ईंधन भर सकता है, ताकि वे बिना उतरे और दूर तक उड़ सकें।',
        },
        verified: true,
      },
      {
        text: { en: "The IAF calls its mid-air refuelling system 'MARS'.", hi: 'वायु सेना अपनी हवाई ईंधन-भरण प्रणाली को "MARS" कहती है।' },
        verified: true,
      },
    ],
    silhouette: { kind: 'transport' },
  },
  {
    id: 'mig-21-bison',
    order: 10,
    photo: {
      src: '/aircraft-photos/mig21.jpg',
      credit: 'Sanil Nath',
      license: 'CC BY 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Indian_Air_Force_MiG-21_Bison_landing.jpg',
    },
    name: { en: 'MiG-21 Bison', hi: 'मिग-21 बाइसन' },
    role: 'fighter',
    retired: true,
    madeInIndia: false,
    maker: { en: 'Mikoyan (Russia), many built in India under licence by HAL', hi: 'मिकोयान (रूस), कई भारत में HAL द्वारा लाइसेंस के तहत निर्मित' },
    crew: 1,
    topSpeedMach: 2.05,
    speedComparison: {
      en: 'About twice the speed of sound!',
      hi: 'ध्वनि की गति से लगभग दोगुना तेज़!',
    },
    standoutFeature: {
      en: 'A legendary fighter that served the IAF for an incredible 62 years.',
      hi: 'एक महान फाइटर जिसने वायु सेना की 62 वर्षों तक अद्भुत सेवा की।',
    },
    facts: [
      {
        text: {
          en: 'MiG-21 flew with the IAF for 62 years before it retired in September 2025.',
          hi: 'मिग-21 ने सितंबर 2025 में रिटायर होने से पहले वायु सेना में 62 वर्षों तक सेवा दी।',
        },
        verified: true,
        source: 'https://www.flightglobal.com/fixed-wing/india-retires-last-mig-21-bison-fighters-after-six-decades/164687.article',
      },
      {
        text: {
          en: 'Hundreds of MiG-21s were built in India by HAL, under licence from Russia.',
          hi: 'सैकड़ों मिग-21 भारत में HAL द्वारा रूस के लाइसेंस के तहत बनाए गए थे।',
        },
        verified: true,
      },
      {
        text: {
          en: 'Its farewell flight in Chandigarh was led by the Air Chief Marshal himself.',
          hi: 'चंडीगढ़ में इसकी विदाई उड़ान की अगुवाई स्वयं एयर चीफ मार्शल ने की।',
        },
        verified: true,
        source: 'https://www.tribuneindia.com/live-blog/defence/iafs-mig-21-retires-ceremony-to-accord-farewell-to-fighter-jet-begins-at-chandigarh-air-force-station',
      },
    ],
    silhouette: { kind: 'fighter', wingShape: 'delta', hasCanards: false, tailCount: 1 },
  },
  {
    id: 'mirage-2000',
    order: 11,
    photo: {
      src: '/aircraft-photos/mirage2000.jpg',
      credit: 'U.S. Air Force photo by Tech. Sgt. Keith Brown',
      license: 'Public domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:An_Indian_air_force_M-2000_Mirage_taxis_into_position_following_a_Cope_India_%2704.JPG',
    },
    name: { en: 'Mirage 2000 "Vajra"', hi: 'मिराज 2000 "वज्र"' },
    role: 'fighter',
    madeInIndia: false,
    maker: { en: 'Dassault Aviation (France)', hi: 'दसॉ एविएशन (फ्रांस)' },
    crew: 1,
    topSpeedMach: 2.2,
    speedComparison: { en: 'More than twice the speed of sound!', hi: 'ध्वनि की गति से दोगुने से भी ज़्यादा!' },
    standoutFeature: {
      en: 'The precision-strike star of Kargil (1999) and Balakot (2019).',
      hi: 'कारगिल (1999) और बालाकोट (2019) का सटीक प्रहार करने वाला सितारा।',
    },
    facts: [
      { text: { en: 'The IAF calls the Mirage 2000 "Vajra", meaning thunderbolt.', hi: 'वायु सेना मिराज 2000 को "वज्र" कहती है।' }, verified: true, source: 'https://indianairforce.nic.in' },
      { text: { en: 'In Kargil, Mirage 2000s used laser-guided bombs on mountain-top targets.', hi: 'कारगिल में मिराज 2000 ने पहाड़ की चोटियों पर लेज़र-निर्देशित बम गिराए।' }, verified: true },
      { text: { en: 'It has a delta wing and no tail-planes at all.', hi: 'इसके डेल्टा पंख हैं और पीछे कोई टेल-प्लेन नहीं है।' }, verified: true },
    ],
    silhouette: { kind: 'fighter', wingShape: 'delta', hasCanards: false, tailCount: 1 },
  },
  {
    id: 'mig-29',
    order: 12,
    photo: {
      src: '/aircraft-photos/mig29.jpg',
      credit: 'Aeroprints.com',
      license: 'CC BY-SA 3.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:KB715_Mikoyan_Mig-29_Indian_Air_Force_(8414613874).jpg',
    },
    name: { en: 'MiG-29 "Baaz"', hi: 'मिग-29 "बाज़"' },
    role: 'fighter',
    madeInIndia: false,
    maker: { en: 'Mikoyan (Russia)', hi: 'मिकोयान (रूस)' },
    crew: 1,
    topSpeedMach: 2.25,
    speedComparison: { en: 'More than twice the speed of sound!', hi: 'ध्वनि की गति से दोगुने से भी ज़्यादा!' },
    standoutFeature: { en: 'A super-agile dogfighter with twin tails.', hi: 'दो टेल वाला बेहद फुर्तीला डॉगफाइटर।' },
    facts: [
      { text: { en: 'The IAF named it "Baaz", meaning falcon.', hi: 'वायु सेना ने इसका नाम "बाज़" रखा।' }, verified: true, source: 'https://indianairforce.nic.in' },
      { text: { en: 'Doors in its air intakes close on the ground, so it doesn\'t swallow stones.', hi: 'ज़मीन पर इसके इंटेक के दरवाज़े बंद हो जाते हैं, ताकि पत्थर अंदर न जाएँ।' }, verified: true },
      { text: { en: 'IAF MiG-29s were upgraded to the MiG-29UPG with a new radar and cockpit.', hi: 'वायु सेना के मिग-29 को नए रडार और कॉकपिट के साथ MiG-29UPG में अपग्रेड किया गया।' }, verified: true },
    ],
    silhouette: { kind: 'fighter', wingShape: 'swept', hasCanards: false, tailCount: 2 },
  },
  {
    id: 'jaguar',
    order: 13,
    photo: {
      src: '/aircraft-photos/jaguar.jpg',
      credit: 'SSgt Mathew Hannen, USAF',
      license: 'Public domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:IAF_Jaguar.jpg',
    },
    name: { en: 'Jaguar "Shamsher"', hi: 'जगुआर "शमशेर"' },
    role: 'fighter',
    madeInIndia: false,
    maker: { en: 'SEPECAT (UK–France), many built in India by HAL', hi: 'सेपेकैट (ब्रिटेन-फ्रांस), कई भारत में HAL द्वारा निर्मित' },
    crew: 1,
    topSpeedMach: 1.6,
    speedComparison: { en: 'About one and a half times the speed of sound.', hi: 'ध्वनि की गति से लगभग डेढ़ गुना।' },
    standoutFeature: { en: 'A deep-strike jet that flies low and fast under radar.', hi: 'रडार से नीचे तेज़ और नीची उड़ान भरने वाला डीप-स्ट्राइक जेट।' },
    facts: [
      { text: { en: 'It carries dogfight missiles ON TOP of its wings!', hi: 'यह अपने पंखों के ऊपर मिसाइलें ले जाता है!' }, verified: true },
      { text: { en: 'In the IAF it is also called "Shamsher", the sword of justice.', hi: 'वायु सेना में इसे "शमशेर" भी कहते हैं।' }, verified: true },
    ],
    silhouette: { kind: 'fighter', wingShape: 'swept', hasCanards: false, tailCount: 1 },
  },
  {
    id: 'lch-prachand',
    order: 14,
    photo: {
      src: '/aircraft-photos/prachand.jpg',
      credit: 'Hindustan Aeronautics Limited',
      license: 'GODL-India',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:HAL_Prachand_during_a_flight.jpg',
    },
    name: { en: 'LCH Prachand', hi: 'एलसीएच प्रचंड' },
    role: 'helicopter',
    madeInIndia: true,
    maker: { en: 'HAL (India)', hi: 'HAL (भारत)' },
    crew: 2,
    standoutFeature: {
      en: 'Built for the Himalayas: it can operate at very high altitudes.',
      hi: 'हिमालय के लिए बना: बहुत ऊँचाई पर भी काम कर सकता है।',
    },
    facts: [
      { text: { en: '"Prachand" means fierce. It was designed and built in India by HAL.', hi: '"प्रचंड" यानी प्रबल। इसे HAL ने भारत में डिज़ाइन और निर्मित किया।' }, verified: true, source: 'https://hal-india.co.in' },
      { text: { en: 'HAL says it is the only attack helicopter that can land and take off at 5,000 metres.', hi: 'HAL के अनुसार यह 5,000 मीटर की ऊँचाई पर उतरने और उड़ने वाला एकमात्र अटैक हेलीकॉप्टर है।' }, verified: true, source: 'https://pib.gov.in' },
      { text: { en: 'The two pilots sit one behind the other, in a "tandem" cockpit.', hi: 'दोनों पायलट एक के पीछे एक बैठते हैं।' }, verified: true },
    ],
    silhouette: { kind: 'helicopter' },
  },
  {
    id: 'apache',
    order: 15,
    photo: {
      src: '/aircraft-photos/apache.jpg',
      credit: 'Indian Air Force',
      license: 'GODL-India',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Induction_Of_AH-64E_Apache_Attack_Helicopter_in_Indian_Air_Force_(2).jpg',
    },
    name: { en: 'Apache AH-64E', hi: 'अपाचे AH-64E' },
    role: 'helicopter',
    madeInIndia: false,
    maker: { en: 'Boeing (USA)', hi: 'बोइंग (अमेरिका)' },
    crew: 2,
    standoutFeature: { en: 'A powerful attack helicopter with a radar dome above its rotor.', hi: 'रोटर के ऊपर रडार वाला शक्तिशाली अटैक हेलीकॉप्टर।' },
    facts: [
      { text: { en: 'The IAF inducted its first Apaches in 2019.', hi: 'वायु सेना ने 2019 में पहले अपाचे शामिल किए।' }, verified: true, source: 'https://pib.gov.in' },
      { text: { en: 'The round "Longbow" radar sits on top of the rotor, so it can peek over hills while hiding.', hi: 'इसका "लॉन्गबो" रडार रोटर के ऊपर होता है, ताकि यह छिपकर पहाड़ियों के पार देख सके।' }, verified: true },
    ],
    silhouette: { kind: 'helicopter' },
  },
  {
    id: 'chinook',
    order: 16,
    photo: {
      src: '/aircraft-photos/chinook.jpg',
      credit: 'Indian Air Force',
      license: 'GODL-India',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:An_Indian_Air_Force%27s_Chinook_helicopter_at_an_event_organised_by_Air_Force_Station_Sarsawa.jpg',
    },
    name: { en: 'Chinook CH-47F', hi: 'चिनूक CH-47F' },
    role: 'helicopter',
    madeInIndia: false,
    maker: { en: 'Boeing (USA)', hi: 'बोइंग (अमेरिका)' },
    standoutFeature: { en: 'A heavy-lift helicopter with two big rotors.', hi: 'दो बड़े रोटर वाला भारी सामान उठाने वाला हेलीकॉप्टर।' },
    facts: [
      { text: { en: 'Its two rotors spin in opposite directions, so it needs no tail rotor.', hi: 'इसके दोनों रोटर उल्टी दिशा में घूमते हैं, इसलिए पीछे रोटर की ज़रूरत नहीं।' }, verified: true },
      { text: { en: 'It can carry guns, vehicles and supplies up to high mountain posts.', hi: 'यह तोपें, गाड़ियाँ और सामान ऊँची चौकियों तक ले जा सकता है।' }, verified: true },
      { text: { en: 'The IAF inducted Chinooks in 2019.', hi: 'वायु सेना ने 2019 में चिनूक शामिल किए।' }, verified: true, source: 'https://pib.gov.in' },
    ],
    silhouette: { kind: 'helicopter' },
  },
  {
    id: 'c130j',
    order: 17,
    photo: {
      src: '/aircraft-photos/c130j.jpg',
      credit: 'Naman Vishwajeet',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:A_C-130J_Super_Hercules_of_the_Indian_Air_Force.jpg',
    },
    name: { en: 'C-130J Super Hercules', hi: 'सी-130जे सुपर हरक्यूलिस' },
    role: 'transport',
    madeInIndia: false,
    maker: { en: 'Lockheed Martin (USA)', hi: 'लॉकहीड मार्टिन (अमेरिका)' },
    standoutFeature: { en: 'Can land on short, rough strips, even at night with no lights.', hi: 'छोटी, कच्ची पट्टियों पर, रात में बिना रोशनी के भी उतर सकता है।' },
    facts: [
      { text: { en: 'In 2013 it landed at Daulat Beg Oldi in Ladakh, one of the highest airstrips in the world.', hi: '2013 में यह लद्दाख के दौलत बेग ओल्डी में उतरा, जो दुनिया की सबसे ऊँची हवाई पट्टियों में से एक है।' }, verified: true, source: 'https://pib.gov.in' },
      { text: { en: 'In Operation Kaveri (2023), a C-130J landed on a dark strip in Sudan using night-vision goggles and rescued 121 people.', hi: 'ऑपरेशन कावेरी (2023) में सी-130जे नाइट-विज़न से सूडान की अंधेरी पट्टी पर उतरा और 121 लोगों को बचाया।' }, verified: true, source: 'https://pib.gov.in' },
    ],
    silhouette: { kind: 'transport' },
  },
];

export function getAircraft(id: string): Aircraft | undefined {
  return AIRCRAFT.find((a) => a.id === id);
}

export function getAllAircraftSorted(): Aircraft[] {
  return [...AIRCRAFT].sort((a, b) => a.order - b.order);
}
