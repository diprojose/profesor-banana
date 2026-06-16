import { describe, it, expect } from 'vitest';
import {
  generateProblem,
  generateDistinctProblem,
  problemSignature,
  type Random,
} from './mathGenerator';
import { type GeneratorConfig } from './types';

/** RNG determinista (LCG) para tests reproducibles. */
function seededRandom(seed: number): Random {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0xffffffff;
  };
}

const additionConfig: GeneratorConfig = {
  operations: ['addition'],
  minOperand: 1,
  maxOperand: 5,
  maxAnswer: 10,
  optionCount: 3,
};

describe('generateProblem', () => {
  it('genera sumas correctas dentro de los límites', () => {
    const rng = seededRandom(42);
    for (let i = 0; i < 500; i++) {
      const p = generateProblem(additionConfig, rng);
      expect(p.operation).toBe('addition');
      expect(p.a + p.b).toBe(p.answer);
      expect(p.a).toBeGreaterThanOrEqual(1);
      expect(p.a).toBeLessThanOrEqual(5);
      expect(p.b).toBeGreaterThanOrEqual(1);
      expect(p.b).toBeLessThanOrEqual(5);
      expect(p.answer).toBeLessThanOrEqual(10);
    }
  });

  it('siempre incluye la respuesta entre las opciones', () => {
    const rng = seededRandom(7);
    for (let i = 0; i < 500; i++) {
      const p = generateProblem(additionConfig, rng);
      expect(p.options).toContain(p.answer);
    }
  });

  it('genera el número pedido de opciones, únicas y no negativas', () => {
    const rng = seededRandom(123);
    for (let i = 0; i < 500; i++) {
      const p = generateProblem(additionConfig, rng);
      expect(p.options).toHaveLength(3);
      expect(new Set(p.options).size).toBe(3);
      for (const opt of p.options) expect(opt).toBeGreaterThanOrEqual(0);
    }
  });

  it('en resta nunca produce resultados negativos', () => {
    const rng = seededRandom(99);
    const subConfig: GeneratorConfig = {
      ...additionConfig,
      operations: ['subtraction'],
    };
    for (let i = 0; i < 500; i++) {
      const p = generateProblem(subConfig, rng);
      expect(p.operation).toBe('subtraction');
      expect(p.a - p.b).toBe(p.answer);
      expect(p.answer).toBeGreaterThanOrEqual(0);
    }
  });

  it('la suma es conmutativa en la firma (4+5 == 5+4)', () => {
    const x = generateProblem(additionConfig, seededRandom(1));
    const ab = { ...x, a: 4, b: 5, operation: 'addition' as const, answer: 9 };
    const ba = { ...x, a: 5, b: 4, operation: 'addition' as const, answer: 9 };
    expect(problemSignature(ab)).toBe(problemSignature(ba));
  });

  it('generateDistinctProblem no repite firmas recientes cuando hay margen', () => {
    const rng = seededRandom(5);
    const recent: string[] = [];
    // Rango amplio: siempre debería encontrar una firma nueva.
    const wide: GeneratorConfig = {
      operations: ['addition'],
      minOperand: 1,
      maxOperand: 20,
      maxAnswer: 40,
      optionCount: 3,
    };
    for (let i = 0; i < 50; i++) {
      const p = generateDistinctProblem(wide, recent, rng);
      const sig = problemSignature(p);
      expect(recent).not.toContain(sig);
      recent.unshift(sig);
      if (recent.length > 5) recent.pop();
    }
  });
});
