// Flight School: basics → advanced air-power concepts, in 4 levels.
// Each concept: a 1–2 sentence kid explanation, an everyday analogy, a real
// IAF example, a "go deeper" paragraph for older/curious cadets, and a check.

export type AnimKey =
  | 'forces'
  | 'axes'
  | 'engine'
  | 'mach'
  | 'gforce'
  | 'radar'
  | 'bvr'
  | 'flares'
  | 'stealth'
  | 'refuel'
  | 'awacs'
  | 'ooda'
  | 'sead'
  | 'package'
  | 'ew'
  | 'drones'
  | 'network'
  | 'scramble'
  | 'cas'
  | 'eject';

export interface Concept {
  id: string;
  level: 1 | 2 | 3 | 4;
  emoji: string;
  title: string;
  kid: string;
  analogy: string;
  realIaf: string;
  deeper: string;
  anim: AnimKey;
  quiz: { q: string; options: string[]; correct: number; explain: string };
}

export const LEVELS = [
  { level: 1, name: 'Cadet Basics', emoji: '🐣', color: 'from-sky-400 to-cyan-500', blurb: 'How does a plane fly?' },
  { level: 2, name: 'Fighter Pilot', emoji: '🧑‍✈️', color: 'from-orange-400 to-rose-500', blurb: 'What makes a fighter jet special?' },
  { level: 3, name: 'Squadron Commander', emoji: '🎖️', color: 'from-violet-500 to-indigo-600', blurb: 'The jobs an air force does' },
  { level: 4, name: 'Air Marshal', emoji: '⭐', color: 'from-emerald-500 to-teal-700', blurb: 'Big-picture air strategy' },
] as const;

