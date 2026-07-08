import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  AppContext,
  type Screen,
  type AuthStatus,
  type Settings,
  type MathSettings,
  type SpeechSettings,
  type Reward,
} from './AppContext';
import { type Lang, getStrings } from '../i18n/strings';
import { palettes, defaultPalette } from '../theme/palettes';
import { headingFonts, defaultHeadingFont } from '../theme/fonts';
import { buildMathConfig, type Grade, type MathTopic } from '../game/grades';
import { defaultSettings } from './defaults';
import {
  loadProfiles,
  saveProfiles,
  loadActiveProfileId,
  saveActiveProfileId,
  loadSessionMode,
  saveSessionMode,
} from './persistence';
import {
  createProfile,
  mergeProfiles,
  type StoredProfile,
} from './profiles';
import {
  type Progress,
  type ProgressEvent,
  progressReducer,
  initialProgress,
} from '../progress/progress';
import { levelInfo, levelFromStars } from '../progress/levels';
import { isFirebaseConfigured } from '../firebase/config';
import {
  subscribeToAuth,
  loginWithEmail,
  loginWithGoogle,
  registerWithEmail,
  logout,
  type AuthUser,
} from '../firebase/auth';
import { fetchCloudProfiles, pushProfile } from '../firebase/sync';

interface AppProviderProps {
  children: ReactNode;
  /** Idioma inicial. */
  initialLang?: Lang;
}

/** Milisegundos de espera antes de subir cambios a la nube. */
const SYNC_DEBOUNCE_MS = 2000;

