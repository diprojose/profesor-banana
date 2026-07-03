/**
 * Tipos compartidos de las islas de idiomas (inglés, francés, ...).
 *
 * Cada isla tiene su propio vocabulario (palabras con emoji, la
 * palabra en el idioma que se aprende y su traducción al español) y
 * sus categorías. La pantalla y el generador de preguntas son los
 * mismos para todas las islas.
 */

export interface VocabWord {
  id: string;
  /** Emoji que ilustra la palabra. */
  emoji: string;
  /** Palabra en el idioma que se está aprendiendo. */
  word: string;
  /** Traducción al español. */
  es: string;
  /** Categoría (los distractores salen primero de la misma). */
  category: string;
}

/** Etiqueta visible de una categoría, en ambos idiomas de la UI. */
export type CategoryNames = Record<string, { es: string; en: string }>;
