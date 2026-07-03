/**
 * Autenticación de padres/madres con Firebase Auth.
 * Email + contraseña y Google.
 *
 * Todo el SDK se carga con `import()` dinámico: si Firebase no está
 * configurado (modo local) el navegador nunca descarga ese código.
 */

import type { FirebaseApp } from 'firebase/app';
import { firebaseConfig, isFirebaseConfigured } from './config';

let appPromise: Promise<FirebaseApp> | null = null;

/** Inicializa (una sola vez) la app de Firebase, o null sin config. */
export function getFirebaseApp(): Promise<FirebaseApp> | null {
  if (!isFirebaseConfigured) return null;
  if (!appPromise) {
    appPromise = import('firebase/app').then(
      (m) => m.getApps()[0] ?? m.initializeApp(firebaseConfig),
    );
  }
  return appPromise;
}

export interface AuthUser {
  uid: string;
  email: string | null;
}

/** Se suscribe a los cambios de sesión. Devuelve el unsubscribe. */
export function subscribeToAuth(
  callback: (user: AuthUser | null) => void,
): () => void {
  const promise = getFirebaseApp();
  if (!promise) {
    callback(null);
    return () => {};
  }

  let cancelled = false;
  let unsubscribe: () => void = () => {};

  void (async () => {
    try {
      const app = await promise;
      const { getAuth, onAuthStateChanged } = await import('firebase/auth');
      if (cancelled) return;
      unsubscribe = onAuthStateChanged(getAuth(app), (user) =>
        callback(user ? { uid: user.uid, email: user.email } : null),
      );
    } catch {
      // SDK no disponible (p. ej. offline en la primera carga).
      if (!cancelled) callback(null);
    }
  })();

  return () => {
    cancelled = true;
    unsubscribe();
  };
}

async function requireAuth() {
  const promise = getFirebaseApp();
  if (!promise) throw new Error('firebase-not-configured');
  const app = await promise;
  const authModule = await import('firebase/auth');
  return { auth: authModule.getAuth(app), authModule };
}

export async function registerWithEmail(
  email: string,
  password: string,
): Promise<void> {
  const { auth, authModule } = await requireAuth();
  await authModule.createUserWithEmailAndPassword(auth, email, password);
}

export async function loginWithEmail(
  email: string,
  password: string,
): Promise<void> {
  const { auth, authModule } = await requireAuth();
  await authModule.signInWithEmailAndPassword(auth, email, password);
}

export async function loginWithGoogle(): Promise<void> {
  const { auth, authModule } = await requireAuth();
  await authModule.signInWithPopup(auth, new authModule.GoogleAuthProvider());
}

export async function logout(): Promise<void> {
  const promise = getFirebaseApp();
  if (!promise) return;
  const app = await promise;
  const { getAuth, signOut } = await import('firebase/auth');
  await signOut(getAuth(app));
}

/** Traduce códigos de error de Firebase a claves de i18n. */
export function authErrorKey(
  error: unknown,
):
  | 'authErrorInvalid'
  | 'authErrorEmailInUse'
  | 'authErrorWeakPassword'
  | 'authErrorNetwork'
  | 'authErrorGeneric' {
  const code =
    typeof error === 'object' && error !== null && 'code' in error
      ? String((error as { code: unknown }).code)
      : '';
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
    case 'auth/invalid-email':
      return 'authErrorInvalid';
    case 'auth/email-already-in-use':
      return 'authErrorEmailInUse';
    case 'auth/weak-password':
      return 'authErrorWeakPassword';
    case 'auth/network-request-failed':
      return 'authErrorNetwork';
    default:
      return 'authErrorGeneric';
  }
}
