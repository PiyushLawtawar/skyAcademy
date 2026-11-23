import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgressStore } from '../store/progressStore';
import { RANKS } from '../content/ranks';
import { pick } from '../i18n';
import { STRINGS } from '../i18n/strings';
import { ParentGate } from '../components/ParentGate';
import { BigButton } from '../components/BigButton';
import { ScreenHeading } from '../components/ScreenHeading';

export function ParentCorner() {
  const navigate = useNavigate();
  const language = useProgressStore((s) => s.settings.language);
  const parentGateUnlockedAt = useProgressStore((s) => s.parentGateUnlockedAt);
  const lockParentGate = useProgressStore((s) => s.lockParentGate);
  const totalStars = useProgressStore((s) => s.totalStars());
  const rankIndex = useProgressStore((s) => s.rankIndex());
  const streakCount = useProgressStore((s) => s.streakCount);
  const lessonResults = useProgressStore((s) => s.lessonResults);
  const exportProgress = useProgressStore((s) => s.exportProgress);
  const importProgress = useProgressStore((s) => s.importProgress);
  const resetProgress = useProgressStore((s) => s.resetProgress);

  const [unlocked, setUnlocked] = useState(() => {
    if (!parentGateUnlockedAt) return false;
    return Date.now() - parentGateUnlockedAt < 10 * 60 * 1000; // re-ask after 10 minutes
  });
  const [importMessage, setImportMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!unlocked) {
    return (
      <div className="mx-auto flex max-w-xl flex-col gap-4 px-4 py-10">
        <button
          onClick={() => navigate('/map')}
          className="self-start rounded-full bg-white/80 px-4 py-2 font-display font-semibold text-slate-700"
        >
          ← {pick(STRINGS.back, language)}
        </button>
        <ParentGate onUnlocked={() => setUnlocked(true)} />
      </div>
    );
  }

  const handleExport = () => {
    const json = exportProgress();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sky-cadet-progress.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = async (file: File) => {
    const text = await file.text();
    const ok = importProgress(text);
    setImportMessage(ok ? 'Progress imported!' : 'That file could not be read — try another export.');
  };

  const handleReset = () => {
    if (window.confirm('This clears all stars, badges and settings on this device. Continue?')) {
      resetProgress();
    }
  };

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4 px-4 py-10">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/map')}
          className="rounded-full bg-white/80 px-4 py-2 font-display font-semibold text-slate-700"
        >
          ← {pick(STRINGS.back, language)}
        </button>
        <button
          onClick={() => {
            lockParentGate();
            setUnlocked(false);
          }}
          className="rounded-full bg-white/80 px-4 py-2 font-display font-semibold text-slate-700"
        >
          Lock
        </button>
      </div>

      <ScreenHeading className="self-start">{pick(STRINGS.parentCorner, language)}</ScreenHeading>

      <section className="rounded-2xl bg-white/90 p-5">
        <h2 className="font-display font-semibold text-slate-800">{pick(STRINGS.yourProgress, language)}</h2>
        <ul className="mt-2 space-y-1 text-slate-700">
          <li>
            {pick(STRINGS.rankLabel, language)}: {pick(RANKS[rankIndex].name, language)}
          </li>
          <li>
            {pick(STRINGS.starsLabel, language)}: {totalStars}
          </li>
          <li>Lessons completed: {Object.keys(lessonResults).length}</li>
          <li>Daily streak: {streakCount} day(s)</li>
        </ul>
      </section>

      <section className="flex flex-col gap-3 rounded-2xl bg-white/90 p-5">
        <BigButton variant="secondary" onClick={handleExport}>
          {pick(STRINGS.exportProgress, language)}
        </BigButton>
        <BigButton variant="secondary" onClick={() => fileInputRef.current?.click()}>
          {pick(STRINGS.importProgress, language)}
        </BigButton>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleImportFile(file);
            e.target.value = '';
          }}
        />
        {importMessage && <p className="text-sm text-slate-600">{importMessage}</p>}
        <BigButton variant="ghost" onClick={handleReset}>
          {pick(STRINGS.resetProgress, language)}
        </BigButton>
      </section>
    </div>
  );
}
