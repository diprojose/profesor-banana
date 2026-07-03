/**
 * Perfiles de niño: una cuenta (o un dispositivo en modo invitado)
 * puede tener varios aventureros, cada uno con sus ajustes y su
 * progreso. Este módulo es puro (sin window) para poder testearlo.
 */

import { type Settings } from './AppContext';
import { type Progress } from '../progress/progress';
import { type Grade } from '../game/grades';
import { defaultSettings } from './defaults';
import { initialProgress } from '../progress/progress';

export interface StoredProfile {
  id: string;
  /** Emoji que representa al niño en el selector. */
  avatar: string;
  createdAt: number;
  /** Última modificación (decide quién gana al sincronizar). */
  updatedAt: number;
  settings: Settings;
  progress: Progress;
}

/** Avatares disponibles en el onboarding. */
export const avatarOptions = [
  '🦊',
  '🐼',
  '🦁',
  '🐸',
  '🦄',
  '🐯',
  '🐙',
  '🦖',
] as const;

function randomId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `p-${Date.now()}-${Math.floor(Math.random() * 1e9)}`;
}

/** Crea un perfil nuevo con ajustes por defecto. */
export function createProfile(
  name: string,
  avatar: string,
  grade: Grade,
  now: number = Date.now(),
): StoredProfile {
  return {
    id: randomId(),
    avatar,
    createdAt: now,
    updatedAt: now,
    settings: { ...defaultSettings, childName: name, grade },
    progress: initialProgress,
  };
}

/**
 * Fusiona los perfiles locales con los de la nube.
 * - Perfiles que solo existen en un lado se conservan.
 * - Si existe en ambos, gana el que tenga `updatedAt` más reciente.
 * Devuelve además qué perfiles hay que subir a la nube (los locales
 * nuevos o más recientes que su copia remota).
 */
export function mergeProfiles(
  local: StoredProfile[],
  cloud: StoredProfile[],
): { merged: StoredProfile[]; toUpload: StoredProfile[] } {
  const byId = new Map<string, StoredProfile>();
  const toUpload: StoredProfile[] = [];

  for (const remote of cloud) byId.set(remote.id, remote);

  for (const mine of local) {
    const remote = byId.get(mine.id);
    if (!remote) {
      byId.set(mine.id, mine);
      toUpload.push(mine);
    } else if (mine.updatedAt > remote.updatedAt) {
      byId.set(mine.id, mine);
      toUpload.push(mine);
    }
  }

  // Orden estable: primero los creados antes.
  const merged = [...byId.values()].sort((a, b) => a.createdAt - b.createdAt);
  return { merged, toUpload };
}
