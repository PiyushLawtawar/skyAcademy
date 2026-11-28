// The War Room: the IAF's role in India's wars, operations and rescues.
// Written for 7–10 year olds: factual, respectful, no gore; it focuses on
// courage, teamwork and the strategy lesson each event teaches. Dates,
// names and awards are from public IAF / PIB / Ministry of Defence history
// pages; see SOURCES.md ("War Room") for the spot-check list.

export type SceneKind = 'airlift' | 'mountains' | 'desert' | 'river' | 'glacier' | 'island' | 'dogfight' | 'night' | 'flood' | 'sea' | 'city';

export interface HistoryEvent {
  id: string;
  year: string;
  sortYear: number;
  kind: 'war' | 'operation' | 'rescue';
  title: string;
  tagline: string;
  emoji: string;
  scene: SceneKind;
  panels: { text: string; scene?: SceneKind }[];
  aircraft: string[];
  hero?: { name: string; award?: string; story: string };
  numbers: { label: string; value: string }[];
  strategy: { title: string; text: string };
  deeper: string;
  quiz: { q: string; options: string[]; correct: number; explain: string };
}

export const HISTORY: HistoryEvent[] = [
  {
    id: 'kashmir-1947',
    year: '1947–48',
    sortYear: 1947,
    kind: 'war',
    title: 'The Airlift That Saved Srinagar',
    tagline: 'First war of free India',
    emoji: '🛩️',
    scene: 'airlift',
    panels: [
      { text: 'October 1947. India had been free for just two months. Raiders were racing towards Srinagar in Kashmir.' },
      { text: 'Roads were too slow. So on 27 October, Dakota planes flew soldiers straight to Srinagar airfield!', scene: 'airlift' },
      { text: 'Pilots flew again and again, landing on a small runway between mountains. The soldiers arrived just in time.', scene: 'mountains' },
      { text: 'In 1948, Air Commodore Mehar Singh even landed a Dakota at Leh, more than 11,000 feet high. Nobody had done that before!', scene: 'glacier' },
    ],
    aircraft: ['Dakota (DC-3)', 'Tempest', 'Spitfire'],
    hero: {
      name: 'Air Commodore Mehar Singh',
      award: 'Maha Vir Chakra',
      story: 'He flew a Dakota over the high Zojila pass and landed at Leh in May 1948, opening an air bridge to Ladakh.',
    },
    numbers: [
      { label: 'Days after independence', value: '~70' },
      { label: 'Leh landing height', value: '11,500 ft' },
    ],
    strategy: {
      title: 'Airlift = Speed',
      text: 'When time is short, aircraft can move soldiers and supplies far faster than roads. Getting there first can decide everything.',
    },
    deeper:
      'Back then the IAF was called the Royal Indian Air Force. It became the "Indian Air Force" when India became a Republic on 26 January 1950. Civil airline Dakotas also joined the airlift: a whole-nation effort.',
    quiz: {
      q: 'How did soldiers reach Srinagar quickly in 1947?',
      options: ['By train', 'By Dakota aircraft', 'By ship', 'On horses'],
      correct: 1,
      explain: 'Dakota planes flew them in, a famous airlift!',
    },
  },
  {
    id: 'goa-1961',
    year: '1961',
    sortYear: 1961,
    kind: 'operation',
    title: 'Operation Vijay: Goa',
    tagline: 'Goa becomes part of India',
    emoji: '🏝️',
    scene: 'sea',
    panels: [
      { text: 'Even after 1947, Goa was still ruled by Portugal. In December 1961, India decided to end that.' },
      { text: 'IAF Canberra bombers made the airfield at Dabolim unusable, so no one could fly in or out.', scene: 'sea' },
      { text: 'Hunter and Vampire jets supported the Army. In about two days, Goa was free, on 19 December 1961.' },
    ],
    aircraft: ['Canberra', 'Hunter', 'Vampire'],
    numbers: [
      { label: 'Duration', value: '~36 hours' },
      { label: 'Goa Liberation Day', value: '19 Dec' },
    ],
    strategy: {
      title: 'Close the runway',
      text: 'If an airfield can\'t be used, no reinforcements can arrive by air. This is called denying the airfield.',
    },
    deeper: 'Operation Vijay was a joint operation of the Army, Navy and Air Force. Daman and Diu were freed at the same time.',
    quiz: {
      q: 'What did IAF Canberras target in Goa?',
      options: ['A bridge', 'The Dabolim airfield runway', 'A ship', 'A railway station'],
      correct: 1,
      explain: 'They made the runway unusable so no planes could come or go.',
    },
  },
  {
    id: 'himalaya-1962',
    year: '1962',
    sortYear: 1962,
    kind: 'war',
    title: 'Lifeline in the Himalayas',
    tagline: 'Transport pilots at the roof of the world',
    emoji: '🏔️',
    scene: 'mountains',
    panels: [
      { text: 'In 1962, India and China fought a war high in the Himalayas, among snowy mountains and thin air.' },
      { text: 'IAF transport planes and helicopters carried soldiers, food and guns to tiny posts in the mountains.', scene: 'airlift' },
      { text: 'Pilots landed on airstrips like Chushul, at over 14,000 feet, in freezing winds!', scene: 'glacier' },
      { text: 'But India\'s fighter jets were never used to attack. Many experts later felt that was a big lesson.', scene: 'mountains' },
    ],
    aircraft: ['An-12', 'C-119 Packet', 'Dakota', 'Mi-4 helicopter', 'Otter'],
    numbers: [
      { label: 'Chushul airstrip height', value: '14,000+ ft' },
      { label: 'Combat jets used', value: 'None' },
    ],
    strategy: {
      title: 'Use all your strengths',
      text: 'An air force has many tools. If you keep your strongest tool on the ground, you lose its help. Leaders must think about every option.',
    },
    deeper:
      'Flying at very high altitude is hard: thin air gives engines less power and wings less lift. The skill IAF transport crews gained here later helped in Siachen and Ladakh, where they still fly every day.',
    quiz: {
      q: 'What big lesson did experts take from 1962?',
      options: ['Use all your air power wisely', 'Never fly in mountains', 'Only use helicopters', 'Planes are not useful'],
      correct: 0,
      explain: 'Not using combat air power was seen as a missed chance.',
    },
  },
  {
    id: 'sabre-slayers-1965',
    year: '1965',
    sortYear: 1965,
    kind: 'war',
    title: 'The Sabre Slayers',
    tagline: 'Small jet, big courage',
    emoji: '🐜',
    scene: 'dogfight',
    panels: [
      { text: 'In September 1965, India and Pakistan went to war. The IAF\'s Chief was Arjan Singh, later India\'s only Marshal of the IAF.' },
      { text: 'Pakistan flew the F-86 Sabre. India had a tiny jet called the Folland Gnat.', scene: 'dogfight' },
      { text: 'The Gnat was so small it was hard to see, and it could turn quickly. On 3 September, Sqn Ldr Trevor Keelor won the IAF\'s first air battle victory of the war in a Gnat!', scene: 'dogfight' },
      { text: 'The Gnat earned a proud nickname: "Sabre Slayer".' },
    ],
    aircraft: ['Folland Gnat', 'Hunter', 'Mystère', 'MiG-21', 'Canberra'],
    hero: {
      name: 'Squadron Leader Trevor Keelor',
      award: 'Vir Chakra',
      story: 'Flying a small Gnat, he won the IAF\'s first air-to-air victory of the 1965 war.',
    },
    numbers: [
      { label: 'Length of the war', value: '~22 days' },
      { label: 'Gnat wingspan', value: 'About 7 m' },
    ],
    strategy: {
      title: 'Small & smart beats big',
      text: 'A small, agile aircraft is hard to spot and can out-turn bigger jets. Pilot skill and clever tactics matter as much as the machine.',
    },
    deeper:
      'Gnats were built in India by HAL. Arjan Singh, Chief of the Air Staff in 1965, was later given the five-star rank of Marshal of the Indian Air Force, the only IAF officer ever to hold it.',
    quiz: {
      q: 'Which small jet was called the "Sabre Slayer"?',
      options: ['Rafale', 'Folland Gnat', 'C-17', 'Chinook'],
      correct: 1,
      explain: 'The tiny Gnat earned that famous nickname in 1965.',
    },
  },
  {
    id: 'bangladesh-1971',
    year: '1971',
    sortYear: 1971,
    kind: 'war',
    title: '13 Days That Made a Nation',
    tagline: 'The birth of Bangladesh',
    emoji: '🇧🇩',
    scene: 'river',
    panels: [
      { text: 'In 1971, millions of people from East Pakistan fled to India for safety. India decided to help them.' },
      { text: 'War began on 3 December. Within days, the IAF ruled the skies over the East. This is called air superiority.', scene: 'dogfight' },
      { text: 'Mi-4 helicopters carried soldiers across the wide Meghna river. It was called the "Meghna Heli-Bridge".', scene: 'river' },
      { text: 'Paratroopers jumped from planes at Tangail to block the way. In the West, Hunter jets at dawn saved the post at Longewala!', scene: 'desert' },
      { text: 'On 16 December, 93,000 soldiers surrendered in Dhaka. A new country was born: Bangladesh! India celebrates it as Vijay Diwas.' },
    ],
    aircraft: ['MiG-21', 'Hunter', 'Gnat', 'Su-7', 'Canberra', 'Mi-4', 'An-12'],
    hero: {
      name: 'Flying Officer Nirmal Jit Singh Sekhon',
      award: 'Param Vir Chakra',
      story:
        'On 14 December 1971, enemy jets attacked his airbase at Srinagar. He took off alone in his Gnat to defend it, against many aircraft. He is the only IAF officer to receive the Param Vir Chakra, India\'s highest award for bravery.',
    },
    numbers: [
      { label: 'Length of the war', value: '13 days' },
      { label: 'Soldiers who surrendered', value: '~93,000' },
      { label: 'Vijay Diwas', value: '16 Dec' },
    ],
    strategy: {
      title: 'Win the sky first',
      text: 'Once the IAF controlled the sky, the Army and Navy could move freely. Air, land and sea working together (called "jointness") won the war fast.',
    },
    deeper:
      'At Longewala, about 120 Indian soldiers held off a large tank attack through the night. At first light, IAF Hunters from Jaisalmer arrived and stopped the tanks. On 14 December, MiG-21s struck the Governor\'s House in Dhaka with precise rockets during a key meeting, which helped persuade the leadership to surrender two days later.',
    quiz: {
      q: 'What new country was born in 1971?',
      options: ['Sri Lanka', 'Bangladesh', 'Nepal', 'Bhutan'],
      correct: 1,
      explain: 'Bangladesh was born on 16 December 1971!',
    },
  },
  {
    id: 'meghdoot-1984',
    year: '1984',
    sortYear: 1984,
    kind: 'operation',
    title: 'Operation Meghdoot: Siachen',
    tagline: 'The highest battlefield on Earth',
    emoji: '🧊',
    scene: 'glacier',
    panels: [
      { text: 'Siachen is a giant glacier in the Himalayas, more than 20,000 feet high in places. It is freezing cold.' },
      { text: 'In April 1984, IAF helicopters flew Indian soldiers up to the high passes, before anyone else could get there.', scene: 'glacier' },
      { text: 'There are no roads there. To this day, IAF helicopters and planes carry food, fuel and medicine to Siachen.', scene: 'airlift' },
    ],
    aircraft: ['Cheetah', 'Chetak', 'Mi-8', 'Mi-17', 'An-32', 'Il-76'],
    numbers: [
      { label: 'Started', value: '13 Apr 1984' },
      { label: 'Height', value: '20,000+ ft' },
    ],
    strategy: {
      title: 'Hold the high ground',
      text: 'Whoever is higher can see further and is harder to attack. Helicopters let India reach the heights first.',
    },
    deeper:
      '"Meghdoot" means "cloud messenger", from a poem by Kalidasa. Cheetah helicopter pilots routinely land on tiny helipads above 20,000 feet, where the air is so thin that helicopters barely have enough lift.',
    quiz: {
      q: 'Why are helicopters so important at Siachen?',
      options: ['It has no roads', 'It is a beach', 'Planes are banned', 'It is in a city'],
      correct: 0,
      explain: 'With no roads, helicopters are the lifeline.',
    },
  },
  {
    id: 'cactus-1988',
    year: '1988',
    sortYear: 1988,
    kind: 'operation',
    title: 'Operation Cactus: Maldives',
    tagline: 'Help arrives overnight',
    emoji: '🌴',
    scene: 'island',
    panels: [
      { text: 'On 3 November 1988, armed men tried to take over the island country of the Maldives. Its President asked India for help.' },
      { text: 'Within hours, IAF Il-76 planes flew Indian paratroopers more than 2,000 km across the sea!', scene: 'night' },
      { text: 'They landed at Hulhule airport and stopped the attack. The President was safe.', scene: 'island' },
    ],
    aircraft: ['Il-76', 'An-32', 'Mirage 2000'],
    numbers: [
      { label: 'Distance flown', value: '2,000+ km' },
      { label: 'Time to respond', value: 'Hours' },
    ],
    strategy: {
      title: 'Rapid reaction',
      text: 'Big transport planes let a country help a friend far away, very fast. This is called strategic airlift.',
    },
    deeper: 'Mirage 2000s also flew over the islands as a show of strength. The Indian Navy later helped capture the attackers as they fled by ship: another example of jointness.',
    quiz: {
      q: 'Which aircraft carried paratroopers to the Maldives?',
      options: ['Il-76', 'Gnat', 'Cheetah', 'Tejas'],
      correct: 0,
      explain: 'The big Il-76 transport flew them overnight.',
    },
  },
  {
    id: 'kargil-1999',
    year: '1999',
    sortYear: 1999,
    kind: 'war',
    title: 'Operation Safed Sagar: Kargil',
    tagline: 'Air power at the edge of the sky',
    emoji: '⛰️',
    scene: 'mountains',
    panels: [
      { text: 'In 1999, intruders secretly took over mountain tops at Kargil, 16,000–18,000 feet high.' },
      { text: 'The IAF had never fought this high. The thin air changed how jets, bombs and missiles behaved.', scene: 'mountains' },
      { text: 'Pilots learned new tactics fast. Mirage 2000s used laser-guided bombs to hit tiny targets like Tiger Hill and Muntho Dhalo.', scene: 'mountains' },
      { text: 'Helicopter pilots like Flt Lt Gunjan Saxena flew in to rescue injured soldiers. On 26 July, India won. Now it is Kargil Vijay Diwas.', scene: 'glacier' },
    ],
    aircraft: ['Mirage 2000', 'MiG-21', 'MiG-27', 'MiG-29', 'Jaguar', 'Cheetah', 'Mi-17'],
    hero: {
      name: 'Squadron Leader Ajay Ahuja',
      award: 'Vir Chakra',
      story: 'When his friend Flt Lt Nachiketa had to eject, Ajay Ahuja flew back to find him and guide help. He gave his life protecting his friend. Nachiketa came home safely later.',
    },
    numbers: [
      { label: 'Height of targets', value: '16–18,000 ft' },
      { label: 'Kargil Vijay Diwas', value: '26 July' },
    ],
    strategy: {
      title: 'Precision & adaptability',
      text: 'Hitting a small target on a mountain needs smart, precise weapons. And when things don\'t work, great teams change their tactics quickly.',
    },
    deeper:
      'Thin air means less drag, so bombs fall differently, and engines produce less power. The IAF fitted Mirage 2000s with laser-designator pods within weeks. Fighters also stayed high to avoid shoulder-fired missiles, a new tactic learned under pressure.',
    quiz: {
      q: 'Which jet used laser-guided bombs in Kargil?',
      options: ['Mirage 2000', 'C-17', 'Chinook', 'Hawk'],
      correct: 0,
      explain: 'The Mirage 2000 became the precision star of Kargil.',
    },
  },
  {
    id: 'balakot-2019',
    year: '2019',
    sortYear: 2019,
    kind: 'operation',
    title: 'Balakot & a Brave Pilot',
    tagline: 'A night strike and a pilot who came home',
    emoji: '🌙',
    scene: 'night',
    panels: [
      { text: 'In February 2019, terrorists attacked Indian soldiers at Pulwama. India decided to act against the terror camp behind it.' },
      { text: 'Before dawn on 26 February, Mirage 2000s flew across the mountains and struck a terrorist training camp at Balakot with precision bombs.', scene: 'night' },
      { text: 'The next day, in an air battle, Wing Commander Abhinandan Varthaman\'s MiG-21 Bison was hit. He ejected safely.', scene: 'dogfight' },
      { text: 'He landed across the border and stayed calm and brave. He came home on 1 March, and the whole country cheered!' },
    ],
    aircraft: ['Mirage 2000', 'Su-30MKI', 'MiG-21 Bison', 'Netra AEW&C', 'Il-78 tanker'],
    hero: {
      name: 'Wing Commander Abhinandan Varthaman',
      award: 'Vir Chakra',
      story: 'He chased intruding jets in an older MiG-21 Bison, ejected when hit, and showed great courage and dignity until he returned home.',
    },
    numbers: [
      { label: 'Strike date', value: '26 Feb 2019' },
      { label: 'Abhinandan returned', value: '1 Mar 2019' },
    ],
    strategy: {
      title: 'A whole team in the sky',
      text: 'Strike jets don\'t fly alone. "Eyes in the sky" (AWACS), tankers and escort fighters all help. This team is called a strike package.',
    },
    deeper:
      'The Mirage 2000s used SPICE 2000 precision-guided bombs. This was the first time since 1971 that IAF jets struck across the border. Netra AEW&C (made in India) and tankers supported the mission.',
    quiz: {
      q: 'Which award did Abhinandan Varthaman receive?',
      options: ['Vir Chakra', 'Arjuna Award', 'Nobel Prize', 'Bharat Ratna'],
      correct: 0,
      explain: 'He received the Vir Chakra for gallantry.',
    },
  },
  {
    id: 'rahat-2013',
    year: '2013',
    sortYear: 2013,
    kind: 'rescue',
    title: 'Operation Rahat: Uttarakhand Floods',
    tagline: 'The biggest helicopter rescue',
    emoji: '🚁',
    scene: 'flood',
    panels: [
      { text: 'In June 2013, huge floods hit Uttarakhand. Roads and bridges were washed away, and thousands of pilgrims were stuck.' },
      { text: 'IAF helicopters flew in bad weather between steep valleys, again and again, to lift people to safety.', scene: 'flood' },
      { text: 'Tens of thousands of people were rescued. It is one of the biggest helicopter rescues ever!' },
    ],
    aircraft: ['Mi-17', 'ALH Dhruv', 'Cheetah', 'C-130J', 'Mi-26'],
    numbers: [
      { label: 'People airlifted', value: '~20,000' },
      { label: 'Helicopters used', value: 'Dozens' },
    ],
    strategy: {
      title: 'Air power saves lives',
      text: 'The same skills used in war (flying in mountains, carrying loads, teamwork) save lives in disasters.',
    },
    deeper: 'A Mi-17 V5 crashed during the rescue, and its brave crew and rescuers lost their lives. The IAF motto "Touch the sky with glory" includes serving people in need.',
    quiz: {
      q: 'What was Operation Rahat about?',
      options: ['Rescuing flood victims', 'An air show', 'Building a runway', 'A space launch'],
      correct: 0,
      explain: 'Rahat means "relief": a huge rescue mission.',
    },
  },
  {
    id: 'ganga-2022',
    year: '2022',
    sortYear: 2022,
    kind: 'rescue',
    title: 'Operation Ganga: Bringing Students Home',
    tagline: 'C-17s fly into a war zone neighbourhood',
    emoji: '🎓',
    scene: 'airlift',
    panels: [
      { text: 'In 2022, war broke out in Ukraine. Thousands of Indian students were studying there.' },
      { text: 'Students crossed into nearby countries. IAF C-17 Globemasters flew there to bring them home.', scene: 'airlift' },
      { text: 'The giant planes also carried tonnes of medicines and relief supplies for people in need.' },
    ],
    aircraft: ['C-17 Globemaster III'],
    numbers: [{ label: 'Indians brought home (all flights)', value: '18,000+' }],
    strategy: {
      title: 'Global reach',
      text: 'Long-range transport planes let India look after its people anywhere in the world.',
    },
    deeper: 'Operation Ganga used both airline flights and IAF C-17s, flying from Romania, Poland, Hungary and Slovakia.',
    quiz: {
      q: 'Which IAF aircraft flew in Operation Ganga?',
      options: ['C-17 Globemaster', 'Gnat', 'Cheetah', 'Hunter'],
      correct: 0,
      explain: 'The giant C-17s brought students home.',
    },
  },
  {
    id: 'kaveri-2023',
    year: '2023',
    sortYear: 2023,
    kind: 'rescue',
    title: 'Operation Kaveri: Night Landing in Sudan',
    tagline: 'No lights, no problem',
    emoji: '🦉',
    scene: 'night',
    panels: [
      { text: 'In April 2023, fighting in Sudan trapped many people, including Indians.' },
      { text: 'An IAF C-130J landed on a small dark airstrip at Wadi Seidna at night, with no runway lights at all!', scene: 'night' },
      { text: 'The pilots used night-vision goggles to see. They rescued 121 people, including a pregnant woman.' },
    ],
    aircraft: ['C-130J Super Hercules', 'C-17'],
    numbers: [
      { label: 'People rescued in that flight', value: '121' },
      { label: 'Runway lights', value: '0' },
    ],
    strategy: {
      title: 'Train for the hardest day',
      text: 'Pilots practise night landings with goggles again and again, so on the real day they can do it calmly.',
    },
    deeper: 'Night-vision goggles turn tiny amounts of starlight into a green picture. The crew also used infra-red sensors to check the strip was clear before landing.',
    quiz: {
      q: 'How did the C-130J pilots land in the dark?',
      options: ['Night-vision goggles', 'Torches', 'They waited for morning', 'Fireworks'],
      correct: 0,
      explain: 'Night-vision goggles let them see on a dark strip.',
    },
  },
];

export function getHistoryEvent(id: string): HistoryEvent | undefined {
  return HISTORY.find((h) => h.id === id);
}
