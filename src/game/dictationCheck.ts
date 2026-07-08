/**
 * Compara lo que el niño escribió en un dictado con el texto esperado
 * y devuelve un resultado palabra por palabra para poder resaltar la
 * comparación.
 *
 * A diferencia de la lectura (que se transcribe por voz y es muy
 * tolerante), aquí la ORTOGRAFÍA es el objetivo. Pero somos flexibles
 * en dos cosas pensando en que se juega en el celular:
 *  - Mayúsculas: "Casa" = "casa".
 *  - Puntuación de los extremos: "casa." = "casa".
 *  - Tildes de las vocales (á é í ó ú, ü): "mama" cuenta como acierto
 *    de "mamá", porque poner la tilde en un teclado táctil es difícil
 *    para un niño. Se marca como acierto, pero se le recuerda con
 *    suavidad la forma correcta (accentHint) para que la aprenda.
 * La ñ sí se respeta ("nino" ≠ "niño"): es una letra distinta y está
 * en el teclado español como tecla propia.
 */

export interface DictationWord {
  /** Palabra tal como se escribe (con tildes y puntuación). */
  text: string;
  /** ¿La escribió bien? (cuenta acierto; las que solo son puntuación van true). */
  correct: boolean;
  /** Acertó, pero le faltó (o sobró) la tilde: se le recuerda sin penalizar. */
  accentHint: boolean;
  /** Si la palabra cuenta para la puntuación. */
  scored: boolean;
}

export interface DictationResult {
  words: DictationWord[];
  /** Palabras acertadas de las que puntúan (incluye las de solo-tilde). */
  correctCount: number;
  /** Total de palabras que puntúan. */
  scoredCount: number;
  /** ¿Escribió toda la frase bien? (aceptando faltas de tilde). */
  allCorrect: boolean;
  /** Acertó todo pero en alguna le faltó la tilde. */
  hasAccentHint: boolean;
}

/**
 * Minúsculas + quita la puntuación de los extremos, pero CONSERVA las
 * tildes y la ñ. Así "Casa." y "casa" coinciden, pero "caza" y "casa"
 * no, y se puede detectar si solo faltó la tilde.
 */
export function normalizeForCompare(word: string): string {
  return word
    .toLowerCase()
    .trim()
    .replace(/^[^\p{L}\p{N}]+/u, '')
    .replace(/[^\p{L}\p{N}]+$/u, '');
}

/**
 * Quita solo las tildes de las vocales y la diéresis, dejando la ñ
 * intacta. Sirve para comparar ignorando la tilde ("mama" ~ "mamá")
 * sin confundir la ñ con la n.
 */
export function stripVowelAccents(word: string): string {
  return word
    .replace(/á/g, 'a')
    .replace(/é/g, 'e')
    .replace(/í/g, 'i')
    .replace(/ó/g, 'o')
    .replace(/ú/g, 'u')
    .replace(/ü/g, 'u');
}

/** Divide un texto escrito en palabras normalizadas no vacías. */
function tokenize(text: string): string[] {
  return text
    .split(/\s+/)
    .map(normalizeForCompare)
    .filter((w) => w.length > 0);
}

/**
 * Evalúa el dictado del niño frente al texto esperado.
 * @param expected Texto original de la parte del dictado.
 * @param typed Lo que escribió el niño.
 */
export function checkDictation(
  expected: string,
  typed: string,
): DictationResult {
  const typedTokens = tokenize(typed);
  const used = new Array<boolean>(typedTokens.length).fill(false);

  const displayWords = expected.split(/\s+/).filter((w) => w.length > 0);

  let scoredCount = 0;
  let correctCount = 0;
  let hasAccentHint = false;

  const words: DictationWord[] = displayWords.map((text) => {
    const norm = normalizeForCompare(text);
    if (norm.length === 0) {
      // Solo puntuación: no puntúa ni penaliza.
      return { text, correct: true, accentHint: false, scored: false };
    }
    scoredCount += 1;

    // 1º intento: coincidencia exacta (con tilde). Es el ideal.
    let matchIndex = -1;
    for (let i = 0; i < typedTokens.length; i++) {
      if (!used[i] && typedTokens[i] === norm) {
        matchIndex = i;
        break;
      }
    }
    if (matchIndex >= 0) {
      used[matchIndex] = true;
      correctCount += 1;
      return { text, correct: true, accentHint: false, scored: true };
    }

    // 2º intento: coincide si ignoramos las tildes de las vocales.
    // Cuenta como acierto, pero le recordamos la tilde.
    const normNoAccent = stripVowelAccents(norm);
    for (let i = 0; i < typedTokens.length; i++) {
      if (!used[i] && stripVowelAccents(typedTokens[i]) === normNoAccent) {
        used[i] = true;
        correctCount += 1;
        hasAccentHint = true;
        return { text, correct: true, accentHint: true, scored: true };
      }
    }

    // No coincide: mal escrita.
    return { text, correct: false, accentHint: false, scored: true };
  });

  return {
    words,
    correctCount,
    scoredCount,
    allCorrect: scoredCount > 0 && correctCount === scoredCount,
    hasAccentHint,
  };
}
