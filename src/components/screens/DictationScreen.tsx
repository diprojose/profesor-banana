import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './DictationScreen.module.css';
import { useApp } from '../../state/useApp';
import { useSpeech } from '../../hooks/useSpeech';
import { BackToMapButton } from '../common/BackToMapButton';
import {
  ArrowRightIcon,
  CheckCircleIcon,
  CrossCircleIcon,
  SpeakerIcon,
  StarIcon,
} from '../icons/Icons';
import {
  dictations,
  dictationLevels,
  type Dictation,
  type DictationLevel,
} from '../../content/dictations';
import {
  checkDictation,
  type DictationResult,
  type DictationWord,
} from '../../game/dictationCheck';
import { type Strings } from '../../i18n/strings';

function levelName(level: DictationLevel, t: Strings): string {
  switch (level) {
    case 1:
      return t.dictationLevel1;
    case 2:
      return t.dictationLevel2;
    case 3:
      return t.dictationLevel3;
  }
}

/** Estilo de una palabra al comparar: bien, bien-pero-tilde, o mal. */
function wordClass(w: DictationWord): string | undefined {
  if (!w.scored) return undefined;
  if (w.accentHint) return styles.wordAccent;
  return w.correct ? styles.wordOk : styles.wordMiss;
}

export function DictationScreen() {
  const {
    t,
    lang,
    palette,
    progress,
    recordDictationItem,
    recordDictationCompleted,
    settings,
  } = useApp();
  const { speak, speaking, enabled: voiceEnabled } = useSpeech(
    lang,
    settings.speech,
  );

  // dictationIndex === null → mostrar el selector de dictados.
  const [dictationIndex, setDictationIndex] = useState<number | null>(null);
  const [itemIndex, setItemIndex] = useState(0);
  const [phase, setPhase] = useState<'writing' | 'results'>('writing');
  const [answers, setAnswers] = useState<string[]>([]);
  const [current, setCurrent] = useState('');
  const [results, setResults] = useState<DictationResult[] | null>(null);
  // Resultado de comprobar la parte actual (null = aún no comprobada).
  const [checkedResult, setCheckedResult] = useState<DictationResult | null>(
    null,
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const dictation: Dictation | null =
    dictationIndex === null ? null : dictations[dictationIndex];
  const currentItem = dictation?.items[itemIndex] ?? null;

  const stopAudio = useCallback(() => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  }, []);

  const openDictation = (index: number) => {
    setDictationIndex(index);
    setItemIndex(0);
    setPhase('writing');
    setAnswers([]);
    setCurrent('');
    setResults(null);
    setCheckedResult(null);
  };

  const backToPicker = () => {
    stopAudio();
    setDictationIndex(null);
    setPhase('writing');
    setResults(null);
    setCheckedResult(null);
  };

  // Al abrir cada parte, la app la dicta una vez sola y enfoca la caja.
  useEffect(() => {
    if (phase !== 'writing' || !currentItem) return;
    inputRef.current?.focus();
    if (voiceEnabled) {
      const id = window.setTimeout(() => speak(currentItem[lang]), 350);
      return () => window.clearTimeout(id);
    }
  }, [phase, currentItem, lang, voiceEnabled, speak]);

  // --- Selector de dictados (agrupados por nivel) ---
  if (dictation === null) {
    return (
      <div className={styles.root}>
        <div className={styles.topBar}>
          <BackToMapButton iconColor="var(--coralInk)" />
          <div className={styles.pickerTitle}>{t.chooseDictation}</div>
          <div style={{ width: 92 }} />
        </div>
        <div className={styles.picker}>
          <div className={styles.pickerInner}>
            {dictationLevels.map((level) => {
              const group = dictations.filter((d) => d.level === level);
              if (group.length === 0) return null;
              return (
                <section key={level}>
                  <div className={styles.levelHeader}>
                    {levelName(level, t)}
                    <span className={styles.levelStars}>
                      {'⭐'.repeat(level)}
                    </span>
                  </div>
                  <div className={styles.grid}>
                    {group.map((d) => {
                      const index = dictations.indexOf(d);
                      const completed = progress.completedDictations.includes(
                        d.id,
                      );
                      return (
                        <button
                          key={d.id}
                          className={styles.card}
                          onClick={() => openDictation(index)}
                        >
                          {completed && (
                            <span className={styles.completedBadge}>
                              ✓ {t.completedBadge}
                            </span>
                          )}
                          <span className={styles.cardEmoji}>{d.emoji}</span>
                          <span className={styles.cardName}>
                            {d.title[lang]}
                          </span>
                          <span className={styles.cardParts}>
                            {d.items.length} {t.dictationParts}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // --- Pantalla de resultados (comparación) ---
  if (phase === 'results' && results) {
    const totalScored = results.reduce((n, r) => n + r.scoredCount, 0);
    const totalCorrect = results.reduce((n, r) => n + r.correctCount, 0);
    const allPerfect = results.every((r) => r.allCorrect);

    return (
      <div className={styles.root}>
        <div className={styles.topBar}>
          <button className={styles.backButton} onClick={backToPicker}>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                d="M15 5l-7 7 7 7"
                stroke="var(--coralInk)"
                strokeWidth="2.6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {t.dictations}
          </button>
          <div className={styles.title}>{dictation.title[lang]}</div>
          <div className={styles.pagePill}>{t.dictationResultsTitle}</div>
        </div>

        <div className={styles.resultsScroll}>
          <div className={styles.resultsInner}>
            <div
              className={styles.scoreBanner}
              style={{ background: allPerfect ? '#2FAE7A' : palette.yellow }}
            >
              <span className={styles.scoreEmoji}>
                {allPerfect ? '🏆' : '✍️'}
              </span>
              <div>
                <div
                  className={styles.scoreMsg}
                  style={{ color: allPerfect ? '#fff' : palette.ink }}
                >
                  {allPerfect ? t.dictationPerfect : t.dictationKeepGoing}
                </div>
                <div
                  className={styles.scoreCount}
                  style={{ color: allPerfect ? '#fff' : palette.ink }}
                >
                  {totalCorrect}/{totalScored} {t.dictationScore}
                </div>
              </div>
            </div>

            {results.map((r, i) => {
              const answer = answers[i]?.trim() ?? '';
              return (
                <div key={i} className={styles.compareCard}>
                  <div className={styles.compareHead}>
                    <span className={styles.compareNum}>{i + 1}</span>
                    {r.allCorrect && (
                      <span className={styles.perfectTag}>
                        <CheckCircleIcon size={18} /> ✓
                      </span>
                    )}
                  </div>

                  <div className={styles.compareLabel}>{t.correctText}</div>
                  <div className={styles.compareExpected}>
                    {r.words.map((w, j) => (
                      <span key={j}>
                        <span className={wordClass(w)}>{w.text}</span>
                        {j < r.words.length - 1 ? ' ' : ''}
                      </span>
                    ))}
                  </div>

                  <div className={styles.compareLabel}>{t.yourAnswer}</div>
                  <div
                    className={`${styles.compareYours} ${
                      answer ? '' : styles.compareEmpty
                    }`}
                  >
                    {answer || t.emptyAnswer}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.resultActions}>
          <button
            className={styles.secondaryButton}
            onClick={() => openDictation(dictationIndex!)}
          >
            {t.repeatDictation}
          </button>
          <button className={styles.continueButton} onClick={backToPicker}>
            {t.anotherDictation}
            <ArrowRightIcon size={24} />
          </button>
        </div>
      </div>
    );
  }

  // --- Escritura del dictado (parte a parte) ---
  const item = currentItem!;
  const isLast = itemIndex >= dictation.items.length - 1;
  const partLabel = `${t.part} ${itemIndex + 1}/${dictation.items.length}`;
  const continueLabel = isLast ? t.seeResults : t.next;
  const canCheck = current.trim().length > 0;

  // Comprueba la parte actual y muestra si está bien o dónde falló.
  const check = () => {
    if (!canCheck) return;
    stopAudio();
    setCheckedResult(checkDictation(item[lang], current));
  };

  // Al editar el texto, se borra la comprobación anterior (hay que
  // volver a comprobar antes de avanzar).
  const editCurrent = (value: string) => {
    setCurrent(value);
    if (checkedResult) setCheckedResult(null);
  };

  const advance = () => {
    stopAudio();
    const nextAnswers = [...answers];
    nextAnswers[itemIndex] = current;

    if (!isLast) {
      setAnswers(nextAnswers);
      setCurrent(nextAnswers[itemIndex + 1] ?? '');
      setItemIndex(itemIndex + 1);
      setCheckedResult(null);
      return;
    }

    // Última parte: evaluar todo y premiar.
    const finalResults = dictation.items.map((it, i) =>
      checkDictation(it[lang], nextAnswers[i] ?? ''),
    );
    finalResults.forEach((r, i) => {
      if (r.allCorrect) recordDictationItem(dictation.id, i);
    });
    recordDictationCompleted(dictation.id);

    setAnswers(nextAnswers);
    setResults(finalResults);
    setPhase('results');
  };

  return (
    <div className={styles.root}>
      <div className={styles.topBar}>
        <button className={styles.backButton} onClick={backToPicker}>
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path
              d="M15 5l-7 7 7 7"
              stroke="var(--coralInk)"
              strokeWidth="2.6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {t.dictations}
        </button>
        <div className={styles.title}>{dictation.title[lang]}</div>
        <div className={styles.pagePill}>{partLabel}</div>
      </div>

      <div className={styles.content}>
        {/* Barra de progreso de partes */}
        <div className={styles.dots}>
          {dictation.items.map((_, i) => (
            <span
              key={i}
              className={`${styles.dot} ${
                i < itemIndex
                  ? styles.dotDone
                  : i === itemIndex
                    ? styles.dotActive
                    : ''
              }`}
            />
          ))}
        </div>

        {/* Botón grande para escuchar el dictado */}
        <button
          className={`${styles.listenBig} ${speaking ? styles.listenActive : ''}`}
          style={{
            background: palette.accent,
            opacity: voiceEnabled ? 1 : 0.4,
            cursor: voiceEnabled ? 'pointer' : 'not-allowed',
          }}
          onClick={() => speak(item[lang])}
          disabled={!voiceEnabled}
        >
          <span className={styles.listenRing}>
            {speaking && <span className={styles.listenPulse} />}
            <SpeakerIcon size={40} />
          </span>
          <span className={styles.listenText}>
            {speaking ? t.speaking : voiceEnabled ? t.listenAgain : t.listen}
          </span>
        </button>

        <div className={styles.hint}>✍️ {t.dictationHint}</div>

        {/* Caja para escribir lo que oyó */}
        <input
          ref={inputRef}
          className={`${styles.input} ${
            checkedResult
              ? checkedResult.allCorrect
                ? styles.inputOk
                : styles.inputBad
              : ''
          }`}
          type="text"
          value={current}
          onChange={(e) => editCurrent(e.target.value)}
          onKeyDown={(e) => {
            if (e.key !== 'Enter') return;
            if (checkedResult) advance();
            else check();
          }}
          placeholder={t.typeHere}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          aria-label={t.typeHere}
        />

        {/* Retroalimentación inmediata tras comprobar */}
        {checkedResult && (
          <div className={styles.feedback}>
            {checkedResult.allCorrect && !checkedResult.hasAccentHint ? (
              <div className={styles.feedbackOk}>
                <CheckCircleIcon size={22} />
                {t.itemCorrect}
              </div>
            ) : (
              <>
                {checkedResult.allCorrect ? (
                  // Acertó, pero le faltó alguna tilde: recordatorio amable.
                  <div className={styles.feedbackAccent}>
                    <CheckCircleIcon size={22} />
                    {t.itemAccent}
                  </div>
                ) : (
                  <div className={styles.feedbackBad}>
                    <CrossCircleIcon size={22} />
                    {t.itemAlmost}
                  </div>
                )}
                <div className={styles.feedbackExpected}>
                  {checkedResult.words.map((w, j) => (
                    <span key={j}>
                      <span className={wordClass(w)}>{w.text}</span>
                      {j < checkedResult.words.length - 1 ? ' ' : ''}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {checkedResult ? (
        <button className={styles.continueButton} onClick={advance}>
          {continueLabel}
          {isLast ? <StarIcon size={22} /> : <ArrowRightIcon size={24} />}
        </button>
      ) : (
        <button
          className={styles.checkButton}
          onClick={check}
          disabled={!canCheck}
          style={{ opacity: canCheck ? 1 : 0.45 }}
        >
          <CheckCircleIcon size={22} />
          {t.check}
        </button>
      )}
    </div>
  );
}
