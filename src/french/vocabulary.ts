/**
 * Vocabulario de la Isla del Francés.
 * Mismo formato genérico que el inglés (ver src/language/vocabulary).
 * Los sustantivos llevan artículo ("le chat", "la pomme"): así se
 * aprenden en clase y así los pronuncia mejor el TTS.
 */

import { type VocabWord, type CategoryNames } from '../language/vocabulary';

/** Nombre visible de cada categoría en ambos idiomas de la UI. */
export const frenchCategoryNames: CategoryNames = {
  animals: { es: 'Animales', en: 'Animals' },
  food: { es: 'Comida', en: 'Food' },
  colors: { es: 'Colores', en: 'Colors' },
  numbers: { es: 'Números', en: 'Numbers' },
  school: { es: 'La escuela', en: 'School' },
  home: { es: 'La casa', en: 'Home' },
  nature: { es: 'La naturaleza', en: 'Nature' },
  transport: { es: 'Transporte y juguetes', en: 'Transport & toys' },
};

export const frenchVocabulary: VocabWord[] = [
  // ---- Animales ----
  { id: 'fr-cat', emoji: '🐱', word: 'le chat', es: 'el gato', category: 'animals' },
  { id: 'fr-dog', emoji: '🐶', word: 'le chien', es: 'el perro', category: 'animals' },
  { id: 'fr-fish', emoji: '🐟', word: 'le poisson', es: 'el pez', category: 'animals' },
  { id: 'fr-bird', emoji: '🐦', word: "l'oiseau", es: 'el pájaro', category: 'animals' },
  { id: 'fr-horse', emoji: '🐴', word: 'le cheval', es: 'el caballo', category: 'animals' },
  { id: 'fr-cow', emoji: '🐮', word: 'la vache', es: 'la vaca', category: 'animals' },
  { id: 'fr-rabbit', emoji: '🐰', word: 'le lapin', es: 'el conejo', category: 'animals' },
  { id: 'fr-lion', emoji: '🦁', word: 'le lion', es: 'el león', category: 'animals' },

  // ---- Comida ----
  { id: 'fr-apple', emoji: '🍎', word: 'la pomme', es: 'la manzana', category: 'food' },
  { id: 'fr-bread', emoji: '🍞', word: 'le pain', es: 'el pan', category: 'food' },
  { id: 'fr-milk', emoji: '🥛', word: 'le lait', es: 'la leche', category: 'food' },
  { id: 'fr-cheese', emoji: '🧀', word: 'le fromage', es: 'el queso', category: 'food' },
  { id: 'fr-banana', emoji: '🍌', word: 'la banane', es: 'el plátano', category: 'food' },
  { id: 'fr-cake', emoji: '🍰', word: 'le gâteau', es: 'el pastel', category: 'food' },
  { id: 'fr-egg', emoji: '🥚', word: "l'œuf", es: 'el huevo', category: 'food' },
  { id: 'fr-strawberry', emoji: '🍓', word: 'la fraise', es: 'la fresa', category: 'food' },

  // ---- Colores ----
  { id: 'fr-red', emoji: '❤️', word: 'rouge', es: 'rojo', category: 'colors' },
  { id: 'fr-blue', emoji: '💙', word: 'bleu', es: 'azul', category: 'colors' },
  { id: 'fr-green', emoji: '💚', word: 'vert', es: 'verde', category: 'colors' },
  { id: 'fr-yellow', emoji: '💛', word: 'jaune', es: 'amarillo', category: 'colors' },
  { id: 'fr-orange', emoji: '🧡', word: 'orange', es: 'naranja', category: 'colors' },
  { id: 'fr-purple', emoji: '💜', word: 'violet', es: 'morado', category: 'colors' },
  { id: 'fr-black', emoji: '🖤', word: 'noir', es: 'negro', category: 'colors' },
  { id: 'fr-white', emoji: '🤍', word: 'blanc', es: 'blanco', category: 'colors' },

  // ---- Números ----
  { id: 'fr-one', emoji: '1️⃣', word: 'un', es: 'uno', category: 'numbers' },
  { id: 'fr-two', emoji: '2️⃣', word: 'deux', es: 'dos', category: 'numbers' },
  { id: 'fr-three', emoji: '3️⃣', word: 'trois', es: 'tres', category: 'numbers' },
  { id: 'fr-four', emoji: '4️⃣', word: 'quatre', es: 'cuatro', category: 'numbers' },
  { id: 'fr-five', emoji: '5️⃣', word: 'cinq', es: 'cinco', category: 'numbers' },
  { id: 'fr-six', emoji: '6️⃣', word: 'six', es: 'seis', category: 'numbers' },
  { id: 'fr-seven', emoji: '7️⃣', word: 'sept', es: 'siete', category: 'numbers' },
  { id: 'fr-eight', emoji: '8️⃣', word: 'huit', es: 'ocho', category: 'numbers' },

  // ---- La escuela ----
  { id: 'fr-pencil', emoji: '✏️', word: 'le crayon', es: 'el lápiz', category: 'school' },
  { id: 'fr-book', emoji: '📖', word: 'le livre', es: 'el libro', category: 'school' },
  { id: 'fr-backpack', emoji: '🎒', word: 'le sac', es: 'la mochila', category: 'school' },
  { id: 'fr-scissors', emoji: '✂️', word: 'les ciseaux', es: 'las tijeras', category: 'school' },
  { id: 'fr-ruler', emoji: '📏', word: 'la règle', es: 'la regla', category: 'school' },
  { id: 'fr-notebook', emoji: '📓', word: 'le cahier', es: 'el cuaderno', category: 'school' },
  { id: 'fr-school', emoji: '🏫', word: "l'école", es: 'la escuela', category: 'school' },
  { id: 'fr-paper', emoji: '📄', word: 'le papier', es: 'el papel', category: 'school' },

  // ---- La casa ----
  { id: 'fr-house', emoji: '🏠', word: 'la maison', es: 'la casa', category: 'home' },
  { id: 'fr-bed', emoji: '🛏️', word: 'le lit', es: 'la cama', category: 'home' },
  { id: 'fr-chair', emoji: '🪑', word: 'la chaise', es: 'la silla', category: 'home' },
  { id: 'fr-door', emoji: '🚪', word: 'la porte', es: 'la puerta', category: 'home' },
  { id: 'fr-key', emoji: '🔑', word: 'la clé', es: 'la llave', category: 'home' },
  { id: 'fr-window', emoji: '🪟', word: 'la fenêtre', es: 'la ventana', category: 'home' },
  { id: 'fr-lamp', emoji: '💡', word: 'la lampe', es: 'la lámpara', category: 'home' },
  { id: 'fr-phone', emoji: '📱', word: 'le téléphone', es: 'el teléfono', category: 'home' },

  // ---- La naturaleza ----
  { id: 'fr-sun', emoji: '☀️', word: 'le soleil', es: 'el sol', category: 'nature' },
  { id: 'fr-moon', emoji: '🌙', word: 'la lune', es: 'la luna', category: 'nature' },
  { id: 'fr-star', emoji: '⭐', word: "l'étoile", es: 'la estrella', category: 'nature' },
  { id: 'fr-tree', emoji: '🌳', word: "l'arbre", es: 'el árbol', category: 'nature' },
  { id: 'fr-flower', emoji: '🌸', word: 'la fleur', es: 'la flor', category: 'nature' },
  { id: 'fr-rain', emoji: '🌧️', word: 'la pluie', es: 'la lluvia', category: 'nature' },
  { id: 'fr-snow', emoji: '❄️', word: 'la neige', es: 'la nieve', category: 'nature' },
  { id: 'fr-sea', emoji: '🌊', word: 'la mer', es: 'el mar', category: 'nature' },

  // ---- Transporte y juguetes ----
  { id: 'fr-car', emoji: '🚗', word: 'la voiture', es: 'el coche', category: 'transport' },
  { id: 'fr-boat', emoji: '⛵', word: 'le bateau', es: 'el barco', category: 'transport' },
  { id: 'fr-plane', emoji: '✈️', word: "l'avion", es: 'el avión', category: 'transport' },
  { id: 'fr-train', emoji: '🚂', word: 'le train', es: 'el tren', category: 'transport' },
  { id: 'fr-bike', emoji: '🚲', word: 'le vélo', es: 'la bicicleta', category: 'transport' },
  { id: 'fr-bus', emoji: '🚌', word: 'le bus', es: 'el autobús', category: 'transport' },
  { id: 'fr-rocket', emoji: '🚀', word: 'la fusée', es: 'el cohete', category: 'transport' },
  { id: 'fr-ball', emoji: '⚽', word: 'le ballon', es: 'la pelota', category: 'transport' },
];
