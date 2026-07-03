/**
 * Persistencia local (localStorage).
 *
 * Desde la versión multi-perfil, todo vive en una lista de perfiles
 * (`aventura.profiles.v2`): cada niño tiene sus ajustes y su progreso.
 * Si existe el formato viejo de un solo niño (`aventura.settings.v1` +
 * `aventura.progress.v1`), se migra automáticamente a un perfil.
 */

import { type Settings } from './AppContext';
import { defaultSettings } from './defaults';
import { type Progress, initialProgress } from '../progress/progress';
import { type StoredProfile } from './profiles';

const PROFILES_KEY = 'aventura.profiles.v2';
const ACTIVE_KEY = 'aventura.activeProfile.v2';
const SESSION_KEY = 'aventura.session.v1';

// Claves del formato viejo (un solo niño), solo para migrar.
const LEGACY_SETTINGS_KEY = 'aventura.settings.v1';
const LEGACY_PROGRESS_KEY = 'aventura.progress.v1';

function storage(): Storage | null {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  return window.localStorage;
}

/** Completa unos ajustes parciales con los valores por defecto. */
export function sanitizeSettings(raw: Partial<Settings> | undefined): Settings {
  return {
    ...defaultSettings,
    ...raw,
    math: { ...defaultSettings.math, ...raw?.math },
    speech: { ...defaultSettings.speech, ...raw?.speech },
  };
}

/** Completa un progreso parcial con los valores iniciales. */
export function sanitizeProgress(raw: Partial<Progress> | undefined): Progress {
  return {
    ...initialProgress,
    ...raw,
    unlockedMedals: raw?.unlockedMedals ?? [],
    englishWordIds: raw?.englishWordIds ?? [],
    frenchWordIds: raw?.frenchWordIds ?? [],
    readPages: raw?.readPages ?? [],
    completedStories: raw?.completedStories ?? [],
  };
}

/** Normaliza un perfil venido de disco o de la nube. */
export function sanitizeProfile(raw: Partial<StoredProfile>): StoredProfile {
  return {
    id: raw.id ?? `p-${Date.now()}`,
    avatar: raw.avatar ?? '🦊',
    createdAt: raw.createdAt ?? Date.now(),
    updatedAt: raw.updatedAt ?? Date.now(),
    settings: sanitizeSettings(raw.settings),
    progress: sanitizeProgress(raw.progress),
  };
}

/** Migra el formato viejo de un solo niño a un perfil, si existe. */
function migrateLegacy(store: Storage): StoredProfile[] {
  try {
    const rawSettings = store.getItem(LEGACY_SETTINGS_KEY);
    const rawProgress = store.getItem(LEGACY_PROGRESS_KEY);
    if (!rawSettings && !rawProgress) return [];

    const settings = sanitizeSettings(
      rawSettings ? (JSON.parse(rawSettings) as Partial<Settings>) : undefined,
    );
    const progress = sanitizeProgress(
      rawProgress ? (JSON.parse(rawProgress) as Partial<Progress>) : undefined,
    );
    const now = Date.now();
    const profile: StoredProfile = {
      id: `legacy-${now}`,
      avatar: '🦊',
      createdAt: now,
      updatedAt: now,
      settings,
      progress,
    };
    // Guarda el nuevo formato y limpia el viejo.
    store.setItem(PROFILES_KEY, JSON.stringify([profile]));
    store.removeItem(LEGACY_SETTINGS_KEY);
    store.removeItem(LEGACY_PROGRESS_KEY);
    return [profile];
  } catch {
    return [];
  }
}

/** Carga todos los perfiles guardados (migrando el formato viejo). */
export function loadProfiles(): StoredProfile[] {
  const store = storage();
  if (!store) return [];
  try {
    const raw = store.getItem(PROFILES_KEY);
    if (!raw) return migrateLegacy(store);
    const parsed = JSON.parse(raw) as Partial<StoredProfile>[];
    if (!Array.isArray(parsed)) return [];
    return parsed.map(sanitizeProfile);
  } catch {
    return [];
  }
}

/** Guarda la lista completa de perfiles (silencioso si falla). */
export function saveProfiles(profiles: StoredProfile[]): void {
  const store = storage();
  if (!store) return;
  try {
    store.setItem(PROFILES_KEY, JSON.stringify(profiles));
  } catch {
    // Almacenamiento lleno o no disponible: ignorar.
  }
}

/** Id del perfil activo (el niño que está jugando). */
export function loadActiveProfileId(): string | null {
  return storage()?.getItem(ACTIVE_KEY) ?? null;
}

export function saveActiveProfileId(id: string | null): void {
  const store = storage();
  if (!store) return;
  try {
    if (id) store.setItem(ACTIVE_KEY, id);
    else store.removeItem(ACTIVE_KEY);
  } catch {
    // ignorar
  }
}

/** Modo de sesión elegido: 'guest' = jugar sin cuenta. */
export function loadSessionMode(): 'guest' | null {
  return storage()?.getItem(SESSION_KEY) === 'guest' ? 'guest' : null;
}

export function saveSessionMode(mode: 'guest' | null): void {
  const store = storage();
  if (!store) return;
  try {
    if (mode) store.setItem(SESSION_KEY, mode);
    else store.removeItem(SESSION_KEY);
  } catch {
    // ignorar
  }
}