export function AppProvider({ children, initialLang = 'es' }: AppProviderProps) {
  const [screen, setScreen] = useState<Screen>('home');
  const [lang, setLang] = useState<Lang>(initialLang);
  const [rewards, setRewards] = useState<Reward[]>([]);

  // --- Perfiles (cada niño tiene ajustes + progreso propios) ---
  const [profiles, setProfiles] = useState<StoredProfile[]>(() =>
    loadProfiles(),
  );
  const [activeProfileId, setActiveProfileId] = useState<string | null>(() =>
    loadActiveProfileId(),
  );

  const profilesRef = useRef(profiles);
  useEffect(() => {
    profilesRef.current = profiles;
  }, [profiles]);

  const activeIdRef = useRef(activeProfileId);
  useEffect(() => {
    activeIdRef.current = activeProfileId;
  }, [activeProfileId]);

  // --- Sesión (Firebase Auth o modo invitado) ---
  const [authStatus, setAuthStatus] = useState<AuthStatus>(() => {
    if (!isFirebaseConfigured) return 'guest';
    return loadSessionMode() === 'guest' ? 'guest' : 'loading';
  });
  const [user, setUser] = useState<AuthUser | null>(null);
  const userRef = useRef(user);
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  // --- Sincronización a la nube (debounce por perfil) ---
  const syncTimersRef = useRef(new Map<string, number>());

  const pushProfileSafe = useCallback((uid: string, profileId: string) => {
    const profile = profilesRef.current.find((p) => p.id === profileId);
    if (!profile) return;
    void pushProfile(uid, profile).catch(() => {
      // Sin conexión: se reintentará en el próximo cambio o al volver online.
    });
  }, []);

  const scheduleSync = useCallback(
    (profileId: string) => {
      const uid = userRef.current?.uid;
      if (!uid) return;
      const timers = syncTimersRef.current;
      const existing = timers.get(profileId);
      if (existing) window.clearTimeout(existing);
      timers.set(
        profileId,
        window.setTimeout(() => {
          timers.delete(profileId);
          pushProfileSafe(uid, profileId);
        }, SYNC_DEBOUNCE_MS),
      );
    },
    [pushProfileSafe],
  );

  // Al recuperar conexión, sube todos los perfiles.
  useEffect(() => {
    const onOnline = () => {
      const uid = userRef.current?.uid;
      if (!uid) return;
      for (const p of profilesRef.current) pushProfileSafe(uid, p.id);
    };
    window.addEventListener('online', onOnline);
    return () => window.removeEventListener('online', onOnline);
  }, [pushProfileSafe]);

  /** Al entrar con cuenta: baja la nube, fusiona y sube lo local nuevo. */
  const syncOnLogin = useCallback(async (uid: string) => {
    try {
      const cloud = await fetchCloudProfiles(uid);
      const { merged, toUpload } = mergeProfiles(profilesRef.current, cloud);
      profilesRef.current = merged;
      setProfiles(merged);
      saveProfiles(merged);
      for (const p of toUpload) {
        void pushProfile(uid, p).catch(() => {});
      }
    } catch {
      // Sin conexión: seguimos con lo local; se sincronizará después.
    }
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    return subscribeToAuth((next) => {
      setUser(next);
      if (next) {
        saveSessionMode(null);
        setAuthStatus('signedIn');
        void syncOnLogin(next.uid);
      } else {
        setAuthStatus(loadSessionMode() === 'guest' ? 'guest' : 'signedOut');
      }
    });
  }, [syncOnLogin]);

  // --- Helpers de perfil activo ---
  const activeProfile =
    profiles.find((p) => p.id === activeProfileId) ?? null;
  const settings: Settings = activeProfile?.settings ?? defaultSettings;
  const progress: Progress = activeProfile?.progress ?? initialProgress;

  /** Aplica un cambio al perfil activo, lo persiste y agenda el sync. */
  const updateActiveProfile = useCallback(
    (mutate: (profile: StoredProfile) => StoredProfile) => {
      const id = activeIdRef.current;
      if (!id) return;
      const next = profilesRef.current.map((p) =>
        p.id === id ? { ...mutate(p), updatedAt: Date.now() } : p,
      );
      profilesRef.current = next;
      setProfiles(next);
      saveProfiles(next);
      scheduleSync(id);
    },
    [scheduleSync],
  );

  const goTo = useCallback((next: Screen) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setScreen(next);
  }, []);

  // --- Progreso ---
  const dispatchProgress = useCallback(
    (event: ProgressEvent) => {
      const id = activeIdRef.current;
      const profile = profilesRef.current.find((p) => p.id === id);
      if (!profile) return;

      const prev = profile.progress;
      const next = progressReducer(prev, event);
      if (next === prev) return;
      updateActiveProfile((p) => ({ ...p, progress: next }));

      // Detecta recompensas nuevas para celebrarlas.
      const newRewards: Reward[] = [];
      const prevLevel = levelFromStars(prev.stars);
      const nextLevel = levelFromStars(next.stars);
      for (let lvl = prevLevel + 1; lvl <= nextLevel; lvl++) {
        newRewards.push({ kind: 'level', level: lvl });
      }
      for (const medalId of next.unlockedMedals) {
        if (!prev.unlockedMedals.includes(medalId)) {
          newRewards.push({ kind: 'medal', medalId });
        }
      }
      if (newRewards.length) setRewards((r) => [...r, ...newRewards]);
    },
    [updateActiveProfile],
  );

  const recordCorrectAnswer = useCallback(
    () => dispatchProgress({ type: 'math-correct' }),
    [dispatchProgress],
  );
  const recordWrongAnswer = useCallback(
    () => dispatchProgress({ type: 'math-wrong' }),
    [dispatchProgress],
  );
  const recordPageRead = useCallback(
    (storyId: string, page: number) =>
      dispatchProgress({ type: 'page-read', pageKey: `${storyId}:${page}` }),
    [dispatchProgress],
  );
  const recordStoryCompleted = useCallback(
    (storyId: string) => dispatchProgress({ type: 'story-completed', storyId }),
    [dispatchProgress],
  );
  const recordEnglishCorrect = useCallback(
    (wordId: string) => dispatchProgress({ type: 'english-correct', wordId }),
    [dispatchProgress],
  );
  const recordFrenchCorrect = useCallback(
    (wordId: string) => dispatchProgress({ type: 'french-correct', wordId }),
    [dispatchProgress],
  );
  const recordDictationItem = useCallback(
    (dictationId: string, index: number) =>
      dispatchProgress({
        type: 'dictation-item',
        itemKey: `${dictationId}:${index}`,
      }),
    [dispatchProgress],
  );
  const recordDictationCompleted = useCallback(
    (dictationId: string) =>
      dispatchProgress({ type: 'dictation-completed', dictationId }),
    [dispatchProgress],
  );
  const resetProgress = useCallback(() => {
    updateActiveProfile((p) => ({ ...p, progress: initialProgress }));
    setRewards([]);
  }, [updateActiveProfile]);

  const dismissReward = useCallback(() => {
    setRewards((r) => r.slice(1));
  }, []);

  // --- Ajustes ---
  const updateSettings = useCallback(
    (patch: Partial<Settings>) => {
      updateActiveProfile((p) => ({
        ...p,
        settings: { ...p.settings, ...patch },
      }));
    },
    [updateActiveProfile],
  );
  const updateMath = useCallback(
    (patch: Partial<MathSettings>) => {
      updateActiveProfile((p) => ({
        ...p,
        settings: { ...p.settings, math: { ...p.settings.math, ...patch } },
      }));
    },
    [updateActiveProfile],
  );
  const updateSpeech = useCallback(
    (patch: Partial<SpeechSettings>) => {
      updateActiveProfile((p) => ({
        ...p,
        settings: { ...p.settings, speech: { ...p.settings.speech, ...patch } },
      }));
    },
    [updateActiveProfile],
  );
  const resetSettings = useCallback(() => {
    // Conserva el nombre y el grado del niño; lo demás vuelve a fábrica.
    updateActiveProfile((p) => ({
      ...p,
      settings: {
        ...defaultSettings,
        childName: p.settings.childName,
        grade: p.settings.grade,
      },
    }));
  }, [updateActiveProfile]);

  // --- Sesión: acciones ---
  const loginEmail = useCallback(async (email: string, password: string) => {
    await loginWithEmail(email, password);
  }, []);
  const registerEmail = useCallback(async (email: string, password: string) => {
    await registerWithEmail(email, password);
  }, []);
  const loginGoogle = useCallback(async () => {
    await loginWithGoogle();
  }, []);
  const signOutAccount = useCallback(async () => {
    await logout();
    saveSessionMode(null);
    setScreen('home');
  }, []);
  const playAsGuest = useCallback(() => {
    saveSessionMode('guest');
    setAuthStatus('guest');
  }, []);
  const goToAuth = useCallback(() => {
    saveSessionMode(null);
    setAuthStatus('signedOut');
  }, []);

  // --- Perfiles: acciones ---
  const selectProfile = useCallback((id: string) => {
    setActiveProfileId(id);
    saveActiveProfileId(id);
    setRewards([]);
    setScreen('home');
  }, []);

  const createChildProfile = useCallback(
    (name: string, avatar: string, grade: Grade) => {
      const profile = createProfile(name.trim() || 'Peque', avatar, grade);
      const next = [...profilesRef.current, profile];
      profilesRef.current = next;
      setProfiles(next);
      saveProfiles(next);
      scheduleSync(profile.id);
      setActiveProfileId(profile.id);
      saveActiveProfileId(profile.id);
      setRewards([]);
      setScreen('home');
    },
    [scheduleSync],
  );

  const value = useMemo(() => {
    const palette = palettes[settings.palette] ?? palettes[defaultPalette];
    const headingFontFamily =
      headingFonts[settings.headingFont] ?? headingFonts[defaultHeadingFont];

    const level = levelInfo(progress.stars);

    // El grado escolar acota qué operaciones y números ve el niño;
    // el tema (elegido en la isla) decide qué se practica.
    const mathConfigFor = (topic: MathTopic) =>
      buildMathConfig(settings.grade, level.level, topic, settings.math);

    return {
      screen,
      goTo,
      lang,
      setLang,
      t: getStrings(lang),
      authStatus,
      userEmail: user?.email ?? null,
      accountsEnabled: isFirebaseConfigured,
      loginEmail,
      registerEmail,
      loginGoogle,
      signOutAccount,
      playAsGuest,
      goToAuth,
      profiles,
      activeProfileId,
      selectProfile,
      createChildProfile,
      progress,
      stars: progress.stars,
      level,
      recordCorrectAnswer,
      recordWrongAnswer,
      recordPageRead,
      recordStoryCompleted,
      recordEnglishCorrect,
      recordFrenchCorrect,
      recordDictationItem,
      recordDictationCompleted,
      resetProgress,
      rewards,
      dismissReward,
      settings,
      updateSettings,
      updateMath,
      updateSpeech,
      resetSettings,
      mathConfigFor,
      palette,
      headingFontFamily,
    };
  }, [
    screen,
    goTo,
    lang,
    authStatus,
    user,
    loginEmail,
    registerEmail,
    loginGoogle,
    signOutAccount,
    playAsGuest,
    goToAuth,
    profiles,
    activeProfileId,
    selectProfile,
    createChildProfile,
    settings,
    progress,
    recordCorrectAnswer,
    recordWrongAnswer,
    recordPageRead,
    recordStoryCompleted,
    recordEnglishCorrect,
    recordFrenchCorrect,
    recordDictationItem,
    recordDictationCompleted,
    resetProgress,
    rewards,
    dismissReward,
    updateSettings,
    updateMath,
    updateSpeech,
    resetSettings,
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
