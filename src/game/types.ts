/** Operaciones soportadas por el generador. */
export type Operation =
  | 'addition'
  | 'subtraction'
  | 'multiplication'
  | 'division';

export const operationSymbol: Record<Operation, string> = {
  addition: '+',
  subtraction: '−',
  multiplication: '×',
  division: '÷',
};

/** Un problema matemático listo para mostrar en pantalla. */
export interface MathProblem {
  /** Primer operando (el de la izquierda). */
  a: number;
  /** Segundo operando (el de la derecha). */
  b: number;
  operation: Operation;
  /** Respuesta correcta. */
  answer: number;
  /** Opciones a elegir, ya mezcladas, incluyendo la respuesta. */
  options: number[];
}

/** Configuración para generar un problema. */
export interface GeneratorConfig {
  /** Operaciones permitidas; se elige una al azar. */
  operations: Operation[];
  /** Valor mínimo de cada operando (suma/resta). */
  minOperand: number;
  /** Valor máximo de cada operando (suma/resta). */
  maxOperand: number;
  /** Tope para la respuesta (p. ej. no pasar de 10 al inicio). */
  maxAnswer: number;
  /** Cuántas opciones mostrar (incluyendo la correcta). */
  optionCount: number;
  /**
   * Tabla más alta para multiplicar/dividir (p. ej. 5 = tablas del 1
   * al 5). Solo se usa con esas operaciones.
   */
  maxTable?: number;
}

/** Configuración por defecto: sumas sencillas, resultado hasta 10. */
export const defaultConfig: GeneratorConfig = {
  operations: ['addition'],
  minOperand: 1,
  maxOperand: 5,
  maxAnswer: 10,
  optionCount: 3,
  maxTable: 5,
};
