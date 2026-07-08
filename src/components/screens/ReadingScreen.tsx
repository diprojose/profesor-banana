import { useCallback, useState } from 'react';
import styles from './ReadingScreen.module.css';
import { useApp } from '../../state/useApp';
import { useSpeech } from '../../hooks/useSpeech';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { useVoiceRecorder } from '../../hooks/useVoiceRecorder';
import { BackToMapButton } from '../common/BackToMapButton';
import {
  ArrowRightIcon,
  CheckCircleIcon,
  CrossCircleIcon,
  MicIcon,
  PlayIcon,
  SpeakerIcon,
  StarIcon,
} from '../icons/Icons';
import {
  stories,
  readingLevels,
  type Story,
  type ReadingLevel,
} from '../../content/stories';
import { checkReading, type ReadingResult } from '../../game/readingCheck';
import { type Strings } from '../../i18n/strings';

function levelName(level: ReadingLevel, t: Strings): string {
  switch (level) {
    case 1:
      return t.readingLevel1;
    case 2:
      return t.readingLevel2;
    case 3:
      return t.readingLevel3;
  }
}

/** Escena ilustrada de la página: fondo suave + emoji grande. */
function StoryScene({ emoji }: { emoji: string }) {
  return (
    <div className={styles.scene}>
      <svg
        className={styles.sceneBg}
        viewBox="0 0 560 280"
        preserveAspectRatio="xMidYMid slice"
      >
        <rect width="560" height="280" fill="#DCF1FB" />
        <circle cx="76" cy="58" r="30" fill="#FBD34B" opacity="0.9" />
        <g fill="#fff" opacity="0.92">
          <ellipse cx="420" cy="52" rx="44" ry="18" />
          <ellipse cx="460" cy="42" rx="30" ry="15" />
          <ellipse cx="150" cy="100" rx="34" ry="13" />
        </g>
        <path
          d="M0 208 Q 140 178 280 208 T 560 208 L560 280 L0 280 Z"
          fill="#BCE8CB"
          opacity="0.95"
        />
      </svg>
      <span className={styles.sceneEmoji}>{emoji}</span>
    </div>
  );
}

