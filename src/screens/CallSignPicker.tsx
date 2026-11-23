import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CALL_SIGNS } from '../content/callsigns';
import { useProgressStore } from '../store/progressStore';
import { pick } from '../i18n';
import { STRINGS } from '../i18n/strings';
import { VeerMascot } from '../components/VeerMascot';
import { ScreenHeading } from '../components/ScreenHeading';
import { soundManager } from '../lib/sound';

export function CallSignPicker() {
  const navigate = useNavigate();
  const language = useProgressStore((s) => s.settings.language);
  const sfxEnabled = useProgressStore((s) => s.settings.sfx);
  const setCallSign = useProgressStore((s) => s.setCallSign);

  const choose = (id: string) => {
    soundManager.unlock();
    soundManager.play('tap', { sfxEnabled });
    setCallSign(id);
    navigate('/avatar');
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-4 py-10 text-center">
      <VeerMascot expression="happy" size={110} />
      <ScreenHeading>{pick(STRINGS.pickYourCallSign, language)}</ScreenHeading>
      <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3">
        {CALL_SIGNS.map((cs) => (
          <motion.button
            key={cs.id}
            whileTap={{ scale: 0.94 }}
            onClick={() => choose(cs.id)}
            className="flex min-h-14 flex-col items-center gap-1 rounded-3xl bg-white/90 px-3 py-4 shadow-md"
          >
            <span className="text-3xl">{cs.emoji}</span>
            <span className="font-display text-sm font-semibold text-slate-700">{pick(cs.label, language)}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
