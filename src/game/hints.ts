/**
 * Pistas (tips) contextuales para resolver el problema actual.
 *
 * En vez de un texto genérico, el Profesor Banana da una estrategia
 * de verdad usando los números del problema: contar a partir del
 * mayor, contar hacia atrás, o trabajar por columnas (unidades,
 * decenas...) cuando los números son grandes.
 */

import { type MathProblem } from './types';
import { type Lang } from '../i18n/strings';

/** Umbral hasta el que conviene sugerir "contar" en vez de columnas. */
const COUNTING_LIMIT = 20;

export function getHints(problem: MathProblem, lang: Lang): string[] {
  const { a, b, operation, answer } = problem;
  const big = Math.max(a, b);
  const small = Math.min(a, b);
  const es = lang === 'es';

  if (operation === 'addition') {
    if (answer <= COUNTING_LIMIT) {
      return es
        ? [
            `Empieza en el número más grande, el ${big}, y cuenta ${small} más: ${countUp(big, small)}.`,
            'También puedes contar todas las manzanas juntas, una por una.',
          ]
        : [
            `Start at the bigger number, ${big}, and count ${small} more: ${countUp(big, small)}.`,
            'You can also count all the apples together, one by one.',
          ];
    }
    return es
      ? [
          'Suma primero las unidades (los números de la derecha) y luego las decenas.',
          'Si las unidades pasan de 9, "llevas" una decena a la siguiente columna.',
        ]
      : [
          'Add the ones first (the right-hand digits), then the tens.',
          'If the ones go past 9, carry one ten to the next column.',
        ];
  }

  // Resta
  if (a <= COUNTING_LIMIT) {
    return es
      ? [
          `Parte del ${a} y cuenta ${b} hacia atrás: ${countDown(a, b)}.`,
          `O piensa: ¿cuánto le falta al ${b} para llegar al ${a}?`,
        ]
      : [
          `Start at ${a} and count back ${b}: ${countDown(a, b)}.`,
          `Or think: how much does ${b} need to reach ${a}?`,
        ];
  }
  return es
    ? [
        'Resta primero las unidades y después las decenas.',
        'Si te faltan unidades, pide prestada una decena a la columna de al lado.',
      ]
    : [
        'Subtract the ones first, then the tens.',
        'If you run out of ones, borrow one ten from the next column.',
      ];
}

/** Secuencia "6, 7, 8, 9" para contar hacia adelante (acotada). */
function countUp(from: number, steps: number): string {
  const seq: number[] = [];
  for (let i = 1; i <= Math.min(steps, 6); i++) seq.push(from + i);
  return seq.join(', ');
}

/** Secuencia "9, 8, 7" para contar hacia atrás (acotada). */
function countDown(from: number, steps: number): string {
  const seq: number[] = [];
  for (let i = 1; i <= Math.min(steps, 6); i++) seq.push(from - i);
  return seq.join(', ');
}
