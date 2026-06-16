import { createContext } from 'react';
import { type Lang, type Strings } from '../i18n/strings';
import { type PaletteName, type Palette } from '../theme/palettes';
import { type HeadingFontName } from '../theme/fonts';
import { type Operation, type GeneratorConfig } from '../game/types';
import { type Progress } from '../progress/progress';
import { type LevelInfo } from '../progress/levels';

export type Screen = 'home' | 'math' | 'reading' | 'settings' | 'achievements';

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
  /** Operaciones activas; debe haber al menos una. */
  operations: Operation[];
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
  palette: PaletteName;
  headingFont: HeadingFontName;
  math: MathSettings;
  speech: SpeechSettings;
}

export interface AppContextValue {
  // Navegación
  screen: Screen;
  goTo: (screen: Screen) => void;

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
  /** Página leída en voz alta (+1 estrella). */
  recordPageRead: () => void;
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
  /** Config lista para pasar al generador de problemas. */
  mathConfig: GeneratorConfig;
  palette: Palette;
  headingFontFamily: string;
}

export const AppContext = createContext<AppContextValue | null>(null);
