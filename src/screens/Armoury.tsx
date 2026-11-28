import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { GUIDANCE_INFO, KIND_INFO, LOADOUTS, getWeapon, type Weapon } from '../content/weapons';
import { PYLON_POOL, PylonStore, TopJet, assignPylons, storeColor } from '../components/art/JetArt';
import { GoDeeper, SayBox, Sheet, ZoneShell } from '../components/zone/ZoneShell';
import { useProgressStore } from '../store/progressStore';
import { soundManager } from '../lib/sound';

export function Armoury() {
  const navigate = useNavigate();
  const sfx = useProgressStore((s) => s.settings.sfx);
  const explored = useProgressStore((s) => s.exploredIds);
  const markExplored = useProgressStore((s) => s.markExplored);
  const [jetIndex, setJetIndex] = useState(0);
  const [loaded, setLoaded] = useState<string[]>([]);
  const [detail, setDetail] = useState<Weapon | null>(null);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const jet = LOADOUTS[jetIndex];
  const pylons = PYLON_POOL.slice(0, jet.hardpoints);
  const gun = getWeapon(jet.gunId)!;
  const weapons = useMemo(() => jet.weaponIds.map((id) => getWeapon(id)!).filter(Boolean), [jet]);
  const slots = assignPylons(
    loaded.map((id) => getWeapon(id)?.kind ?? 'fuel'),
    jet.hardpoints,
  );
  const storeAt = (pylon: number) => {
    const i = slots.indexOf(pylon);
    return i === -1 ? null : { id: loaded[i], order: i };
  };
  const exploredWeapons = explored.filter((id) => id.startsWith('weapon:')).length;

  const selectJet = (i: number) => {
    soundManager.unlock();
    soundManager.play('jetFlyPast', { sfxEnabled: sfx });
    setJetIndex(i);
    setLoaded([]);
    setActivePreset(null);
  };

  const load = (id: string) => {
    soundManager.unlock();
    if (loaded.length >= jet.hardpoints) {
      soundManager.play('almost', { sfxEnabled: sfx });
      return;
    }
    soundManager.play('cockpitBeep', { sfxEnabled: sfx });
    setLoaded((l) => [...l, id]);
    setActivePreset(null);
  };

  const applyPreset = (name: string, items: string[]) => {
    soundManager.unlock();
    soundManager.play('engineStartup', { sfxEnabled: sfx });
    setLoaded(items.slice(0, jet.hardpoints));
    setActivePreset(name);
  };

  const openDetail = (w: Weapon) => {
    soundManager.unlock();
    soundManager.play('radarPing', { sfxEnabled: sfx });
    markExplored(`weapon:${w.id}`);
    setDetail(w);
  };

  return (
    <ZoneShell
      emoji="🚀"
      title="The Armoury"
      subtitle="Load a fighter jet like a real armament crew!"
      wide
      right={
        <span className="rounded-full bg-white/90 px-4 py-2 font-display font-bold text-slate-700 shadow">
          🔍 {exploredWeapons}/{new Set(LOADOUTS.flatMap((l) => [...l.weaponIds, l.gunId])).size} weapons studied
        </span>
      }
    >
      {/* Jet picker */}
      <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2">
        {LOADOUTS.map((l, i) => (
          <button
            key={l.aircraftId}
            onClick={() => selectJet(i)}
            className={`flex min-h-14 shrink-0 items-center gap-2 rounded-2xl px-4 font-display font-bold shadow transition ${
              i === jetIndex ? 'scale-105 bg-saffron text-white' : 'bg-white/90 text-slate-700'
            }`}
          >
            <span className="text-2xl">{l.emoji}</span>
            {l.name}
          </button>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr]">
        {/* Jet on the armament bay */}
        <div className="hud-panel relative overflow-hidden rounded-3xl p-4 text-white">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-display text-2xl font-extrabold">{jet.name}</h2>
            <button onClick={() => navigate(`/hangar-3d/${jet.aircraftId}`)} className="hud-text text-sm font-bold underline">
              🛩️ See it in 3D →
            </button>
          </div>
          <p className="text-slate-200">{jet.role}</p>

          <div className="relative mx-auto mt-2 aspect-square w-full max-w-[440px]">
            {/* grid floor */}
            <svg className="absolute inset-0 h-full w-full opacity-30" viewBox="0 0 100 100" aria-hidden>
              {Array.from({ length: 11 }, (_, i) => (
                <g key={i}>
                  <line x1={i * 10} y1="0" x2={i * 10} y2="100" stroke="#6ee7b7" strokeWidth="0.2" />
                  <line x1="0" y1={i * 10} x2="100" y2={i * 10} stroke="#6ee7b7" strokeWidth="0.2" />
                </g>
              ))}
            </svg>
            <AnimatePresence mode="wait">
              <motion.div
                key={jet.aircraftId}
                className="absolute inset-0"
                initial={{ y: 80, opacity: 0, scale: 0.8 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: -120, opacity: 0 }}
                transition={{ type: 'spring', damping: 18 }}
              >
                <TopJet shape={jet.shape} color={jet.color}>
                  {pylons.map((p, i) => {
                    const store = storeAt(i);
                    return (
                      <g key={i}>
                        <circle cx={p.x} cy={p.y} r={6} fill="none" stroke="#6ee7b7" strokeWidth={2} strokeDasharray="3 3" className="anim-dash" />
                        <AnimatePresence>
                          {store && (
                            <motion.g
                              key={`${i}-${store.id}`}
                              initial={{ y: 60, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ type: 'spring', damping: 14, delay: activePreset ? store.order * 0.08 : 0 }}
                            >
                              <PylonStore x={p.x} y={p.y} kind={getWeapon(store.id)?.kind ?? 'fuel'} />
                            </motion.g>
                          )}
                        </AnimatePresence>
                      </g>
                    );
                  })}
                </TopJet>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
            <span className="rounded-full bg-white/10 px-3 py-1 font-bold">🔩 Hardpoints: {jet.hardpoints}</span>
            <span className="rounded-full bg-white/10 px-3 py-1 font-bold">
              📦 Loaded: {loaded.length}/{jet.hardpoints}
            </span>
            <button onClick={() => openDetail(gun)} className="rounded-full bg-white/10 px-3 py-1 font-bold underline">
              💥 Gun: {gun.name}
            </button>
            {loaded.length > 0 && (
              <button onClick={() => (setLoaded([]), setActivePreset(null))} className="ml-auto rounded-full bg-rose-500/80 px-4 py-2 font-bold">
                Unload all
              </button>
            )}
          </div>
          <p className="mt-3 rounded-2xl bg-white/10 p-3 text-sm text-emerald-100">💡 {jet.note}</p>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-4">
          <div className="glass rounded-3xl p-4 shadow">
            <h3 className="font-display text-lg font-extrabold text-slate-900">🎖️ Pick a mission. The crew loads the jet!</h3>
            <div className="mt-3 grid gap-2">
              {jet.presets.map((p) => (
                <button
                  key={p.name}
                  onClick={() => applyPreset(p.name, p.items)}
                  className={`flex min-h-14 items-center gap-3 rounded-2xl border-2 px-4 py-2 text-left transition ${
                    activePreset === p.name ? 'border-saffron bg-orange-50' : 'border-slate-200 bg-white'
                  }`}
                >
                  <span className="text-3xl">{p.emoji}</span>
                  <span>
                    <span className="block font-display font-bold text-slate-900">{p.name}</span>
                    <span className="block text-sm text-slate-600">{p.mission}</span>
                  </span>
                </button>
              ))}
            </div>
            {activePreset && (
              <p className="mt-3 rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-800">
                ✅ Different missions need different weapons. Choosing them is called a <b>loadout</b>!
              </p>
            )}
          </div>

          <div className="glass rounded-3xl p-4 shadow">
            <h3 className="font-display text-lg font-extrabold text-slate-900">🧰 Or load it yourself</h3>
            <p className="text-sm text-slate-600">Tap ➕ to load. Tap the name to learn about it.</p>
            <div className="mt-3 grid gap-2">
              {weapons.map((w) => (
                <div key={w.id} className="flex items-center gap-2 rounded-2xl bg-white p-2 shadow-sm">
                  <span className="h-10 w-2 shrink-0 rounded-full" style={{ background: storeColor(w.kind) }} />
                  <button onClick={() => openDetail(w)} className="min-h-12 flex-1 text-left">
                    <span className="block font-display font-bold text-slate-900">
                      {w.name} {w.madeInIndia && <span className="ml-1 rounded-full bg-orange-100 px-2 text-xs text-orange-700">Made in India</span>}
                      {explored.includes(`weapon:${w.id}`) && <span className="ml-1 text-xs">✔️</span>}
                    </span>
                    <span className="block text-xs text-slate-500">
                      {KIND_INFO[w.kind].emoji} {KIND_INFO[w.kind].label} · {w.flag}
                    </span>
                  </button>
                  <button
                    aria-label={`Load ${w.name}`}
                    onClick={() => load(w.id)}
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-saffron text-2xl font-bold text-white active:scale-90"
                  >
                    ➕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <MissileSchool />

      <Sheet open={!!detail} onClose={() => setDetail(null)}>
        {detail && <WeaponDetail weapon={detail} />}
      </Sheet>
    </ZoneShell>
  );
}

function WeaponDetail({ weapon }: { weapon: Weapon }) {
  const kind = KIND_INFO[weapon.kind];
  const carriedBy = LOADOUTS.filter((l) => l.weaponIds.includes(weapon.id) || l.gunId === weapon.id).map((l) => l.name);
  return (
    <div className="flex flex-col gap-4 pr-2">
      <div>
        <p className="text-sm font-bold uppercase tracking-wide" style={{ color: storeColor(weapon.kind) }}>
          {kind.emoji} {kind.label}
        </p>
        <h2 className="font-display text-3xl font-extrabold text-slate-900">
          {weapon.name} <span className="text-2xl">{weapon.flag}</span>
        </h2>
        <p className="text-slate-500">Made by: {weapon.origin}</p>
      </div>

      {weapon.kind !== 'gun' && weapon.kind !== 'fuel' && <MissileCutaway kind={weapon.kind} />}

      <SayBox text={weapon.kid} />
      <div className="rounded-2xl bg-gradient-to-r from-amber-100 to-orange-100 p-4">
        <p className="font-display font-bold text-orange-900">🤩 Wow fact</p>
        <p className="text-slate-800">{weapon.wow}</p>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {weapon.guidance.map((g) => (
          <div key={g} className="rounded-2xl bg-slate-50 p-3">
            <p className="font-display font-bold text-slate-900">
              {GUIDANCE_INFO[g].emoji} How it finds the way: {GUIDANCE_INFO[g].label}
            </p>
            <p className="text-sm text-slate-600">{GUIDANCE_INFO[g].kid}</p>
          </div>
        ))}
        {weapon.speed && (
          <div className="rounded-2xl bg-slate-50 p-3">
            <p className="font-display font-bold text-slate-900">⚡ Speed</p>
            <p className="text-sm text-slate-600">{weapon.speed}</p>
          </div>
        )}
        {weapon.range && (
          <div className="rounded-2xl bg-slate-50 p-3">
            <p className="font-display font-bold text-slate-900">📏 Range</p>
            <p className="text-sm text-slate-600">{weapon.range}</p>
          </div>
        )}
      </div>

      {carriedBy.length > 0 && (
        <p className="text-sm text-slate-600">
          ✈️ <b>Carried by:</b> {carriedBy.join(', ')}
        </p>
      )}
      <GoDeeper text={weapon.deeper} />
    </div>
  );
}

/** Labelled side view of a missile: what's inside, front to back. */
function MissileCutaway({ kind }: { kind: string }) {
  const c = storeColor(kind);
  const parts = [
    { x: 70, label: 'Seeker (its "eye")' },
    { x: 120, label: 'Brain (guidance)' },
    { x: 200, label: 'Payload' },
    { x: 300, label: 'Motor (rocket or ramjet)' },
    { x: 385, label: 'Fins (steering)' },
  ];
  return (
    <div className="overflow-hidden rounded-2xl bg-slate-900 p-3">
      <svg viewBox="0 0 440 130" className="w-full">
        <motion.g initial={{ x: -60 }} animate={{ x: 0 }} transition={{ type: 'spring', damping: 12 }}>
          <path d="M10 60 Q20 42 52 42 L400 42 L400 78 L52 78 Q20 78 10 60 Z" fill={c} />
          <path d="M10 60 Q20 42 52 42 L60 42 L60 78 L52 78 Q20 78 10 60 Z" fill="#e2e8f0" />
          {[90, 160, 250, 360].map((x) => (
            <line key={x} x1={x} y1="42" x2={x} y2="78" stroke="#0f172a" strokeOpacity="0.35" strokeWidth="2" />
          ))}
          <path d="M370 42 L410 14 L420 42 Z M370 78 L410 106 L420 78 Z" fill="#334155" />
          <path d="M150 42 L170 28 L190 42 Z M150 78 L170 92 L190 78 Z" fill="#334155" />
          <path d="M400 50 L430 60 L400 70 Z" fill="#fbbf24" className="anim-flame" style={{ transformOrigin: '400px 60px' }} />
        </motion.g>
        {parts.map((p, i) => (
          <motion.g key={p.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 + i * 0.15 }}>
            <line x1={p.x} y1={i % 2 ? 84 : 36} x2={p.x} y2={i % 2 ? 108 : 14} stroke="#6ee7b7" strokeWidth="1.5" />
            <text x={p.x} y={i % 2 ? 122 : 10} fill="#6ee7b7" fontSize="12" fontWeight="700" textAnchor="middle">
              {p.label}
            </text>
          </motion.g>
        ))}
      </svg>
    </div>
  );
}

function MissileSchool() {
  return (
    <section className="hud-panel rounded-3xl p-5 text-white">
      <h2 className="font-display text-2xl font-extrabold">🎓 Missile School: how does a missile find its way?</h2>
      <p className="mt-1 text-slate-300">Every missile has an "eye" called a seeker. Here are the main kinds:</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {(['radar', 'heat', 'laser', 'gps', 'radar-signal', 'camera'] as const).map((g, i) => (
          <motion.div
            key={g}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl bg-white/10 p-4"
          >
            <p className="text-3xl">{GUIDANCE_INFO[g].emoji}</p>
            <p className="font-display text-lg font-bold">{GUIDANCE_INFO[g].label}</p>
            <p className="text-sm text-slate-200">{GUIDANCE_INFO[g].kid}</p>
          </motion.div>
        ))}
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-sky-500/20 p-4">
          <p className="font-display font-bold">🎯 BVR = Beyond Visual Range</p>
          <p className="text-sm text-slate-200">Missiles like Astra and Meteor hit targets so far away the pilot can't see them. Radar sees for the pilot.</p>
        </div>
        <div className="rounded-2xl bg-teal-500/20 p-4">
          <p className="font-display font-bold">🔥 WVR = Within Visual Range</p>
          <p className="text-sm text-slate-200">Close-up "dogfight" missiles like R-73 and Python-5 chase the heat of engines.</p>
        </div>
      </div>
    </section>
  );
}
