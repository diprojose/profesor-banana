/**
 * Cuentos para la Isla de las Palabras.
 * Cada cuento tiene un emoji de portada, título (ES/EN) y varias
 * páginas con la frase en ambos idiomas.
 */

export interface ReadingPage {
  es: string;
  en: string;
}

export interface Story {
  id: string;
  emoji: string;
  title: { es: string; en: string };
  pages: ReadingPage[];
}

export const stories: Story[] = [
  {
    id: 'boat',
    emoji: '⛵',
    title: { es: 'El barco aventurero', en: 'The Adventurous Boat' },
    pages: [
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
      {
        es: 'Un cangrejo rojo camina por la arena.',
        en: 'A red crab walks on the sand.',
      },
      {
        es: 'El barco llega a la playa dorada.',
        en: 'The boat reaches the golden beach.',
      },
      {
        es: 'Todos los amigos juegan felices al sol.',
        en: 'All the friends play happily in the sun.',
      },
    ],
  },
  {
    id: 'garden',
    emoji: '🌷',
    title: { es: 'El jardín mágico', en: 'The Magic Garden' },
    pages: [
      {
        es: 'En el jardín crece una flor amarilla.',
        en: 'A yellow flower grows in the garden.',
      },
      {
        es: 'Una abeja vuela de flor en flor.',
        en: 'A bee flies from flower to flower.',
      },
      {
        es: 'La mariposa tiene alas de colores.',
        en: 'The butterfly has colorful wings.',
      },
      {
        es: 'El árbol grande da una sombra fresca.',
        en: 'The big tree gives cool shade.',
      },
      {
        es: 'Llueve un poco y todo se pone verde.',
        en: 'It rains a little and everything turns green.',
      },
    ],
  },
  {
    id: 'pets',
    emoji: '🐶',
    title: { es: 'Mis mascotas', en: 'My Pets' },
    pages: [
      {
        es: 'El perro corre detrás de la pelota.',
        en: 'The dog runs after the ball.',
      },
      {
        es: 'El gato duerme sobre la silla.',
        en: 'The cat sleeps on the chair.',
      },
      {
        es: 'El pez nada en el agua clara.',
        en: 'The fish swims in the clear water.',
      },
      {
        es: 'El pájaro canta una canción bonita.',
        en: 'The bird sings a pretty song.',
      },
      {
        es: 'Todos los animales son mis amigos.',
        en: 'All the animals are my friends.',
      },
    ],
  },
];
