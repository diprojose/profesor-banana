/**
 * Cuentos para la Isla de las Palabras.
 *
 * Cada cuento tiene un nivel de lectura (1 = frases muy cortas,
 * 3 = frases largas con más vocabulario), un emoji de portada,
 * páginas con la frase en ambos idiomas y su propio emoji de escena,
 * y una pregunta de comprensión al final con 3 opciones.
 */

export type ReadingLevel = 1 | 2 | 3;

export interface ReadingPage {
  es: string;
  en: string;
  /** Emoji que ilustra la escena de esta página. */
  emoji: string;
}

export interface QuizOption {
  emoji: string;
  es: string;
  en: string;
}

export interface StoryQuiz {
  question: { es: string; en: string };
  /** Tres opciones; `correct` es el índice de la buena. */
  options: QuizOption[];
  correct: number;
}

export interface Story {
  id: string;
  emoji: string;
  level: ReadingLevel;
  title: { es: string; en: string };
  pages: ReadingPage[];
  quiz: StoryQuiz;
}

export const readingLevels: readonly ReadingLevel[] = [1, 2, 3];

export const stories: Story[] = [
  // ============ Nivel 1 · Primeros lectores ============
  {
    id: 'sun-day',
    emoji: '☀️',
    level: 1,
    title: { es: 'Buenos días, sol', en: 'Good Morning, Sun' },
    pages: [
      { es: 'El sol sale feliz.', en: 'The sun comes up happy.', emoji: '🌅' },
      { es: 'El gallo canta fuerte.', en: 'The rooster sings loudly.', emoji: '🐓' },
      { es: 'La flor se despierta.', en: 'The flower wakes up.', emoji: '🌸' },
      { es: 'El niño dice: ¡hola!', en: 'The boy says: hello!', emoji: '👦' },
      { es: 'Todos aman el sol.', en: 'Everyone loves the sun.', emoji: '☀️' },
    ],
    quiz: {
      question: { es: '¿Quién canta fuerte?', en: 'Who sings loudly?' },
      options: [
        { emoji: '🐓', es: 'El gallo', en: 'The rooster' },
        { emoji: '🐱', es: 'El gato', en: 'The cat' },
        { emoji: '🐟', es: 'El pez', en: 'The fish' },
      ],
      correct: 0,
    },
  },
  {
    id: 'my-cat',
    emoji: '🐱',
    level: 1,
    title: { es: 'Mi gato Michi', en: 'My Cat Michi' },
    pages: [
      { es: 'Michi es mi gato.', en: 'Michi is my cat.', emoji: '🐱' },
      { es: 'Michi bebe leche.', en: 'Michi drinks milk.', emoji: '🥛' },
      { es: 'Michi juega mucho.', en: 'Michi plays a lot.', emoji: '🧶' },
      { es: 'Michi duerme al sol.', en: 'Michi sleeps in the sun.', emoji: '😴' },
      { es: 'Quiero mucho a Michi.', en: 'I love Michi very much.', emoji: '💛' },
    ],
    quiz: {
      question: { es: '¿Qué bebe Michi?', en: 'What does Michi drink?' },
      options: [
        { emoji: '🧃', es: 'Jugo', en: 'Juice' },
        { emoji: '🥛', es: 'Leche', en: 'Milk' },
        { emoji: '💧', es: 'Agua', en: 'Water' },
      ],
      correct: 1,
    },
  },
  {
    id: 'happy-frog',
    emoji: '🐸',
    level: 1,
    title: { es: 'La rana saltarina', en: 'The Jumping Frog' },
    pages: [
      { es: 'La rana es verde.', en: 'The frog is green.', emoji: '🐸' },
      { es: 'La rana salta alto.', en: 'The frog jumps high.', emoji: '🌿' },
      { es: 'Salta sobre una hoja.', en: 'It jumps on a leaf.', emoji: '🍃' },
      { es: 'La rana dice: ¡croac!', en: 'The frog says: ribbit!', emoji: '🎵' },
      { es: 'La rana está feliz.', en: 'The frog is happy.', emoji: '💚' },
    ],
    quiz: {
      question: { es: '¿De qué color es la rana?', en: 'What color is the frog?' },
      options: [
        { emoji: '❤️', es: 'Roja', en: 'Red' },
        { emoji: '💙', es: 'Azul', en: 'Blue' },
        { emoji: '💚', es: 'Verde', en: 'Green' },
      ],
      correct: 2,
    },
  },
  {
    id: 'the-farm',
    emoji: '🐮',
    level: 1,
    title: { es: 'En la granja', en: 'On the Farm' },
    pages: [
      { es: 'La vaca dice: ¡muu!', en: 'The cow says: moo!', emoji: '🐮' },
      { es: 'El pato nada feliz.', en: 'The duck swims happily.', emoji: '🦆' },
      { es: 'El cerdo come manzanas.', en: 'The pig eats apples.', emoji: '🐷' },
      { es: 'El caballo corre rápido.', en: 'The horse runs fast.', emoji: '🐴' },
      { es: 'Me gusta la granja.', en: 'I like the farm.', emoji: '🚜' },
    ],
    quiz: {
      question: { es: '¿Quién dice muu?', en: 'Who says moo?' },
      options: [
        { emoji: '🐮', es: 'La vaca', en: 'The cow' },
        { emoji: '🐷', es: 'El cerdo', en: 'The pig' },
        { emoji: '🦆', es: 'El pato', en: 'The duck' },
      ],
      correct: 0,
    },
  },

  // ============ Nivel 2 · Lectores valientes ============
  {
    id: 'boat',
    emoji: '⛵',
    level: 2,
    title: { es: 'El barco aventurero', en: 'The Adventurous Boat' },
    pages: [
      {
        es: 'El pequeño barco navega por el mar azul.',
        en: 'The little boat sails on the blue sea.',
        emoji: '⛵',
      },
      {
        es: 'El sol brilla sobre la isla feliz.',
        en: 'The sun shines over the happy island.',
        emoji: '🏝️',
      },
      {
        es: 'Una palmera verde baila con el viento.',
        en: 'A green palm tree dances in the wind.',
        emoji: '🌴',
      },
      {
        es: 'Un cangrejo rojo camina por la arena.',
        en: 'A red crab walks on the sand.',
        emoji: '🦀',
      },
      {
        es: 'El barco llega a la playa dorada.',
        en: 'The boat reaches the golden beach.',
        emoji: '🏖️',
      },
      {
        es: 'Todos los amigos juegan felices al sol.',
        en: 'All the friends play happily in the sun.',
        emoji: '🎉',
      },
    ],
    quiz: {
      question: {
        es: '¿Quién camina por la arena?',
        en: 'Who walks on the sand?',
      },
      options: [
        { emoji: '🐟', es: 'El pez', en: 'The fish' },
        { emoji: '🦀', es: 'El cangrejo', en: 'The crab' },
        { emoji: '🐦', es: 'El pájaro', en: 'The bird' },
      ],
      correct: 1,
    },
  },
  {
    id: 'garden',
    emoji: '🌷',
    level: 2,
    title: { es: 'El jardín mágico', en: 'The Magic Garden' },
    pages: [
      {
        es: 'En el jardín crece una flor amarilla.',
        en: 'A yellow flower grows in the garden.',
        emoji: '🌼',
      },
      {
        es: 'Una abeja vuela de flor en flor.',
        en: 'A bee flies from flower to flower.',
        emoji: '🐝',
      },
      {
        es: 'La mariposa tiene alas de colores.',
        en: 'The butterfly has colorful wings.',
        emoji: '🦋',
      },
      {
        es: 'El árbol grande da una sombra fresca.',
        en: 'The big tree gives cool shade.',
        emoji: '🌳',
      },
      {
        es: 'Llueve un poco y todo se pone verde.',
        en: 'It rains a little and everything turns green.',
        emoji: '🌧️',
      },
    ],
    quiz: {
      question: {
        es: '¿Quién vuela de flor en flor?',
        en: 'Who flies from flower to flower?',
      },
      options: [
        { emoji: '🐌', es: 'El caracol', en: 'The snail' },
        { emoji: '🐶', es: 'El perro', en: 'The dog' },
        { emoji: '🐝', es: 'La abeja', en: 'The bee' },
      ],
      correct: 2,
    },
  },
  {
    id: 'pets',
    emoji: '🐶',
    level: 2,
    title: { es: 'Mis mascotas', en: 'My Pets' },
    pages: [
      {
        es: 'El perro corre detrás de la pelota.',
        en: 'The dog runs after the ball.',
        emoji: '🐶',
      },
      {
        es: 'El gato duerme sobre la silla.',
        en: 'The cat sleeps on the chair.',
        emoji: '🐱',
      },
      {
        es: 'El pez nada en el agua clara.',
        en: 'The fish swims in the clear water.',
        emoji: '🐟',
      },
      {
        es: 'El pájaro canta una canción bonita.',
        en: 'The bird sings a pretty song.',
        emoji: '🐦',
      },
      {
        es: 'Todos los animales son mis amigos.',
        en: 'All the animals are my friends.',
        emoji: '🐾',
      },
    ],
    quiz: {
      question: { es: '¿Dónde duerme el gato?', en: 'Where does the cat sleep?' },
      options: [
        { emoji: '🪑', es: 'En la silla', en: 'On the chair' },
        { emoji: '🛏️', es: 'En la cama', en: 'On the bed' },
        { emoji: '🌳', es: 'En el árbol', en: 'In the tree' },
      ],
      correct: 0,
    },
  },
  {
    id: 'moon-trip',
    emoji: '🚀',
    level: 2,
    title: { es: 'Viaje a la Luna', en: 'Trip to the Moon' },
    pages: [
      {
        es: 'Ana construye un cohete de cartón.',
        en: 'Ana builds a cardboard rocket.',
        emoji: '🚀',
      },
      {
        es: 'El cohete vuela hasta el cielo.',
        en: 'The rocket flies up to the sky.',
        emoji: '🌌',
      },
      {
        es: 'La Luna saluda con su luz blanca.',
        en: 'The Moon waves with its white light.',
        emoji: '🌕',
      },
      {
        es: 'Ana salta muy alto en la Luna.',
        en: 'Ana jumps very high on the Moon.',
        emoji: '👧',
      },
      {
        es: 'Las estrellas brillan a su lado.',
        en: 'The stars shine next to her.',
        emoji: '✨',
      },
      {
        es: 'Ana vuelve a casa para cenar.',
        en: 'Ana comes home for dinner.',
        emoji: '🏠',
      },
    ],
    quiz: {
      question: { es: '¿A dónde viaja Ana?', en: 'Where does Ana travel?' },
      options: [
        { emoji: '🏖️', es: 'A la playa', en: 'To the beach' },
        { emoji: '🌕', es: 'A la Luna', en: 'To the Moon' },
        { emoji: '🏔️', es: 'A la montaña', en: 'To the mountain' },
      ],
      correct: 1,
    },
  },

  // ============ Nivel 3 · Grandes lectores ============
  {
    id: 'kind-dragon',
    emoji: '🐉',
    level: 3,
    title: { es: 'El dragón amable', en: 'The Kind Dragon' },
    pages: [
      {
        es: 'En la montaña vive un dragón grande y amable.',
        en: 'A big, kind dragon lives on the mountain.',
        emoji: '⛰️',
      },
      {
        es: 'Su fuego no quema nada: solo hace palomitas.',
        en: 'His fire burns nothing: it only makes popcorn.',
        emoji: '🍿',
      },
      {
        es: 'Los niños del pueblo suben a merendar con él.',
        en: 'The children from town climb up to snack with him.',
        emoji: '🧺',
      },
      {
        es: 'Un día de frío, el dragón calienta todas las casas.',
        en: 'On a cold day, the dragon warms every house.',
        emoji: '🏘️',
      },
      {
        es: 'Desde entonces, el pueblo celebra la fiesta del dragón.',
        en: 'Since then, the town celebrates the dragon festival.',
        emoji: '🎉',
      },
    ],
    quiz: {
      question: {
        es: '¿Qué hace el fuego del dragón?',
        en: "What does the dragon's fire make?",
      },
      options: [
        { emoji: '🍦', es: 'Helado', en: 'Ice cream' },
        { emoji: '🍕', es: 'Pizza', en: 'Pizza' },
        { emoji: '🍿', es: 'Palomitas', en: 'Popcorn' },
      ],
      correct: 2,
    },
  },
  {
    id: 'sea-secret',
    emoji: '🐬',
    level: 3,
    title: { es: 'El secreto del mar', en: 'The Secret of the Sea' },
    pages: [
      {
        es: 'Bajo las olas azules hay un jardín escondido.',
        en: 'Under the blue waves there is a hidden garden.',
        emoji: '🌊',
      },
      {
        es: 'Un delfín curioso guía a los peces pequeños.',
        en: 'A curious dolphin guides the little fish.',
        emoji: '🐬',
      },
      {
        es: 'Las estrellas de mar duermen sobre rocas suaves.',
        en: 'The starfish sleep on smooth rocks.',
        emoji: '🪸',
      },
      {
        es: 'Una tortuga vieja cuenta historias de barcos antiguos.',
        en: 'An old turtle tells stories about ancient ships.',
        emoji: '🐢',
      },
      {
        es: 'El pulpo pinta las conchas con colores brillantes.',
        en: 'The octopus paints the shells with bright colors.',
        emoji: '🐙',
      },
      {
        es: 'El mar guarda su secreto hasta mañana.',
        en: 'The sea keeps its secret until tomorrow.',
        emoji: '🌙',
      },
    ],
    quiz: {
      question: {
        es: '¿Quién cuenta historias de barcos?',
        en: 'Who tells stories about ships?',
      },
      options: [
        { emoji: '🐢', es: 'La tortuga', en: 'The turtle' },
        { emoji: '🐬', es: 'El delfín', en: 'The dolphin' },
        { emoji: '🐙', es: 'El pulpo', en: 'The octopus' },
      ],
      correct: 0,
    },
  },
  {
    id: 'forest-party',
    emoji: '🦉',
    level: 3,
    title: { es: 'La fiesta del bosque', en: 'The Forest Party' },
    pages: [
      {
        es: 'El búho invita a todos los animales a una fiesta.',
        en: 'The owl invites all the animals to a party.',
        emoji: '🦉',
      },
      {
        es: 'La ardilla trae nueces y el oso trae miel dulce.',
        en: 'The squirrel brings nuts and the bear brings sweet honey.',
        emoji: '🐿️',
      },
      {
        es: 'Los conejos preparan una pista de baile con hojas.',
        en: 'The rabbits make a dance floor out of leaves.',
        emoji: '🐰',
      },
      {
        es: 'Las luciérnagas encienden sus luces como farolitos.',
        en: 'The fireflies turn on their lights like little lanterns.',
        emoji: '✨',
      },
      {
        es: 'Todos bailan bajo la luna hasta quedarse dormidos.',
        en: 'Everyone dances under the moon until they fall asleep.',
        emoji: '🌙',
      },
    ],
    quiz: {
      question: { es: '¿Quién trae la miel?', en: 'Who brings the honey?' },
      options: [
        { emoji: '🐿️', es: 'La ardilla', en: 'The squirrel' },
        { emoji: '🐻', es: 'El oso', en: 'The bear' },
        { emoji: '🦉', es: 'El búho', en: 'The owl' },
      ],
      correct: 1,
    },
  },
  {
    id: 'little-cloud',
    emoji: '☁️',
    level: 3,
    title: { es: 'La nube pequeña', en: 'The Little Cloud' },
    pages: [
      {
        es: 'Una nube pequeña quería regar un jardín seco.',
        en: 'A little cloud wanted to water a dry garden.',
        emoji: '☁️',
      },
      {
        es: 'Voló muy lejos, buscando las flores más tristes.',
        en: 'It flew very far, looking for the saddest flowers.',
        emoji: '🥀',
      },
      {
        es: 'Cuando las encontró, dejó caer una lluvia suave.',
        en: 'When it found them, it let a soft rain fall.',
        emoji: '🌧️',
      },
      {
        es: 'Las flores bebieron y pintaron el campo de colores.',
        en: 'The flowers drank and painted the field with colors.',
        emoji: '🌸',
      },
      {
        es: 'El sol salió y le regaló un arcoíris a la nube.',
        en: 'The sun came out and gave the cloud a rainbow.',
        emoji: '🌈',
      },
    ],
    quiz: {
      question: {
        es: '¿Qué regalo recibió la nube?',
        en: 'What gift did the cloud get?',
      },
      options: [
        { emoji: '🎈', es: 'Un globo', en: 'A balloon' },
        { emoji: '⭐', es: 'Una estrella', en: 'A star' },
        { emoji: '🌈', es: 'Un arcoíris', en: 'A rainbow' },
      ],
      correct: 2,
    },
  },
];
