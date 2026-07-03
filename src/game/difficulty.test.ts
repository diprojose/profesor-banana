import { describe, it, expect } from 'vitest';
import { rangeForLevel, maxDifficultyLevel } from './difficulty';

describe('rangeForLevel', () => {
  it('el nivel 1 usa números de un solo dígito', () => {
    const r = rangeForLevel(1);
    expect(r.minOperand).toBe(1);
    expect(r.maxOperand).toBeLessThanOrEqual(9);
  });

  it('el máximo crece (o se mantiene) con el nivel', () => {
    let prev = 0;
    for (let lvl = 1; lvl <= maxDifficultyLevel + 3; lvl++) {
      const r = rangeForLevel(lvl);
      expect(r.maxOperand).toBeGreaterThanOrEqual(prev);
      expect(r.minOperand).toBeGreaterThanOrEqual(1);
      expect(r.minOperand).toBeLessThan(r.maxOperand);
      prev = r.maxOperand;
    }
  });

  it('alcanza sumas de 4 dígitos en el nivel máximo', () => {
    const r = rangeForLevel(maxDifficultyLevel);
    // Dos operandos cerca del tope dan un resultado de 4 dígitos.
    expect(r.maxOperand * 2).toBeGreaterThanOrEqual(1000);
  });

  it('niveles por encima del tope no rompen (se mantienen en el último tramo)', () => {
    const top = rangeForLevel(maxDifficultyLevel);
    const beyond = rangeForLevel(maxDifficultyLevel + 10);
    expect(beyond).toEqual(top);
  });

  it('el techo del grado acota la curva sin importar el nivel', () => {
    for (let lvl = 1; lvl <= maxDifficultyLevel + 3; lvl++) {
      const r = rangeForLevel(lvl, 50);
      expect(r.maxOperand).toBeLessThanOrEqual(50);
      expect(r.minOperand).toBeLessThan(r.maxOperand);
    }
    // Con techo no cambia nada por debajo de él.
    expect(rangeForLevel(1, 50)).toEqual(rangeForLevel(1));
  });
});
