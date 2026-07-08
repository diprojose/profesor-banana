/**
 * Catálogo de medallas (logros). Cada medalla tiene un emoji, un
 * criterio sobre el progreso y sus textos en ES/EN. Mantener juntas
 * la lógica y la traducción facilita añadir medallas nuevas.
 */

import { type Progress } from './progress';
import { levelFromStars } from './levels';
import { type Lang } from '../i18n/strings';

export interface MedalDef {
  id: string;
  emoji: string;
  /** ¿El progreso cumple el criterio de esta medalla? */
  isUnlocked: (p: Progress) => boolean;
  text: Record<Lang, { name: string; desc: string }>;
}

export const medals: MedalDef[] = [
  {
    id: 'first-correct',
    emoji: '🌟',
    isUnlocked: (p) => p.mathSolved >= 1,
    text: {
      es: { name: 'Primera estrella', desc: 'Resuelve tu primera suma' },
      en: { name: 'First star', desc: 'Solve your first sum' },
    },
  },
  {
    id: 'math-10',
    emoji: '🍎',
    isUnlocked: (p) => p.mathSolved >= 10,
    text: {
      es: { name: 'Contador veloz', desc: 'Resuelve 10 problemas' },
      en: { name: 'Quick counter', desc: 'Solve 10 problems' },
    },
  },
  {
    id: 'math-25',
    emoji: '🧮',
    isUnlocked: (p) => p.mathSolved >= 25,
    text: {
      es: { name: 'Maestro de números', desc: 'Resuelve 25 problemas' },
      en: { name: 'Number master', desc: 'Solve 25 problems' },
    },
  },
  {
    id: 'streak-5',
    emoji: '🔥',
    isUnlocked: (p) => p.bestStreak >= 5,
    text: {
      es: { name: 'En racha', desc: '5 aciertos seguidos' },
      en: { name: 'On fire', desc: '5 correct in a row' },
    },
  },
  {
    id: 'read-5',
    emoji: '📖',
    isUnlocked: (p) => p.pagesRead >= 5,
    text: {
      es: { name: 'Pequeño lector', desc: 'Lee 5 páginas' },
      en: { name: 'Little reader', desc: 'Read 5 pages' },
    },
  },
  {
    id: 'read-15',
    emoji: '📚',
    isUnlocked: (p) => p.pagesRead >= 15,
    text: {
      es: { name: 'Ratón de biblioteca', desc: 'Lee 15 páginas' },
      en: { name: 'Bookworm', desc: 'Read 15 pages' },
    },
  },
  {
    id: 'story-1',
    emoji: '🧚',
    isUnlocked: (p) => p.completedStories.length >= 1,
    text: {
      es: { name: 'Fin del cuento', desc: 'Termina tu primer cuento' },
      en: { name: 'The end', desc: 'Finish your first story' },
    },
  },
  {
    id: 'stories-5',
    emoji: '🏰',
    isUnlocked: (p) => p.completedStories.length >= 5,
    text: {
      es: { name: 'Cuentacuentos', desc: 'Termina 5 cuentos' },
      en: { name: 'Storyteller', desc: 'Finish 5 stories' },
    },
  },
  {
    id: 'english-5',
    emoji: '🗣️',
    isUnlocked: (p) => p.englishWordIds.length >= 5,
    text: {
      es: { name: 'Hello!', desc: 'Aprende 5 palabras en inglés' },
      en: { name: 'Hello!', desc: 'Learn 5 English words' },
    },
  },
  {
    id: 'english-15',
    emoji: '🌎',
    isUnlocked: (p) => p.englishWordIds.length >= 15,
    text: {
      es: { name: 'Pequeño políglota', desc: 'Aprende 15 palabras en inglés' },
      en: { name: 'Little polyglot', desc: 'Learn 15 English words' },
    },
  },
  {
    id: 'english-40',
    emoji: '🎓',
    isUnlocked: (p) => p.englishWordIds.length >= 40,
    text: {
      es: { name: 'Gran políglota', desc: 'Aprende 40 palabras en inglés' },
      en: { name: 'Great polyglot', desc: 'Learn 40 English words' },
    },
  },
  {
    id: 'french-5',
    emoji: '🥐',
    isUnlocked: (p) => p.frenchWordIds.length >= 5,
    text: {
      es: { name: 'Bonjour !', desc: 'Aprende 5 palabras en francés' },
      en: { name: 'Bonjour!', desc: 'Learn 5 French words' },
    },
  },
  {
    id: 'french-15',
    emoji: '🗼',
    isUnlocked: (p) => p.frenchWordIds.length >= 15,
    text: {
      es: { name: 'Petit chef', desc: 'Aprende 15 palabras en francés' },
      en: { name: 'Petit chef', desc: 'Learn 15 French words' },
    },
  },
  {
    id: 'dictation-1',
    emoji: '✍️',
    isUnlocked: (p) => p.completedDictations.length >= 1,
    text: {
      es: { name: 'Primer dictado', desc: 'Termina tu primer dictado' },
      en: { name: 'First dictation', desc: 'Finish your first dictation' },
    },
  },
  {
    id: 'dictation-15',
    emoji: '📝',
    isUnlocked: (p) => p.dictationItems.length >= 15,
    text: {
      es: { name: 'Buena letra', desc: 'Escribe 15 frases sin errores' },
      en: { name: 'Good speller', desc: 'Write 15 lines with no mistakes' },
    },
  },
  {
    id: 'stars-25',
    emoji: '⭐',
    isUnlocked: (p) => p.stars >= 25,
    text: {
      es: { name: 'Coleccionista', desc: 'Reúne 25 estrellas' },
      en: { name: 'Collector', desc: 'Collect 25 stars' },
    },
  },
  {
    id: 'level-5',
    emoji: '🏆',
    isUnlocked: (p) => levelFromStars(p.stars) >= 5,
    text: {
      es: { name: 'Gran aventurero', desc: 'Llega al nivel 5' },
      en: { name: 'Great adventurer', desc: 'Reach level 5' },
    },
  },
];

/** Devuelve los ids de medallas cuyo criterio se cumple. */
export function computeUnlocked(p: Progress): string[] {
  return medals.filter((m) => m.isUnlocked(p)).map((m) => m.id);
}

/** Busca la definición de una medalla por id. */
export function getMedal(id: string): MedalDef | undefined {
  return medals.find((m) => m.id === id);
}
