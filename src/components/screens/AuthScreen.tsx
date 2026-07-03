import { useState, type FormEvent } from 'react';
import styles from './AuthScreen.module.css';
import { useApp } from '../../state/useApp';
import { LangToggle } from '../common/LangToggle';
import { ProfessorBananaFull } from '../art/Characters';
import { authErrorKey } from '../../firebase/auth';

type Mode = 'login' | 'register';

/**
 * Pantalla inicial de cuenta (para el padre/madre): entrar, crear
 * cuenta con email o Google, o jugar sin cuenta (modo invitado).
 */
export function AuthScreen() {
  const { t, loginEmail, registerEmail, loginGoogle, playAsGuest } = useApp();

  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [errorKey, setErrorKey] = useState<ReturnType<typeof authErrorKey> | null>(
    null,
  );

  const run = async (action: () => Promise<void>) => {
    setBusy(true);
    setErrorKey(null);
    try {
      await action();
      // El cambio de sesión lo detecta el provider; no navegamos aquí.
    } catch (error) {
      setErrorKey(authErrorKey(error));
    } finally {
      setBusy(false);
    }
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    void run(() =>
      mode === 'login'
        ? loginEmail(email.trim(), password)
        : registerEmail(email.trim(), password),
    );
  };

  return (
    <div className={styles.root}>
      <div className={styles.langCorner}>
        <LangToggle />
      </div>

      <div className={styles.hero}>
        <ProfessorBananaFull size={96} />
        <h1 className={styles.appName}>{t.appName}</h1>
        <p className={styles.tagline}>{t.authWelcome}</p>
      </div>

      <div className={styles.card}>
        {/* Pestañas Entrar / Crear cuenta */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${mode === 'login' ? styles.tabActive : ''}`}
            onClick={() => {
              setMode('login');
              setErrorKey(null);
            }}
          >
            {t.authLogin}
          </button>
          <button
            className={`${styles.tab} ${mode === 'register' ? styles.tabActive : ''}`}
            onClick={() => {
              setMode('register');
              setErrorKey(null);
            }}
          >
            {t.authRegister}
          </button>
        </div>

        <form className={styles.form} onSubmit={submit}>
          <label className={styles.label}>
            {t.authEmailLabel}
            <input
              className={styles.input}
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className={styles.label}>
            {t.authPasswordLabel}
            <input
              className={styles.input}
              type="password"
              autoComplete={
                mode === 'login' ? 'current-password' : 'new-password'
              }
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {mode === 'register' && (
              <span className={styles.hint}>{t.authPasswordHint}</span>
            )}
          </label>

          {errorKey && <div className={styles.error}>{t[errorKey]}</div>}

          <button className={styles.primaryButton} type="submit" disabled={busy}>
            {busy ? t.authWorking : mode === 'login' ? t.authLogin : t.authRegister}
          </button>
        </form>

        <div className={styles.divider}>
          <span>{t.authOr}</span>
        </div>

        <button
          className={styles.googleButton}
          disabled={busy}
          onClick={() => void run(loginGoogle)}
        >
          <GoogleLogo />
          {t.authGoogleButton}
        </button>
      </div>

      <button className={styles.guestButton} onClick={playAsGuest}>
        {t.authGuestButton} →
      </button>
      <div className={styles.guestNote}>{t.authGuestNote}</div>
    </div>
  );
}

function GoogleLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#FFC107"
        d="M43.6 20.1H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C41 35.4 44 30.2 44 24c0-1.3-.1-2.6-.4-3.9z"
      />
    </svg>
  );
}
