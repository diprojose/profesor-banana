/**
 * Vocabulario de la Isla del Inglés.
 * Cada palabra usa un emoji como "dibujo" (claro, colorido y sin
 * tener que ilustrar cada SVG), con su nombre en inglés y español.
 */

export interface VocabItem {
  id: string;
  emoji: string;
  en: string;
  es: string;
}

export const vocabulary: VocabItem[] = [
  { id: 'pencil', emoji: '✏️', en: 'pencil', es: 'lápiz' },
  { id: 'apple', emoji: '🍎', en: 'apple', es: 'manzana' },
  { id: 'cat', emoji: '🐱', en: 'cat', es: 'gato' },
  { id: 'dog', emoji: '🐶', en: 'dog', es: 'perro' },
  { id: 'sun', emoji: '☀️', en: 'sun', es: 'sol' },
  { id: 'star', emoji: '⭐', en: 'star', es: 'estrella' },
  { id: 'tree', emoji: '🌳', en: 'tree', es: 'árbol' },
  { id: 'house', emoji: '🏠', en: 'house', es: 'casa' },
  { id: 'fish', emoji: '🐟', en: 'fish', es: 'pez' },
  { id: 'car', emoji: '🚗', en: 'car', es: 'coche' },
  { id: 'ball', emoji: '⚽', en: 'ball', es: 'pelota' },
  { id: 'book', emoji: '📖', en: 'book', es: 'libro' },
  { id: 'flower', emoji: '🌸', en: 'flower', es: 'flor' },
  { id: 'bird', emoji: '🐦', en: 'bird', es: 'pájaro' },
  { id: 'moon', emoji: '🌙', en: 'moon', es: 'luna' },
  { id: 'hat', emoji: '🎩', en: 'hat', es: 'sombrero' },
  { id: 'milk', emoji: '🥛', en: 'milk', es: 'leche' },
  { id: 'cake', emoji: '🍰', en: 'cake', es: 'pastel' },
];
