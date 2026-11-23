import { useProgressStore } from '../store/progressStore';
import { speak } from '../lib/readAloud';

interface ReadAloudButtonProps {
  text: string;
  className?: string;
}

// Every text block in the app pairs with one of these. Hidden-but-present
// even when the read-aloud setting is off, so a child can still ask for it.
export function ReadAloudButton({ text, className = '' }: ReadAloudButtonProps) {
  const language = useProgressStore((s) => s.settings.language);

  return (
    <button
      type="button"
      aria-label="Read this aloud"
      onClick={() => speak(text, language)}
      className={`inline-flex min-h-14 min-w-14 items-center justify-center rounded-full bg-white/70 text-2xl shadow active:scale-95 ${className}`}
    >
      🔊
    </button>
  );
}
