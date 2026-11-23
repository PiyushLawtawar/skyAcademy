import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAllAircraftSorted } from '../content/aircraft';
import type { Aircraft } from '../content/types';
import { useProgressStore } from '../store/progressStore';
import { pick } from '../i18n';
import { STRINGS } from '../i18n/strings';
import { AircraftSilhouette } from '../components/diagrams/AircraftSilhouette';
import { ScreenHeading } from '../components/ScreenHeading';

// Rough relative-speed ranking only (never shown as a literal number) so we
// can say "which is faster" without asserting a precise, unverified figure.
function speedRank(a: Aircraft): number | null {
  if (a.topSpeedMach !== undefined) return a.topSpeedMach * 1225;
  if (a.topSpeedKmh !== undefined) return a.topSpeedKmh;
  return null;
}

export function AircraftCompare() {
  const navigate = useNavigate();
  const { stageId } = useParams<{ stageId: string }>();
  const language = useProgressStore((s) => s.settings.language);
  const cardIds = useProgressStore((s) => s.cardIds);
  const unlocked = getAllAircraftSorted().filter((a) => cardIds.includes(a.id));

  const [leftId, setLeftId] = useState<string | null>(unlocked[0]?.id ?? null);
  const [rightId, setRightId] = useState<string | null>(unlocked[1]?.id ?? null);

  const left = unlocked.find((a) => a.id === leftId);
  const right = unlocked.find((a) => a.id === rightId);

  const leftRank = left ? speedRank(left) : null;
  const rightRank = right ? speedRank(right) : null;
  const faster = leftRank !== null && rightRank !== null ? (leftRank > rightRank ? left : rightRank > leftRank ? right : null) : null;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-8">
      <button
        onClick={() => navigate(`/stage/${stageId}`)}
        className="self-start rounded-full bg-white/80 px-4 py-2 font-display font-semibold text-slate-700"
      >
        ← {pick(STRINGS.back, language)}
      </button>

      <ScreenHeading className="self-start">⚖️ {language === 'hi' ? 'विमान तुलना' : 'Compare Aircraft'}</ScreenHeading>

      <div className="grid grid-cols-2 gap-4">
        <AircraftPicker
          options={unlocked}
          selectedId={leftId}
          otherId={rightId}
          onSelect={setLeftId}
          language={language}
        />
        <AircraftPicker
          options={unlocked}
          selectedId={rightId}
          otherId={leftId}
          onSelect={setRightId}
          language={language}
        />
      </div>

      {left && right && (
        <div className="grid grid-cols-2 gap-4">
          <CompareColumn aircraft={left} highlightFaster={faster?.id === left.id} language={language} />
          <CompareColumn aircraft={right} highlightFaster={faster?.id === right.id} language={language} />
        </div>
      )}
    </div>
  );
}

function AircraftPicker({
  options,
  selectedId,
  otherId,
  onSelect,
  language,
}: {
  options: Aircraft[];
  selectedId: string | null;
  otherId: string | null;
  onSelect: (id: string) => void;
  language: 'en' | 'hi';
}) {
  return (
    <select
      value={selectedId ?? ''}
      onChange={(e) => onSelect(e.target.value)}
      className="min-h-14 rounded-2xl bg-white/90 px-4 font-display font-semibold text-slate-800"
    >
      {options.map((a) => (
        <option key={a.id} value={a.id} disabled={a.id === otherId}>
          {pick(a.name, language)}
        </option>
      ))}
    </select>
  );
}

function CompareColumn({
  aircraft,
  highlightFaster,
  language,
}: {
  aircraft: Aircraft;
  highlightFaster: boolean;
  language: 'en' | 'hi';
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-3xl bg-white/90 p-4 text-center">
      <AircraftSilhouette spec={aircraft.silhouette} size={150} />
      <p className="font-display font-bold text-slate-900">{pick(aircraft.name, language)}</p>
      {highlightFaster && (
        <p className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
          💨 {language === 'hi' ? 'ज़्यादा तेज़!' : 'Faster!'}
        </p>
      )}
      <dl className="w-full space-y-1 text-left text-sm">
        <Row label={language === 'hi' ? 'निर्माता' : 'Maker'} value={pick(aircraft.maker, language)} />
        {aircraft.crew !== undefined && <Row label={language === 'hi' ? 'चालक दल' : 'Crew'} value={String(aircraft.crew)} />}
        <Row
          label={language === 'hi' ? 'मेड इन इंडिया' : 'Made in India'}
          value={aircraft.madeInIndia ? (language === 'hi' ? 'हाँ' : 'Yes') : language === 'hi' ? 'नहीं' : 'No'}
        />
      </dl>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-2">
      <dt className="text-slate-500">{label}</dt>
      <dd className="font-semibold text-slate-800">{value}</dd>
    </div>
  );
}
