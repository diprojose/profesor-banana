import { describe, it, expect } from 'vitest';
import { levelInfo, levelFromStars, starsToAdvance } from './levels';

describe('levelInfo', () => {
  it('empieza en nivel 1 con 0 estrellas', () => {
    const info = levelInfo(0);
    expect(info.level).toBe(1);
    expect(info.into).toBe(0);
    expect(info.needed).toBe(10); // 5 + 1*5
    expect(info.progressPct).toBe(0);
  });

  it('sube a nivel 2 al alcanzar 10 estrellas', () => {
    expect(levelFromStars(9)).toBe(1);
    expect(levelFromStars(10)).toBe(2);
    const info = levelInfo(10);
    expect(info.into).toBe(0);
    expect(info.needed).toBe(starsToAdvance(2)); // 15
  });

  it('acumula correctamente varios niveles', () => {
    // L1→2: 10, L2→3: 15  => 25 estrellas = inicio de nivel 3
    expect(levelFromStars(24)).toBe(2);
    expect(levelFromStars(25)).toBe(3);
    const info = levelInfo(28);
    expect(info.level).toBe(3);
    expect(info.into).toBe(3);
  });

  it('progressPct se mantiene entre 0 y 100', () => {
    for (let s = 0; s <= 200; s++) {
      const { progressPct } = levelInfo(s);
      expect(progressPct).toBeGreaterThanOrEqual(0);
      expect(progressPct).toBeLessThanOrEqual(100);
    }
  });
});
