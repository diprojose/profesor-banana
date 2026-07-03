import { describe, it, expect } from 'vitest';
import {
  gradeRules,
  gradeOrder,
  topicsForGrade,
  tableForLevel,
  buildMathConfig,
} from './grades';
import { type MathSettings } from '../state/AppContext';

const autoMath: MathSettings = {
  mode: 'auto',
  maxOperand: 5,
  maxAnswer: 10,
  optionCount: 3,
};

describe('topicsForGrade', () => {
  it('preescolar solo ve sumas (sin mezclado)', () => {
    expect(topicsForGrade('preschool')).toEqual(['addition']);
  });

  it('1º ve sumas, restas y sorpresa; nunca multiplicación', () => {
    const topics = topicsForGrade('grade1');
    expect(topics).toContain('addition');
    expect(topics).toContain('subtraction');
    expect(topics).toContain('mixed');
    expect(topics).not.toContain('multiplication');
    expect(topics).not.toContain('division');
  });

  it('2º suma la multiplicación y 3º la división', () => {
    expect(topicsForGrade('grade2')).toContain('multiplication');
    expect(topicsForGrade('grade2')).not.toContain('division');
    expect(topicsForGrade('grade3')).toContain('division');
  });

  it('cada grado amplía (nunca quita) lo del anterior', () => {
    for (let i = 1; i < gradeOrder.length; i++) {
      const prev = gradeRules[gradeOrder[i - 1]].operations;
      const curr = gradeRules[gradeOrder[i]].operations;
      for (const op of prev) expect(curr).toContain(op);
    }
  });
});

describe('tableForLevel', () => {
  it('empieza con tablas pequeñas y crece hasta el tope del grado', () => {
    expect(tableForLevel(1, 10)).toBe(3);
    expect(tableForLevel(3, 10)).toBe(5);
    expect(tableForLevel(20, 10)).toBe(10); // nunca pasa del tope
    expect(tableForLevel(20, 5)).toBe(5);
  });
});

describe('buildMathConfig', () => {
  it('el grado acota los números aunque el nivel sea altísimo', () => {
    const config = buildMathConfig('grade1', 11, 'addition', autoMath);
    // 1º grado: resultados hasta ~100, nunca sumas de 4 dígitos.
    expect(config.maxOperand).toBeLessThanOrEqual(50);
    expect(config.maxAnswer).toBeLessThanOrEqual(100);
  });

  it('preescolar mantiene sumas hasta 10', () => {
    const config = buildMathConfig('preschool', 8, 'addition', autoMath);
    expect(config.maxOperand).toBeLessThanOrEqual(5);
  });

  it('el tema mixto usa todas las operaciones del grado', () => {
    const config = buildMathConfig('grade2', 3, 'mixed', autoMath);
    expect(config.operations).toEqual(
      gradeRules.grade2.operations,
    );
  });

  it('un tema fuera del grado cae en un respaldo seguro', () => {
    const config = buildMathConfig('grade1', 3, 'multiplication', autoMath);
    expect(config.operations).toEqual(['addition']);
  });

  it('el modo manual respeta sus topes pero no supera el grado', () => {
    const manual: MathSettings = {
      mode: 'manual',
      maxOperand: 40,
      maxAnswer: 80,
      optionCount: 4,
    };
    const config = buildMathConfig('preschool', 1, 'addition', manual);
    expect(config.maxOperand).toBeLessThanOrEqual(
      gradeRules.preschool.maxOperandCap,
    );
  });
});
