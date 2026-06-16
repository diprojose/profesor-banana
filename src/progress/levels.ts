/**
 * Sistema de niveles basado en estrellas acumuladas.
 *
 * Cada nivel pide cada vez más estrellas para avanzar, así la
 * progresión se siente como una aventura sin volverse imposible.
 */

/** Estrellas necesarias para pasar del nivel `level` al siguiente. */
export function starsToAdvance(level: number): number {
  return 5 + level * 5; // L1→2: 10, L2→3: 15, L3→4: 20, ...
}

export interface LevelInfo {
  /** Nivel actual (empieza en 1). */
  level: number;
  /** Estrellas ya ganadas dentro del nivel actual. */
  into: number;
  /** Estrellas que pide el nivel actual para avanzar. */
  needed: number;
  /** Progreso dentro del nivel, 0–100. */
  progressPct: number;
}

/** Calcula el nivel y el progreso a partir del total de estrellas. */
export function levelInfo(totalStars: number): LevelInfo {
  let level = 1;
  let consumed = 0;

  // Avanza de nivel mientras alcancen las estrellas restantes.
  while (totalStars - consumed >= starsToAdvance(level)) {
    consumed += starsToAdvance(level);
    level += 1;
  }

  const into = totalStars - consumed;
  const needed = starsToAdvance(level);
  return {
    level,
    into,
    needed,
    progressPct: Math.max(0, Math.min(100, (into / needed) * 100)),
  };
}

/** Atajo: solo el número de nivel para un total de estrellas. */
export function levelFromStars(totalStars: number): number {
  return levelInfo(totalStars).level;
}
