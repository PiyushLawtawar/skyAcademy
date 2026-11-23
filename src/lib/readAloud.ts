import type { Language } from '../content/types';

function pickVoice(language: Language): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices();
  const preferredLangPrefix = language === 'hi' ? 'hi' : 'en-IN';
  return (
    voices.find((v) => v.lang.toLowerCase().startsWith(preferredLangPrefix.toLowerCase())) ??
    voices.find((v) => v.lang.toLowerCase().startsWith(language)) ??
    voices.find((v) => v.lang.toLowerCase().startsWith('en'))
  );
}

export function speak(text: string, language: Language): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
  utterance.rate = 0.95;
  utterance.pitch = 1.05;
  const voice = pickVoice(language);
  if (voice) utterance.voice = voice;

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}
