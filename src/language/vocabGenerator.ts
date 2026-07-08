/**
 * Generador de preguntas de las islas de idiomas.
 *
 * Cada pregunta tiene un modo de juego:
 *  - 'picture-to-word': se muestra el dibujo y se elige la palabra.
 *  - 'audio-to-picture': se oye la palabra y se elige el dibujo.
 *  - 'word-to-picture': se lee la palabra y se elige el dibujo.
 *
 * Los distractores se toman primero de la misma categoría (distinguir
 * "cat" de "dog" enseña más que distinguir "cat" de "pencil") y se
 * completan con otras palabras si la categoría no alcanza. Igual que
 * en matemáticas, se evita repetir la misma palabra seguida.
 */

import { type VocabWord } from './vocabulary';

export type Random = () => number;

export type VocabMode =
  | 'picture-to-word'
  | 'audio-to-picture'
  | 'word-to-picture';

export const vocabModes: readonly VocabMode[] = [
  'picture-to-word',
  'audio-to-picture',
  'word-to-picture',
];

export interface VocabQuestion {
  mode: VocabMode;
  item: VocabWord;
  /** Opciones a elegir, mezcladas, incluyendo la correcta. */
  options: VocabWord[];
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
 * Elige distractores para un item: primero de su misma categoría,
 * luego del resto. Nunca repite la palabra ("orange" fruta y "orange"
 * color no pueden aparecer en la misma pregunta).
 */
function pickDistractors(
  rng: Random,
  vocabulary: readonly VocabWord[],
  item: VocabWord,
  count: number,
): VocabWord[] {
  const result: VocabWord[] = [];
  const usedWords = new Set<string>([item.word]);

  const takeFrom = (pool: VocabWord[]) => {
    for (const candidate of shuffle(rng, pool)) {
      if (result.length >= count) break;
      if (usedWords.has(candidate.word)) continue;
      usedWords.add(candidate.word);
      result.push(candidate);
    }
  };

  takeFrom(
    vocabulary.filter((v) => v.category === item.category && v.id !== item.id),
  );
  takeFrom(vocabulary.filter((v) => v.category !== item.category));
  return result;
}

/**
 * Crea una pregunta evitando las palabras recientes.
 * @param vocabulary Vocabulario de la isla (inglés, francés, ...).
 * @param optionCount Número de opciones (incluida la correcta).
 * @param recentIds Ids de palabras que salieron hace poco.
 * @param rng Fuente de aleatoriedad (inyectable para tests).
 * @param mode Modo de juego; si se omite, se elige uno al azar.
 */
export function generateVocabQuestion(
  vocabulary: readonly VocabWord[],
  optionCount = 4,
  recentIds: readonly string[] = [],
  rng: Random = Math.random,
  mode?: VocabMode,
): VocabQuestion {
  const pool =
    vocabulary.length > recentIds.length
      ? vocabulary.filter((v) => !recentIds.includes(v.id))
      : vocabulary;

  const item = pool[Math.floor(rng() * pool.length)];
  const distractors = pickDistractors(
    rng,
    vocabulary,
    item,
    Math.max(0, optionCount - 1),
  );
  const options = shuffle(rng, [item, ...distractors]);
  const chosenMode = mode ?? vocabModes[Math.floor(rng() * vocabModes.length)];

  return { mode: chosenMode, item, options };
}

/**
 * Lleva el "mazo" de palabras vistas: ninguna palabra se repite hasta
 * haber recorrido TODO el vocabulario. Cuando se completa la vuelta,
 * el mazo se reinicia conservando las `keep` más recientes para que
 * tampoco haya repeticiones justo en el cambio de vuelta.
 *
 * Uso: pasar `seen` como `recentIds` al generador y actualizarlo con
 * esta función tras cada pregunta.
 */
export function updateSeenWords(
  seen: readonly string[],
  newId: string,
  vocabSize: number,
  keep = 8,
): string[] {
  const next = [newId, ...seen.filter((id) => id !== newId)];
  if (next.length >= vocabSize) {
    // Vuelta completa: empezar de nuevo sin repetir las últimas.
    return next.slice(0, Math.min(keep, Math.max(0, vocabSize - 1)));
  }
  return next;
}
