/**
 * Sincronización de perfiles con Firestore.
 *
 * Modelo de datos: `users/{uid}/children/{profileId}` guarda el perfil
 * completo (avatar, ajustes y progreso) con `updatedAt` para decidir
 * qué copia gana. La fuente local (localStorage) siempre manda en el
 * dispositivo; la nube es la copia de respaldo/compartida.
 *
 * El SDK de Firestore se carga con `import()` dinámico, igual que auth.
 */

import { getFirebaseApp } from './auth';
import { sanitizeProfile } from '../state/persistence';
import { type StoredProfile } from '../state/profiles';

async function getDb() {
  const promise = getFirebaseApp();
  if (!promise) return null;
  const app = await promise;
  const firestore = await import('firebase/firestore');
  return { db: firestore.getFirestore(app), firestore };
}

/** Descarga todos los perfiles de niño de una cuenta. */
export async function fetchCloudProfiles(uid: string): Promise<StoredProfile[]> {
  const handle = await getDb();
  if (!handle) return [];
  const { db, firestore } = handle;
  const snapshot = await firestore.getDocs(
    firestore.collection(db, 'users', uid, 'children'),
  );
  return snapshot.docs.map((d) =>
    sanitizeProfile({ ...(d.data() as Partial<StoredProfile>), id: d.id }),
  );
}

/** Sube (o actualiza) un perfil a la nube. */
export async function pushProfile(
  uid: string,
  profile: StoredProfile,
): Promise<void> {
  const handle = await getDb();
  if (!handle) return;
  const { db, firestore } = handle;
  const ref = firestore.doc(db, 'users', uid, 'children', profile.id);
  await firestore.setDoc(ref, profile);
}
