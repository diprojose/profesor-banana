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
  type Settings,
  type MathSettings,
  type SpeechSettings,
  type Reward,
} from './AppContext';
import { type Lang, getStrings } from '../i18n/strings';
import { palettes, defaultPalette } from '../theme/palettes';
import { headingFonts, defaultHeadingFont } from '../theme/fonts';
import { type GeneratorConfig } from '../game/types';
import { defaultSettings } from './defaults';
import {
  loadSettings,
  saveSettings,
  loadProgress,
  saveProgress,
} from './persistence';
import {
  type Progress,
  type ProgressEvent,
  progressReducer,
  initialProgress,
} from '../progress/progress';
import { levelInfo, levelFromStars } from '../progress/levels';
import { rangeForLevel } from '../game/difficulty';

interface AppProviderProps {
  children: ReactNode;
  /** Idioma inicial. */
  initialLang?: Lang;
}

export function AppProvider({ children, initialLang = 'es' }: AppProviderProps) {
  const [screen, setScreen] = useState<Screen>('home');
  const [lang, setLang] = useState<Lang>(initialLang);
  const [settings, setSettings] = useState<Settings>(() => loadSettings());
  const [progress, setProgress] = useState<Progress>(() => loadProgress());
  const [rewards, setRewards] = useState<Reward[]>([]);

  // Ref para leer el progreso actual de forma síncrona dentro de las
  // acciones (evita efectos secundarios dentro del updater de setState).
  const progressRef = useRef(progress);
  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  // Persistencia.
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);
  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const goTo = useCallback((next: Screen) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setScreen(next);
  }, []);

  // --- Progreso ---
  const dispatchProgress = useCallback((event: ProgressEvent) => {
    const prev = progressRef.current;
    const next = progressReducer(prev, event);
    progressRef.current = next;
    setProgress(next);

    // Detecta recompensas nuevas para celebrarlas.
    const newRewards: Reward[] = [];
    const prevLevel = levelFromStars(prev.stars);
    const nextLevel = levelFromStars(next.stars);
    for (let lvl = prevLevel + 1; lvl <= nextLevel; lvl++) {
      newRewards.push({ kind: 'level', level: lvl });
    }
    for (const id of next.unlockedMedals) {
      if (!prev.unlockedMedals.includes(id)) {
        newRewards.push({ kind: 'medal', medalId: id });
      }
    }
    if (newRewards.length) setRewards((r) => [...r, ...newRewards]);
  }, []);

  const recordCorrectAnswer = useCallback(
    () => dispatchProgress({ type: 'math-correct' }),
    [dispatchProgress],
  );
  const recordWrongAnswer = useCallback(
    () => dispatchProgress({ type: 'math-wrong' }),
    [dispatchProgress],
  );
  const recordPageRead = useCallback(
    () => dispatchProgress({ type: 'page-read' }),
    [dispatchProgress],
  );
  const resetProgress = useCallback(() => {
    progressRef.current = initialProgress;
    setProgress(initialProgress);
    setRewards([]);
  }, []);

  const dismissReward = useCallback(() => {
    setRewards((r) => r.slice(1));
  }, []);

  // --- Ajustes ---
  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setSettings((s) => ({ ...s, ...patch }));
  }, []);
  const updateMath = useCallback((patch: Partial<MathSettings>) => {
    setSettings((s) => ({ ...s, math: { ...s.math, ...patch } }));
  }, []);
  const updateSpeech = useCallback((patch: Partial<SpeechSettings>) => {
    setSettings((s) => ({ ...s, speech: { ...s.speech, ...patch } }));
  }, []);
  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
  }, []);

  const value = useMemo(() => {
    const palette = palettes[settings.palette] ?? palettes[defaultPalette];
    const headingFontFamily =
      headingFonts[settings.headingFont] ?? headingFonts[defaultHeadingFont];

    const operations =
      settings.math.operations.length > 0
        ? settings.math.operations
        : (['addition'] as const).slice();

    const level = levelInfo(progress.stars);

    // Modo automático: los números crecen con el nivel.
    // Modo manual: se usan los topes fijos de los ajustes.
    const mathConfig: GeneratorConfig =
      settings.math.mode === 'auto'
        ? (() => {
            const range = rangeForLevel(level.level);
            return {
              operations,
              minOperand: range.minOperand,
              maxOperand: range.maxOperand,
              // Tope holgado para no forzar reintentos del generador.
              maxAnswer: range.maxOperand * 2,
              optionCount: range.optionCount,
            };
          })()
        : {
            operations,
            minOperand: 1,
            maxOperand: settings.math.maxOperand,
            maxAnswer: settings.math.maxAnswer,
            optionCount: settings.math.optionCount,
          };

    return {
      screen,
      goTo,
      lang,
      setLang,
      t: getStrings(lang),
      progress,
      stars: progress.stars,
      level,
      recordCorrectAnswer,
      recordWrongAnswer,
      recordPageRead,
      resetProgress,
      rewards,
      dismissReward,
      settings,
      updateSettings,
      updateMath,
      updateSpeech,
      resetSettings,
      mathConfig,
      palette,
      headingFontFamily,
    };
  }, [
    screen,
    goTo,
    lang,
    progress,
    recordCorrectAnswer,
    recordWrongAnswer,
    recordPageRead,
    resetProgress,
    rewards,
    dismissReward,
    settings,
    updateSettings,
    updateMath,
    updateSpeech,
    resetSettings,
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
