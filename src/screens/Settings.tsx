import { useNavigate } from 'react-router-dom';
import { useProgressStore } from '../store/progressStore';
import { pick } from '../i18n';
import { STRINGS } from '../i18n/strings';
import { ScreenHeading } from '../components/ScreenHeading';
import { soundManager } from '../lib/sound';

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  const sfxEnabled = useProgressStore((s) => s.settings.sfx);

  return (
    <label className="flex min-h-14 items-center justify-between gap-4 rounded-2xl bg-white/90 px-5 py-3">
      <span className="font-display font-semibold text-slate-700">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => {
          soundManager.unlock();
          soundManager.play('tap', { sfxEnabled });
          onChange(!checked);
        }}
        className={`relative h-9 w-16 rounded-full transition-colors ${checked ? 'bg-india-green' : 'bg-slate-300'}`}
      >
        <span
          className={`absolute top-1 h-7 w-7 rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-8' : 'translate-x-1'
          }`}
        />
      </button>
    </label>
  );
}

// Volume/read-aloud/Calm mode and language are directly accessible to the
// child (section 5/2 of the spec) — the gated Parent Corner is a separate
// screen for progress, export/import and reset.
export function Settings() {
  const navigate = useNavigate();
  const settings = useProgressStore((s) => s.settings);
  const updateSettings = useProgressStore((s) => s.updateSettings);
  const language = settings.language;

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4 px-4 py-10">
      <button
        onClick={() => navigate('/map')}
        className="self-start rounded-full bg-white/80 px-4 py-2 font-display font-semibold text-slate-700"
      >
        ← {pick(STRINGS.back, language)}
      </button>
      <ScreenHeading className="self-start">{pick(STRINGS.settingsTitle, language)}</ScreenHeading>

      <Toggle
        label={pick(STRINGS.music, language)}
        checked={settings.music}
        onChange={(v) => updateSettings({ music: v })}
      />
      <Toggle
        label={pick(STRINGS.soundEffects, language)}
        checked={settings.sfx}
        onChange={(v) => updateSettings({ sfx: v })}
      />
      <Toggle
        label={pick(STRINGS.readAloud, language)}
        checked={settings.readAloud}
        onChange={(v) => updateSettings({ readAloud: v })}
      />
      <Toggle
        label={pick(STRINGS.calmMode, language)}
        checked={settings.calmMode}
        onChange={(v) => updateSettings({ calmMode: v })}
      />

      <div className="flex min-h-14 items-center justify-between gap-4 rounded-2xl bg-white/90 px-5 py-3">
        <span className="font-display font-semibold text-slate-700">{pick(STRINGS.language, language)}</span>
        <div className="flex gap-2">
          <button
            onClick={() => updateSettings({ language: 'en' })}
            className={`min-h-14 rounded-xl px-4 font-display font-semibold ${
              language === 'en' ? 'bg-sky-day text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            English
          </button>
          <button
            onClick={() => updateSettings({ language: 'hi' })}
            className={`min-h-14 rounded-xl px-4 font-display font-semibold ${
              language === 'hi' ? 'bg-sky-day text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            हिंदी
          </button>
        </div>
      </div>
    </div>
  );
}
