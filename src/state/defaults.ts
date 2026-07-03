import { type Settings, type MathSettings } from './AppContext';
import { defaultPalette } from '../theme/palettes';
import { defaultHeadingFont } from '../theme/fonts';

/** Ajustes por defecto al abrir la app por primera vez. */
export const defaultSettings: Settings = {
  childName: 'Sofía',
  grade: 'grade1',
  palette: defaultPalette,
  headingFont: defaultHeadingFont,
  math: {
    mode: 'auto',
    maxOperand: 5,
    maxAnswer: 10,
    optionCount: 3,
  },
  speech: {
    enabled: true,
    rate: 0.85,
    pitch: 1.12,
  },
};

/** Un preset solo toca los topes, no el modo de dificultad. */
export type MathPreset = Omit<MathSettings, 'mode'>;

/** Presets rápidos de dificultad (modo manual) para Ajustes. */
export const difficultyPresets = {
  easy: {
    maxOperand: 5,
    maxAnswer: 10,
    optionCount: 3,
  },
  medium: {
    maxOperand: 10,
    maxAnswer: 20,
    optionCount: 3,
  },
  hard: {
    maxOperand: 20,
    maxAnswer: 40,
    optionCount: 4,
  },
} satisfies Record<string, MathPreset>;

export type DifficultyPreset = keyof typeof difficultyPresets;

/** Devuelve el preset que coincide con la configuración actual, o null. */
export function matchPreset(math: MathSettings): DifficultyPreset | null {
  const entries = Object.entries(difficultyPresets) as [
    DifficultyPreset,
    MathPreset,
  ][];
  for (const [name, preset] of entries) {
    if (
      preset.maxOperand === math.maxOperand &&
      preset.maxAnswer === math.maxAnswer &&
      preset.optionCount === math.optionCount
    ) {
      return name;
    }
  }
  return null;
}

/** Límites de los controles finos (sliders/steppers). */
export const mathLimits = {
  maxOperand: { min: 2, max: 50 },
  maxAnswer: { min: 5, max: 100 },
  optionCount: { min: 2, max: 4 },
};

export const speechLimits = {
  rate: { min: 0.5, max: 1.2, step: 0.05 },
  pitch: { min: 0.8, max: 1.6, step: 0.05 },
};
