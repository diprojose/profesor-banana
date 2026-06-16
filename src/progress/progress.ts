/**
 * Modelo de progreso del niño: estrellas, estadísticas, rachas y
 * medallas desbloqueadas. Es la "memoria" del juego y se persiste
 * en localStorage.
 */

import { computeUnlocked } from './medals';

export interface Progress {
  /** Estrellas acumuladas (determinan el nivel). */
  stars: number;
  /** Sumas/restas resueltas correctamente. */
  mathSolved: number;
  /** Páginas leídas en voz alta. */
  pagesRead: number;
  /** Racha actual de aciertos seguidos en matemáticas. */
  currentStreak: number;
  /** Mejor racha alcanzada. */
  bestStreak: number;
  /** Ids de medallas ya desbloqueadas. */
  unlockedMedals: string[];
}

export const initialProgress: Progress = {
  stars: 0,
  mathSolved: 0,
  pagesRead: 0,
  currentStreak: 0,
  bestStreak: 0,
  unlockedMedals: [],
};

/** Eventos que hacen avanzar el progreso. */
export type ProgressEvent =
  | { type: 'math-correct' }
  | { type: 'math-wrong' }
  | { type: 'page-read' }
  | { type: 'reset' };

/** Aplica un evento y recalcula las medallas desbloqueadas. */
export function progressReducer(
  state: Progress,
  event: ProgressEvent,
): Progress {
  let next: Progress;

  switch (event.type) {
    case 'math-correct': {
      const currentStreak = state.currentStreak + 1;
      next = {
        ...state,
        stars: state.stars + 1,
        mathSolved: state.mathSolved + 1,
        currentStreak,
        bestStreak: Math.max(state.bestStreak, currentStreak),
      };
      break;
    }
    case 'math-wrong': {
      // Un fallo corta la racha (sin penalizar estrellas).
      next = { ...state, currentStreak: 0 };
      break;
    }
    case 'page-read': {
      next = {
        ...state,
        stars: state.stars + 1,
        pagesRead: state.pagesRead + 1,
      };
      break;
    }
    case 'reset':
      return initialProgress;
  }

  // Las medallas solo se suman, nunca se quitan.
  const unlocked = computeUnlocked(next);
  const merged = [
    ...state.unlockedMedals,
    ...unlocked.filter((id) => !state.unlockedMedals.includes(id)),
  ];
  return { ...next, unlockedMedals: merged };
}
