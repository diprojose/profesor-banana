/**
 * Generador de problemas matemáticos aleatorios.
 *
 * Reemplaza las sumas hardcodeadas del prototipo: cada vez que el
 * niño pasa al siguiente problema se crea uno nuevo al azar dentro
 * de los límites de `GeneratorConfig`. Está escrito de forma pura y
 * con una fuente de aleatoriedad inyectable para poder testearlo.
 */

import {
  type GeneratorConfig,
  type MathProblem,
  type Operation,
  defaultConfig,
} from './types';

/** Fuente de aleatoriedad: devuelve un número en [0, 1). */
export type Random = () => number;

/** Entero aleatorio en [min, max] (ambos inclusive). */
function randInt(rng: Random, min: number, max: number): number {
  return min + Math.floor(rng() * (max - min + 1));
}

function pick<T>(rng: Random, items: readonly T[]): T {
  return items[Math.floor(rng() * items.length)];
}

/** Mezcla (Fisher-Yates) sin mutar el arreglo original. */
function shuffle<T>(rng: Random, items: readonly T[]): T[] {
  const result = items.slice();
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Construye un conjunto de opciones que incluye la respuesta correcta
 * más distractores cercanos, únicos y no negativos.
 * @param preferred Distractores preferidos (p. ej. productos vecinos
 *   de la tabla en multiplicación) que se intentan usar primero.
 */
function buildOptions(
  rng: Random,
  answer: number,
  optionCount: number,
  preferred: number[] = [],
): number[] {
  const options = new Set<number>([answer]);

  // Primero los distractores pedagógicos (mezclados, sin duplicar).
  for (const candidate of shuffle(rng, preferred)) {
    if (options.size >= optionCount) break;
    if (candidate >= 0 && candidate !== answer) options.add(candidate);
  }

  // Luego valores cercanos a la respuesta (±1, ±2, ...).
  let spread = 1;
  let guard = 0;
  while (options.size < optionCount && guard < 50) {
    const delta = randInt(rng, 1, spread + 1) * (rng() < 0.5 ? -1 : 1);
    const candidate = answer + delta;
    if (candidate >= 0) options.add(candidate);
    spread = Math.min(spread + 1, 5);
    guard++;
  }

  // Respaldo por si no se llenó (rangos muy pequeños): rellena hacia arriba.
  let fill = answer + 1;
  while (options.size < optionCount) {
    if (fill >= 0) options.add(fill);
    fill++;
  }

  return shuffle(rng, [...options]);
}

/**
 * Distractores preferidos: en multiplicación, productos vecinos de la
 * tabla (6×7 → 6×6 y 6×8), que son los errores típicos; en división,
 * cocientes vecinos. Para suma/resta no hay preferencia.
 */
function preferredDistractors(
  operation: Operation,
  a: number,
  b: number,
): number[] {
  if (operation === 'multiplication') {
    return [a * (b - 1), a * (b + 1), (a - 1) * b, (a + 1) * b];
  }
  if (operation === 'division') {
    const q = a / b;
    return [q - 1, q + 1, q + 2];
  }
  return [];
}

/** Genera los operandos para una operación respetando los límites. */
function makeOperands(
  rng: Random,
  operation: Operation,
  config: GeneratorConfig,
): { a: number; b: number; answer: number } {
  const { minOperand, maxOperand, maxAnswer } = config;
  const maxTable = Math.max(2, config.maxTable ?? 5);

  if (operation === 'multiplication') {
    // a × b: un factor dentro de la tabla, el otro hasta 10.
    const a = randInt(rng, 1, maxTable);
    const b = randInt(rng, 1, 10);
    return { a, b, answer: a * b };
  }

  if (operation === 'division') {
    // División exacta: se construye desde la tabla (divisor × cociente).
    const b = randInt(rng, 2, maxTable);
    const quotient = randInt(rng, 1, 10);
    return { a: b * quotient, b, answer: quotient };
  }

  if (operation === 'subtraction') {
    // a - b, con a >= b para que el resultado no sea negativo.
    const a = randInt(rng, minOperand, maxOperand);
    const b = randInt(rng, minOperand, a);
    return { a, b, answer: a - b };
  }

  // addition: reintenta hasta respetar maxAnswer (rangos chicos => pocos intentos).
  for (let attempt = 0; attempt < 30; attempt++) {
    const a = randInt(rng, minOperand, maxOperand);
    const b = randInt(rng, minOperand, maxOperand);
    if (a + b <= maxAnswer) return { a, b, answer: a + b };
  }
  // Respaldo: recorta para no exceder el tope.
  const a = randInt(rng, minOperand, Math.min(maxOperand, maxAnswer - minOperand));
  const b = Math.min(maxOperand, maxAnswer - a);
  return { a, b, answer: a + b };
}

/**
 * Genera un problema matemático aleatorio según la configuración.
 * @param config Límites y opciones (por defecto: sumas hasta 10).
 * @param rng Fuente de aleatoriedad (por defecto Math.random).
 */
export function generateProblem(
  config: GeneratorConfig = defaultConfig,
  rng: Random = Math.random,
): MathProblem {
  const operation = pick(rng, config.operations);
  const { a, b, answer } = makeOperands(rng, operation, config);
  const options = buildOptions(
    rng,
    answer,
    config.optionCount,
    preferredDistractors(operation, a, b),
  );
  return { a, b, operation, answer, options };
}

/**
 * Firma de un problema para detectar repeticiones. La suma y la
 * multiplicación son conmutativas (4+5 y 5+4 comparten firma); la
 * resta y la división no.
 */
export function problemSignature(p: MathProblem): string {
  const lo = Math.min(p.a, p.b);
  const hi = Math.max(p.a, p.b);
  switch (p.operation) {
    case 'addition':
      return `add:${lo}:${hi}`;
    case 'multiplication':
      return `mul:${lo}:${hi}`;
    case 'division':
      return `div:${p.a}:${p.b}`;
    case 'subtraction':
      return `sub:${p.a}:${p.b}`;
  }
}

/**
 * Genera un problema evitando los que aparecieron hace poco, para
 * que no se repita la misma suma de forma seguida. Si el rango es muy
 * pequeño y no hay alternativas, se rinde tras unos intentos.
 */
export function generateDistinctProblem(
  config: GeneratorConfig = defaultConfig,
  recentSignatures: readonly string[] = [],
  rng: Random = Math.random,
): MathProblem {
  let problem = generateProblem(config, rng);
  let guard = 0;
  while (guard < 40 && recentSignatures.includes(problemSignature(problem))) {
    problem = generateProblem(config, rng);
    guard++;
  }
  return problem;
}
