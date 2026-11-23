# Sky Cadet Academy ✈️

A playful web app where children learn about the Indian Air Force, how
aircraft fly, fighter-jet concepts, India's aircraft, and Officer Like
Qualities — through story, play and small daily missions.

This repo is a working slice of the full curriculum, not the finished
product (see **Build plan** below for what's done vs. pending): call-sign
picker, avatar builder, the animated World Map, Veer the mascot, a
synthesised sound manager, read-aloud, settings (incl. English/Hindi), a
gated Parent Corner, a Zustand+`persist` progress store, a full
Learn → Explore → Play → Check lesson engine, three real Hangar/IAF Story
lessons, and a 10-aircraft collectible gallery (Stage 4) with a
"Spot the Shape" unlock game and a Compare mode.

## Stack

React + TypeScript + Vite, Tailwind CSS v4, Framer Motion, Zustand
(`persist` middleware), React Router (`HashRouter`, so it works as a
static export with no server-side routing). All art is inline SVG, all
sound is synthesised at runtime via the Web Audio API — no external
image or audio assets.

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
npm run build      # production build to dist/
npm run test       # vitest
```

## Deploy (Vercel)

The app is a static build with no backend, so it deploys as a static
site. One-time setup, then every push to the connected branch redeploys
automatically:

```bash
npx vercel          # first run: links/creates the Vercel project, deploys a preview
npx vercel --prod   # promotes to the production URL
```

Or without the CLI: push this repo to GitHub, then **Import Project** at
[vercel.com/new](https://vercel.com/new) and pick the repo — Vercel
auto-detects the Vite framework preset (build command `npm run build`,
output directory `dist`), no extra config needed.

## Project layout

```
src/
  content/     # data-driven stages, lessons, aircraft, ranks, call signs,
                 badges, OLQs, glossary, types (new content slots in here
                 without touching code)
  store/       # progressStore.ts — the single source of truth, persisted
  lib/         # sound.ts (Web Audio synth SFX), readAloud.ts (Web Speech),
                 scoring.ts (star calculation)
  components/  # VeerMascot, BigButton, HintButton, StarBurst, SkyBackground,
                 StoryPlayer, QuizEngine, WingsCeremony, AircraftCard,
                 SilhouetteGame, diagrams/ (SimplePlaneDiagram,
                 AircraftSilhouette, HardpointDiagram), explore/, play/
  screens/     # CallSignPicker, AvatarBuilder, WorldMap, StageIsland,
                 Lesson, AircraftGallery, AircraftDetail, AircraftCompare,
                 Settings, ParentCorner
  i18n/        # English/Hindi UI strings (content strings live with content)
```

## Progress & saving

All play progress — call sign, avatar, lesson stars, unlocked
stages/lessons, badges, collected cards, fact journal, daily streak,
and settings — lives in one Zustand store (`src/store/progressStore.ts`)
backed by `localStorage`, so a child's progress survives closing the
tab or reloading the page on the same device. If storage is unavailable
(private browsing, quota, disabled cookies) the app falls back to an
in-memory store rather than crashing — progress just won't persist
between visits in that case.

Parents can back up or move progress between devices from **Parent
Corner → Export/Import progress**, which reads/writes a plain JSON
file. There is no account system and no server — nothing leaves the
device.

## Build plan (phases)

1. ✅ **Foundation** — shell, theme, mascot, avatar/call-sign, sound,
   read-aloud, settings, progress store, Parent Corner gate.
2. ✅ **Engine** — Learn → Explore → Play → Check lesson flow (with
   per-lesson step skipping), QuizEngine (multiple-choice/true-false),
   tiered hints, stars, rank-ups, Wings Ceremony.
3. 🚧 **Stage 1: The Hangar** — two lessons live (plane parts; hardpoints,
   drop tanks & missiles). Build-a-Plane and the full parts list from the
   brief are still pending.
4. ⬜ **Stage 2–3** — Sky Lab (how planes fly) and Fighter Academy.
5. 🚧 **Stage 4–5C**:
   - Stage 4 (India's Hangar of Fame): ✅ 10 aircraft with verified specs,
     collectible flip cards, "Spot the Shape" unlock game, detail pages,
     Compare mode. Remaining aircraft (Mirage 2000, MiG-29, Jaguar,
     C-130J, Il-76, An-32, C-295, HJT-16 Kiran, A-50 Phalcon) still to add.
   - Stage 5 (IAF Story): ✅ two hero lessons live (Marshal Arjan Singh,
     Rakesh Sharma), linked to real Officer Like Qualities.
   - Women of the IAF / Mission Control: ⬜ not started.
6. ⬜ **Stage 6** — Officer Training Ground (the 15 OLQs are already
   modelled as data in `src/content/olq.ts`; the game stage itself is
   pending) and Daily Missions.
7. ⬜ **Stage 7** — Wings Exam, certificate, fact journal, full Hindi
   translation pass, PWA, accessibility pass.

## Content accuracy

Every aircraft spec, date and historical fact is checked against a
source before it ships (`verified: true` in `src/content`) — see
`SOURCES.md` for what's been verified, against what source, and what
still needs a human double-check before this goes in front of real
users. Unverified facts are never shown to children.

## Credits

All sound effects are synthesised at runtime (see `CREDITS.md`) — no
licensed or copyrighted audio/image assets are used anywhere in the app.
