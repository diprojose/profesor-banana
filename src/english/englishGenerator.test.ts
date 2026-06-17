import { describe, it, expect } from 'vitest';
import { generateEnglishQuestion, type Random } from './englishGenerator';
import { vocabulary } from './vocabulary';

function seededRandom(seed: number): Random {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0xffffffff;
  };
}

describe('generateEnglishQuestion', () => {
  it('incluye la palabra correcta entre las opciones', () => {
    const rng = seededRandom(3);
    for (let i = 0; i < 300; i++) {
      const q = generateEnglishQuestion(3, [], rng);
      expect(q.options).toContain(q.item.en);
    }
  });

  it('genera opciones únicas y en el número pedido', () => {
    const rng = seededRandom(11);
    for (let i = 0; i < 300; i++) {
      const q = generateEnglishQuestion(4, [], rng);
      expect(q.options).toHaveLength(4);
      expect(new Set(q.options).size).toBe(4);
    }
  });

  it('evita las palabras recientes cuando hay margen', () => {
    const rng = seededRandom(7);
    const recent: string[] = [];
    for (let i = 0; i < 60; i++) {
      const q = generateEnglishQuestion(3, recent, rng);
      expect(recent).not.toContain(q.item.id);
      recent.unshift(q.item.id);
      if (recent.length > 5) recent.pop();
    }
  });

  it('cada palabra del vocabulario tiene emoji, en y es', () => {
    for (const v of vocabulary) {
      expect(v.emoji.length).toBeGreaterThan(0);
      expect(v.en.length).toBeGreaterThan(0);
      expect(v.es.length).toBeGreaterThan(0);
    }
  });
});
