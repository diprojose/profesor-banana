/**
 * Compara lo que leyó el niño (transcrito por el reconocimiento de
 * voz) con la frase esperada y devuelve un resultado palabra por
 * palabra. La comparación es tolerante: ignora mayúsculas, tildes y
 * signos de puntuación, y acepta pequeñas diferencias (el
 * reconocimiento de voz no es perfecto y los niños están aprendiendo).
 */

export type ReadingStatus = 'great' | 'partial' | 'tryagain';

export interface WordResult {
  /** Palabra tal como se muestra (con tildes/puntuación). */
  text: string;
  /** ¿Se leyó correctamente? (las que son solo puntuación van true). */
  matched: boolean;
  /** Si la palabra cuenta para la puntuación. */
  scored: boolean;
}

export interface ReadingResult {
  score: number; // 0..1 sobre las palabras que puntúan
  status: ReadingStatus;
  words: WordResult[];
  heard: string;
}

/** Quita tildes, pasa a minúsculas y elimina lo que no sea letra/número. */
export function normalizeWord(word: string): string {
  return (
    word
      .toLowerCase()
      // NFD separa la tilde de la letra (á -> a + ´); luego quitamos
      // todo lo que no sea letra/número, incluidas tildes y puntuación.
      .normalize('NFD')
      .replace(/[^a-z0-9]/g, '')
  );
}

/** Divide un texto en palabras normalizadas no vacías. */
function tokenize(text: string): string[] {
  return text
    .split(/\s+/)
    .map(normalizeWord)
    .filter((w) => w.length > 0);
}

/** Distancia de edición (Levenshtein) entre dos cadenas cortas. */
export function editDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  let curr = new Array<number>(n + 1);
  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
    }
    [prev, curr] = [curr, prev];
  }
  return prev[n];
}

/** ¿Dos palabras se parecen lo suficiente? Tolerancia según largo. */
function fuzzyEquals(a: string, b: string): boolean {
  if (a === b) return true;
  const tolerance = Math.max(a.length, b.length) <= 4 ? 1 : 2;
  return editDistance(a, b) <= tolerance;
}

const GREAT_THRESHOLD = 0.8;
const PARTIAL_THRESHOLD = 0.5;

/**
 * Evalúa la lectura del niño frente a la frase esperada.
 * @param expected Frase original del cuento.
 * @param heard Transcripción de lo que dijo el niño.
 */
export function checkReading(expected: string, heard: string): ReadingResult {
  const heardTokens = tokenize(heard);
  const used = new Array<boolean>(heardTokens.length).fill(false);

  const displayWords = expected.split(/\s+/).filter((w) => w.length > 0);

  let scored = 0;
  let matchedCount = 0;

  const words: WordResult[] = displayWords.map((text) => {
    const norm = normalizeWord(text);
    if (norm.length === 0) {
      // Solo puntuación: no penaliza ni puntúa.
      return { text, matched: true, scored: false };
    }
    scored += 1;
    // Busca una palabra escuchada (no usada) que coincida.
    let matched = false;
    for (let i = 0; i < heardTokens.length; i++) {
      if (!used[i] && fuzzyEquals(norm, heardTokens[i])) {
        used[i] = true;
        matched = true;
        break;
      }
    }
    if (matched) matchedCount += 1;
    return { text, matched, scored: true };
  });

  const score = scored === 0 ? 0 : matchedCount / scored;
  const status: ReadingStatus =
    score >= GREAT_THRESHOLD
      ? 'great'
      : score >= PARTIAL_THRESHOLD
        ? 'partial'
        : 'tryagain';

  return { score, status, words, heard: heard.trim() };
}
