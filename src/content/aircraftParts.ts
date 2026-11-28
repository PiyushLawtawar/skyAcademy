// Parts of a fighter jet for the 3D Hangar: tap a part to zoom in and learn
// what it is and what job it does. `view` is the preferred direction to look
// at the part from (x forward/nose, y up, z right wing).

export type PartId =
  | 'radome'
  | 'pitot'
  | 'canopy'
  | 'intake'
  | 'fuselage'
  | 'wing'
  | 'aileron'
  | 'flaps'
  | 'elevon'
  | 'canard'
  | 'tailplane'
  | 'fin'
  | 'rudder'
  | 'engine'
  | 'gear'
  | 'missile'
  | 'pylon'
  | 'droptank'
  | 'probe';

export interface PartInfo {
  id: PartId;
  name: string;
  emoji: string;
  /** What it is, in kid language. */
  what: string;
  /** Its job / role in flight. */
  role: string;
  fact: string;
  view: [number, number, number];
}

export const PARTS: Record<PartId, PartInfo> = {
  radome: {
    id: 'radome',
    name: 'Radome (nose cone)',
    emoji: '📡',
    what: 'The pointy nose cone. Inside it hides the jet\'s radar.',
    role: 'The radar sends out radio waves and listens for echoes to find other aircraft far away, even at night or in clouds.',
    fact: 'The radome is made of special material that radio waves can pass through, but metal can\'t!',
    view: [1, 0.35, 0.6],
  },
  pitot: {
    id: 'pitot',
    name: 'Pitot tube',
    emoji: '🌬️',
    what: 'The thin needle sticking out of the nose.',
    role: 'Air rushes into it as the jet flies. Measuring that air pressure tells the pilot how fast the jet is going.',
    fact: 'Pitot tubes are heated so ice can\'t block them high up where it is freezing cold.',
    view: [1, 0.2, 0.4],
  },
  canopy: {
    id: 'canopy',
    name: 'Cockpit & canopy',
    emoji: '🧑‍✈️',
    what: 'The clear glass bubble over the pilot\'s seat.',
    role: 'It protects the pilot from the wind while giving a view all around. Inside are the ejection seat, the joystick, the throttle and the HUD (Head-Up Display) that shows speed and height right in front of the pilot\'s eyes.',
    fact: 'In an emergency, the canopy is blown away and a rocket-powered ejection seat shoots the pilot out to safety!',
    view: [0.5, 0.8, 0.6],
  },
  intake: {
    id: 'intake',
    name: 'Air intake',
    emoji: '💨',
    what: 'The openings where air goes into the engine.',
    role: 'Jet engines need huge amounts of air. The intake slows the air down and feeds it smoothly to the engine, even at supersonic speeds.',
    fact: 'At full power, a fighter engine can gulp more air every second than a whole room holds!',
    view: [1, 0.1, 0.7],
  },
  fuselage: {
    id: 'fuselage',
    name: 'Fuselage',
    emoji: '🛩️',
    what: 'The main body of the jet, like its tummy.',
    role: 'It holds everything together: the cockpit, fuel tanks, engines, radar, computers and wires. Its smooth shape lets air flow past easily.',
    fact: 'Most of a fighter\'s fuel is stored inside the fuselage and wings, not in a single big tank.',
    view: [0.1, 0.4, 1],
  },
  wing: {
    id: 'wing',
    name: 'Wing',
    emoji: '🪽',
    what: 'The big flat surfaces on each side.',
    role: 'Wings make LIFT. As the jet moves forward, the wing pushes air down, and the air pushes the jet up. Wings also hold fuel and weapons.',
    fact: 'Fighter wings are swept back or shaped like a triangle (delta) so they work well at supersonic speeds.',
    view: [0, 1, 0.5],
  },
  aileron: {
    id: 'aileron',
    name: 'Ailerons',
    emoji: '🔄',
    what: 'Small hinged flaps at the back edge of the outer wings.',
    role: 'They make the jet ROLL. One aileron goes up while the other goes down, so one wing lifts more and the jet tilts.',
    fact: 'The ailerons on the two wings always move in opposite directions.',
    view: [-0.6, 0.8, 0.6],
  },
  flaps: {
    id: 'flaps',
    name: 'Flaps',
    emoji: '🛬',
    what: 'Hinged panels on the inner back edge of the wings.',
    role: 'They slide down for take-off and landing to give extra lift at slow speeds, so the jet can use a shorter runway.',
    fact: 'Flaps go back up after take-off, because at high speed they would only add drag.',
    view: [-0.6, 0.7, 0.6],
  },
  elevon: {
    id: 'elevon',
    name: 'Elevons',
    emoji: '🔀',
    what: 'Control surfaces along the back edge of a delta wing.',
    role: 'Delta-wing jets have no separate tail-plane, so elevons do two jobs: move together to pitch the nose up or down (like an elevator), or opposite to roll (like ailerons). Elevator + aileron = elevon!',
    fact: 'A fly-by-wire computer moves the elevons many times every second to keep the jet stable.',
    view: [-0.7, 0.7, 0.5],
  },
  canard: {
    id: 'canard',
    name: 'Canards',
    emoji: '🦆',
    what: 'Small extra wings in front of the main wings, near the cockpit.',
    role: 'They help control the nose and make the jet extra agile, so it can turn very tightly in a dogfight.',
    fact: '"Canard" is French for "duck". Early planes with front wings looked like ducks flying neck-first!',
    view: [0.7, 0.6, 0.7],
  },
  tailplane: {
    id: 'tailplane',
    name: 'Horizontal stabiliser',
    emoji: '⬆️',
    what: 'The small wings at the back of the jet.',
    role: 'They keep the jet steady and control PITCH, moving the nose up and down. On most fighters the whole surface moves, so it is called a "stabilator".',
    fact: 'Moving both tail surfaces in opposite directions also helps the jet roll faster.',
    view: [-0.8, 0.6, 0.6],
  },
  fin: {
    id: 'fin',
    name: 'Vertical fin',
    emoji: '🦈',
    what: 'The tall fin standing up at the back, like a shark\'s fin.',
    role: 'It stops the jet\'s tail from swinging from side to side, keeping it flying straight. The tricolour "fin flash" is painted here.',
    fact: 'Some fighters, like the Su-30MKI and MiG-29, have two fins for extra control at high angles.',
    view: [-0.5, 0.4, 1],
  },
  rudder: {
    id: 'rudder',
    name: 'Rudder',
    emoji: '↔️',
    what: 'The hinged back part of the vertical fin.',
    role: 'It turns the nose LEFT or RIGHT (called YAW). The pilot moves it with foot pedals in the cockpit.',
    fact: 'Pilots use the rudder a lot in crosswinds to keep the nose pointed down the runway.',
    view: [-0.9, 0.4, 0.8],
  },
  engine: {
    id: 'engine',
    name: 'Engine & afterburner',
    emoji: '🔥',
    what: 'The jet engine and its nozzle at the back.',
    role: 'It sucks in air, squeezes it, burns it with fuel and blasts it out of the nozzle, pushing the jet forward (THRUST). The afterburner sprays extra fuel into the exhaust for a big burst of speed.',
    fact: 'Exhaust gas leaving the nozzle with the afterburner on can be hotter than 1,500 °C!',
    view: [-1, 0.2, 0.4],
  },
  gear: {
    id: 'gear',
    name: 'Landing gear',
    emoji: '🛞',
    what: 'The legs and wheels the jet stands on.',
    role: 'They carry the jet\'s weight on the ground and absorb the bump of landing. After take-off they fold up into the body (retract) to reduce drag.',
    fact: 'Fighter tyres are pumped up to very high pressure, many times more than a car tyre!',
    view: [0.4, -0.5, 1],
  },
  missile: {
    id: 'missile',
    name: 'Missiles',
    emoji: '🚀',
    what: 'Guided weapons carried under the wings or on the wingtips.',
    role: 'Air-to-air missiles protect the sky. Each has a "seeker" eye (radar or heat), a guidance brain, a rocket motor and fins to steer. Visit the Armoury to learn each one!',
    fact: 'Long-range missiles like India\'s Astra can reach targets more than 100 km away.',
    view: [0.3, -0.3, 1],
  },
  pylon: {
    id: 'pylon',
    name: 'Pylons (hardpoints)',
    emoji: '🔩',
    what: 'Strong mounting points under the wings and body.',
    role: 'Missiles, bombs, fuel tanks and pods hang from them. Choosing what goes on each pylon is called the jet\'s "loadout".',
    fact: 'The Su-30MKI has 12 hardpoints and can carry about 8 tonnes!',
    view: [0.2, -0.6, 1],
  },
  droptank: {
    id: 'droptank',
    name: 'Drop tank',
    emoji: '⛽',
    what: 'An extra fuel tank hanging under the jet.',
    role: 'It lets the jet fly much further. When it is empty, the pilot can drop it to make the jet lighter.',
    fact: 'Fuel tanks are called "force multipliers" because range matters as much as weapons.',
    view: [0.3, -0.7, 1],
  },
  probe: {
    id: 'probe',
    name: 'Refuelling probe',
    emoji: '🔌',
    what: 'The short pipe sticking out near the cockpit.',
    role: 'In mid-air, the pilot flies this probe into a basket trailing from a tanker plane, and fuel flows in. The jet can stay in the air much longer.',
    fact: 'The pilot has to fly just a few metres behind the huge tanker, very steadily!',
    view: [0.8, 0.5, 0.8],
  },
};

