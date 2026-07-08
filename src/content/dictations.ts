/**
 * Dictados para la Isla del Dictado.
 *
 * Cada dictado tiene un nivel (1 = palabras sueltas para los que
 * empiezan a escribir, 3 = frases largas), un emoji de portada y una
 * lista de "partes" que se dictan una a una en ambos idiomas. El niño
 * escucha cada parte, la escribe, y al final compara lo que escribió
 * con el texto original.
 *
 * Para añadir un dictado: agrégalo aquí con un `id` único y sus partes
 * en es/en. La pantalla los agrupa sola por nivel.
 */

export type DictationLevel = 1 | 2 | 3;

export interface DictationItem {
  es: string;
  en: string;
}

export interface Dictation {
  id: string;
  emoji: string;
  level: DictationLevel;
  title: { es: string; en: string };
  /** Partes que se dictan una a una (palabras o frases). */
  items: DictationItem[];
}

export const dictationLevels: readonly DictationLevel[] = [1, 2, 3];

export const dictations: Dictation[] = [
  // ============ Nivel 1 · Primeras palabras ============
  {
    id: 'home-words',
    emoji: '🏠',
    level: 1,
    title: { es: 'Palabras de casa', en: 'Home Words' },
    items: [
      { es: 'mamá', en: 'mom' },
      { es: 'papá', en: 'dad' },
      { es: 'casa', en: 'house' },
      { es: 'mesa', en: 'table' },
      { es: 'cama', en: 'bed' },
    ],
  },
  {
    id: 'animal-words',
    emoji: '🐶',
    level: 1,
    title: { es: 'Los animales', en: 'The Animals' },
    items: [
      { es: 'gato', en: 'cat' },
      { es: 'perro', en: 'dog' },
      { es: 'pato', en: 'duck' },
      { es: 'oso', en: 'bear' },
      { es: 'pez', en: 'fish' },
    ],
  },
  {
    id: 'color-words',
    emoji: '🎨',
    level: 1,
    title: { es: 'Los colores', en: 'The Colors' },
    items: [
      { es: 'rojo', en: 'red' },
      { es: 'azul', en: 'blue' },
      { es: 'verde', en: 'green' },
      { es: 'amarillo', en: 'yellow' },
    ],
  },
  {
    id: 'family-words',
    emoji: '👪',
    level: 1,
    title: { es: 'La familia', en: 'The Family' },
    items: [
      { es: 'abuelo', en: 'grandpa' },
      { es: 'abuela', en: 'grandma' },
      { es: 'hermano', en: 'brother' },
      { es: 'tío', en: 'uncle' },
      { es: 'primo', en: 'cousin' },
    ],
  },
  {
    id: 'body-words',
    emoji: '🧍',
    level: 1,
    title: { es: 'Mi cuerpo', en: 'My Body' },
    items: [
      { es: 'mano', en: 'hand' },
      { es: 'pie', en: 'foot' },
      { es: 'boca', en: 'mouth' },
      { es: 'nariz', en: 'nose' },
      { es: 'ojo', en: 'eye' },
    ],
  },
  {
    id: 'fruit-words',
    emoji: '🍎',
    level: 1,
    title: { es: 'Las frutas', en: 'The Fruits' },
    items: [
      { es: 'manzana', en: 'apple' },
      { es: 'pera', en: 'pear' },
      { es: 'uva', en: 'grape' },
      { es: 'plátano', en: 'banana' },
      { es: 'fresa', en: 'strawberry' },
    ],
  },
  {
    id: 'number-words',
    emoji: '🔢',
    level: 1,
    title: { es: 'Los números', en: 'The Numbers' },
    items: [
      { es: 'uno', en: 'one' },
      { es: 'dos', en: 'two' },
      { es: 'tres', en: 'three' },
      { es: 'cuatro', en: 'four' },
      { es: 'cinco', en: 'five' },
    ],
  },
  {
    id: 'toy-words',
    emoji: '🧸',
    level: 1,
    title: { es: 'Los juguetes', en: 'The Toys' },
    items: [
      { es: 'pelota', en: 'ball' },
      { es: 'muñeca', en: 'doll' },
      { es: 'coche', en: 'car' },
      { es: 'tren', en: 'train' },
      { es: 'globo', en: 'balloon' },
    ],
  },
  {
    id: 'school-words',
    emoji: '🏫',
    level: 1,
    title: { es: 'En la escuela', en: 'At School' },
    items: [
      { es: 'lápiz', en: 'pencil' },
      { es: 'libro', en: 'book' },
      { es: 'silla', en: 'chair' },
      { es: 'goma', en: 'eraser' },
      { es: 'papel', en: 'paper' },
    ],
  },
  {
    id: 'food-words',
    emoji: '🍽️',
    level: 1,
    title: { es: 'La comida', en: 'The Food' },
    items: [
      { es: 'pan', en: 'bread' },
      { es: 'leche', en: 'milk' },
      { es: 'queso', en: 'cheese' },
      { es: 'huevo', en: 'egg' },
      { es: 'sopa', en: 'soup' },
    ],
  },
  {
    id: 'nature-words',
    emoji: '🌿',
    level: 1,
    title: { es: 'La naturaleza', en: 'Nature' },
    items: [
      { es: 'árbol', en: 'tree' },
      { es: 'flor', en: 'flower' },
      { es: 'hoja', en: 'leaf' },
      { es: 'río', en: 'river' },
      { es: 'montaña', en: 'mountain' },
    ],
  },
  {
    id: 'weather-words',
    emoji: '☁️',
    level: 1,
    title: { es: 'El tiempo', en: 'The Weather' },
    items: [
      { es: 'sol', en: 'sun' },
      { es: 'lluvia', en: 'rain' },
      { es: 'viento', en: 'wind' },
      { es: 'nube', en: 'cloud' },
      { es: 'nieve', en: 'snow' },
    ],
  },
  {
    id: 'clothes-words',
    emoji: '👕',
    level: 1,
    title: { es: 'La ropa', en: 'The Clothes' },
    items: [
      { es: 'camisa', en: 'shirt' },
      { es: 'zapato', en: 'shoe' },
      { es: 'gorra', en: 'cap' },
      { es: 'falda', en: 'skirt' },
      { es: 'abrigo', en: 'coat' },
    ],
  },
  {
    id: 'sea-words',
    emoji: '🐠',
    level: 1,
    title: { es: 'El mar', en: 'The Sea' },
    items: [
      { es: 'pez', en: 'fish' },
      { es: 'ballena', en: 'whale' },
      { es: 'pulpo', en: 'octopus' },
      { es: 'cangrejo', en: 'crab' },
      { es: 'tortuga', en: 'turtle' },
    ],
  },
  {
    id: 'farm-words',
    emoji: '🚜',
    level: 1,
    title: { es: 'La granja', en: 'The Farm' },
    items: [
      { es: 'vaca', en: 'cow' },
      { es: 'cerdo', en: 'pig' },
      { es: 'gallina', en: 'hen' },
      { es: 'caballo', en: 'horse' },
      { es: 'oveja', en: 'sheep' },
    ],
  },

  // ============ Nivel 2 · Frases cortas ============
  {
    id: 'in-the-park',
    emoji: '🌳',
    level: 2,
    title: { es: 'En el parque', en: 'At the Park' },
    items: [
      { es: 'El niño juega.', en: 'The boy plays.' },
      { es: 'El sol brilla.', en: 'The sun shines.' },
      { es: 'Hay un perro.', en: 'There is a dog.' },
      { es: 'La flor es roja.', en: 'The flower is red.' },
    ],
  },
  {
    id: 'my-day',
    emoji: '☀️',
    level: 2,
    title: { es: 'Mi día', en: 'My Day' },
    items: [
      { es: 'Como una manzana.', en: 'I eat an apple.' },
      { es: 'Voy a la escuela.', en: 'I go to school.' },
      { es: 'Leo un cuento.', en: 'I read a story.' },
      { es: 'Duermo feliz.', en: 'I sleep happy.' },
    ],
  },
  {
    id: 'my-house',
    emoji: '🏡',
    level: 2,
    title: { es: 'Mi casa', en: 'My House' },
    items: [
      { es: 'Mi casa es grande.', en: 'My house is big.' },
      { es: 'La cama es blanda.', en: 'The bed is soft.' },
      { es: 'Hay flores en la mesa.', en: 'There are flowers on the table.' },
      { es: 'El gato duerme aquí.', en: 'The cat sleeps here.' },
    ],
  },
  {
    id: 'little-animals',
    emoji: '🐤',
    level: 2,
    title: { es: 'Animalitos', en: 'Little Animals' },
    items: [
      { es: 'El pato nada en el lago.', en: 'The duck swims in the lake.' },
      { es: 'La rana salta alto.', en: 'The frog jumps high.' },
      { es: 'El perro corre rápido.', en: 'The dog runs fast.' },
      { es: 'El pájaro canta.', en: 'The bird sings.' },
    ],
  },
  {
    id: 'at-school-2',
    emoji: '✏️',
    level: 2,
    title: { es: 'En clase', en: 'In Class' },
    items: [
      { es: 'La maestra es amable.', en: 'The teacher is kind.' },
      { es: 'Pinto con muchos colores.', en: 'I paint with many colors.' },
      { es: 'Cuento hasta diez.', en: 'I count to ten.' },
      { es: 'Me gusta leer.', en: 'I like to read.' },
    ],
  },
  {
    id: 'yummy-food',
    emoji: '🍲',
    level: 2,
    title: { es: 'Qué rico', en: 'Yummy' },
    items: [
      { es: 'La sopa está caliente.', en: 'The soup is hot.' },
      { es: 'El pan es rico.', en: 'The bread is tasty.' },
      { es: 'Bebo un vaso de agua.', en: 'I drink a glass of water.' },
      { es: 'Como fruta fresca.', en: 'I eat fresh fruit.' },
    ],
  },
  {
    id: 'seasons',
    emoji: '🍂',
    level: 2,
    title: { es: 'Las estaciones', en: 'The Seasons' },
    items: [
      { es: 'En invierno hace frío.', en: 'In winter it is cold.' },
      { es: 'Las hojas caen en otoño.', en: 'The leaves fall in autumn.' },
      { es: 'En verano vamos al mar.', en: 'In summer we go to the sea.' },
      { es: 'La primavera trae flores.', en: 'Spring brings flowers.' },
    ],
  },
  {
    id: 'friends',
    emoji: '🤝',
    level: 2,
    title: { es: 'Mis amigos', en: 'My Friends' },
    items: [
      { es: 'Juego con mi amigo.', en: 'I play with my friend.' },
      { es: 'Compartimos la pelota.', en: 'We share the ball.' },
      { es: 'Reímos mucho juntos.', en: 'We laugh a lot together.' },
      { es: 'Somos buenos amigos.', en: 'We are good friends.' },
    ],
  },
  {
    id: 'my-pets',
    emoji: '🐱',
    level: 2,
    title: { es: 'Mis mascotas', en: 'My Pets' },
    items: [
      { es: 'Mi gato es suave.', en: 'My cat is soft.' },
      { es: 'El perro mueve la cola.', en: 'The dog wags its tail.' },
      { es: 'Doy comida al conejo.', en: 'I give food to the rabbit.' },
      { es: 'Los peces nadan.', en: 'The fish swim.' },
    ],
  },
  {
    id: 'i-move',
    emoji: '🏃',
    level: 2,
    title: { es: 'Me muevo', en: 'I Move' },
    items: [
      { es: 'Corro por el patio.', en: 'I run in the yard.' },
      { es: 'Salto con un pie.', en: 'I jump on one foot.' },
      { es: 'Aplaudo con las manos.', en: 'I clap my hands.' },
      { es: 'Sonrío feliz.', en: 'I smile happily.' },
    ],
  },
  {
    id: 'bedtime',
    emoji: '🌙',
    level: 2,
    title: { es: 'A dormir', en: 'Bedtime' },
    items: [
      { es: 'La luna sale de noche.', en: 'The moon comes out at night.' },
      { es: 'Me pongo el pijama.', en: 'I put on my pajamas.' },
      { es: 'Leo un cuento corto.', en: 'I read a short story.' },
      { es: 'Cierro los ojos.', en: 'I close my eyes.' },
    ],
  },
  {
    id: 'rainy-day',
    emoji: '🌧️',
    level: 2,
    title: { es: 'Día de lluvia', en: 'Rainy Day' },
    items: [
      { es: 'La lluvia moja la calle.', en: 'The rain wets the street.' },
      { es: 'Abro mi paraguas azul.', en: 'I open my blue umbrella.' },
      { es: 'Salto en los charcos.', en: 'I jump in the puddles.' },
      { es: 'Después sale el sol.', en: 'Then the sun comes out.' },
    ],
  },
  {
    id: 'birthday',
    emoji: '🎂',
    level: 2,
    title: { es: 'Mi cumpleaños', en: 'My Birthday' },
    items: [
      { es: 'Hoy es mi cumpleaños.', en: 'Today is my birthday.' },
      { es: 'Tengo un pastel grande.', en: 'I have a big cake.' },
      { es: 'Mis amigos cantan.', en: 'My friends sing.' },
      { es: 'Soplo las velas.', en: 'I blow out the candles.' },
    ],
  },
  {
    id: 'the-garden',
    emoji: '🌻',
    level: 2,
    title: { es: 'El jardín', en: 'The Garden' },
    items: [
      { es: 'Riego las plantas.', en: 'I water the plants.' },
      { es: 'La flor huele bien.', en: 'The flower smells good.' },
      { es: 'Una abeja vuela cerca.', en: 'A bee flies nearby.' },
      { es: 'El árbol da sombra.', en: 'The tree gives shade.' },
    ],
  },
  {
    id: 'i-help',
    emoji: '🧹',
    level: 2,
    title: { es: 'Ayudo en casa', en: 'I Help at Home' },
    items: [
      { es: 'Ayudo a mi mamá.', en: 'I help my mom.' },
      { es: 'Recojo mis juguetes.', en: 'I pick up my toys.' },
      { es: 'Pongo la mesa.', en: 'I set the table.' },
      { es: 'Barro el suelo.', en: 'I sweep the floor.' },
    ],
  },

  // ============ Nivel 3 · Dictado experto ============
  {
    id: 'the-adventure',
    emoji: '🗺️',
    level: 3,
    title: { es: 'La aventura', en: 'The Adventure' },
    items: [
      { es: 'El barco navega por el mar azul.', en: 'The boat sails on the blue sea.' },
      { es: 'Los niños buscan un tesoro.', en: 'The children look for a treasure.' },
      { es: 'Encontraron una caja de oro.', en: 'They found a box of gold.' },
      { es: 'Todos saltaron de alegría.', en: 'Everyone jumped with joy.' },
    ],
  },
  {
    id: 'the-forest',
    emoji: '🌲',
    level: 3,
    title: { es: 'El bosque', en: 'The Forest' },
    items: [
      { es: 'Los pájaros cantan en los árboles.', en: 'The birds sing in the trees.' },
      { es: 'Un conejo corre entre las flores.', en: 'A rabbit runs among the flowers.' },
      { es: 'El río suena con fuerza.', en: 'The river sounds loudly.' },
      { es: 'La luna ilumina el camino.', en: 'The moon lights the path.' },
    ],
  },
  {
    id: 'the-beach',
    emoji: '🏖️',
    level: 3,
    title: { es: 'La playa', en: 'The Beach' },
    items: [
      { es: 'Construimos un castillo de arena.', en: 'We build a sandcastle.' },
      { es: 'Las olas llegan hasta mis pies.', en: 'The waves reach my feet.' },
      { es: 'Un cangrejo camina de lado.', en: 'A crab walks sideways.' },
      { es: 'El sol se esconde en el mar.', en: 'The sun hides in the sea.' },
    ],
  },
  {
    id: 'the-space',
    emoji: '🚀',
    level: 3,
    title: { es: 'El espacio', en: 'Space' },
    items: [
      { es: 'El cohete despega hacia las estrellas.', en: 'The rocket lifts off toward the stars.' },
      { es: 'La luna brilla en el cielo oscuro.', en: 'The moon shines in the dark sky.' },
      { es: 'Los planetas giran alrededor del sol.', en: 'The planets spin around the sun.' },
      { es: 'Un astronauta flota en el espacio.', en: 'An astronaut floats in space.' },
    ],
  },
  {
    id: 'the-farm-3',
    emoji: '🐄',
    level: 3,
    title: { es: 'La granja', en: 'The Farm' },
    items: [
      { es: 'El granjero se levanta muy temprano.', en: 'The farmer gets up very early.' },
      { es: 'Las vacas comen hierba verde.', en: 'The cows eat green grass.' },
      { es: 'Las gallinas ponen huevos frescos.', en: 'The hens lay fresh eggs.' },
      { es: 'El caballo corre por el campo.', en: 'The horse runs through the field.' },
    ],
  },
  {
    id: 'the-rainbow',
    emoji: '🌦️',
    level: 3,
    title: { es: 'La tormenta', en: 'The Rain' },
    items: [
      { es: 'Las nubes grises cubren el cielo.', en: 'The gray clouds cover the sky.' },
      { es: 'La lluvia cae sobre los tejados.', en: 'The rain falls on the roofs.' },
      { es: 'Los niños saltan en los charcos.', en: 'The children jump in the puddles.' },
      { es: 'Después aparece un arcoíris.', en: 'Then a rainbow appears.' },
    ],
  },
  {
    id: 'the-city',
    emoji: '🏙️',
    level: 3,
    title: { es: 'La ciudad', en: 'The City' },
    items: [
      { es: 'Los coches pasan por la avenida.', en: 'The cars pass down the avenue.' },
      { es: 'La gente camina con prisa.', en: 'People walk in a hurry.' },
      { es: 'Las luces brillan de noche.', en: 'The lights shine at night.' },
      { es: 'El tren llega a la estación.', en: 'The train arrives at the station.' },
    ],
  },
  {
    id: 'the-jungle',
    emoji: '🐒',
    level: 3,
    title: { es: 'La selva', en: 'The Jungle' },
    items: [
      { es: 'Los monos saltan entre las ramas.', en: 'The monkeys jump among the branches.' },
      { es: 'Un tigre descansa bajo la sombra.', en: 'A tiger rests in the shade.' },
      { es: 'Los pájaros cantan con fuerza.', en: 'The birds sing loudly.' },
      { es: 'El río cruza toda la selva.', en: 'The river crosses the whole jungle.' },
    ],
  },
  {
    id: 'the-winter',
    emoji: '❄️',
    level: 3,
    title: { es: 'El invierno', en: 'Winter' },
    items: [
      { es: 'La nieve cubre las montañas blancas.', en: 'The snow covers the white mountains.' },
      { es: 'Los niños hacen un muñeco.', en: 'The children make a snowman.' },
      { es: 'Bebemos chocolate caliente.', en: 'We drink hot chocolate.' },
      { es: 'El frío pinta las ventanas.', en: 'The cold paints the windows.' },
    ],
  },
  {
    id: 'the-library',
    emoji: '📚',
    level: 3,
    title: { es: 'La biblioteca', en: 'The Library' },
    items: [
      { es: 'La biblioteca guarda muchos libros.', en: 'The library keeps many books.' },
      { es: 'Busco un cuento de aventuras.', en: 'I look for an adventure story.' },
      { es: 'Leo en silencio toda la tarde.', en: 'I read quietly all afternoon.' },
      { es: 'Los libros abren nuevos mundos.', en: 'Books open new worlds.' },
    ],
  },
  {
    id: 'the-kitchen',
    emoji: '🍳',
    level: 3,
    title: { es: 'La cocina', en: 'The Kitchen' },
    items: [
      { es: 'Mi abuela prepara una sopa rica.', en: 'My grandma makes a tasty soup.' },
      { es: 'Cortamos las verduras con cuidado.', en: 'We cut the vegetables carefully.' },
      { es: 'El olor llena toda la casa.', en: 'The smell fills the whole house.' },
      { es: 'Comemos todos juntos en la mesa.', en: 'We all eat together at the table.' },
    ],
  },
  {
    id: 'the-storm',
    emoji: '⛈️',
    level: 3,
    title: { es: 'La tempestad', en: 'The Storm' },
    items: [
      { es: 'El viento sopla con mucha fuerza.', en: 'The wind blows very hard.' },
      { es: 'Los truenos suenan en la noche.', en: 'The thunder sounds in the night.' },
      { es: 'La lluvia golpea los cristales.', en: 'The rain hits the windows.' },
      { es: 'Por la mañana todo está tranquilo.', en: 'In the morning everything is calm.' },
    ],
  },
  {
    id: 'the-friends-3',
    emoji: '👫',
    level: 3,
    title: { es: 'En el parque', en: 'At the Park' },
    items: [
      { es: 'Mis amigos y yo jugamos en el parque.', en: 'My friends and I play in the park.' },
      { es: 'Compartimos la merienda bajo un árbol.', en: 'We share our snack under a tree.' },
      { es: 'Corremos detrás de la pelota.', en: 'We run after the ball.' },
      { es: 'Volvemos a casa muy felices.', en: 'We go home very happy.' },
    ],
  },
  {
    id: 'the-ocean',
    emoji: '🐋',
    level: 3,
    title: { es: 'El océano', en: 'The Ocean' },
    items: [
      { es: 'Una ballena enorme nada en el mar.', en: 'A huge whale swims in the sea.' },
      { es: 'Los peces de colores brillan bajo el agua.', en: 'The colorful fish shine under the water.' },
      { es: 'El pulpo se esconde entre las rocas.', en: 'The octopus hides among the rocks.' },
      { es: 'Las olas mueven los barcos pequeños.', en: 'The waves move the small boats.' },
    ],
  },
  {
    id: 'the-night',
    emoji: '🌌',
    level: 3,
    title: { es: 'La noche', en: 'The Night' },
    items: [
      { es: 'Las estrellas llenan el cielo de noche.', en: 'The stars fill the sky at night.' },
      { es: 'La luna ilumina el camino del bosque.', en: 'The moon lights the forest path.' },
      { es: 'Un búho observa desde un árbol.', en: 'An owl watches from a tree.' },
      { es: 'Todo el mundo duerme tranquilo.', en: 'Everyone sleeps peacefully.' },
    ],
  },
];
