import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { GoDeeper, SayBox, ZoneShell } from '../components/zone/ZoneShell';
import { useProgressStore } from '../store/progressStore';
import { soundManager } from '../lib/sound';

// Entry rules are from UPSC's NDA/AFCAT notices and the IAF careers site
// (careerindianairforce.cdac.in); they change occasionally, so parents are
// pointed to the official site in SOURCES.md before acting on them.

const NDA_MIN_AGE = 16.5;

const PATH = [
  { emoji: '🎒', title: 'School (now!)', text: 'Love maths and science, play sports, read a lot, and look after your eyes.', tag: 'You are here' },
  { emoji: '📐', title: 'Class 11–12 with Physics & Maths', text: 'To fly, you need Physics and Maths in Class 12. Join NCC Air Wing if your school has it!' },
  { emoji: '📝', title: 'NDA Entrance Exam', text: 'Written by UPSC, twice a year. You can apply between 16½ and 19½ years old.' },
  { emoji: '🧠', title: 'SSB Interview (5 days)', text: 'Tests, group games and talks that look for Officer Like Qualities. Plus a pilot aptitude test.' },
  { emoji: '🩺', title: 'Medical Check', text: 'Healthy eyes, heart and body. Pilots need especially good eyesight!' },
  { emoji: '🏛️', title: 'NDA, Khadakwasla (Pune): 3 years', text: 'Army, Navy and Air Force cadets train together: studies, sports, horse riding, drills.' },
  { emoji: '🛩️', title: 'Air Force Academy, Dundigal (Hyderabad)', text: 'Your first real flying, on the Pilatus PC-7 Mk II. Then the Kiran jet trainer.' },
  { emoji: '🎖️', title: 'Commissioned as Flying Officer!', text: 'Pilot\'s wings are pinned on your chest at the passing-out parade. A dream come true!' },
  { emoji: '⚡', title: 'Hawk Advanced Jet Trainer', text: 'Fighter pilots learn fast jet flying, formation and weapons on the Hawk.' },
  { emoji: '🦅', title: 'Fighter Squadron', text: 'Fly Su-30MKI, Rafale, Tejas… and protect India\'s skies!' },
];

const OTHER_ROUTES = [
  { emoji: '🎓', name: 'AFCAT', text: 'After graduation (college): the Air Force Common Admission Test, for flying and ground duty branches.' },
  { emoji: '🪖', name: 'CDS', text: 'Combined Defence Services exam after graduation, including the Air Force Academy.' },
  { emoji: '🎗️', name: 'NCC Special Entry', text: 'NCC Air Wing cadets with a "C" certificate get a special route into flying.' },
  { emoji: '🔧', name: 'Agniveervayu', text: 'Join as an airman after Class 12 to work on aircraft, radars and more.' },
];

const CAREERS = [
  { emoji: '🧑‍✈️', name: 'Fighter / transport / helicopter pilot' },
  { emoji: '📡', name: 'Fighter controller (guides jets by radar)' },
  { emoji: '🛠️', name: 'Aeronautical engineer' },
  { emoji: '🗼', name: 'Air traffic controller' },
  { emoji: '🌦️', name: 'Meteorologist (weather expert)' },
  { emoji: '🦅', name: 'Garud commando (special forces)' },
  { emoji: '🩺', name: 'Air Force doctor' },
  { emoji: '📦', name: 'Logistics officer' },
];

const HABITS = [
  { id: 'run', emoji: '🏃', text: 'Run, cycle or swim for 30 minutes', power: 'Stamina' },
  { id: 'eyes', emoji: '👀', text: 'Play outdoors & rest your eyes from screens', power: 'Pilot eyes' },
  { id: 'maths', emoji: '➗', text: 'Solve 5 maths puzzles', power: 'Reasoning' },
  { id: 'read', emoji: '📖', text: 'Read for 20 minutes', power: 'Power of Expression' },
  { id: 'help', emoji: '🤝', text: 'Help someone at home or school', power: 'Cooperation' },
  { id: 'tidy', emoji: '🧹', text: 'Make your bed & tidy your bag', power: 'Responsibility' },
  { id: 'brave', emoji: '🦁', text: 'Try one new thing that feels hard', power: 'Courage' },
];

