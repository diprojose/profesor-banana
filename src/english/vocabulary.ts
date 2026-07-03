/**
 * Vocabulario de la Isla del Inglés.
 * Cada palabra usa un emoji como "dibujo" (claro, colorido y sin
 * tener que ilustrar cada SVG), con su nombre en inglés y español,
 * y pertenece a una categoría (los distractores se eligen primero
 * de la misma categoría para que la pregunta enseñe a distinguir).
 */

import { type VocabWord, type CategoryNames } from '../language/vocabulary';

export type Category =
  | 'animals'
  | 'food'
  | 'colors'
  | 'numbers'
  | 'school'
  | 'home'
  | 'body'
  | 'clothes'
  | 'nature'
  | 'transport';

/** Nombre visible de cada categoría en ambos idiomas. */
export const categoryNames: CategoryNames = {
  animals: { es: 'Animales', en: 'Animals' },
  food: { es: 'Comida', en: 'Food' },
  colors: { es: 'Colores', en: 'Colors' },
  numbers: { es: 'Números', en: 'Numbers' },
  school: { es: 'La escuela', en: 'School' },
  home: { es: 'La casa', en: 'Home' },
  body: { es: 'El cuerpo', en: 'Body' },
  clothes: { es: 'La ropa', en: 'Clothes' },
  nature: { es: 'La naturaleza', en: 'Nature' },
  transport: { es: 'Transporte y juguetes', en: 'Transport & toys' },
};

export interface VocabItem {
  id: string;
  emoji: string;
  en: string;
  es: string;
  category: Category;
}

