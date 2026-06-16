/**
 * Páginas del cuento para la Isla de las Palabras.
 * Cada página tiene la frase en español e inglés.
 *
 * Más adelante esto puede crecer a cuentos completos con
 * ilustraciones por página, niveles de dificultad, etc.
 */

export interface ReadingPage {
  es: string;
  en: string;
}

export const readingPages: ReadingPage[] = [
  {
    es: 'El pequeño barco navega por el mar azul.',
    en: 'The little boat sails on the blue sea.',
  },
  {
    es: 'El sol brilla sobre la isla feliz.',
    en: 'The sun shines over the happy island.',
  },
  {
    es: 'Una palmera verde baila con el viento.',
    en: 'A green palm tree dances in the wind.',
  },
];
