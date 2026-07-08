import { createContext } from 'react';
import { type Lang, type Strings } from '../i18n/strings';
import { type PaletteName, type Palette } from '../theme/palettes';
import { type HeadingFontName } from '../theme/fonts';
import { type GeneratorConfig } from '../game/types';
import { type Grade, type MathTopic } from '../game/grades';
import { type Progress } from '../progress/progress';
import { type LevelInfo } from '../progress/levels';
import { type StoredProfile } from './profiles';

export type Screen =
  | 'home'
  | 'math'
  | 'reading'
  | 'english'
  | 'french'
  | 'dictation'
  | 'settings'
  | 'achievements'
  | 'profiles'
  | 'onboarding';

/**
 * Estado de la sesión del padre/madre:
 * - 'loading': esperando saber si hay sesión guardada.
 * - 'signedOut': hay cuentas activadas pero nadie ha entrado.
 * - 'guest': jugando sin cuenta (solo datos locales).
 * - 'signedIn': cuenta activa; los perfiles se sincronizan a la nube.
 */
export type AuthStatus = 'loading' | 'signedOut' | 'guest' | 'signedIn';

/** Recompensa pendiente de celebrar (subida de nivel o medalla nueva). */
export type Reward =
  | { kind: 'level'; level: number }
  | { kind: 'medal'; medalId: string };

/**
 * Cómo se decide la dificultad de las matemáticas:
 * - `auto`: sube sola con el nivel (de 1 a 4 dígitos).
 * - `manual`: usa los topes fijos elegidos abajo.
 */
export type DifficultyMode = 'auto' | 'manual';

/** Dificultad de las matemáticas (alimenta al generador). */
export interface MathSettings {
  /** Modo de dificultad. */
  mode: DifficultyMode;
  /** Número más grande que puede aparecer como operando. */
  maxOperand: number;
  /** Resultado máximo permitido. */
  maxAnswer: number;
  /** Cuántas opciones se muestran (incluyendo la correcta). */
  optionCount: number;
}

/** Ajustes de la lectura en voz alta. */
export interface SpeechSettings {
  /** Activar/desactivar la voz. */
  enabled: boolean;
  /** Velocidad de lectura (0.5 lenta – 1.2 rápida). */
  rate: number;
  /** Tono de la voz (0.8 grave – 1.6 agudo). */
  pitch: number;
}

/** Todos los ajustes personalizables por el usuario. */
export interface Settings {
  childName: string;
  /** Grado escolar: define qué operaciones y números ve el niño. */
  grade: Grade;
  palette: PaletteName;
  headingFont: HeadingFontName;
  math: MathSettings;
  speech: SpeechSettings;
}

export interface AppContextValue {
  // Navegación
  screen: Screen;
  goTo: (screen: Screen) => void;

  // Sesión y cuentas
  authStatus: AuthStatus;
  userEmail: string | null;
  /** ¿Firebase está configurado? (si no, todo es modo local). */
  accountsEnabled: boolean;
  loginEmail: (email: string, password: string) => Promise<void>;
  registerEmail: (email: string, password: string) => Promise<void>;
  loginGoogle: () => Promise<void>;
  signOutAccount: () => Promise<void>;
  playAsGuest: () => void;
  /** Sale del modo invitado para ir a la pantalla de cuenta. */
  goToAuth: () => void;

  // Perfiles de niño
  profiles: StoredProfile[];
  activeProfileId: string | null;
  selectProfile: (id: string) => void;
  createChildProfile: (name: string, avatar: string, grade: Grade) => void;

  // Idioma
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Strings;

  // Progreso
  progress: Progress;
  stars: number;
  level: LevelInfo;
  /** Suma resuelta correctamente (+1 estrella, racha, medallas). */
  recordCorrectAnswer: () => void;
  /** Fallo en matemáticas (corta la racha). */
  recordWrongAnswer: () => void;
  /** Página leída en voz alta (+1 estrella la primera vez). */
  recordPageRead: (storyId: string, page: number) => void;
  /** Cuento terminado: pregunta final respondida bien (+2 estrellas). */
  recordStoryCompleted: (storyId: string) => void;
  /** Palabra de inglés acertada (+1 estrella, cuenta palabras distintas). */
  recordEnglishCorrect: (wordId: string) => void;
  /** Palabra de francés acertada (+1 estrella, cuenta palabras distintas). */
  recordFrenchCorrect: (wordId: string) => void;
  /** Parte de dictado escrita sin errores (+1 estrella la primera vez). */
  recordDictationItem: (dictationId: string, index: number) => void;
  /** Dictado terminado: todas sus partes escritas (+2 estrellas). */
  recordDictationCompleted: (dictationId: string) => void;
  resetProgress: () => void;

  // Recompensas por celebrar (cola)
  rewards: Reward[];
  dismissReward: () => void;

  // Ajustes y theme derivado
  settings: Settings;
  updateSettings: (patch: Partial<Settings>) => void;
  updateMath: (patch: Partial<MathSettings>) => void;
  updateSpeech: (patch: Partial<SpeechSettings>) => void;
  resetSettings: () => void;
  /** Config lista para el generador según el tema elegido en la isla. */
  mathConfigFor: (topic: MathTopic) => GeneratorConfig;
  palette: Palette;
  headingFontFamily: string;
}

export const AppContext = createContext<AppContextValue | null>(null);
