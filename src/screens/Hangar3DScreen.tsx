import { useNavigate, useParams } from 'react-router-dom';
import { Hangar3D } from '../components/hangar3d/Hangar3D';
import { FIGHTER_SPECS } from '../components/hangar3d/fighterSpecs';
import { getAircraft } from '../content/aircraft';
import { ZoneShell } from '../components/zone/ZoneShell';
import { soundManager } from '../lib/sound';
import { useProgressStore } from '../store/progressStore';

const IDS = Object.keys(FIGHTER_SPECS);

/** Big interactive 3D model of each IAF fighter: spin it, tap parts to zoom in. */
export function Hangar3DScreen() {
  const navigate = useNavigate();
  const { aircraftId } = useParams<{ aircraftId?: string }>();
  const sfx = useProgressStore((s) => s.settings.sfx);
  const id = aircraftId && FIGHTER_SPECS[aircraftId] ? aircraftId : 'su-30mki';
  const photo = getAircraft(id)?.photo;

  return (
    <ZoneShell emoji="🛩️" title="3D Hangar" subtitle="Spin a real IAF jet. Tap any part to zoom in and learn its job!" wide>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {IDS.map((a) => (
          <button
            key={a}
            onClick={() => {
              soundManager.unlock();
              soundManager.play('jetFlyPast', { sfxEnabled: sfx });
              navigate(`/hangar-3d/${a}`, { replace: true });
            }}
            className={`flex min-h-14 shrink-0 items-center gap-2 rounded-2xl px-3 pr-4 font-display font-bold shadow transition ${
              a === id ? 'scale-105 bg-saffron text-white' : 'bg-white/90 text-slate-700'
            }`}
          >
            {getAircraft(a)?.photo && <img src={getAircraft(a)!.photo!.src} alt="" className="h-9 w-14 rounded-lg object-cover" />}
            {FIGHTER_SPECS[a].name}
          </button>
        ))}
      </div>

      <Hangar3D key={id} aircraftId={id} height={typeof window !== 'undefined' && window.innerWidth < 640 ? 430 : Math.max(460, Math.min(660, window.innerHeight * 0.68))} />

      {photo && (
        <div className="glass flex flex-col gap-3 overflow-hidden rounded-3xl p-3 shadow sm:flex-row sm:items-center">
          <img src={photo.src} alt={`${FIGHTER_SPECS[id].name} of the Indian Air Force`} className="h-40 w-full rounded-2xl object-cover sm:w-72" />
          <div className="px-1">
            <p className="font-display text-lg font-extrabold text-slate-900">📷 The real {FIGHTER_SPECS[id].name}</p>
            <p className="text-sm text-slate-600">
              Compare the 3D model with this real photo. Can you spot the same parts?
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Photo: {photo.credit} ({photo.license})
            </p>
            <button onClick={() => navigate('/armoury')} className="mt-2 text-sm font-bold text-indigo-700 underline">
              See its weapons in the Armoury →
            </button>
          </div>
        </div>
      )}
    </ZoneShell>
  );
}
