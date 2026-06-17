import { describe, it, expect } from 'vitest';
import { checkReading, normalizeWord, editDistance } from './readingCheck';

describe('normalizeWord', () => {
  it('quita tildes, mayúsculas y puntuación', () => {
    expect(normalizeWord('Pequeño,')).toBe('pequeno');
    expect(normalizeWord('Azul.')).toBe('azul');
    expect(normalizeWord('¡Hola!')).toBe('hola');
  });
});

describe('editDistance', () => {
  it('mide cambios mínimos', () => {
    expect(editDistance('barco', 'barco')).toBe(0);
    expect(editDistance('barco', 'barca')).toBe(1);
    expect(editDistance('sol', 'sal')).toBe(1);
  });
});

describe('checkReading', () => {
  const sentence = 'El pequeño barco navega por el mar azul.';

  it('lectura perfecta da estado "great" y puntuación 1', () => {
    const r = checkReading(sentence, 'el pequeño barco navega por el mar azul');
    expect(r.status).toBe('great');
    expect(r.score).toBe(1);
    expect(r.words.every((w) => w.matched)).toBe(true);
  });

  it('tolera pequeñas diferencias de reconocimiento', () => {
    // "navega" -> "navego", "azul" igual
    const r = checkReading(sentence, 'el pequeno barco navego por el mar azul');
    expect(r.status).toBe('great');
  });

  it('marca como no leídas las palabras que faltan', () => {
    const r = checkReading(sentence, 'el barco azul');
    const navega = r.words.find((w) => w.text.startsWith('navega'));
    expect(navega?.matched).toBe(false);
    expect(r.score).toBeLessThan(1);
  });

  it('lectura muy distinta da "tryagain"', () => {
    const r = checkReading(sentence, 'hola amigo');
    expect(r.status).toBe('tryagain');
  });

  it('una palabra que es solo puntuación no penaliza', () => {
    const r = checkReading('El sol .', 'el sol');
    expect(r.score).toBe(1);
    expect(r.status).toBe('great');
  });
});
