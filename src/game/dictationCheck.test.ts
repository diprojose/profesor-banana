import { describe, it, expect } from 'vitest';
import { checkDictation, normalizeForCompare } from './dictationCheck';

describe('normalizeForCompare', () => {
  it('quita mayúsculas y puntuación de los extremos', () => {
    expect(normalizeForCompare('Casa.')).toBe('casa');
    expect(normalizeForCompare('¡Hola!')).toBe('hola');
  });

  it('conserva las tildes y la ñ (la ortografía importa)', () => {
    expect(normalizeForCompare('Mamá')).toBe('mamá');
    expect(normalizeForCompare('niño')).toBe('niño');
  });
});

describe('checkDictation', () => {
  it('marca todo correcto cuando la frase está bien escrita', () => {
    const r = checkDictation('El niño juega.', 'el niño juega');
    expect(r.allCorrect).toBe(true);
    expect(r.correctCount).toBe(3);
    expect(r.scoredCount).toBe(3);
    expect(r.words.every((w) => w.correct)).toBe(true);
  });

  it('acepta la palabra sin tilde, pero lo marca como recordatorio', () => {
    const r = checkDictation('mamá', 'mama');
    expect(r.allCorrect).toBe(true);
    expect(r.correctCount).toBe(1);
    expect(r.hasAccentHint).toBe(true);
    expect(r.words[0].accentHint).toBe(true);
  });

  it('la tilde correcta no genera recordatorio', () => {
    const r = checkDictation('mamá', 'mamá');
    expect(r.allCorrect).toBe(true);
    expect(r.hasAccentHint).toBe(false);
    expect(r.words[0].accentHint).toBe(false);
  });

  it('sigue siendo estricto con la ñ (es otra letra, está en el teclado)', () => {
    const r = checkDictation('niño', 'nino');
    expect(r.allCorrect).toBe(false);
    expect(r.correctCount).toBe(0);
  });

  it('distingue palabras que solo cambian por una consonante', () => {
    const r = checkDictation('casa', 'caza');
    expect(r.allCorrect).toBe(false);
  });

  it('detecta una palabra mal escrita', () => {
    const r = checkDictation('La flor es roja', 'La flor es roha');
    expect(r.allCorrect).toBe(false);
    expect(r.correctCount).toBe(3);
    expect(r.scoredCount).toBe(4);
    const roja = r.words.find((w) => w.text === 'roja');
    expect(roja?.correct).toBe(false);
  });

  it('trata la puntuación suelta como no puntuable', () => {
    const r = checkDictation('Hola , mundo', 'hola mundo');
    // "," normaliza a vacío → no puntúa
    expect(r.scoredCount).toBe(2);
    expect(r.allCorrect).toBe(true);
  });

  it('una entrada vacía no acierta nada', () => {
    const r = checkDictation('El sol brilla', '');
    expect(r.correctCount).toBe(0);
    expect(r.allCorrect).toBe(false);
  });
});