export const CONCEPTS: Concept[] = [
  // ---------------- Level 1: Cadet Basics ----------------
  {
    id: 'four-forces',
    level: 1,
    emoji: '⬆️',
    title: 'The 4 Forces of Flight',
    kid: 'Four pushes and pulls act on every plane: Lift (up), Weight (down), Thrust (forward) and Drag (backward).',
    analogy: 'Like a tug-of-war in four directions! If Lift beats Weight, the plane goes up.',
    realIaf: 'A Su-30MKI has so much thrust it can point its nose straight up and keep climbing!',
    deeper:
      'Wings are shaped and tilted so that they push air downwards. Push air down, and the air pushes the wing up (Newton\'s third law). Engines give thrust; air rubbing on the plane gives drag. A plane flies level when Lift = Weight and Thrust = Drag.',
    anim: 'forces',
    quiz: { q: 'Which force pulls a plane down?', options: ['Lift', 'Weight', 'Thrust', 'Drag'], correct: 1, explain: 'Weight (gravity) always pulls down.' },
  },
  {
    id: 'pitch-roll-yaw',
    level: 1,
    emoji: '🔄',
    title: 'Pitch, Roll & Yaw',
    kid: 'A plane can move 3 ways: Pitch (nose up/down), Roll (tip wings), and Yaw (nose left/right).',
    analogy: 'Pitch = nodding "yes". Yaw = shaking "no". Roll = tilting your head to your shoulder!',
    realIaf: 'The Surya Kiran team rolls and loops in perfect sync, just metres apart.',
    deeper:
      'The elevator (on the tail) controls pitch, the ailerons (on the wings) control roll, and the rudder (on the fin) controls yaw. Fighters like the Rafale and Tejas use fly-by-wire computers that move these surfaces many times a second.',
    anim: 'axes',
    quiz: { q: 'Nodding your head "yes" is like…', options: ['Roll', 'Yaw', 'Pitch', 'Drag'], correct: 2, explain: 'Pitch moves the nose up and down.' },
  },
  {
    id: 'jet-engine',
    level: 1,
    emoji: '🔥',
    title: 'Suck, Squeeze, Bang, Blow',
    kid: 'A jet engine sucks in air, squeezes it, burns it with fuel (bang!) and blows it out the back really fast.',
    analogy: 'Like letting go of a balloon: air rushes out the back, and the balloon zooms forward!',
    realIaf: 'Tejas Mk1 flies with a GE F404 engine. India is also working on its own fighter engines.',
    deeper:
      'Stages: intake → compressor (spinning blades squeeze air) → combustion chamber (fuel burns) → turbine (spins to power the compressor) → nozzle (hot gas shoots out). An afterburner sprays extra fuel into the exhaust for a big burst of thrust; you can see it as a bright flame!',
    anim: 'engine',
    quiz: { q: 'What comes right after "squeeze"?', options: ['Suck', 'Bang', 'Blow', 'Brake'], correct: 1, explain: 'Squeeze the air, then bang: burn it with fuel!' },
  },
  {
    id: 'mach',
    level: 1,
    emoji: '💥',
    title: 'Speed of Sound & Mach',
    kid: 'Mach 1 means as fast as sound. Fly faster and you make a loud "sonic boom"!',
    analogy: 'Like a boat making a V-shaped wave in water: a supersonic jet makes a V-shaped wave in the air.',
    realIaf: 'Su-30MKI can reach about Mach 2: twice the speed of sound!',
    deeper:
      'Sound travels about 1,200 km/h near the ground, and slower high up where the air is cold. "Mach" is named after the scientist Ernst Mach. Above Mach 1, air can\'t get out of the way in time, so it piles up into a shock wave. That shock wave is the sonic boom.',
    anim: 'mach',
    quiz: { q: 'Mach 2 means…', options: ['Half the speed of sound', 'Twice the speed of sound', '2 km/h', 'Two engines'], correct: 1, explain: 'Mach 2 = 2 × the speed of sound.' },
  },
  {
    id: 'g-force',
    level: 1,
    emoji: '🏋️',
    title: 'G-Force & the G-Suit',
    kid: 'When a jet turns hard, the pilot feels many times heavier. That\'s G-force!',
    analogy: 'Like the squish you feel on a fast swing or roller-coaster, but much stronger.',
    realIaf: 'Fighter pilots can pull 9G: they feel 9 times their weight!',
    deeper:
      'At high G, blood gets pulled towards the feet and the brain gets less. A G-suit squeezes the legs and tummy with air to keep blood up. Pilots also do a special breathing-and-tensing "G-strain". That\'s why fitness matters so much for pilots!',
    anim: 'gforce',
    quiz: { q: 'What does a G-suit do?', options: ['Keeps blood flowing to the brain', 'Makes the jet faster', 'Keeps the pilot warm', 'Helps radar'], correct: 0, explain: 'It squeezes the legs so blood stays up near the brain.' },
  },
  {
    id: 'radar',
    level: 1,
    emoji: '📡',
    title: 'Radar: Seeing Without Eyes',
    kid: 'Radar sends invisible radio waves. When they bounce off a plane, the echo shows where it is.',
    analogy: 'Like a bat: it squeaks and listens for the echo to "see" in the dark!',
    realIaf: 'The Su-30MKI\'s radar can spot aircraft long before the pilot could ever see them.',
    deeper:
      'Radar = RAdio Detection And Ranging. Measuring how long the echo takes gives distance; the echo\'s direction gives the bearing. Modern AESA radars (like on Rafale and Tejas Mk1A) steer their beam electronically, without moving, using hundreds of tiny modules.',
    anim: 'radar',
    quiz: { q: 'Radar works like…', options: ['A bat\'s echo', 'A torch', 'A magnet', 'A telescope'], correct: 0, explain: 'Send a signal, listen for the echo!' },
  },

  // ---------------- Level 2: Fighter Pilot ----------------
  {
    id: 'bvr-vs-dogfight',
    level: 2,
    emoji: '🎯',
    title: 'BVR vs Dogfight',
    kid: 'Today, most air battles start far away: "Beyond Visual Range". If they come close, it becomes a "dogfight".',
    analogy: 'BVR is like a long-distance throw in cricket. A dogfight is like a close wrestling match.',
    realIaf: 'Astra and Meteor are BVR missiles. R-73 and Python-5 are dogfight missiles.',
    deeper:
      'In BVR combat, the side that sees first and shoots first often wins, which is why radar, AWACS and long-range missiles matter so much. In a dogfight, turning ability, helmet-sights and pilot skill matter most.',
    anim: 'bvr',
    quiz: { q: 'What does BVR stand for?', options: ['Beyond Visual Range', 'Big Very Rocket', 'Before Victory Run', 'Best View Radar'], correct: 0, explain: 'Beyond Visual Range: too far to see with your eyes.' },
  },
  {
    id: 'flares-chaff',
    level: 2,
    emoji: '🎆',
    title: 'Flares & Chaff: Fooling Missiles',
    kid: 'Jets drop hot flares to fool heat-seeking missiles, and clouds of shiny chaff to confuse radar.',
    analogy: 'Like throwing a ball for a dog to chase, so it runs after the ball instead of you!',
    realIaf: 'IAF transport planes and helicopters also carry flares, to keep them safe.',
    deeper:
      'Flares burn hotter than a jet engine, so a heat-seeker may follow them instead. Chaff is millions of tiny strips of foil-coated fibre, cut to match radar wavelengths, which create a fake echo. Modern missiles try to ignore these tricks, so the contest never ends!',
    anim: 'flares',
    quiz: { q: 'What do flares fool?', options: ['Heat-seeking missiles', 'Pilots', 'Weather', 'GPS'], correct: 0, explain: 'Hot flares trick missiles that follow heat.' },
  },
  {
    id: 'stealth',
    level: 2,
    emoji: '🥷',
    title: 'Stealth: Hiding from Radar',
    kid: 'Stealth jets have special shapes and paint so radar waves bounce away instead of back.',
    analogy: 'Like a mirror tilted away: if you shine a torch at it, the light goes elsewhere, not back to you.',
    realIaf: 'India is designing AMCA, its own 5th-generation stealth fighter!',
    deeper:
      'Radar Cross Section (RCS) measures how "big" a plane looks on radar. Stealth jets hide weapons inside the body, use angled surfaces and radar-absorbing materials. A big fighter can look as small as a bird on radar.',
    anim: 'stealth',
    quiz: { q: 'What is India\'s planned stealth fighter called?', options: ['AMCA', 'Gnat', 'Hawk', 'Dakota'], correct: 0, explain: 'AMCA: Advanced Medium Combat Aircraft.' },
  },
  {
    id: 'air-refuelling',
    level: 2,
    emoji: '⛽',
    title: 'Mid-Air Refuelling',
    kid: 'A tanker plane gives fuel to fighters while flying! The fighter connects to a hose behind the tanker.',
    analogy: 'Like a petrol pump that flies alongside your car on the highway!',
    realIaf: 'IAF Il-78 tankers let fighters like the Su-30MKI fly very long missions without landing.',
    deeper:
      'The IAF mostly uses "probe-and-drogue": the tanker trails a hose with a basket (drogue); the fighter pokes its probe into it. Refuelling multiplies range and patrol time, so tankers are called "force multipliers".',
    anim: 'refuel',
    quiz: { q: 'Which IAF plane is a tanker?', options: ['Il-78', 'Tejas', 'Chinook', 'PC-7'], correct: 0, explain: 'The Il-78 is the IAF\'s flying fuel station.' },
  },
  {
    id: 'ejection',
    level: 2,
    emoji: '🪂',
    title: 'Ejection Seat',
    kid: 'In an emergency, a rocket seat shoots the pilot out of the jet and a parachute opens. Safety first!',
    analogy: 'Like a super-fast escape slide, with a parachute at the end.',
    realIaf: 'Ejection seats have saved many IAF pilots, including Wing Commander Abhinandan in 2019.',
    deeper:
      'The canopy is blown away, a rocket under the seat fires, and within seconds the seat separates and the parachute opens. "Zero-zero" seats can save a pilot even at zero height and zero speed, while parked on the runway!',
    anim: 'eject',
    quiz: { q: 'What opens after the pilot ejects?', options: ['A parachute', 'An umbrella', 'A window', 'A radar'], correct: 0, explain: 'The parachute brings the pilot gently down.' },
  },
  {
    id: 'scramble',
    level: 2,
    emoji: '🚨',
    title: 'Scramble! Quick Reaction Alert',
    kid: 'Some pilots wait near ready jets, day and night. When an alarm rings, they take off in minutes!',
    analogy: 'Like fire-fighters who slide down the pole when the bell rings.',
    realIaf: 'IAF jets stay on "QRA" (Quick Reaction Alert) at airbases to guard India\'s skies 24×7.',
    deeper:
      'When radar spots an unknown aircraft, controllers "scramble" the alert jets. They intercept, identify it, and if it\'s lost or not allowed, they guide it away or make it land. Most intercepts end peacefully!',
    anim: 'scramble',
    quiz: { q: 'What does "scramble" mean for pilots?', options: ['Take off quickly to intercept', 'Cook eggs', 'Land slowly', 'Paint the jet'], correct: 0, explain: 'Scramble = get airborne fast!' },
  },

  // ---------------- Level 3: Squadron Commander ----------------
  {
    id: 'air-superiority',
    level: 3,
    emoji: '👑',
    title: 'Air Superiority: Own the Sky',
    kid: 'The first job in any war is to control the sky. Then everyone on the ground and sea is safer.',
    analogy: 'Like controlling the middle of the chessboard: from there you can help every piece.',
    realIaf: 'In 1971, the IAF won control of the eastern sky in just a few days.',
    deeper:
      'Air superiority means the enemy\'s air force can\'t stop your operations. "Air supremacy" means they can\'t fly at all. It is won by fighters in the air, by striking enemy airfields, and by strong air defence at home.',
    anim: 'bvr',
    quiz: { q: 'Why win the sky first?', options: ['So everyone else is safer', 'For fun', 'To see the clouds', 'For air shows'], correct: 0, explain: 'Owning the sky protects the Army and Navy too.' },
  },
  {
    id: 'cas',
    level: 3,
    emoji: '🪖',
    title: 'Close Air Support',
    kid: 'Jets and attack helicopters help soldiers on the ground who are in trouble.',
    analogy: 'Like a big sibling who comes running when you call for help!',
    realIaf: 'At Longewala (1971), IAF Hunters arrived at dawn and saved the post.',
    deeper:
      'Close Air Support needs very careful teamwork, because friendly soldiers are nearby. Ground controllers guide the pilot by radio. The Apache and India\'s own LCH Prachand helicopters are built for this job.',
    anim: 'cas',
    quiz: { q: 'Which battle is a famous example of close air support?', options: ['Longewala', 'Olympics', 'IPL', 'Diwali'], correct: 0, explain: 'IAF Hunters helped at Longewala in 1971.' },
  },
  {
    id: 'awacs',
    level: 3,
    emoji: '👁️',
    title: 'Eyes in the Sky: AWACS',
    kid: 'AWACS planes carry a giant radar on their back. From high up, they see hundreds of km and guide the fighters.',
    analogy: 'Like standing on a tall tower to see the whole playground, while your friends play on the ground.',
    realIaf: 'Netra AEW&C (made in India by DRDO) and the A-50 Phalcon are the IAF\'s eyes in the sky.',
    deeper:
      'Ground radars can\'t see behind hills or past the curve of the Earth. Flying high solves this. AWACS act like a flying control tower: they spot threats early and send fighters to the right place at the right time.',
    anim: 'awacs',
    quiz: { q: 'What is India\'s home-made AEW&C called?', options: ['Netra', 'Garuda', 'Akash', 'Kiran'], correct: 0, explain: 'Netra means "eye" in Sanskrit!' },
  },
  {
    id: 'sead',
    level: 3,
    emoji: '📶',
    title: 'SEAD: Blind the Defences',
    kid: 'Before a big mission, special jets find and switch off the enemy\'s radars and missile sites.',
    analogy: 'Like turning off the lights in hide-and-seek, so the seeker can\'t see anyone!',
    realIaf: 'India\'s Rudram-1 missile follows enemy radar signals to switch them off.',
    deeper:
      'SEAD = Suppression of Enemy Air Defences. Tools include anti-radiation missiles, jamming (electronic noise) and decoys. Once the defences are blind, other aircraft can fly through more safely.',
    anim: 'sead',
    quiz: { q: 'What does SEAD aim to do?', options: ['Switch off enemy air defences', 'Plant seeds', 'Refuel jets', 'Fly air shows'], correct: 0, explain: 'SEAD blinds enemy radars and missiles.' },
  },
  {
    id: 'strike-package',
    level: 3,
    emoji: '🧩',
    title: 'The Strike Package',
    kid: 'Big missions use a team: eyes (AWACS), radar-blinders (SEAD), escorts, strikers and a tanker.',
    analogy: 'Like a cricket team: bowlers, batters, fielders and a wicket-keeper all have a job.',
    realIaf: 'The 2019 Balakot mission had Mirage strikers, Su-30MKI escorts, Netra AEW&C and tankers.',
    deeper:
      'Planning a package means choosing the right aircraft, timing (who goes first), routes (avoid radars, use mountains), fuel (tankers), and a backup plan. Try it yourself in Mission Planner!',
    anim: 'package',
    quiz: { q: 'Who gives fuel in a strike package?', options: ['The tanker', 'The escort', 'The AWACS', 'The trainer'], correct: 0, explain: 'The tanker refuels everyone so they can reach far.' },
  },

  // ---------------- Level 4: Air Marshal ----------------
  {
    id: 'ooda',
    level: 4,
    emoji: '🔁',
    title: 'The OODA Loop',
    kid: 'Observe, Orient, Decide, Act. Whoever goes round this loop faster usually wins!',
    analogy: 'Like a goalkeeper: see the ball, understand where it\'s going, decide, and dive. Fast!',
    realIaf: 'IAF pilots train in simulators so they can think and decide quickly under pressure.',
    deeper:
      'The OODA loop was described by US Air Force pilot John Boyd. Speed of decision is also one of the 15 Officer Like Qualities used in SSB selection! Modern networks and AWACS help commanders "observe" faster.',
    anim: 'ooda',
    quiz: { q: 'What does the first "O" stand for?', options: ['Observe', 'Orange', 'Open', 'Over'], correct: 0, explain: 'Observe → Orient → Decide → Act.' },
  },
  {
    id: 'force-multipliers',
    level: 4,
    emoji: '✖️',
    title: 'Force Multipliers',
    kid: 'Some aircraft don\'t fight, but they make all the others much stronger: like tankers and AWACS.',
    analogy: 'Like a coach and a water-bottle helper: they don\'t score goals, but the team plays far better.',
    realIaf: 'Il-78 tankers, Netra AEW&C and C-17 transports multiply what IAF fighters can do.',
    deeper:
      'One tanker can double how far several fighters fly. One AWACS can guide dozens of fighters. Satellites, drones and data-links are also force multipliers. Smart leaders invest in them, not only in fighters.',
    anim: 'refuel',
    quiz: { q: 'Which is a force multiplier?', options: ['Tanker aircraft', 'A sticker', 'A runway light', 'A helmet colour'], correct: 0, explain: 'Tankers multiply the range of all the fighters.' },
  },
  {
    id: 'electronic-warfare',
    level: 4,
    emoji: '⚡',
    title: 'Electronic Warfare',
    kid: 'Invisible battles happen with radio waves: jamming radars, listening to signals, and protecting your own.',
    analogy: 'Like someone shouting loudly so you can\'t hear your friend\'s whisper!',
    realIaf: 'IAF jets carry jamming pods and warning receivers that beep if a radar is watching them.',
    deeper:
      'EW has 3 parts: electronic attack (jamming, spoofing), electronic protection (resisting jamming) and electronic support (listening and locating). In modern conflicts, the side that controls the "electromagnetic spectrum" has a huge advantage.',
    anim: 'ew',
    quiz: { q: 'Jamming a radar is like…', options: ['Shouting over a whisper', 'Painting a jet', 'Turning on a light', 'Opening a door'], correct: 0, explain: 'Jamming drowns the radar in noise.' },
  },
  {
    id: 'drones',
    level: 4,
    emoji: '🛸',
    title: 'Drones & Swarms',
    kid: 'Drones are aircraft with no pilot on board. Some watch from the sky for many hours; some fly in big groups called swarms.',
    analogy: 'Like a remote-control plane, but very smart and able to fly very far.',
    realIaf: 'The IAF flies Heron drones for surveillance, and India is building its own combat drones.',
    deeper:
      'Drones are cheap compared to fighters and keep pilots safe. Future fighters may fly with "loyal wingman" drones. India\'s CATS Warrior and Ghatak projects explore this. Air defences must now stop swarms of small drones too.',
    anim: 'drones',
    quiz: { q: 'A group of drones flying together is called a…', options: ['Swarm', 'Herd', 'Team bus', 'Runway'], correct: 0, explain: 'Many drones together = a swarm.' },
  },
  {
    id: 'network-centric',
    level: 4,
    emoji: '🕸️',
    title: 'Network-Centric Warfare',
    kid: 'Radars, jets, AWACS and commanders all share one live picture by data-link, like a giant team chat.',
    analogy: 'Like a cricket team where every fielder can see the same TV replay instantly!',
    realIaf: 'India\'s IACCS (Integrated Air Command and Control System) links radars and airbases across the country.',
    deeper:
      'When everyone shares the same picture, one sensor can find a target while another aircraft fires at it. This makes the whole force faster and smarter than any single jet. It also means cyber-security is very important.',
    anim: 'network',
    quiz: { q: 'What is IACCS?', options: ['A network linking radars and bases', 'A new jet', 'A missile', 'A parachute'], correct: 0, explain: 'It joins India\'s air defence into one network.' },
  },
  {
    id: 'air-defence-shield',
    level: 4,
    emoji: '🛡️',
    title: 'The Air Defence Shield',
    kid: 'Layers of radars and surface-to-air missiles protect cities and bases from enemy aircraft and missiles.',
    analogy: 'Like a castle with many walls: if something gets past one wall, the next one stops it.',
    realIaf: 'India uses its own Akash missile and the long-range S-400 system as layers of the shield.',
    deeper:
      'Layers go from long range (hundreds of km) to medium and short range, plus guns for very close threats. "Akash" means "sky" in Hindi/Sanskrit and was developed in India by DRDO.',
    anim: 'radar',
    quiz: { q: 'Which air-defence missile was made in India?', options: ['Akash', 'Meteor', 'SCALP', 'Harpoon'], correct: 0, explain: 'Akash is India\'s own surface-to-air missile.' },
  },
  {
    id: 'jointness',
    level: 4,
    emoji: '🤝',
    title: 'Jointness: One Team',
    kid: 'The Army, Navy and Air Force win best when they plan and fight together as one team.',
    analogy: 'Like your hands, legs and eyes working together to catch a ball.',
    realIaf: 'India appointed a Chief of Defence Staff (CDS) in 2020 to help the three services work as one.',
    deeper:
      '1971 is a classic example: Air Force, Navy and Army all moved together and won in 13 days. India is now creating joint "theatre commands" so planning is shared from the start.',
    anim: 'network',
    quiz: { q: 'Jointness means…', options: ['Army, Navy and Air Force together', 'Only fighters', 'Flying alone', 'Joining a club'], correct: 0, explain: 'Three services, one team!' },
  },
];

export function getConcept(id: string): Concept | undefined {
  return CONCEPTS.find((c) => c.id === id);
}
