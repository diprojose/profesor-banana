import { describe, it, expect } from 'vitest';
import {
  generateVocabQuestion,
  updateSeenWords,
  vocabModes,
  type Random,
} from './vocabGenerator';
import { type VocabWord } from './vocabulary';
import { englishVocabulary } from '../english/vocabulary';
import { frenchVocabulary } from '../french/vocabulary';

function seededRandom(seed: number): Random {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0xffffffff;
  };
}

const islands: [string, VocabWord[]][] = [
  ['inglés', englishVocabulary],
  ['francés', frenchVocabulary],
];

describe.each(islands)('generateVocabQuestion (%s)', (_name, vocab) => {
  it('incluye la palabra correcta entre las opciones', () => {
    const rng = seededRandom(3);
    for (let i = 0; i < 300; i++) {
      const q = generateVocabQuestion(vocab, 4, [], rng);
      expect(q.options.map((o) => o.id)).toContain(q.item.id);
    }
  });

  it('genera opciones únicas (sin repetir la palabra)', () => {
    const rng = seededRandom(11);
    for (let i = 0; i < 300; i++) {
      const q = generateVocabQuestion(vocab, 4, [], rng);
      expect(q.options).toHaveLength(4);
      const words = q.options.map((o) => o.word);
      expect(new Set(words).size).toBe(4);
    }
  });

  it('prefiere distractores de la misma categoría', () => {
    const rng = seededRandom(5);
    for (let i = 0; i < 200; i++) {
      const q = generateVocabQuestion(vocab, 4, [], rng);
      // Todas las categorías tienen bastantes palabras, así que los
      // 3 distractores siempre pueden salir de la misma categoría.
      for (const option of q.options) {
        expect(option.category).toBe(q.item.category);
      }
    }
  });

  it('usa un modo de juego válido y respeta el modo forzado', () => {
    const rng = seededRandom(9);
    for (let i = 0; i < 100; i++) {
      const q = generateVocabQuestion(vocab, 4, [], rng);
      expect(vocabModes).toContain(q.mode);
    }
    const forced = generateVocabQuestion(vocab, 4, [], rng, 'audio-to-picture');
    expect(forced.mode).toBe('audio-to-picture');
  });

  it('evita las palabras recientes cuando hay margen', () => {
    const rng = seededRandom(7);
    const recent: string[] = [];
    for (let i = 0; i < 60; i++) {
      const q = generateVocabQuestion(vocab, 4, recent, rng);
      expect(recent).not.toContain(q.item.id);
      recent.unshift(q.item.id);
      if (recent.length > 8) recent.pop();
    }
  });

  it('con el mazo, recorre TODO el vocabulario sin repetir ninguna', () => {
    const rng = seededRandom(13);
    let seen: string[] = [];
    const cycle = new Set<string>();
    for (let i = 0; i < vocab.length; i++) {
      const q = generateVocabQuestion(vocab, 4, seen, rng);
      expect(cycle.has(q.item.id)).toBe(false);
      cycle.add(q.item.id);
      seen = updateSeenWords(seen, q.item.id, vocab.length, 8);
    }
    expect(cycle.size).toBe(vocab.length);
    // La vuelta siguiente tampoco repite las últimas 8 de la anterior.
    const next = generateVocabQuestion(vocab, 4, seen, rng);
    expect(seen).not.toContain(next.item.id);
    expect(seen.length).toBeLessThanOrEqual(8);
  });
});

describe.each(islands)('vocabulario (%s)', (_name, vocab) => {
  it('cada palabra tiene emoji, palabra, traducción y categoría', () => {
    for (const v of vocab) {
      expect(v.emoji.length).toBeGreaterThan(0);
      expect(v.word.length).toBeGreaterThan(0);
      expect(v.es.length).toBeGreaterThan(0);
      expect(v.category.length).toBeGreaterThan(0);
    }
  });

  it('los ids son únicos', () => {
    const ids = vocab.map((v) => v.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('cada categoría tiene bastantes palabras para armar opciones', () => {
    const byCategory = new Map<string, number>();
    for (const v of vocab) {
      byCategory.set(v.category, (byCategory.get(v.category) ?? 0) + 1);
    }
    for (const count of byCategory.values()) {
      expect(count).toBeGreaterThanOrEqual(4);
    }
  });
});

describe('tamaño de los vocabularios', () => {
  it('inglés tiene 100+ palabras y francés 60+', () => {
    expect(englishVocabulary.length).toBeGreaterThanOrEqual(100);
    expect(frenchVocabulary.length).toBeGreaterThanOrEqual(60);
  });
});
