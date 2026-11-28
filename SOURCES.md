# Sources

Tracks the provenance of every factual claim in `src/content`. A fact
is only shown to a child when its `verified` flag is `true`; add the
source here in the same change that flips it.

## Verified

Checked against a primary/official source during this change (web search,
2026-11-23). Cross-checked against at least one other independent source
where the official page didn't give every figure.

- `src/content/aircraft.ts` — `tejas`: top speed Mach 1.6, length, single-seat
  configuration — [MoD DDP product page](https://www.ddpmod.gov.in/hi/node/6843).
  Note: some enthusiast sources (ADA-attributed) cite Mach 1.8 instead; the
  official MoD figure (Mach 1.6) was used as authoritative.
- `src/content/aircraft.ts` — `c17-globemaster`: crew of 3 (two pilots +
  loadmaster), cruise speed Mach .74 — [USAF fact sheet](https://www.af.mil/About-Us/Fact-Sheets/Display/Article/1529726/c-17-globemaster-iii/).
- `src/content/aircraft.ts` — `hal-dhruv`: built by HAL, cruise speed
  ~250 km/h — [HAL ALH Mk III product page](https://www.ddpmod.gov.in/hi/node/6844) / HAL civil brochure.
- `src/content/aircraft.ts` — `netra-awacs`: DRDO-built mission system on an
  Embraer 145 airframe, near-all-round radar coverage — [DRDO Netra page](https://drdo.gov.in/node/11921).
  Crew size and top speed could not be confirmed from an official source and
  are intentionally omitted from the content rather than estimated.
- `src/content/aircraft.ts` — `mig-21-bison`: retired from IAF service in a
  ceremony at Air Force Station Chandigarh on 26 September 2025, after 62
  years — [FlightGlobal](https://www.flightglobal.com/fixed-wing/india-retires-last-mig-21-bison-fighters-after-six-decades/164687.article),
  [Tribune India](https://www.tribuneindia.com/live-blog/defence/iafs-mig-21-retires-ceremony-to-accord-farewell-to-fighter-jet-begins-at-chandigarh-air-force-station)
  (cross-corroborated by many independent outlets). Top speed Mach 2.05 is
  the widely documented MiG-21bis figure, not Bison-specific — reasonable
  confidence, not a primary Mikoyan/HAL source.

## To verify (recommended before shipping to real users)

- `src/content/aircraft.ts` — `su-30mki`: crew of 2 and canard/twin-tail
  configuration are well cross-corroborated ([Bharat Rakshak](https://www.bharat-rakshak.com/IAF/?p=1343),
  [airforce-technology](https://www.airforce-technology.com/projects/su-30mki-multirole-fighter-aircraft/)),
  but the exact top-speed figure varies by source (Mach 1.75–2.0+ depending
  on altitude/variant) — Mach 2 (at altitude) was used as a round, commonly
  cited figure. Confirm against an HAL/IAF primary source if precision matters.
- `src/content/aircraft.ts` — `rafale`: Mach 1.8 top speed and canard
  configuration are consistently reported, but no single authoritative
  primary source was checked — confirm against Dassault/IAF documentation.
- `src/content/aircraft.ts` — `pc7-mk2`: crew of 2 is solid; cruise speed
  (~450 km/h) is taken from a South African Air Force fact sheet for the
  base PC-7, not a Mk II–specific or IAF source — confirm against
  Pilatus/HAL documentation.
- `src/content/aircraft.ts` — `hawk-mk132`: Mach 0.84 top speed is from
  Bharat Rakshak (enthusiast site, not primary); crew of 2 is inferred from
  the general Hawk tandem-trainer configuration, not an IAF-specific
  source — confirm against BAE Systems/HAL documentation.
- `src/content/aircraft.ts` — `il-78-tanker`: crew of 6 is a standard
  Ilyushin/UAC spec figure; no top-speed figure met the bar for inclusion
  here (only a single weak secondary source was found, so it was left out
  rather than shown) — confirm crew figure against an Ilyushin/IAF source.
- `src/content/lessons.ts` — `hangar-hardpoints-1`: Astra is described as an
  Indian-made air-to-air missile, and BrahMos as an India–Russia joint
  venture — verify current status/name against IAF/DRDO/BrahMos Aerospace
  sources before shipping.
- `src/content/lessons.ts` — `iaf-story-arjan-singh`: that Arjan Singh is the
  only IAF officer to hold the five-star Marshal of the IAF rank — verify
  against official IAF/PIB sources.
- `src/content/lessons.ts` — `iaf-story-rakesh-sharma`: the 1984 spaceflight,
  "first Indian in space" claim, and the "Saare Jahan Se Achha" quote —
  verify against official ISRO/PIB sources.
- Remaining Stage 4 aircraft not yet added (Mirage 2000, MiG-29, Jaguar,
  C-130J, Il-76, An-32, C-295, HJT-16 Kiran, A-50 Phalcon) — IAF / HAL /
  manufacturer official sources, as that content is written.
- Any further hero storybook fact (names, ranks, years, mission names) added
  in future Stage 5/5B content.

## IAF Zones (v2): Armoury, War Room, Flight School, Mission Planner, Join the IAF

Added 2026-11-27. This content was written from widely published public
records (IAF history pages, PIB releases, DRDO/HAL/manufacturer pages, UPSC
notices) but was **not** re-checked line by line against a primary source in
the same change, unlike the "Verified" list above. Please spot-check before
putting it in front of children. Highest-value items to check:

- `src/content/weapons.ts`: each jet ↔ weapon pairing (e.g. Astra on
  Su-30MKI/Tejas, BrahMos-A on Su-30MKI only, Meteor/MICA/SCALP/HAMMER on
  Rafale, SPICE 2000 on Mirage 2000, Python-5/Derby on Tejas, Magic II on
  Jaguar over-wing pylons), hardpoint counts (Su-30MKI 12, Rafale 14,
  Tejas 8, Mirage 2000 9, MiG-29 7, Jaguar 7, MiG-21 Bison 5), gun types,
  BrahMos ~Mach 2.8 and first air-launch Nov 2017, Rudram-1 test Oct 2020,
  Su-30MKI ~8 t payload. Ranges are deliberately vague ("100+ km").
- `src/content/history.ts`: dates, names and awards in each story, notably
  27 Oct 1947 Srinagar airlift; Mehar Singh's Leh landing (May 1948, MVC);
  Goa 18–19 Dec 1961; Chushul altitude; Trevor Keelor's 3 Sep 1965 victory
  (VrC); 1971 timeline (3–16 Dec, Meghna Heli-Bridge, Tangail, Longewala,
  Governor's House strike 14 Dec, ~93,000 POWs, Sekhon PVC); Op Meghdoot
  13 Apr 1984; Op Cactus 3 Nov 1988; Kargil (Mirage LGB strikes on Tiger Hill
  and Muntho Dhalo, Ajay Ahuja VrC, Nachiketa, Gunjan Saxena); Balakot
  26 Feb 2019 and Abhinandan Varthaman's return on 1 Mar 2019 (VrC);
  Op Rahat (~20,000 airlifted), Op Ganga (18,000+ total), Op Kaveri (121
  people, Wadi Seidna night landing).
- `src/content/concepts.ts`: real-IAF examples (Netra, IACCS, Heron, CATS
  Warrior/Ghatak, AMCA, Akash, S-400, CDS appointed 2020).
- `src/content/aircraft.ts`: new entries (`mirage-2000`, `mig-29`,
  `jaguar`, `lch-prachand`, `apache`, `chinook`, `c130j`) and their
  nicknames (Vajra, Baaz, Shamsher), Prachand's 5,000 m claim (HAL), DBO
  landing 2013. No photos yet; cards fall back to the silhouette.
- `src/screens/JoinIAF.tsx`: NDA age window (16½–19½), PCM requirement for
  the flying branch, training sequence (PC-7 Mk II → Kiran → Hawk), women
  in NDA from 2022. These rules change. Check the current UPSC notice and
  https://careerindianairforce.cdac.in.
- `src/content/skyFacts.ts`: the 40 shooting-star facts.

Deliberately **not** included: Operation Sindoor (2025) and other recent,
still-contested operations. Add only with carefully sourced, neutral wording.
