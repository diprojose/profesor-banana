/**
 * Configuración de cada isla de idioma. La pantalla compartida
 * (`LanguageScreen`) y el generador de preguntas son los mismos;
 * cada isla aporta su vocabulario, categorías y voz.
 * Para añadir otro idioma: vocabulario nuevo + una entrada aquí.
 */

import { type VocabWord, type CategoryNames } from './vocabulary';
import { type SpeechLang } from '../hooks/useSpeech';
import { englishVocabulary, categoryNames } from '../english/vocabulary';
import { frenchVocabulary, frenchCategoryNames } from '../french/vocabulary';

export interface LanguageIsland {
  vocab: VocabWord[];
  categories: CategoryNames;
  speechLang: SpeechLang;
}

export const languageIslands = {
  english: {
    vocab: englishVocabulary,
    categories: categoryNames,
    speechLang: 'en',
  },
  french: {
    vocab: frenchVocabulary,
    categories: frenchCategoryNames,
    speechLang: 'fr',
  },
} satisfies Record<string, LanguageIsland>;

export type LanguageIslandId = keyof typeof languageIslands;
