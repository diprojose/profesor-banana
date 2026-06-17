import { useCallback, useRef, useState } from 'react';
import styles from './EnglishScreen.module.css';
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
  generateEnglishQuestion,
  type EnglishQuestion,
} from '../../english/englishGenerator';

type Status = 'correct' | 'wrong' | null;

/** Cuántas preguntas recientes recordar para no repetirlas seguidas. */
const RECENT_MEMORY = 5;

export function EnglishScreen() {
  const { t, stars, palette, recordEnglishCorrect, settings } = useApp();
  // La pronunciación es siempre en inglés, sin importar el idioma de la UI.
  const { speak, speaking } = useSpeech('en', settings.speech);

  const recentRef = useRef<string[]>([]);
  const [question, setQuestion] = useState<EnglishQuestion>(() => {
    const q = generateEnglishQuestion(3, recentRef.current);
    recentRef.current = [q.item.id];
    return q;
  });
  const [picked, setPicked] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>(null);
  const [celebrate, setCelebrate] = useState(false);

  const solved = status === 'correct';
  const optionColors = [palette.mint, palette.yellow, palette.lilac, palette.coral];

  const pick = useCallback(
    (value: string) => {
      if (solved) return;
      if (value === question.item.en) {
        setPicked(value);
        setStatus('correct');
        setCelebrate(true);
        recordEnglishCorrect();
        speak(question.item.en);
      } else {
        setPicked(value);
        setStatus('wrong');
      }
    },
    [solved, question.item.en, recordEnglishCorrect, speak],
  );

  const nextQuestion = useCallback(() => {
    const q = generateEnglishQuestion(3, recentRef.current);
    recentRef.current = [q.item.id, ...recentRef.current].slice(0, RECENT_MEMORY);
    setQuestion(q);
    setPicked(null);
    setStatus(null);
    setCelebrate(false);
  }, []);

  return (
    <div className={styles.root}>
      {/* Barra superior */}
      <div className={styles.topBar}>
        <BackToMapButton iconColor="var(--accent)" />
        <div className={styles.title}>{t.englishTitle}</div>
        <div className={styles.starsPill}>
          <StarIcon size={26} />
          <span className={styles.starsValue}>{stars}</span>
        </div>
      </div>

      <div className={styles.center}>
        {/* Dibujo (emoji) + botón para oír la pronunciación */}
        <div className={styles.pictureCard}>
          <div className={styles.emoji}>{question.item.emoji}</div>
          <button
            className={`${styles.hearButton} ${speaking ? styles.hearButtonActive : ''}`}
            onClick={() => speak(question.item.en)}
          >
            <SpeakerIcon size={24} />
            {t.listen}
          </button>
        </div>

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

      {/* Opciones */}
      <div className={styles.options}>
        {question.options.map((value, i) => {
          const isPicked = picked === value;
          const isCorrect = solved && value === question.item.en;
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
              key={value}
              className={styles.optionButton}
              style={optStyle}
              onClick={() => pick(value)}
            >
              <span>{value}</span>
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
            <div className={styles.celebrateWord}>{question.item.en}</div>
            <div className={styles.celebrateEs}>{question.item.es}</div>
            <div className={styles.celebrateButtons}>
              <button
                className={styles.replayButton}
                onClick={() => speak(question.item.en)}
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