export function JoinIAF() {
  const navigate = useNavigate();
  const sfx = useProgressStore((s) => s.settings.sfx);
  const cadetAge = useProgressStore((s) => s.cadetAge);
  const setCadetAge = useProgressStore((s) => s.setCadetAge);
  const [{ today, year }] = useState(() => ({ today: new Date().toISOString().slice(0, 10), year: new Date().getFullYear() }));
  const [habits, setHabits] = useState<Record<string, boolean>>(() => {
    try {
      const raw = localStorage.getItem(`sca-habits-${today}`);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  const toggleHabit = (id: string) => {
    soundManager.unlock();
    soundManager.play('starCollect', { sfxEnabled: sfx });
    setHabits((h) => {
      const next = { ...h, [id]: !h[id] };
      try {
        localStorage.setItem(`sca-habits-${today}`, JSON.stringify(next));
      } catch {
        // storage unavailable — habits just won't persist today
      }
      return next;
    });
  };

  const yearsToNda = cadetAge !== null ? Math.max(0, NDA_MIN_AGE - cadetAge) : null;
  const ndaYear = yearsToNda !== null ? year + Math.ceil(yearsToNda) : null;
  const habitsDone = HABITS.filter((h) => habits[h.id]).length;

  return (
    <ZoneShell emoji="🇮🇳" title="Join the Indian Air Force" subtitle="Your flight path from school to the cockpit">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-saffron via-white to-india-green p-[3px] shadow-xl">
        <div className="rounded-[22px] bg-white/95 p-5">
          <p className="font-display text-2xl font-extrabold text-slate-900">✨ Nabha Sparsham Deeptam</p>
          <p className="text-slate-600">"Touch the sky with glory". The IAF motto, from the Bhagavad Gita.</p>
          <p className="mt-3 text-lg text-slate-800">Any brave, hard-working girl or boy can become an Air Force officer. Let's see when <b>you</b> can start!</p>
        </div>
      </div>

      {/* Age countdown */}
      <section className="hud-panel rounded-3xl p-5 text-white">
        <h2 className="font-display text-xl font-extrabold">🎂 How old are you, cadet?</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {[6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((a) => (
            <button
              key={a}
              onClick={() => (soundManager.unlock(), soundManager.play('tap', { sfxEnabled: sfx }), setCadetAge(a))}
              className={`h-14 w-14 rounded-2xl font-display text-xl font-extrabold ${cadetAge === a ? 'bg-saffron text-white' : 'bg-white/15 text-white'}`}
            >
              {a}
            </button>
          ))}
        </div>
        {yearsToNda !== null && (
          <motion.div key={cadetAge} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-5 grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center">
            <div className="flex flex-col items-center rounded-3xl bg-white/10 px-6 py-4">
              <motion.p className="font-display text-6xl font-black text-amber-300" initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                {Math.ceil(yearsToNda)}
              </motion.p>
              <p className="text-sm font-bold">years to go</p>
            </div>
            <div>
              <p className="text-lg">
                In about <b className="text-amber-300">{ndaYear}</b>, you can apply for the <b>NDA</b> exam! 🚀
              </p>
              <p className="mt-1 text-slate-300">That's {Math.ceil(yearsToNda) * 365} days to get fit, smart and brave. Every day counts. Start with today's habits below!</p>
              <div className="relative mt-4 h-3 rounded-full bg-white/15">
                <motion.div className="h-3 rounded-full bg-gradient-to-r from-saffron to-amber-300" initial={{ width: 0 }} animate={{ width: `${Math.min(100, ((cadetAge ?? 0) / NDA_MIN_AGE) * 100)}%` }} transition={{ duration: 1.2 }} />
                <motion.span className="absolute -top-4 text-2xl" initial={{ left: 0 }} animate={{ left: `calc(${Math.min(100, ((cadetAge ?? 0) / NDA_MIN_AGE) * 100)}% - 16px)` }} transition={{ duration: 1.2 }}>
                  ✈️
                </motion.span>
              </div>
            </div>
          </motion.div>
        )}
      </section>

      {/* Flight path */}
      <section className="flex flex-col gap-3">
        <h2 className="inline-block self-start rounded-2xl bg-white/90 px-4 py-2 font-display text-2xl font-extrabold text-slate-900">🗺️ Your flight path</h2>
        <div className="relative pl-8">
          <div className="absolute bottom-6 left-[27px] top-6 w-1 rounded-full bg-gradient-to-b from-sky-400 via-saffron to-india-green" />
          {PATH.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: 0.05 }}
              className="relative mb-3 ml-4 rounded-3xl bg-white/95 p-4 shadow-md"
            >
              <span className="absolute -left-[46px] top-4 flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-slate-900 text-2xl shadow">{p.emoji}</span>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Step {i + 1}</p>
              <p className="font-display text-lg font-bold text-slate-900">
                {p.title} {p.tag && <span className="ml-1 rounded-full bg-saffron px-2 py-0.5 text-xs text-white">{p.tag}</span>}
              </p>
              <p className="text-slate-700">{p.text}</p>
            </motion.div>
          ))}
        </div>
        <GoDeeper
          label="👧 Girls in the IAF"
          text="Women have flown IAF fighter jets since 2016, when Avani Chaturvedi, Bhawana Kanth and Mohana Singh became India's first women fighter pilots. Since 2022, girls can also join the NDA straight after school. Shivangi Singh flies the Rafale. The sky is for everyone!"
        />
        <GoDeeper
          label="🧭 Other ways to join"
          text={OTHER_ROUTES.map((r) => `${r.emoji} ${r.name}: ${r.text}`).join('  ')}
        />
      </section>

      {/* Habits */}
      <section className="glass rounded-3xl p-5 shadow-lg">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-xl font-extrabold text-slate-900">💪 Train like a cadet: today's checklist</h2>
          <span className="rounded-full bg-emerald-100 px-3 py-1 font-display font-bold text-emerald-800">
            {habitsDone}/{HABITS.length}
          </span>
        </div>
        <p className="text-sm text-slate-600">Do these in real life, then tick them. Ask a grown-up to check!</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {HABITS.map((h) => (
            <motion.button
              key={h.id}
              whileTap={{ scale: 0.96 }}
              onClick={() => toggleHabit(h.id)}
              aria-pressed={!!habits[h.id]}
              className={`flex min-h-16 items-center gap-3 rounded-2xl border-2 px-4 text-left ${habits[h.id] ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 bg-white'}`}
            >
              <span className="text-3xl">{habits[h.id] ? '✅' : h.emoji}</span>
              <span>
                <span className="block font-semibold text-slate-900">{h.text}</span>
                <span className="text-xs font-bold text-indigo-600">Builds: {h.power}</span>
              </span>
            </motion.button>
          ))}
        </div>
        {habitsDone === HABITS.length && <p className="mt-3 text-center font-display text-xl font-extrabold text-emerald-700">🏅 Full checklist! That's officer material!</p>}
      </section>

      {/* Careers */}
      <section className="hud-panel rounded-3xl p-5 text-white">
        <h2 className="font-display text-xl font-extrabold">🧑‍🚀 Not only pilots! Jobs in the IAF</h2>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {CAREERS.map((c) => (
            <div key={c.name} className="rounded-2xl bg-white/10 p-3 text-center">
              <p className="text-3xl">{c.emoji}</p>
              <p className="text-sm font-semibold">{c.name}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-sm text-slate-300">
          🚀 Some IAF test pilots even become astronauts, like Rakesh Sharma (1984) and Group Captain Shubhanshu Shukla, who flew to the International Space Station in 2025!
        </p>
      </section>

      <SayBox text="The SSB looks for 15 Officer Like Qualities, like courage, cooperation and quick decisions. You can start building them today!" />
      <button onClick={() => navigate('/war-room')} className="glass rounded-3xl p-4 text-left font-display font-bold text-slate-900 shadow">
        🎖️ Meet the heroes who walked this path, in the War Room →
      </button>
    </ZoneShell>
  );
}
