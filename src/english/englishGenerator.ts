/**
 * Generador de preguntas de la Isla del Inglés: elige una palabra al
 * azar y arma opciones (la correcta + distractores de otras palabras).
 * Igual que en matemáticas, evita repetir la misma palabra seguida.
 */

import { vocabulary, type VocabItem } from './vocabulary';

export type Random = () => number;

export interface EnglishQuestion {
  item: VocabItem;
  /** Palabras en inglés a elegir, mezcladas, incluyendo la correcta. */
  options: string[];
}

function shuffle<T>(rng: Random, items: readonly T[]): T[] {
  const result = items.slice();
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Crea una pregunta evitando las palabras recientes.
 * @param optionCount Número de opciones (incluida la correcta).
 * @param recentIds Ids de palabras que salieron hace poco.
 */
export function generateEnglishQuestion(
  optionCount = 3,
  recentIds: readonly string[] = [],
  rng: Random = Math.random,
): EnglishQuestion {
  const pool =
    vocabulary.length > recentIds.length
      ? vocabulary.filter((v) => !recentIds.includes(v.id))
      : vocabulary;

  const item = pool[Math.floor(rng() * pool.length)];

  // Distractores: palabras en inglés de otros items.
  const distractors = shuffle(
    rng,
    vocabulary.filter((v) => v.id !== item.id).map((v) => v.en),
  ).slice(0, Math.max(0, optionCount - 1));

  const options = shuffle(rng, [item.en, ...distractors]);
  return { item, options };
}
