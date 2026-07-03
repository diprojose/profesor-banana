import styles from './SettingsScreen.module.css';
import { useApp } from '../../state/useApp';
import { BackToMapButton } from '../common/BackToMapButton';
import {
  Segmented,
  Toggle,
  Stepper,
  Slider,
  Swatches,
  type SegmentedOption,
} from '../settings/Controls';
import { palettes, paletteNames } from '../../theme/palettes';
import { headingFontNames, headingFonts } from '../../theme/fonts';
import { gradeOrder, type Grade } from '../../game/grades';
import { type DifficultyMode } from '../../state/AppContext';
import { type Lang } from '../../i18n/strings';
import {
  difficultyPresets,
  matchPreset,
  mathLimits,
  speechLimits,
  type DifficultyPreset,
} from '../../state/defaults';

export function SettingsScreen() {
  const {
    t,
    lang,
    setLang,
    settings,
    updateSettings,
    updateMath,
    updateSpeech,
    resetSettings,
    headingFontFamily,
    goTo,
    authStatus,
    userEmail,
    accountsEnabled,
    signOutAccount,
    goToAuth,
  } = useApp();

  const { math, speech } = settings;

  // --- Opciones derivadas ---
  const langOptions: SegmentedOption<Lang>[] = [
    { value: 'es', label: 'Español' },
    { value: 'en', label: 'English' },
  ];

  const fontOptions: SegmentedOption<string>[] = headingFontNames.map((f) => ({
    value: f,
    label: f,
  }));

  const swatchOptions = paletteNames.map((name) => {
    const p = palettes[name];
    return { name, label: name, colors: [p.accent, p.coralInk, p.mint, p.yellow] };
  });

  const difficultyOptions: SegmentedOption<DifficultyPreset | 'custom'>[] = [
    { value: 'easy', label: t.easy },
    { value: 'medium', label: t.medium },
    { value: 'hard', label: t.hard },
    { value: 'custom', label: t.custom },
  ];
  const currentPreset: DifficultyPreset | 'custom' =
    matchPreset(math) ?? 'custom';

  const gradeLabels: Record<Grade, string> = {
    preschool: t.gradePreschool,
    grade1: t.grade1,
    grade2: t.grade2,
    grade3: t.grade3,
  };
  const gradeOptions: SegmentedOption<Grade>[] = gradeOrder.map((g) => ({
    value: g,
    label: gradeLabels[g],
  }));

  const modeOptions: SegmentedOption<DifficultyMode>[] = [
    { value: 'auto', label: t.modeAuto },
    { value: 'manual', label: t.modeManual },
  ];

  // --- Handlers ---
  const applyDifficulty = (value: DifficultyPreset | 'custom') => {
    if (value !== 'custom') updateMath(difficultyPresets[value]);
  };

  const handleReset = () => {
    if (window.confirm(t.resetConfirm)) resetSettings();
  };

  return (
    <div className={styles.root}>
      <div className={styles.topBar}>
        <BackToMapButton iconColor="var(--accent)" />
        <div className={styles.title}>{t.settingsTitle}</div>
        <button className={styles.resetButton} onClick={handleReset}>
          {t.resetButton}
        </button>
      </div>

      <div className={styles.scroll}>
        <div className={styles.grid}>
          {/* Perfil */}
          <section className={styles.card}>
            <div className={styles.cardTitle}>{t.profileSection}</div>
            <div className={`${styles.row} ${styles.rowColumn}`}>
              <span className={`${styles.rowLabel} ${styles.rowLabelTop}`}>
                {t.childNameLabel}
              </span>
              <input
                className={styles.nameInput}
                value={settings.childName}
                placeholder={t.childNamePlaceholder}
                maxLength={20}
                onChange={(e) => updateSettings({ childName: e.target.value })}
              />
            </div>
            <div className={styles.row}>
              <button
                className={styles.accountButton}
                onClick={() => goTo('profiles')}
              >
                👧 {t.switchProfile}
              </button>
            </div>
          </section>

          {/* Idioma + Cuenta */}
          <section className={styles.card}>
            <div className={styles.cardTitle}>{t.languageSection}</div>
            <div className={styles.row}>
              <span className={styles.rowLabel}>{t.languageSection}</span>
              <Segmented
                options={langOptions}
                value={lang}
                onChange={setLang}
              />
            </div>

            {accountsEnabled && (
              <>
                <div className={styles.divider} />
                <div className={styles.cardTitle}>{t.accountSection}</div>
                {authStatus === 'signedIn' ? (
                  <>
                    <div className={styles.note}>
                      {userEmail} · {t.accountCloudNote}
                    </div>
                    <div className={styles.row}>
                      <button
                        className={styles.accountButton}
                        onClick={() => void signOutAccount()}
                      >
                        {t.signOut}
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className={styles.note}>{t.accountLocalNote}</div>
                    <div className={styles.row}>
                      <button className={styles.accountButton} onClick={goToAuth}>
                        {t.createAccountCta}
                      </button>
                    </div>
                  </>
                )}
              </>
            )}
          </section>

          {/* Apariencia */}
          <section className={`${styles.card} ${styles.cardWide}`}>
            <div className={styles.cardTitle}>{t.appearanceSection}</div>
            <div className={`${styles.row} ${styles.rowColumn}`}>
              <span className={`${styles.rowLabel} ${styles.rowLabelTop}`}>
                {t.paletteLabel}
              </span>
              <Swatches
                options={swatchOptions}
                value={settings.palette}
                onChange={(name) =>
                  updateSettings({ palette: name as typeof settings.palette })
                }
              />
            </div>
            <div className={styles.divider} />
            <div className={`${styles.row} ${styles.rowColumn}`}>
              <span className={`${styles.rowLabel} ${styles.rowLabelTop}`}>
                {t.fontLabel}
              </span>
              <Segmented
                options={fontOptions}
                value={settings.headingFont}
                onChange={(f) =>
                  updateSettings({
                    headingFont: f as typeof settings.headingFont,
                  })
                }
              />
              <div
                className={styles.fontPreview}
                style={{
                  fontFamily:
                    headingFonts[
                      settings.headingFont as keyof typeof headingFonts
                    ] ?? headingFontFamily,
                }}
              >
                {settings.childName || 'Abc'} · 1 2 3
              </div>
            </div>
          </section>

          {/* Matemáticas */}
          <section className={`${styles.card} ${styles.cardWide}`}>
            <div className={styles.cardTitle}>{t.mathSection}</div>

            {/* Grado escolar: decide qué operaciones y números ve el niño */}
            <div className={styles.row}>
              <span className={styles.rowLabel}>{t.gradeLabel}</span>
              <Segmented
                options={gradeOptions}
                value={settings.grade}
                onChange={(grade) => updateSettings({ grade })}
              />
            </div>
            <div className={styles.note}>{t.gradeNote}</div>

            <div className={styles.divider} />

            <div className={styles.row}>
              <span className={styles.rowLabel}>{t.difficultyModeLabel}</span>
              <Segmented
                options={modeOptions}
                value={math.mode}
                onChange={(mode) => updateMath({ mode })}
              />
            </div>

            {math.mode === 'auto' ? (
              <div className={styles.note}>{t.autoNote}</div>
            ) : (
              <>
                <div className={styles.row}>
                  <span className={styles.rowLabel}>{t.difficultyLabel}</span>
                  <Segmented
                    options={difficultyOptions}
                    value={currentPreset}
                    onChange={applyDifficulty}
                  />
                </div>
                <div className={styles.row}>
                  <span className={styles.rowLabel}>{t.maxOperandLabel}</span>
                  <Stepper
                    value={math.maxOperand}
                    min={mathLimits.maxOperand.min}
                    max={mathLimits.maxOperand.max}
                    onChange={(v) => updateMath({ maxOperand: v })}
                  />
                </div>
                <div className={styles.row}>
                  <span className={styles.rowLabel}>{t.maxAnswerLabel}</span>
                  <Stepper
                    value={math.maxAnswer}
                    min={mathLimits.maxAnswer.min}
                    max={mathLimits.maxAnswer.max}
                    step={5}
                    onChange={(v) => updateMath({ maxAnswer: v })}
                  />
                </div>
                <div className={styles.row}>
                  <span className={styles.rowLabel}>{t.optionCountLabel}</span>
                  <Stepper
                    value={math.optionCount}
                    min={mathLimits.optionCount.min}
                    max={mathLimits.optionCount.max}
                    onChange={(v) => updateMath({ optionCount: v })}
                  />
                </div>
              </>
            )}
          </section>

          {/* Audio y lectura */}
          <section className={`${styles.card} ${styles.cardWide}`}>
            <div className={styles.cardTitle}>{t.audioSection}</div>
            <div className={styles.row}>
              <span className={styles.rowLabel}>{t.voiceEnabledLabel}</span>
              <Toggle
                checked={speech.enabled}
                onChange={(v) => updateSpeech({ enabled: v })}
              />
            </div>
            <div className={`${styles.row} ${styles.rowColumn}`}>
              <span className={`${styles.rowLabel} ${styles.rowLabelTop}`}>
                {t.rateLabel}
              </span>
              <Slider
                value={speech.rate}
                min={speechLimits.rate.min}
                max={speechLimits.rate.max}
                step={speechLimits.rate.step}
                leftLabel={t.slow}
                rightLabel={t.fast}
                onChange={(v) => updateSpeech({ rate: v })}
              />
            </div>
            <div className={`${styles.row} ${styles.rowColumn}`}>
              <span className={`${styles.rowLabel} ${styles.rowLabelTop}`}>
                {t.pitchLabel}
              </span>
              <Slider
                value={speech.pitch}
                min={speechLimits.pitch.min}
                max={speechLimits.pitch.max}
                step={speechLimits.pitch.step}
                leftLabel={t.low}
                rightLabel={t.high}
                onChange={(v) => updateSpeech({ pitch: v })}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
