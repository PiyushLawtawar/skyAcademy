import type { Language, LocalizedText } from '../content/types';
import { STRINGS, type StringKey } from './strings';

export function pick(text: LocalizedText, language: Language): string {
  return text[language] ?? text.en;
}

export function useTranslatedString(key: StringKey, language: Language): string {
  return pick(STRINGS[key], language);
}

export { STRINGS };
export type { StringKey };
