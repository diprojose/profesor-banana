import { describe, it, expect } from 'vitest';
import { progressReducer, initialProgress, type Progress } from './progress';

describe('progressReducer', () => {
  it('un acierto suma estrella, resuelve y aumenta la racha', () => {
    const s = progressReducer(initialProgress, { type: 'math-correct' });
    expect(s.stars).toBe(1);
    expect(s.mathSolved).toBe(1);
    expect(s.currentStreak).toBe(1);
    expect(s.bestStreak).toBe(1);
    expect(s.unlockedMedals).toContain('first-correct');
  });

  it('un fallo corta la racha sin quitar estrellas', () => {
    let s: Progress = initialProgress;
    s = progressReducer(s, { type: 'math-correct' });
    s = progressReducer(s, { type: 'math-correct' });
    const beforeStars = s.stars;
    s = progressReducer(s, { type: 'math-wrong' });
    expect(s.currentStreak).toBe(0);
    expect(s.stars).toBe(beforeStars);
    expect(s.bestStreak).toBe(2); // la mejor racha se conserva
  });

  it('leer una página suma estrella y cuenta páginas', () => {
    const s = progressReducer(initialProgress, {
      type: 'page-read',
      pageKey: 'boat:0',
    });
    expect(s.stars).toBe(1);
    expect(s.pagesRead).toBe(1);
    expect(s.readPages).toContain('boat:0');
  });

  it('releer la misma página no vuelve a premiar', () => {
    let s: Progress = initialProgress;
    s = progressReducer(s, { type: 'page-read', pageKey: 'boat:0' });
    s = progressReducer(s, { type: 'page-read', pageKey: 'boat:0' });
    s = progressReducer(s, { type: 'page-read', pageKey: 'boat:1' });
    expect(s.stars).toBe(2);
    expect(s.pagesRead).toBe(2);
  });

  it('terminar un cuento da 2 estrellas y solo cuenta una vez', () => {
    let s: Progress = initialProgress;
    s = progressReducer(s, { type: 'story-completed', storyId: 'boat' });
    expect(s.stars).toBe(2);
    expect(s.completedStories).toEqual(['boat']);
    expect(s.unlockedMedals).toContain('story-1');
    s = progressReducer(s, { type: 'story-completed', storyId: 'boat' });
    expect(s.stars).toBe(2); // sin doble premio
  });

  it('francés cuenta palabras distintas, igual que inglés', () => {
    let s: Progress = initialProgress;
    s = progressReducer(s, { type: 'french-correct', wordId: 'fr-cat' });
    s = progressReducer(s, { type: 'french-correct', wordId: 'fr-cat' });
    s = progressReducer(s, { type: 'french-correct', wordId: 'fr-dog' });
    expect(s.stars).toBe(3);
    expect(s.frenchLearned).toBe(3);
    expect(s.frenchWordIds).toEqual(['fr-cat', 'fr-dog']);
  });

  it('inglés cuenta palabras distintas, sin duplicar repetidas', () => {
    let s: Progress = initialProgress;
    s = progressReducer(s, { type: 'english-correct', wordId: 'cat' });
    s = progressReducer(s, { type: 'english-correct', wordId: 'dog' });
    s = progressReducer(s, { type: 'english-correct', wordId: 'cat' });
    expect(s.stars).toBe(3); // cada acierto premia
    expect(s.englishLearned).toBe(3);
    expect(s.englishWordIds).toEqual(['cat', 'dog']); // distintas: 2
  });

  it('desbloquea la medalla de racha al llegar a 5 seguidos', () => {
    let s: Progress = initialProgress;
    for (let i = 0; i < 5; i++) {
      s = progressReducer(s, { type: 'math-correct' });
    }
    expect(s.bestStreak).toBe(5);
    expect(s.unlockedMedals).toContain('streak-5');
  });

  it('las medallas no se pierden aunque baje la racha', () => {
    let s: Progress = initialProgress;
    for (let i = 0; i < 5; i++) s = progressReducer(s, { type: 'math-correct' });
    s = progressReducer(s, { type: 'math-wrong' });
    expect(s.unlockedMedals).toContain('streak-5');
  });

  it('reset vuelve al estado inicial', () => {
    let s = progressReducer(initialProgress, { type: 'math-correct' });
    s = progressReducer(s, { type: 'reset' });
    expect(s).toEqual(initialProgress);
  });
});
