import { describe, it, expect } from 'vitest';
import { dictations, dictationLevels } from './dictations';

describe('dictations', () => {
  it('hay un buen catálogo (30+ dictados)', () => {
    expect(dictations.length).toBeGreaterThanOrEqual(30);
  });

  it('los ids son únicos', () => {
    const ids = dictations.map((d) => d.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('cada nivel tiene al menos 5 dictados', () => {
    for (const level of dictationLevels) {
      const count = dictations.filter((d) => d.level === level).length;
      expect(count).toBeGreaterThanOrEqual(5);
    }
  });

  it('cada dictado tiene portada, título bilingüe y partes completas', () => {
    for (const d of dictations) {
      expect(d.emoji.length).toBeGreaterThan(0);
      expect(d.title.es.length).toBeGreaterThan(0);
      expect(d.title.en.length).toBeGreaterThan(0);
      expect(dictationLevels).toContain(d.level);
      expect(d.items.length).toBeGreaterThanOrEqual(4);
      for (const item of d.items) {
        expect(item.es.trim().length).toBeGreaterThan(0);
        expect(item.en.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it('las partes suben de largo con el nivel (en promedio)', () => {
    const avgWords = (level: number) => {
      const items = dictations
        .filter((d) => d.level === level)
        .flatMap((d) => d.items);
      const words = items.reduce((sum, i) => sum + i.es.split(/\s+/).length, 0);
      return words / items.length;
    };
    expect(avgWords(1)).toBeLessThan(avgWords(2));
    expect(avgWords(2)).toBeLessThan(avgWords(3));
  });
});
