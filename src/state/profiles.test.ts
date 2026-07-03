import { describe, it, expect } from 'vitest';
import { createProfile, mergeProfiles, type StoredProfile } from './profiles';

function profileAt(id: string, updatedAt: number, stars = 0): StoredProfile {
  const p = createProfile('Test', '🦊', 'grade1', updatedAt);
  return {
    ...p,
    id,
    createdAt: updatedAt,
    updatedAt,
    progress: { ...p.progress, stars },
  };
}

describe('createProfile', () => {
  it('crea un perfil con nombre, avatar, grado y progreso en cero', () => {
    const p = createProfile('Sofía', '🐼', 'grade2');
    expect(p.settings.childName).toBe('Sofía');
    expect(p.avatar).toBe('🐼');
    expect(p.settings.grade).toBe('grade2');
    expect(p.progress.stars).toBe(0);
    expect(p.id.length).toBeGreaterThan(0);
  });

  it('genera ids distintos', () => {
    const a = createProfile('A', '🦊', 'grade1');
    const b = createProfile('B', '🦊', 'grade1');
    expect(a.id).not.toBe(b.id);
  });
});

describe('mergeProfiles', () => {
  it('conserva perfiles que solo existen en un lado', () => {
    const local = [profileAt('a', 100)];
    const cloud = [profileAt('b', 200)];
    const { merged, toUpload } = mergeProfiles(local, cloud);
    expect(merged.map((p) => p.id).sort()).toEqual(['a', 'b']);
    // El local nuevo se sube a la nube.
    expect(toUpload.map((p) => p.id)).toEqual(['a']);
  });

  it('si existe en ambos lados gana el más reciente', () => {
    const localNewer = [profileAt('a', 300, 50)];
    const cloudOlder = [profileAt('a', 100, 10)];
    const r1 = mergeProfiles(localNewer, cloudOlder);
    expect(r1.merged[0].progress.stars).toBe(50);
    expect(r1.toUpload.map((p) => p.id)).toEqual(['a']); // sube el local

    const localOlder = [profileAt('a', 100, 10)];
    const cloudNewer = [profileAt('a', 300, 50)];
    const r2 = mergeProfiles(localOlder, cloudNewer);
    expect(r2.merged[0].progress.stars).toBe(50);
    expect(r2.toUpload).toHaveLength(0); // la nube ya está al día
  });

  it('con ambos lados vacíos no hay nada que fusionar', () => {
    const { merged, toUpload } = mergeProfiles([], []);
    expect(merged).toEqual([]);
    expect(toUpload).toEqual([]);
  });

  it('ordena por fecha de creación', () => {
    const local = [profileAt('late', 500)];
    const cloud = [profileAt('early', 100)];
    const { merged } = mergeProfiles(local, cloud);
    expect(merged.map((p) => p.id)).toEqual(['early', 'late']);
  });
});
