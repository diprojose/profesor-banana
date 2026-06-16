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
 */
function buildOptions(
  rng: Random,
  answer: number,
  optionCount: number,
): number[] {
  const options = new Set<number>([answer]);

  // Distractores: valores cercanos a la respuesta (±1, ±2, ...).
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

/** Genera los operandos para una operación respetando los límites. */
function makeOperands(
  rng: Random,
  operation: Operation,
  config: GeneratorConfig,
): { a: number; b: number; answer: number } {
  const { minOperand, maxOperand, maxAnswer } = config;

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
  const options = buildOptions(rng, answer, config.optionCount);
  return { a, b, operation, answer, options };
}

/**
 * Firma de un problema para detectar repeticiones. La suma es
 * conmutativa, así que 4+5 y 5+4 comparten firma; la resta no.
 */
export function problemSignature(p: MathProblem): string {
  if (p.operation === 'addition') {
    const lo = Math.min(p.a, p.b);
    const hi = Math.max(p.a, p.b);
    return `add:${lo}:${hi}`;
  }
  return `sub:${p.a}:${p.b}`;
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
