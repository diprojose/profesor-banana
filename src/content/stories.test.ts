import { describe, it, expect } from 'vitest';
import { stories, readingLevels } from './stories';

describe('stories', () => {
  it('hay una buena biblioteca (10+ cuentos)', () => {
    expect(stories.length).toBeGreaterThanOrEqual(10);
  });

  it('los ids son únicos', () => {
    const ids = stories.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('cada nivel de lectura tiene al menos 3 cuentos', () => {
    for (const level of readingLevels) {
      const count = stories.filter((s) => s.level === level).length;
      expect(count).toBeGreaterThanOrEqual(3);
    }
  });

  it('cada cuento tiene portada, título bilingüe y 4+ páginas completas', () => {
    for (const story of stories) {
      expect(story.emoji.length).toBeGreaterThan(0);
      expect(story.title.es.length).toBeGreaterThan(0);
      expect(story.title.en.length).toBeGreaterThan(0);
      expect(readingLevels).toContain(story.level);
      expect(story.pages.length).toBeGreaterThanOrEqual(4);
      for (const page of story.pages) {
        expect(page.es.length).toBeGreaterThan(0);
        expect(page.en.length).toBeGreaterThan(0);
        expect(page.emoji.length).toBeGreaterThan(0);
      }
    }
  });

  it('cada pregunta final tiene 3 opciones y un índice correcto válido', () => {
    for (const story of stories) {
      const { quiz } = story;
      expect(quiz.question.es.length).toBeGreaterThan(0);
      expect(quiz.question.en.length).toBeGreaterThan(0);
      expect(quiz.options).toHaveLength(3);
      expect(quiz.correct).toBeGreaterThanOrEqual(0);
      expect(quiz.correct).toBeLessThan(quiz.options.length);
      for (const option of quiz.options) {
        expect(option.emoji.length).toBeGreaterThan(0);
        expect(option.es.length).toBeGreaterThan(0);
        expect(option.en.length).toBeGreaterThan(0);
      }
    }
  });

  it('las frases suben de largo con el nivel (en promedio)', () => {
    const avgWords = (level: number) => {
      const pages = stories
        .filter((s) => s.level === level)
        .flatMap((s) => s.pages);
      const words = pages.reduce(
        (sum, p) => sum + p.es.split(/\s+/).length,
        0,
      );
      return words / pages.length;
    };
    expect(avgWords(1)).toBeLessThan(avgWords(2));
    expect(avgWords(2)).toBeLessThan(avgWords(3));
  });
});
