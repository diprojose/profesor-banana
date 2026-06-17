import { useCallback, useRef, useState } from 'react';
import styles from './ReadingScreen.module.css';
import { useApp } from '../../state/useApp';
import { useSpeech } from '../../hooks/useSpeech';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { useVoiceRecorder } from '../../hooks/useVoiceRecorder';
import { BackToMapButton } from '../common/BackToMapButton';
import { StorybookScene } from '../art/Scenery';
import {
  ArrowRightIcon,
  CheckCircleIcon,
  CrossCircleIcon,
  MicIcon,
  PlayIcon,
  SpeakerIcon,
} from '../icons/Icons';
import { stories } from '../../content/stories';
import { checkReading, type ReadingResult } from '../../game/readingCheck';

export function ReadingScreen() {
  const { t, lang, palette, recordPageRead, settings } = useApp();
  const { speak, speaking, enabled: voiceEnabled } = useSpeech(
    lang,
    settings.speech,
  );
  const recognition = useSpeechRecognition(lang);
  const recorder = useVoiceRecorder();

  // storyIndex === null → mostrar el selector de cuentos.
  const [storyIndex, setStoryIndex] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const [result, setResult] = useState<ReadingResult | null>(null);
  const [manualDone, setManualDone] = useState(false);
  // Páginas premiadas: clave `${storyIndex}-${page}` (no premiar dos veces).
  const awardedPages = useRef<Set<string>>(new Set());

  const stopAudio = useCallback(() => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    recognition.cancel();
    recorder.stop();
    recorder.clear();
  }, [recognition, recorder]);

  const resetPageState = useCallback(() => {
    setResult(null);
    setManualDone(false);
  }, []);

  // --- Selector de cuentos ---
  if (storyIndex === null) {
    return (
      <div className={styles.root}>
        <div className={styles.topBar}>
          <BackToMapButton iconColor="var(--coralInk)" />
          <div className={styles.pickerTitle}>{t.chooseStory}</div>
          <div style={{ width: 92 }} />
        </div>
        <div className={styles.picker}>
          <div className={styles.storyGrid}>
            {stories.map((story, i) => (
              <button
                key={story.id}
                className={styles.storyCard}
                onClick={() => {
                  resetPageState();
                  setPage(0);
                  setStoryIndex(i);
                }}
              >
                <span className={styles.storyEmoji}>{story.emoji}</span>
                <span className={styles.storyName}>{story.title[lang]}</span>
                <span className={styles.storyPages}>
                  {story.pages.length} {t.pagesCount}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- Vista de lectura ---
  const story = stories[storyIndex];
  const sentence = story.pages[page][lang];
  const pageLabel = `${t.page} ${page + 1}/${story.pages.length}`;
  const isLastPage = page >= story.pages.length - 1;
  const hasNextStory = storyIndex < stories.length - 1;
  const pageDone = result?.status === 'great' || manualDone;
  const active = recognition.listening || recorder.recording;

  const awardOnce = () => {
    const key = `${storyIndex}-${page}`;
    if (!awardedPages.current.has(key)) {
      awardedPages.current.add(key);
      recordPageRead();
    }
  };

  const toggleRecording = () => {
    if (active) {
      recognition.stop();
      recorder.stop();
      if (!recognition.supported) {
        setManualDone(true);
        awardOnce();
      }
      return;
    }
    if (!recognition.supported && !recorder.supported) {
      setManualDone(true);
      awardOnce();
      return;
    }
    setResult(null);
    setManualDone(false);
    recorder.start();
    if (recognition.supported) {
      recognition.start((transcript) => {
        const r = checkReading(sentence, transcript);
        setResult(r);
        if (r.status === 'great') awardOnce();
      });
    }
  };

  const playRecording = () => {
    if (recorder.audioUrl) void new Audio(recorder.audioUrl).play();
  };

  const backToStories = () => {
    stopAudio();
    resetPageState();
    setStoryIndex(null);
  };

  const advance = () => {
    stopAudio();
    resetPageState();
    if (!isLastPage) {
      setPage(page + 1);
    } else if (hasNextStory) {
      setStoryIndex(storyIndex + 1);
      setPage(0);
    } else {
      setStoryIndex(null); // fin: volver al selector
    }
  };

  const micLabel = active
    ? t.imDone
    : recognition.supported || recorder.supported
      ? t.readAloud
      : t.iReadIt;
  const showPlayback = !active && recorder.audioUrl !== null;
  const continueLabel = !isLastPage
    ? t.nextPage
    : hasNextStory
      ? t.nextStory
      : t.finishStory;

  return (
    <div className={styles.root}>
      <div className={styles.topBar}>
        <button className={styles.backToStories} onClick={backToStories}>
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
          {t.stories}
        </button>
        <div className={styles.title}>{story.title[lang]}</div>
        <div className={styles.pagePill}>{pageLabel}</div>
      </div>

      <div className={styles.content}>
        {/* Ilustración del cuento */}
        <div className={styles.illustrationFrame}>
          <div className={styles.illustrationInner}>
            <StorybookScene />
          </div>
        </div>

        {/* Frase (coloreada palabra por palabra tras evaluar) */}
        <div className={styles.sentenceCard}>
          <div className={styles.sentence}>
            {result ? (
              result.words.map((w, i) => (
                <span key={i}>
                  <span
                    className={
                      !w.scored
                        ? undefined
                        : w.matched
                          ? styles.wordOk
                          : styles.wordMiss
                    }
                  >
                    {w.text}
                  </span>
                  {i < result.words.length - 1 ? ' ' : ''}
                </span>
              ))
            ) : (
              <span>{sentence}</span>
            )}
          </div>
        </div>

        {/* Controles de audio */}
        <div className={styles.audioControls}>
          <button
            className={`${styles.audioButton} ${speaking ? styles.audioButtonActive : ''}`}
            style={{
              background: palette.accent,
              opacity: voiceEnabled ? 1 : 0.4,
              cursor: voiceEnabled ? 'pointer' : 'not-allowed',
            }}
            onClick={() => speak(sentence)}
            disabled={!voiceEnabled}
          >
            <SpeakerIcon size={26} />
            {speaking ? t.speaking : t.listen}
          </button>

          <button
            className={`${styles.audioButton} ${active ? styles.audioButtonActive : ''}`}
            style={{ background: palette.coralInk }}
            onClick={toggleRecording}
          >
            <span className={styles.micRing}>
              {active && <span className={styles.micRingPulse} />}
              <MicIcon size={26} />
            </span>
            {micLabel}
          </button>

          {showPlayback && (
            <button
              className={styles.audioButton}
              style={{ background: palette.lilac, color: palette.ink }}
              onClick={playRecording}
            >
              <PlayIcon size={18} color={palette.ink} />
              {t.playMyReading}
            </button>
          )}
        </div>

        {/* Estado / corrección */}
        <div className={styles.statusRow}>
          <ReadingFeedback
            t={t}
            listening={active}
            error={recognition.error || recorder.error}
            supported={recognition.supported || recorder.supported}
            result={result}
            manualDone={manualDone}
          />
        </div>
      </div>

      {/* Avanzar: solo cuando el niño leyó bien la página */}
      {pageDone && (
        <button className={styles.continueButton} onClick={advance}>
          {continueLabel}
          <ArrowRightIcon size={24} />
        </button>
      )}
    </div>
  );
}

/** Línea de estado bajo los controles: pista, corrección o error. */
function ReadingFeedback({
  t,
  listening,
  error,
  supported,
  result,
  manualDone,
}: {
  t: ReturnType<typeof useApp>['t'];
  listening: boolean;
  error: ReturnType<typeof useSpeechRecognition>['error'];
  supported: boolean;
  result: ReadingResult | null;
  manualDone: boolean;
}) {
  if (listening) {
    return <div className={styles.statusHint}>🎤 {t.listeningHint}</div>;
  }
  if (error === 'denied') {
    return <div className={styles.statusBad}>{t.micDenied}</div>;
  }
  if (manualDone) {
    return (
      <div className={styles.recordedOk}>
        <CheckCircleIcon size={20} />
        {t.wellRead}
      </div>
    );
  }
  if (result) {
    if (result.status === 'great') {
      return (
        <div className={styles.recordedOk}>
          <CheckCircleIcon size={20} />
          {t.wellRead}
          {result.heard && (
            <span className={styles.heard}>
              · {t.heard}: “{result.heard}”
            </span>
          )}
        </div>
      );
    }
    const label = result.status === 'partial' ? t.almostReading : t.tryAgainReading;
    return (
      <div className={styles.recordedBad}>
        <CrossCircleIcon size={20} />
        {label}
        {result.heard && (
          <span className={styles.heard}>
            · {t.heard}: “{result.heard}”
          </span>
        )}
      </div>
    );
  }
  // Estado inicial: invitación a leer.
  return (
    <div className={styles.statusHint}>
      {supported ? t.tapToRead : t.recognitionUnsupported}
    </div>
  );
}