export function ReadingScreen() {
  const {
    t,
    lang,
    palette,
    progress,
    recordPageRead,
    recordStoryCompleted,
    settings,
  } = useApp();
  const { speak, speaking, enabled: voiceEnabled } = useSpeech(
    lang,
    settings.speech,
  );
  const recognition = useSpeechRecognition(lang);
  const recorder = useVoiceRecorder();

  // storyIndex === null → mostrar el selector de cuentos.
  const [storyIndex, setStoryIndex] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const [phase, setPhase] = useState<'reading' | 'quiz'>('reading');
  const [result, setResult] = useState<ReadingResult | null>(null);
  const [manualDone, setManualDone] = useState(false);
  // Pregunta final del cuento.
  const [quizPicked, setQuizPicked] = useState<number | null>(null);
  const [quizStatus, setQuizStatus] = useState<'correct' | 'wrong' | null>(null);

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

  const openStory = (index: number) => {
    resetPageState();
    setPage(0);
    setPhase('reading');
    setQuizPicked(null);
    setQuizStatus(null);
    setStoryIndex(index);
  };

  const backToStories = () => {
    stopAudio();
    resetPageState();
    setPhase('reading');
    setQuizPicked(null);
    setQuizStatus(null);
    setStoryIndex(null);
  };

  // --- Selector de cuentos (agrupados por nivel de lectura) ---
  if (storyIndex === null) {
    return (
      <div className={styles.root}>
        <div className={styles.topBar}>
          <BackToMapButton iconColor="var(--coralInk)" />
          <div className={styles.pickerTitle}>{t.chooseStory}</div>
          <div style={{ width: 92 }} />
        </div>
        <div className={styles.picker}>
          <div className={styles.pickerInner}>
            {readingLevels.map((level) => {
              const group = stories.filter((s) => s.level === level);
              if (group.length === 0) return null;
              return (
                <section key={level}>
                  <div className={styles.levelHeader}>
                    {levelName(level, t)}
                    <span className={styles.levelStars}>
                      {'⭐'.repeat(level)}
                    </span>
                  </div>
                  <div className={styles.storyGrid}>
                    {group.map((story) => {
                      const index = stories.indexOf(story);
                      const readCount = progress.readPages.filter((key) =>
                        key.startsWith(`${story.id}:`),
                      ).length;
                      const completed = progress.completedStories.includes(
                        story.id,
                      );
                      return (
                        <button
                          key={story.id}
                          className={styles.storyCard}
                          onClick={() => openStory(index)}
                        >
                          {completed && (
                            <span className={styles.completedBadge}>
                              ✓ {t.completedBadge}
                            </span>
                          )}
                          <span className={styles.storyEmoji}>
                            {story.emoji}
                          </span>
                          <span className={styles.storyName}>
                            {story.title[lang]}
                          </span>
                          <span className={styles.storyPages}>
                            {readCount > 0 && !completed
                              ? `${Math.min(readCount, story.pages.length)}/${story.pages.length} ${t.pagesCount}`
                              : `${story.pages.length} ${t.pagesCount}`}
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

  const story: Story = stories[storyIndex];

  // --- Pregunta final del cuento ---
  if (phase === 'quiz') {
    const quiz = story.quiz;
    const solvedQuiz = quizStatus === 'correct';

    const pickQuizOption = (index: number) => {
      if (solvedQuiz) return;
      setQuizPicked(index);
      if (index === quiz.correct) {
        setQuizStatus('correct');
        recordStoryCompleted(story.id);
      } else {
        setQuizStatus('wrong');
      }
    };

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
          <div className={styles.pagePill}>{t.storyQuestion}</div>
        </div>

        <div className={styles.content}>
          <StoryScene emoji={story.emoji} />

          <div className={styles.sentenceCard}>
            <div className={styles.quizQuestion}>
              {quiz.question[lang]}
              <button
                className={styles.quizHear}
                onClick={() => speak(quiz.question[lang])}
                disabled={!voiceEnabled}
                aria-label={t.listen}
              >
                <SpeakerIcon size={20} color={palette.ink} />
              </button>
            </div>
          </div>

          <div className={styles.quizOptions}>
            {quiz.options.map((option, i) => {
              const isPicked = quizPicked === i;
              const isCorrect = solvedQuiz && i === quiz.correct;
              const isWrong = isPicked && quizStatus === 'wrong';
              const optionColors = [palette.mint, palette.yellow, palette.lilac];
              const style: React.CSSProperties = {
                background: optionColors[i % 3],
                cursor: solvedQuiz ? 'default' : 'pointer',
              };
              if (isCorrect) {
                style.boxShadow = '0 0 0 5px #2FAE7A, 0 8px 0 rgba(0,0,0,0.10)';
              }
              if (isWrong) {
                style.animation = 'shake .4s ease';
                style.boxShadow = '0 0 0 5px #E58A7E, 0 8px 0 rgba(0,0,0,0.10)';
              }
              if (solvedQuiz && !isCorrect) style.opacity = 0.45;

              return (
                <button
                  key={i}
                  className={styles.quizOption}
                  style={style}
                  onClick={() => pickQuizOption(i)}
                >
                  <span className={styles.quizOptionEmoji}>{option.emoji}</span>
                  <span className={styles.quizOptionText}>{option[lang]}</span>
                </button>
              );
            })}
          </div>

          <div className={styles.statusRow}>
            {quizStatus === 'wrong' && (
              <div className={styles.recordedBad}>
                <CrossCircleIcon size={20} />
                {t.quizWrong}
              </div>
            )}
            {solvedQuiz && (
              <div className={styles.recordedOk}>
                <CheckCircleIcon size={20} />
                {t.storyDone}
                <StarIcon size={20} />
                <StarIcon size={20} />
              </div>
            )}
          </div>
        </div>

        {solvedQuiz && (
          <button className={styles.continueButton} onClick={backToStories}>
            {t.backToStoriesCta}
            <ArrowRightIcon size={24} />
          </button>
        )}
      </div>
    );
  }

  // --- Vista de lectura ---
  const currentPage = story.pages[page];
  const sentence = currentPage[lang];
  const pageLabel = `${t.page} ${page + 1}/${story.pages.length}`;
  const isLastPage = page >= story.pages.length - 1;
  const pageDone = result?.status === 'great' || manualDone;
  const active = recognition.listening || recorder.recording;

  const award = () => recordPageRead(story.id, page);

  const toggleRecording = () => {
    if (active) {
      recognition.stop();
      recorder.stop();
      if (!recognition.supported) {
        setManualDone(true);
        award();
      }
      return;
    }
    if (!recognition.supported && !recorder.supported) {
      setManualDone(true);
      award();
      return;
    }
    setResult(null);
    setManualDone(false);

    void (async () => {
      // Primero el permiso del micrófono (grabadora); el
      // reconocimiento arranca DESPUÉS de concedido. Si arrancaran a
      // la vez, el diálogo de permiso mataba el reconocimiento y al
      // terminar "no pasaba nada" (bug reportado).
      if (recorder.supported) {
        await recorder.start();
      }
      if (recognition.supported) {
        recognition.start((transcript) => {
          const r = checkReading(sentence, transcript);
          setResult(r);
          if (r.status === 'great') award();
        });
      }
    })();
  };

  const playRecording = () => {
    if (recorder.audioUrl) void new Audio(recorder.audioUrl).play();
  };

  const advance = () => {
    stopAudio();
    resetPageState();
    if (!isLastPage) {
      setPage(page + 1);
    } else {
      setPhase('quiz'); // fin de páginas: pregunta de comprensión
    }
  };

  const micLabel = active
    ? t.imDone
    : recognition.supported || recorder.supported
      ? t.readAloud
      : t.iReadIt;
  const showPlayback = !active && recorder.audioUrl !== null;
  const continueLabel = !isLastPage ? t.nextPage : t.quizCta;

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
        {/* Ilustración de la página (emoji de escena) */}
        <div className={styles.illustrationFrame}>
          <div className={styles.illustrationInner}>
            <StoryScene emoji={currentPage.emoji} />
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
  if (manualDone) {
    return (
      <div className={styles.recordedOk}>
        <CheckCircleIcon size={20} />
        {t.wellRead}
      </div>
    );
  }
  // El error de micrófono solo se muestra si NO hubo lectura evaluada
  // (p. ej. la grabadora falló pero el reconocimiento sí funcionó).
  if (error === 'denied' && !result) {
    return <div className={styles.statusBad}>{t.micDenied}</div>;
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
