/**
 * Grado escolar y temas de práctica.
 *
 * Los padres eligen el grado en Ajustes y eso define qué operaciones
 * existen para el niño y hasta dónde crecen los números. Un niño de
 * 1º nunca ve una multiplicación: ni pregunta, ni botón, ni candado.
 * Dentro de la isla, el niño elige un tema (sumas, restas, ...) o el
 * modo sorpresa que los mezcla.
 */

import { type GeneratorConfig, type Operation } from './types';
import { rangeForLevel } from './difficulty';
import { type MathSettings } from '../state/AppContext';

export type Grade = 'preschool' | 'grade1' | 'grade2' | 'grade3';

export const gradeOrder: readonly Grade[] = [
  'preschool',
  'grade1',
  'grade2',
  'grade3',
];

export interface GradeRules {
  /** Operaciones que el niño puede ver en este grado. */
  operations: Operation[];
  /**
   * Techo del operando de suma/resta en modo automático. La curva de
   * niveles sigue subiendo, pero nunca pasa de aquí (un niño de 1º no
   * debe encontrarse sumas de 4 dígitos).
   */
  maxOperandCap: number;
  /** Tabla más alta para multiplicar/dividir (0 = aún no toca). */
  maxTable: number;
}

export const gradeRules: Record<Grade, GradeRules> = {
  // Preescolar: contar y sumar con resultados hasta 10.
  preschool: { operations: ['addition'], maxOperandCap: 5, maxTable: 0 },
  // 1º: sumas y restas con resultados hasta ~100.
  grade1: {
    operations: ['addition', 'subtraction'],
    maxOperandCap: 50,
    maxTable: 0,
  },
  // 2º: entra la multiplicación con tablas pequeñas (1–5).
  grade2: {
    operations: ['addition', 'subtraction', 'multiplication'],
    maxOperandCap: 50,
    maxTable: 5,
  },
  // 3º o más: división exacta y tablas completas, números hasta ~1000.
  grade3: {
    operations: ['addition', 'subtraction', 'multiplication', 'division'],
    maxOperandCap: 499,
    maxTable: 10,
  },
};

/**
 * Tema de práctica que elige el niño al entrar a la isla.
 * 'mixed' mezcla todas las operaciones de su grado.
 */
export type MathTopic = Operation | 'mixed';

/** Temas disponibles para un grado ('mixed' solo si hay más de uno). */
export function topicsForGrade(grade: Grade): MathTopic[] {
  const ops = gradeRules[grade].operations;
  return ops.length > 1 ? [...ops, 'mixed'] : [...ops];
}

/**
 * Tabla máxima según el nivel: se empieza con tablas pequeñas (hasta
 * el 3) y cada nivel abre una más, sin pasar del tope del grado.
 */
export function tableForLevel(level: number, maxTable: number): number {
  return Math.max(2, Math.min(2 + level, maxTable));
}

/**
 * Arma la configuración del generador para un tema concreto.
 * @param grade Grado escolar elegido por los padres.
 * @param level Nivel actual del niño (curva automática).
 * @param topic Tema elegido en la isla.
 * @param math Ajustes de matemáticas (modo manual usa sus topes).
 */
export function buildMathConfig(
  grade: Grade,
  level: number,
  topic: MathTopic,
  math: MathSettings,
): GeneratorConfig {
  const rules = gradeRules[grade];
  const operations: Operation[] =
    topic === 'mixed'
      ? rules.operations
      : rules.operations.includes(topic)
        ? [topic]
        : [rules.operations[0]]; // tema fuera del grado: respaldo seguro

  if (math.mode === 'manual') {
    return {
      operations,
      minOperand: 1,
      maxOperand: Math.min(math.maxOperand, rules.maxOperandCap),
      maxAnswer: math.maxAnswer,
      optionCount: math.optionCount,
      maxTable: rules.maxTable,
    };
  }

  const range = rangeForLevel(level, rules.maxOperandCap);
  return {
    operations,
    minOperand: range.minOperand,
    maxOperand: range.maxOperand,
    // Tope holgado para no forzar reintentos del generador.
    maxAnswer: range.maxOperand * 2,
    optionCount: range.optionCount,
    maxTable: tableForLevel(level, rules.maxTable),
  };
}