/** Aircraft-specific extras shown under the general info. */
export const PART_EXTRAS: Record<string, Partial<Record<PartId, string>>> = {
  'su-30mki': {
    engine: 'Su-30MKI special: its two AL-31FP engines have thrust-vectoring nozzles that can tilt, helping it do amazing manoeuvres!',
    canard: 'Su-30MKI special: canards + thrust vectoring make it one of the most agile big fighters in the world.',
    canopy: 'Su-30MKI special: it has TWO seats. The pilot flies, and the Weapon Systems Operator behind handles radar and weapons.',
  },
  rafale: {
    canard: 'Rafale special: its canards sit very close to the wing ("close-coupled") for smooth airflow and agility.',
    probe: 'Rafale special: its refuelling probe is fixed on the right side of the nose.',
  },
  tejas: {
    wing: 'Tejas special: a "compound delta" wing made with lots of light, strong carbon-fibre composites. Designed in India!',
    elevon: 'Tejas special: Tejas has no tail-plane at all. Its elevons control both pitch and roll.',
  },
  'mirage-2000': {
    wing: 'Mirage 2000 special: a pure delta wing with no tail-plane: simple, strong and great at high speed.',
    intake: 'Mirage 2000 special: each half-moon intake has a cone in the middle (a "souris", French for mouse) that controls supersonic airflow.',
  },
  'mig-29': {
    intake: 'MiG-29 special: doors close inside the intakes on the ground, so it can operate from rough runways without swallowing stones!',
    fin: 'MiG-29 special: twin fins keep it controllable at very high angles in a dogfight.',
  },
  jaguar: {
    missile: 'Jaguar special: its dogfight missiles sit ON TOP of the wings: very rare for any jet!',
    wing: 'Jaguar special: its wing sits high on the body, leaving room underneath for bombs and tanks.',
  },
  'mig-21-bison': {
    radome: 'MiG-21 special: its air intake is in the nose, and the cone in the middle (the "shock cone") moves in and out to control supersonic airflow. The radar is inside it!',
    intake: 'MiG-21 special: the whole nose is one big round air intake.',
  },
  'hawk-mk132': {
    canopy: 'Hawk special: a two-seat trainer. The instructor sits behind the student pilot, slightly higher, to see over their head.',
  },
};
