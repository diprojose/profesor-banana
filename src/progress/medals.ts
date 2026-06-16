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
