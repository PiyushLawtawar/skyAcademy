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
