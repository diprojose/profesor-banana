/**
 * Curva de dificultad por nivel.
 *
 * Cada nivel agranda los números: empieza con sumas de un solo
 * dígito y va creciendo hasta sumas de cuatro dígitos. El resultado
 * alimenta al generador (`mathConfig`) cuando la dificultad está en
 * modo automático ("por nivel").
 */

export interface LevelRange {
  minOperand: number;
  maxOperand: number;
  optionCount: number;
}

/**
 * Tope de cada operando por nivel (índice 0 = nivel 1).
 * El número de dígitos del resultado crece de forma gradual:
 *   1 dígito → 2 dígitos → 3 dígitos → 4 dígitos.
 * El último tramo se repite para niveles superiores.
 */
const TIERS: { max: number; options: number }[] = [
  { max: 5, options: 3 }, //  L1  · sumas hasta 10
  { max: 9, options: 3 }, //  L2  · 1 dígito
  { max: 15, options: 3 }, //  L3  · empiezan resultados de 2 dígitos
  { max: 25, options: 3 }, //  L4
  { max: 50, options: 4 }, //  L5
  { max: 99, options: 4 }, //  L6  · operandos de 2 dígitos
  { max: 199, options: 4 }, // L7
  { max: 499, options: 4 }, // L8  · 3 dígitos
  { max: 999, options: 4 }, // L9
  { max: 1999, options: 4 }, // L10
  { max: 4999, options: 4 }, // L11 · sumas de 4 dígitos
];

/**
 * Devuelve el rango de números recomendado para un nivel dado.
 * @param maxOperandCap Techo opcional (p. ej. el del grado escolar):
 *   la curva sube con el nivel pero nunca lo sobrepasa.
 */
export function rangeForLevel(
  level: number,
  maxOperandCap = Infinity,
): LevelRange {
  const idx = Math.min(Math.max(level, 1), TIERS.length) - 1;
  const tier = TIERS[idx];
  const maxOperand = Math.max(2, Math.min(tier.max, maxOperandCap));
  // El mínimo crece con el nivel para que no aparezcan números
  // demasiado pequeños en niveles altos (nada de 2 + 3 en nivel 10).
  const minOperand = Math.max(1, Math.floor(maxOperand / 5));
  return { minOperand, maxOperand, optionCount: tier.options };
}

/** Nivel a partir del cual el último tramo deja de crecer. */
export const maxDifficultyLevel = TIERS.length;
