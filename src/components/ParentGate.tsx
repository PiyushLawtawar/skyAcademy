import { useMemo, useState } from 'react';
import { useProgressStore } from '../store/progressStore';
import { pick } from '../i18n';
import { STRINGS } from '../i18n/strings';
import { BigButton } from './BigButton';

interface ParentGateProps {
  onUnlocked: () => void;
}

function randomQuestion() {
  const a = 3 + Math.floor(Math.random() * 6);
  const b = 2 + Math.floor(Math.random() * 6);
  return { a, b, answer: a * b };
}

// A simple maths question (multiplication, deliberately beyond a 7-year-old)
// gates Parent Corner. Not real security — just enough friction to keep kids
// from wandering into settings/export meant for a grown-up.
export function ParentGate({ onUnlocked }: ParentGateProps) {
  const language = useProgressStore((s) => s.settings.language);
  const unlockParentGate = useProgressStore((s) => s.unlockParentGate);
  const question = useMemo(randomQuestion, []);
  const [value, setValue] = useState('');
  const [wrong, setWrong] = useState(false);

  const submit = () => {
    if (Number(value) === question.answer) {
      unlockParentGate();
      onUnlocked();
    } else {
      setWrong(true);
      setValue('');
    }
  };

  return (
    <div className="mx-auto flex max-w-sm flex-col items-center gap-4 rounded-3xl bg-white/90 p-6 text-center shadow-xl">
      <h2 className="font-display text-xl font-bold text-slate-800">{pick(STRINGS.parentCorner, language)}</h2>
      <p className="text-slate-600">{pick(STRINGS.parentGatePrompt, language)}</p>
      <p className="font-display text-3xl font-bold text-slate-800">
        {question.a} &times; {question.b} = ?
      </p>
      <input
        type="number"
        inputMode="numeric"
        value={value}
        onChange={(e) => {
          setWrong(false);
          setValue(e.target.value);
        }}
        className="w-28 rounded-2xl border-2 border-slate-200 px-4 py-3 text-center text-xl"
        aria-label="Answer"
      />
      {wrong && <p className="text-sm text-almost">{pick(STRINGS.parentGateWrong, language)}</p>}
      <BigButton onClick={submit}>{pick(STRINGS.continueButton, language)}</BigButton>
    </div>
  );
}
