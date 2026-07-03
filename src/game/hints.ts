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

  if (operation === 'multiplication') {
    return es
      ? [
          `${a} × ${b} son ${a} grupos de ${b}. Puedes sumar: ${repeatSum(b, a)}.`,
          `Cuenta de ${b} en ${b}, ${a} veces: ${skipCount(b, a)}.`,
        ]
      : [
          `${a} × ${b} means ${a} groups of ${b}. You can add: ${repeatSum(b, a)}.`,
          `Count by ${b}s, ${a} times: ${skipCount(b, a)}.`,
        ];
  }

  if (operation === 'division') {
    return es
      ? [
          `${a} ÷ ${b} es repartir ${a} en ${b} grupos iguales.`,
          `Piensa al revés: ¿${b} por cuánto da ${a}?`,
        ]
      : [
          `${a} ÷ ${b} means sharing ${a} into ${b} equal groups.`,
          `Think backwards: ${b} times what makes ${a}?`,
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

/** Suma repetida "4 + 4 + 4" (acotada para no hacer pistas eternas). */
function repeatSum(value: number, times: number): string {
  const shown = Math.min(times, 5);
  const parts = Array.from({ length: shown }, () => String(value));
  return parts.join(' + ') + (times > shown ? ' + ...' : '');
}

/** Conteo saltado "4, 8, 12" (acotado). */
function skipCount(step: number, times: number): string {
  const seq: number[] = [];
  for (let i = 1; i <= Math.min(times, 5); i++) seq.push(step * i);
  return seq.join(', ') + (times > 5 ? ', ...' : '');
}
