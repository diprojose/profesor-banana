import { type Settings } from './AppContext';
import { defaultSettings } from './defaults';
import { type Progress, initialProgress } from '../progress/progress';

const STORAGE_KEY = 'aventura.settings.v1';
const PROGRESS_KEY = 'aventura.progress.v1';

/**
 * Carga los ajustes guardados, combinándolos con los valores por
 * defecto para tolerar versiones anteriores o campos faltantes.
 */
export function loadSettings(): Settings {
  if (typeof window === 'undefined' || !window.localStorage) {
    return defaultSettings;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultSettings;
    const saved = JSON.parse(raw) as Partial<Settings>;
    return {
      ...defaultSettings,
      ...saved,
      math: { ...defaultSettings.math, ...saved.math },
      speech: { ...defaultSettings.speech, ...saved.speech },
    };
  } catch {
    return defaultSettings;
  }
}

/** Guarda los ajustes en localStorage (silencioso si falla). */
export function saveSettings(settings: Settings): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Almacenamiento lleno o no disponible: ignorar.
  }
}

/** Carga el progreso guardado, combinándolo con los valores iniciales. */
export function loadProgress(): Progress {
  if (typeof window === 'undefined' || !window.localStorage) {
    return initialProgress;
  }
  try {
    const raw = window.localStorage.getItem(PROGRESS_KEY);
    if (!raw) return initialProgress;
    const saved = JSON.parse(raw) as Partial<Progress>;
    return {
      ...initialProgress,
      ...saved,
      unlockedMedals: saved.unlockedMedals ?? [],
    };
  } catch {
    return initialProgress;
  }
}

/** Guarda el progreso en localStorage (silencioso si falla). */
export function saveProgress(progress: Progress): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch {
    // Almacenamiento lleno o no disponible: ignorar.
  }
}
