import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './LanguageScreen.module.css';
import { useApp } from '../../state/useApp';
import { useSpeech } from '../../hooks/useSpeech';
import { BackToMapButton } from '../common/BackToMapButton';
import {
  ArrowRightIcon,
  CrossCircleIcon,
  SpeakerIcon,
  StarIcon,
} from '../icons/Icons';
import {
  generateVocabQuestion,
  updateSeenWords,
  type VocabQuestion,
} from '../../language/vocabGenerator';
import { languageIslands, type LanguageIslandId } from '../../language/islands';
import { type VocabWord } from '../../language/vocabulary';

type Status = 'correct' | 'wrong' | null;

/** Al reiniciar el mazo, cuántas palabras recientes seguir evitando. */
const RECENT_MEMORY = 8;

/** Opciones por pregunta (la correcta + 3 distractores). */
const OPTION_COUNT = 4;

/**
 * Pantalla compartida de las islas de idiomas (inglés, francés, ...).
 * El vocabulario, las categorías y la voz vienen de `languageIslands`.
 */
export function LanguageScreen({ island }: { island: LanguageIslandId }) {
  const {
    t,
    lang,
    stars,
    palette,
    recordEnglishCorrect,
    recordFrenchCorrect,
    settings,
  } = useApp();
  const config = languageIslands[island];
  // La pronunciación es siempre en el idioma que se aprende.
  const { speak, speaking } = useSpeech(config.speechLang, settings.speech);

  const recordCorrect =
    island === 'french' ? recordFrenchCorrect : recordEnglishCorrect;

  // "Mazo" de palabras vistas: no se repite ninguna hasta recorrer
  // todo el vocabulario (feedback de los niños: se repetían mucho).
  const seenRef = useRef<string[]>([]);
  const [question, setQuestion] = useState<VocabQuestion>(() => {
    const q = generateVocabQuestion(config.vocab, OPTION_COUNT, seenRef.current);
    seenRef.current = updateSeenWords(
      seenRef.current,
      q.item.id,
      config.vocab.length,
      RECENT_MEMORY,
    );
    return q;
  });
  const [picked, setPicked] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>(null);
  const [celebrate, setCelebrate] = useState(false);

  const solved = status === 'correct';
  const optionColors = [palette.mint, palette.yellow, palette.lilac, palette.coral];

  // En el modo de escucha, la palabra se pronuncia sola al aparecer.
  useEffect(() => {
    if (question.mode === 'audio-to-picture') {
      const timer = window.setTimeout(() => speak(question.item.word), 400);
      return () => window.clearTimeout(timer);
    }
    // speak cambia con los ajustes de voz; solo reaccionamos a la pregunta.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question]);

  const pick = useCallback(
    (option: VocabWord) => {
      if (solved) return;
      setPicked(option.id);
      if (option.id === question.item.id) {
        setStatus('correct');
        setCelebrate(true);
        recordCorrect(question.item.id);
        speak(question.item.word);
      } else {
        setStatus('wrong');
      }
    },
    [solved, question.item, recordCorrect, speak],
  );

  const nextQuestion = useCallback(() => {
    const q = generateVocabQuestion(config.vocab, OPTION_COUNT, seenRef.current);
    seenRef.current = updateSeenWords(
      seenRef.current,
      q.item.id,
      config.vocab.length,
      RECENT_MEMORY,
    );
    setQuestion(q);
    setPicked(null);
    setStatus(null);
    setCelebrate(false);
  }, [config.vocab]);

  const isPictureMode = question.mode === 'picture-to-word';
  const pictureTitle = island === 'french' ? t.frenchTitle : t.englishTitle;
  const title =
    question.mode === 'picture-to-word'
      ? pictureTitle
      : question.mode === 'audio-to-picture'
        ? t.englishTitleAudio
        : t.englishTitleWord;

  return (
    <div className={styles.root}>
      {/* Barra superior */}
      <div className={styles.topBar}>
        <BackToMapButton iconColor="var(--accent)" />
        <div className={styles.title}>{title}</div>
        <div className={styles.starsPill}>
          <StarIcon size={26} />
          <span className={styles.starsValue}>{stars}</span>
        </div>
      </div>

      <div className={styles.center}>
        {/* Chip con la categoría de la palabra */}
        <div className={styles.categoryChip}>
          {config.categories[question.item.category]?.[lang] ??
            question.item.category}
        </div>

        {/* Enunciado según el modo */}
        {question.mode === 'picture-to-word' && (
          <div className={styles.pictureCard}>
            <div className={styles.emoji}>{question.item.emoji}</div>
            <button
              className={`${styles.hearButton} ${speaking ? styles.hearButtonActive : ''}`}
              onClick={() => speak(question.item.word)}
            >
              <SpeakerIcon size={24} />
              {t.listen}
            </button>
          </div>
        )}

        {question.mode === 'audio-to-picture' && (
          <button
            className={`${styles.bigHearButton} ${speaking ? styles.hearButtonActive : ''}`}
            onClick={() => speak(question.item.word)}
            aria-label={t.tapToHear}
          >
            <SpeakerIcon size={44} />
            <span>{t.listen}</span>
          </button>
        )}

        {question.mode === 'word-to-picture' && (
          <div className={styles.pictureCard}>
            <div className={styles.bigWord}>{question.item.word}</div>
            <button
              className={`${styles.hearButton} ${speaking ? styles.hearButtonActive : ''}`}
              onClick={() => speak(question.item.word)}
            >
              <SpeakerIcon size={24} />
              {t.listen}
            </button>
          </div>
        )}

        {/* Feedback de fallo */}
        <div className={styles.feedbackRow}>
          {status === 'wrong' && (
            <div className={styles.feedbackWrong}>
              <CrossCircleIcon size={22} />
              {t.almost}
            </div>
          )}
        </div>
      </div>

      {/* Opciones: palabras o dibujos según el modo */}
      <div className={isPictureMode ? styles.options : styles.optionsPictures}>
        {question.options.map((option, i) => {
          const isPicked = picked === option.id;
          const isCorrect = solved && option.id === question.item.id;
          const isWrong = isPicked && status === 'wrong';

          const optStyle: React.CSSProperties = {
            background: optionColors[i % optionColors.length],
            cursor: solved ? 'default' : 'pointer',
          };
          if (isCorrect) {
            optStyle.boxShadow = '0 0 0 5px #2FAE7A, 0 8px 0 rgba(0,0,0,0.10)';
          }
          if (isWrong) {
            optStyle.animation = 'shake .4s ease';
            optStyle.boxShadow = '0 0 0 5px #E58A7E, 0 8px 0 rgba(0,0,0,0.10)';
          }
          if (solved && !isCorrect) optStyle.opacity = 0.45;

          return (
            <button
              key={option.id}
              className={isPictureMode ? styles.optionButton : styles.pictureOption}
              style={optStyle}
              onClick={() => pick(option)}
              aria-label={isPictureMode ? option.word : option.es}
            >
              <span>{isPictureMode ? option.word : option.emoji}</span>
              {(isCorrect || isWrong) && (
                <span
                  className={styles.optionMark}
                  style={{ background: isCorrect ? '#2FAE7A' : '#E58A7E' }}
                >
                  {isCorrect ? '✓' : '✕'}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Celebración */}
      {celebrate && (
        <div className={styles.overlay}>
          <div className={styles.celebrateCard}>
            <div className={styles.celebrateEmoji}>{question.item.emoji}</div>
            <div className={styles.celebrateWord}>{question.item.word}</div>
            <div className={styles.celebrateEs}>{question.item.es}</div>
            <div className={styles.celebrateButtons}>
              <button
                className={styles.replayButton}
                onClick={() => speak(question.item.word)}
              >
                <SpeakerIcon size={22} color={palette.ink} />
                {t.listen}
              </button>
              <button className={styles.nextButton} onClick={nextQuestion}>
                {t.next}
                <ArrowRightIcon size={22} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
