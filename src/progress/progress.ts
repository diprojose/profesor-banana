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
  /** Páginas leídas en voz alta (solo cuenta páginas nuevas). */
  pagesRead: number;
  /** Claves `storyId:página` ya premiadas (no premiar dos veces). */
  readPages: string[];
  /** Ids de cuentos terminados (pregunta final respondida bien). */
  completedStories: string[];
  /** Aciertos totales en inglés (incluye palabras repetidas). */
  englishLearned: number;
  /** Ids de palabras de inglés distintas ya acertadas alguna vez. */
  englishWordIds: string[];
  /** Aciertos totales en francés (incluye palabras repetidas). */
  frenchLearned: number;
  /** Ids de palabras de francés distintas ya acertadas alguna vez. */
  frenchWordIds: string[];
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
  readPages: [],
  completedStories: [],
  englishLearned: 0,
  englishWordIds: [],
  frenchLearned: 0,
  frenchWordIds: [],
  currentStreak: 0,
  bestStreak: 0,
  unlockedMedals: [],
};

/** Eventos que hacen avanzar el progreso. */
export type ProgressEvent =
  | { type: 'math-correct' }
  | { type: 'math-wrong' }
  | { type: 'page-read'; pageKey: string }
  | { type: 'story-completed'; storyId: string }
  | { type: 'english-correct'; wordId: string }
  | { type: 'french-correct'; wordId: string }
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
      // Releer una página ya premiada no da estrellas otra vez.
      if (state.readPages.includes(event.pageKey)) return state;
      next = {
        ...state,
        stars: state.stars + 1,
        pagesRead: state.pagesRead + 1,
        readPages: [...state.readPages, event.pageKey],
      };
      break;
    }
    case 'story-completed': {
      // Terminar un cuento (pregunta final bien) da un bonus de 2 ⭐.
      if (state.completedStories.includes(event.storyId)) return state;
      next = {
        ...state,
        stars: state.stars + 2,
        completedStories: [...state.completedStories, event.storyId],
      };
      break;
    }
    case 'english-correct': {
      next = {
        ...state,
        stars: state.stars + 1,
        englishLearned: state.englishLearned + 1,
        englishWordIds: state.englishWordIds.includes(event.wordId)
          ? state.englishWordIds
          : [...state.englishWordIds, event.wordId],
      };
      break;
    }
    case 'french-correct': {
      next = {
        ...state,
        stars: state.stars + 1,
        frenchLearned: state.frenchLearned + 1,
        frenchWordIds: state.frenchWordIds.includes(event.wordId)
          ? state.frenchWordIds
          : [...state.frenchWordIds, event.wordId],
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