export const vocabulary: VocabItem[] = [
  // ---- Animales ----
  { id: 'cat', emoji: '🐱', en: 'cat', es: 'gato', category: 'animals' },
  { id: 'dog', emoji: '🐶', en: 'dog', es: 'perro', category: 'animals' },
  { id: 'fish', emoji: '🐟', en: 'fish', es: 'pez', category: 'animals' },
  { id: 'bird', emoji: '🐦', en: 'bird', es: 'pájaro', category: 'animals' },
  { id: 'horse', emoji: '🐴', en: 'horse', es: 'caballo', category: 'animals' },
  { id: 'cow', emoji: '🐮', en: 'cow', es: 'vaca', category: 'animals' },
  { id: 'pig', emoji: '🐷', en: 'pig', es: 'cerdo', category: 'animals' },
  { id: 'rabbit', emoji: '🐰', en: 'rabbit', es: 'conejo', category: 'animals' },
  { id: 'lion', emoji: '🦁', en: 'lion', es: 'león', category: 'animals' },
  { id: 'monkey', emoji: '🐵', en: 'monkey', es: 'mono', category: 'animals' },
  { id: 'bear', emoji: '🐻', en: 'bear', es: 'oso', category: 'animals' },
  { id: 'duck', emoji: '🦆', en: 'duck', es: 'pato', category: 'animals' },
  { id: 'elephant', emoji: '🐘', en: 'elephant', es: 'elefante', category: 'animals' },
  { id: 'frog', emoji: '🐸', en: 'frog', es: 'rana', category: 'animals' },

  // ---- Comida ----
  { id: 'apple', emoji: '🍎', en: 'apple', es: 'manzana', category: 'food' },
  { id: 'milk', emoji: '🥛', en: 'milk', es: 'leche', category: 'food' },
  { id: 'cake', emoji: '🍰', en: 'cake', es: 'pastel', category: 'food' },
  { id: 'bread', emoji: '🍞', en: 'bread', es: 'pan', category: 'food' },
  { id: 'cheese', emoji: '🧀', en: 'cheese', es: 'queso', category: 'food' },
  { id: 'egg', emoji: '🥚', en: 'egg', es: 'huevo', category: 'food' },
  { id: 'banana', emoji: '🍌', en: 'banana', es: 'plátano', category: 'food' },
  { id: 'orange', emoji: '🍊', en: 'orange', es: 'naranja', category: 'food' },
  { id: 'strawberry', emoji: '🍓', en: 'strawberry', es: 'fresa', category: 'food' },
  { id: 'pizza', emoji: '🍕', en: 'pizza', es: 'pizza', category: 'food' },
  { id: 'ice-cream', emoji: '🍦', en: 'ice cream', es: 'helado', category: 'food' },
  { id: 'cookie', emoji: '🍪', en: 'cookie', es: 'galleta', category: 'food' },
  { id: 'juice', emoji: '🧃', en: 'juice', es: 'jugo', category: 'food' },
  { id: 'carrot', emoji: '🥕', en: 'carrot', es: 'zanahoria', category: 'food' },

  // ---- Colores ----
  { id: 'color-red', emoji: '❤️', en: 'red', es: 'rojo', category: 'colors' },
  { id: 'color-blue', emoji: '💙', en: 'blue', es: 'azul', category: 'colors' },
  { id: 'color-green', emoji: '💚', en: 'green', es: 'verde', category: 'colors' },
  { id: 'color-yellow', emoji: '💛', en: 'yellow', es: 'amarillo', category: 'colors' },
  { id: 'color-orange', emoji: '🧡', en: 'orange', es: 'naranja', category: 'colors' },
  { id: 'color-purple', emoji: '💜', en: 'purple', es: 'morado', category: 'colors' },
  { id: 'color-pink', emoji: '🎀', en: 'pink', es: 'rosa', category: 'colors' },
  { id: 'color-black', emoji: '🖤', en: 'black', es: 'negro', category: 'colors' },
  { id: 'color-white', emoji: '🤍', en: 'white', es: 'blanco', category: 'colors' },
  { id: 'color-brown', emoji: '🤎', en: 'brown', es: 'marrón', category: 'colors' },

  // ---- Números ----
  { id: 'num-one', emoji: '1️⃣', en: 'one', es: 'uno', category: 'numbers' },
  { id: 'num-two', emoji: '2️⃣', en: 'two', es: 'dos', category: 'numbers' },
  { id: 'num-three', emoji: '3️⃣', en: 'three', es: 'tres', category: 'numbers' },
  { id: 'num-four', emoji: '4️⃣', en: 'four', es: 'cuatro', category: 'numbers' },
  { id: 'num-five', emoji: '5️⃣', en: 'five', es: 'cinco', category: 'numbers' },
  { id: 'num-six', emoji: '6️⃣', en: 'six', es: 'seis', category: 'numbers' },
  { id: 'num-seven', emoji: '7️⃣', en: 'seven', es: 'siete', category: 'numbers' },
  { id: 'num-eight', emoji: '8️⃣', en: 'eight', es: 'ocho', category: 'numbers' },
  { id: 'num-nine', emoji: '9️⃣', en: 'nine', es: 'nueve', category: 'numbers' },
  { id: 'num-ten', emoji: '🔟', en: 'ten', es: 'diez', category: 'numbers' },

  // ---- La escuela ----
  { id: 'pencil', emoji: '✏️', en: 'pencil', es: 'lápiz', category: 'school' },
  { id: 'book', emoji: '📖', en: 'book', es: 'libro', category: 'school' },
  { id: 'backpack', emoji: '🎒', en: 'backpack', es: 'mochila', category: 'school' },
  { id: 'scissors', emoji: '✂️', en: 'scissors', es: 'tijeras', category: 'school' },
  { id: 'ruler', emoji: '📏', en: 'ruler', es: 'regla', category: 'school' },
  { id: 'crayon', emoji: '🖍️', en: 'crayon', es: 'crayón', category: 'school' },
  { id: 'notebook', emoji: '📓', en: 'notebook', es: 'cuaderno', category: 'school' },
  { id: 'school', emoji: '🏫', en: 'school', es: 'escuela', category: 'school' },
  { id: 'paper', emoji: '📄', en: 'paper', es: 'papel', category: 'school' },
  { id: 'paint', emoji: '🎨', en: 'paint', es: 'pintura', category: 'school' },

  // ---- La casa ----
  { id: 'house', emoji: '🏠', en: 'house', es: 'casa', category: 'home' },
  { id: 'bed', emoji: '🛏️', en: 'bed', es: 'cama', category: 'home' },
  { id: 'chair', emoji: '🪑', en: 'chair', es: 'silla', category: 'home' },
  { id: 'door', emoji: '🚪', en: 'door', es: 'puerta', category: 'home' },
  { id: 'window', emoji: '🪟', en: 'window', es: 'ventana', category: 'home' },
  { id: 'key', emoji: '🔑', en: 'key', es: 'llave', category: 'home' },
  { id: 'lamp', emoji: '💡', en: 'lamp', es: 'lámpara', category: 'home' },
  { id: 'spoon', emoji: '🥄', en: 'spoon', es: 'cuchara', category: 'home' },
  { id: 'clock', emoji: '⏰', en: 'clock', es: 'reloj', category: 'home' },
  { id: 'phone', emoji: '📱', en: 'phone', es: 'teléfono', category: 'home' },
  { id: 'television', emoji: '📺', en: 'television', es: 'televisión', category: 'home' },
  { id: 'soap', emoji: '🧼', en: 'soap', es: 'jabón', category: 'home' },

  // ---- El cuerpo ----
  { id: 'eye', emoji: '👁️', en: 'eye', es: 'ojo', category: 'body' },
  { id: 'ear', emoji: '👂', en: 'ear', es: 'oreja', category: 'body' },
  { id: 'nose', emoji: '👃', en: 'nose', es: 'nariz', category: 'body' },
  { id: 'mouth', emoji: '👄', en: 'mouth', es: 'boca', category: 'body' },
  { id: 'hand', emoji: '✋', en: 'hand', es: 'mano', category: 'body' },
  { id: 'foot', emoji: '🦶', en: 'foot', es: 'pie', category: 'body' },
  { id: 'tooth', emoji: '🦷', en: 'tooth', es: 'diente', category: 'body' },
  { id: 'tongue', emoji: '👅', en: 'tongue', es: 'lengua', category: 'body' },
  { id: 'arm', emoji: '💪', en: 'arm', es: 'brazo', category: 'body' },
  { id: 'leg', emoji: '🦵', en: 'leg', es: 'pierna', category: 'body' },

  // ---- La ropa ----
  { id: 'hat', emoji: '🎩', en: 'hat', es: 'sombrero', category: 'clothes' },
  { id: 'shirt', emoji: '👕', en: 'shirt', es: 'camiseta', category: 'clothes' },
  { id: 'pants', emoji: '👖', en: 'pants', es: 'pantalón', category: 'clothes' },
  { id: 'dress', emoji: '👗', en: 'dress', es: 'vestido', category: 'clothes' },
  { id: 'shoes', emoji: '👟', en: 'shoes', es: 'zapatos', category: 'clothes' },
  { id: 'socks', emoji: '🧦', en: 'socks', es: 'calcetines', category: 'clothes' },
  { id: 'coat', emoji: '🧥', en: 'coat', es: 'abrigo', category: 'clothes' },
  { id: 'scarf', emoji: '🧣', en: 'scarf', es: 'bufanda', category: 'clothes' },
  { id: 'gloves', emoji: '🧤', en: 'gloves', es: 'guantes', category: 'clothes' },
  { id: 'cap', emoji: '🧢', en: 'cap', es: 'gorra', category: 'clothes' },

  // ---- La naturaleza ----
  { id: 'sun', emoji: '☀️', en: 'sun', es: 'sol', category: 'nature' },
  { id: 'star', emoji: '⭐', en: 'star', es: 'estrella', category: 'nature' },
  { id: 'tree', emoji: '🌳', en: 'tree', es: 'árbol', category: 'nature' },
  { id: 'flower', emoji: '🌸', en: 'flower', es: 'flor', category: 'nature' },
  { id: 'moon', emoji: '🌙', en: 'moon', es: 'luna', category: 'nature' },
  { id: 'rain', emoji: '🌧️', en: 'rain', es: 'lluvia', category: 'nature' },
  { id: 'snow', emoji: '❄️', en: 'snow', es: 'nieve', category: 'nature' },
  { id: 'cloud', emoji: '☁️', en: 'cloud', es: 'nube', category: 'nature' },
  { id: 'mountain', emoji: '⛰️', en: 'mountain', es: 'montaña', category: 'nature' },
  { id: 'sea', emoji: '🌊', en: 'sea', es: 'mar', category: 'nature' },
  { id: 'leaf', emoji: '🍃', en: 'leaf', es: 'hoja', category: 'nature' },
  { id: 'rainbow', emoji: '🌈', en: 'rainbow', es: 'arcoíris', category: 'nature' },

  // ---- Transporte y juguetes ----
  { id: 'car', emoji: '🚗', en: 'car', es: 'coche', category: 'transport' },
  { id: 'ball', emoji: '⚽', en: 'ball', es: 'pelota', category: 'transport' },
  { id: 'boat', emoji: '⛵', en: 'boat', es: 'barco', category: 'transport' },
  { id: 'plane', emoji: '✈️', en: 'plane', es: 'avión', category: 'transport' },
  { id: 'train', emoji: '🚂', en: 'train', es: 'tren', category: 'transport' },
  { id: 'bus', emoji: '🚌', en: 'bus', es: 'autobús', category: 'transport' },
  { id: 'bike', emoji: '🚲', en: 'bike', es: 'bicicleta', category: 'transport' },
  { id: 'rocket', emoji: '🚀', en: 'rocket', es: 'cohete', category: 'transport' },
  { id: 'truck', emoji: '🚚', en: 'truck', es: 'camión', category: 'transport' },
  { id: 'kite', emoji: '🪁', en: 'kite', es: 'cometa', category: 'transport' },
  { id: 'teddy-bear', emoji: '🧸', en: 'teddy bear', es: 'osito', category: 'transport' },
  { id: 'drum', emoji: '🥁', en: 'drum', es: 'tambor', category: 'transport' },
];

/**
 * El mismo vocabulario en el formato genérico de las islas de
 * idiomas (`word` = palabra que se aprende). La pantalla y el
 * generador compartidos trabajan con esta forma.
 */
export const englishVocabulary: VocabWord[] = vocabulary.map((v) => ({
  id: v.id,
  emoji: v.emoji,
  word: v.en,
  es: v.es,
  category: v.category,
}));
