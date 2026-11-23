import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgressStore } from '../store/progressStore';
import { pick } from '../i18n';
import { STRINGS } from '../i18n/strings';
import { BigButton } from '../components/BigButton';
import { ScreenHeading } from '../components/ScreenHeading';

const HELMET_COLORS = ['#5c6b8a', '#ff9933', '#2fbf71', '#d64550', '#6c5ce7'];
const VISOR_COLORS = ['#ffcf6b', '#7ec8ff', '#ff8fa3', '#c7f9cc'];

export function AvatarBuilder() {
  const navigate = useNavigate();
  const language = useProgressStore((s) => s.settings.language);
  const setAvatar = useProgressStore((s) => s.setAvatar);
  const [helmetColor, setHelmetColor] = useState(HELMET_COLORS[0]);
  const [visorColor, setVisorColor] = useState(VISOR_COLORS[0]);

  const confirm = () => {
    setAvatar({ helmetColor, visorColor, badgeId: null });
    navigate('/map');
  };

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-6 px-4 py-10 text-center">
      <ScreenHeading>{pick(STRINGS.buildYourPilot, language)}</ScreenHeading>

      <svg viewBox="0 0 160 160" width={150} height={150} role="img" aria-label="Your pilot avatar preview">
        <circle cx="80" cy="90" r="55" fill="#f2d9c0" />
        <path d="M30 70 Q80 20 130 70 Q130 95 115 98 Q80 78 45 98 Q30 95 30 70 Z" fill={helmetColor} />
        <rect x="45" y="75" width="70" height="24" rx="12" fill={visorColor} opacity={0.9} />
      </svg>

      <div className="flex flex-col items-center gap-2 rounded-2xl bg-white/85 px-5 py-4">
        <p className="font-display font-semibold text-slate-700">{pick(STRINGS.helmetColor, language)}</p>
        <div className="flex gap-2">
          {HELMET_COLORS.map((color) => (
            <button
              key={color}
              aria-label={`Helmet colour ${color}`}
              onClick={() => setHelmetColor(color)}
              className="h-14 w-14 rounded-full border-4"
              style={{ backgroundColor: color, borderColor: helmetColor === color ? '#1b2347' : 'transparent' }}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 rounded-2xl bg-white/85 px-5 py-4">
        <p className="font-display font-semibold text-slate-700">{pick(STRINGS.visorColor, language)}</p>
        <div className="flex gap-2">
          {VISOR_COLORS.map((color) => (
            <button
              key={color}
              aria-label={`Visor colour ${color}`}
              onClick={() => setVisorColor(color)}
              className="h-14 w-14 rounded-full border-4"
              style={{ backgroundColor: color, borderColor: visorColor === color ? '#1b2347' : 'transparent' }}
            />
          ))}
        </div>
      </div>

      <BigButton onClick={confirm}>{pick(STRINGS.letsFly, language)}</BigButton>
    </div>
  );
}
