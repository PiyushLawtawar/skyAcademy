import { Suspense, lazy } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { hasModel } from '../components/hangar3d/fighterSpecs';
import { getAircraft } from '../content/aircraft';
import { useProgressStore } from '../store/progressStore';
import { pick } from '../i18n';
import { STRINGS } from '../i18n/strings';
import { AircraftSilhouette } from '../components/diagrams/AircraftSilhouette';
import { ReadAloudButton } from '../components/ReadAloudButton';
import { ScreenHeading } from '../components/ScreenHeading';
import { BigButton } from '../components/BigButton';

const Hangar3D = lazy(() => import('../components/hangar3d/Hangar3D').then((m) => ({ default: m.Hangar3D })));

const ROLE_LABEL: Record<string, { en: string; hi: string }> = {
  fighter: { en: 'Fighter', hi: 'फाइटर' },
  transport: { en: 'Transport', hi: 'परिवहन' },
  helicopter: { en: 'Helicopter', hi: 'हेलीकॉप्टर' },
  trainer: { en: 'Trainer', hi: 'ट्रेनर' },
  awacs: { en: 'Eyes in the Sky', hi: 'आसमान की आँखें' },
  tanker: { en: 'Tanker', hi: 'टैंकर' },
};

export function AircraftDetail() {
  const navigate = useNavigate();
  const { stageId, aircraftId } = useParams<{ stageId: string; aircraftId: string }>();
  const language = useProgressStore((s) => s.settings.language);
  const cardIds = useProgressStore((s) => s.cardIds);
  const aircraft = aircraftId ? getAircraft(aircraftId) : undefined;

  if (!aircraft || !cardIds.includes(aircraft.id)) {
    return (
      <div className="mx-auto max-w-xl px-4 py-10 text-center">
        <p>{language === 'hi' ? 'यह कार्ड अभी अनलॉक नहीं हुआ है।' : 'This card is not unlocked yet.'}</p>
        <BigButton onClick={() => navigate(`/stage/${stageId}`)}>{pick(STRINGS.back, language)}</BigButton>
      </div>
    );
  }

  const speedLabel = aircraft.role === 'fighter' ? (language === 'hi' ? 'अधिकतम गति' : 'Top speed') : language === 'hi' ? 'सामान्य गति' : 'Cruise speed';

  return (
    <div className={`mx-auto flex flex-col items-center gap-5 px-4 py-8 text-center ${hasModel(aircraft.id) ? 'max-w-4xl' : 'max-w-xl'}`}>
      <button
        onClick={() => navigate(`/stage/${stageId}`)}
        className="self-start rounded-full bg-white/80 px-4 py-2 font-display font-semibold text-slate-700"
      >
        ← {pick(STRINGS.back, language)}
      </button>

      {aircraft.photo ? (
        <div className="w-full">
          <img
            src={aircraft.photo.src}
            alt={pick(aircraft.name, language)}
            className="h-56 w-full rounded-3xl object-cover shadow-md"
          />
          <p className="mt-1 text-right text-xs text-slate-500">
            📷 {aircraft.photo.credit} ({aircraft.photo.license})
          </p>
        </div>
      ) : (
        <AircraftSilhouette spec={aircraft.silhouette} size={240} />
      )}
      <ScreenHeading>{pick(aircraft.name, language)}</ScreenHeading>

      {hasModel(aircraft.id) && (
        <div className="w-full text-left">
          <Suspense fallback={<div className="flex h-[480px] items-center justify-center rounded-3xl bg-slate-900 font-display text-white">🛩️ Rolling the jet out of the hangar…</div>}>
            <Hangar3D aircraftId={aircraft.id} height={500} />
          </Suspense>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="rounded-full bg-white/90 px-4 py-2 font-display text-sm font-semibold text-slate-700">
          {pick(ROLE_LABEL[aircraft.role] ?? { en: aircraft.role, hi: aircraft.role }, language)}
        </span>
        {aircraft.madeInIndia && (
          <span className="rounded-full bg-india-green/10 px-4 py-2 font-display text-sm font-semibold text-india-green">
            🇮🇳 {language === 'hi' ? 'मेड इन इंडिया' : 'Made in India'}
          </span>
        )}
        {aircraft.retired && (
          <span className="rounded-full bg-slate-200 px-4 py-2 font-display text-sm font-semibold text-slate-600">
            {language === 'hi' ? 'रिटायर्ड लीजेंड' : 'Retired Legend'}
          </span>
        )}
      </div>

      <div className="grid w-full grid-cols-2 gap-3 text-left">
        <div className="rounded-2xl bg-white/90 px-4 py-3">
          <p className="text-xs font-semibold text-slate-500">{language === 'hi' ? 'निर्माता' : 'Maker'}</p>
          <p className="font-display font-semibold text-slate-900">{pick(aircraft.maker, language)}</p>
        </div>
        {aircraft.crew !== undefined && (
          <div className="rounded-2xl bg-white/90 px-4 py-3">
            <p className="text-xs font-semibold text-slate-500">{language === 'hi' ? 'चालक दल' : 'Crew'}</p>
            <p className="font-display font-semibold text-slate-900">{aircraft.crew}</p>
          </div>
        )}
        {(aircraft.topSpeedMach !== undefined || aircraft.topSpeedKmh !== undefined) && (
          <div className="col-span-2 rounded-2xl bg-white/90 px-4 py-3">
            <p className="text-xs font-semibold text-slate-500">{speedLabel}</p>
            <p className="font-display font-semibold text-slate-900">
              {aircraft.topSpeedMach !== undefined ? `Mach ${aircraft.topSpeedMach}` : `${aircraft.topSpeedKmh} km/h`}
            </p>
            {aircraft.speedComparison && <p className="text-sm text-slate-600">{pick(aircraft.speedComparison, language)}</p>}
          </div>
        )}
      </div>

      <div className="w-full rounded-2xl bg-white/90 px-5 py-4 text-left">
        <p className="text-xs font-semibold text-slate-500">{language === 'hi' ? 'खास बात' : 'Standout feature'}</p>
        <p className="font-display font-semibold text-slate-900">{pick(aircraft.standoutFeature, language)}</p>
      </div>

      <div className="flex w-full flex-col gap-2">
        {aircraft.facts
          .filter((f) => f.verified)
          .map((fact, i) => (
            <div key={i} className="flex items-center justify-between gap-2 rounded-2xl bg-white/90 px-4 py-3 text-left">
              <p className="text-slate-700">⭐ {pick(fact.text, language)}</p>
              <ReadAloudButton text={pick(fact.text, language)} />
            </div>
          ))}
      </div>
    </div>
  );
}
