import { useCallback, useMemo, useRef, useState } from 'react';
import styles from './MathScreen.module.css';
import { useApp } from '../../state/useApp';
import { BackToMapButton } from '../common/BackToMapButton';
import { HelpButton } from './HelpButton';
import { Apple, ProfessorBananaFull } from '../art/Characters';
import {
  ArrowRightIcon,
  CheckCircleIcon,
  CrossCircleIcon,
  StarIcon,
} from '../icons/Icons';
import {
  generateDistinctProblem,
  problemSignature,
} from '../../game/mathGenerator';
import { operationSymbol } from '../../game/types';
import { type MathProblem } from '../../game/types';
import { topicsForGrade, type MathTopic } from '../../game/grades';
import { getHints } from '../../game/hints';
import { type Strings } from '../../i18n/strings';

type Status = 'correct' | 'wrong' | null;

interface Confetto {
  left: string;
  size: string;
  background: string;
  borderRadius: string;
  animation: string;
}

const CONFETTI_COLORS = ['#FBE4A0', '#F7B3A8', '#BCE8CB', '#DBC9F2', '#5CB8E0', '#FBC13E'];

/** Máximo de manzanas a dibujar; con más, solo se muestra el número.
 *  Contar muchísimas manzanas es difícil (y desborda la pantalla). */
const APPLE_LIMIT = 10;

/** Cuántos problemas recientes recordar para no repetirlos seguidos. */
const RECENT_MEMORY = 5;

/** Emoji de cada tema en el selector. */
const topicEmoji: Record<MathTopic, string> = {
  addition: '🍎',
  subtraction: '🎈',
  multiplication: '🧺',
  division: '🍪',
  mixed: '🎲',
};

function topicLabel(topic: MathTopic, t: Strings): string {
  switch (topic) {
    case 'addition':
      return t.topicAddition;
    case 'subtraction':
      return t.topicSubtraction;
    case 'multiplication':
      return t.topicMultiplication;
    case 'division':
      return t.topicDivision;
    case 'mixed':
      return t.topicMixed;
  }
}

/** Título de la pregunta según la operación del problema actual. */
function titleFor(problem: MathProblem, t: Strings): string {
  switch (problem.operation) {
    case 'subtraction':
      return t.mathTitleSub;
    case 'multiplication':
      return t.mathTitleMul;
    case 'division':
      return t.mathTitleDiv;
    default:
      return t.mathTitle;
  }
}

function makeConfetti(): Confetto[] {
  return Array.from({ length: 18 }).map((_, i) => ({
    left: `${4 + Math.random() * 92}%`,
    size: `${8 + Math.random() * 9}px`,
    background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    borderRadius: i % 2 ? '50%' : '3px',
    animation: `fall ${1.2 + Math.random() * 0.8}s linear ${Math.random() * 0.4}s forwards`,
  }));
}

/** Encoge la tipografía según los dígitos para que no se desborde. */
function digitScale(problem: MathProblem): number {
  const lens = [problem.a, problem.b, problem.answer, ...problem.options].map(
    (n) => String(n).length,
  );
  const maxLen = Math.max(...lens);
  if (maxLen <= 1) return 1;
  if (maxLen === 2) return 0.82;
  if (maxLen === 3) return 0.64;
  return 0.52;
}

/**
 * Apoyo visual para multiplicar: `a` grupos de `b` manzanas.
 * Solo con números pequeños; con grandes se trabaja con cifras.
 */
function GroupsVisual({ a, b }: { a: number; b: number }) {
  if (a > 5 || b > 6) return null;
  return (
    <div className={styles.groupsRow}>
      {Array.from({ length: a }).map((_, g) => (
        <div key={g} className={styles.groupBox}>
          {Array.from({ length: b }).map((_, i) => (
            <Apple key={i} size={22} />
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * Apoyo visual para repartir: `a` manzanas y `b` cestas con "?".
 */
function SharingVisual({ a, b }: { a: number; b: number }) {
  if (a > 12 || b > 5) return null;
  return (
    <div className={styles.shareRow}>
      <div className={styles.groupBox}>
        {Array.from({ length: a }).map((_, i) => (
          <Apple key={i} size={22} />
        ))}
      </div>
      <span className={styles.shareArrow}>→</span>
      {Array.from({ length: b }).map((_, i) => (
        <span key={i} className={styles.basket}>
          🧺<span className={styles.basketMark}>?</span>
        </span>
      ))}
    </div>
  );
}

export function MathScreen() {
  const {
    t,
    lang,
    stars,
    recordCorrectAnswer,
    recordWrongAnswer,
    palette,
    headingFontFamily,
    mathConfigFor,
    settings,
  } = useApp();

  const topics = topicsForGrade(settings.grade);

  // Tema elegido; null → selector de temas.
  const [topic, setTopic] = useState<MathTopic | null>(null);

  // Memoria de problemas recientes (firmas) para evitar repeticiones.
  const recentRef = useRef<string[]>([]);

  const [problem, setProblem] = useState<MathProblem | null>(null);
  const [picked, setPicked] = useState<number | null>(null);
  const [status, setStatus] = useState<Status>(null);
  const [celebrate, setCelebrate] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const startTopic = useCallback(
    (next: MathTopic) => {
      recentRef.current = [];
      const p = generateDistinctProblem(mathConfigFor(next), []);
      recentRef.current = [problemSignature(p)];
      setTopic(next);
      setProblem(p);
      setPicked(null);
      setStatus(null);
      setCelebrate(false);
    },
    [mathConfigFor],
  );

  const backToTopics = useCallback(() => {
    setTopic(null);
    setProblem(null);
    setPicked(null);
    setStatus(null);
    setCelebrate(false);
    setShowHelp(false);
  }, []);

  const solved = status === 'correct';
  const optionColors = [palette.mint, palette.yellow, palette.lilac];

  const scale = useMemo(() => (problem ? digitScale(problem) : 1), [problem]);
  const hints = useMemo(
    () => (problem ? getHints(problem, lang) : []),
    [problem, lang],
  );

  const pick = useCallback(
    (value: number) => {
      if (!problem || status === 'correct') return;
      if (value === problem.answer) {
        setPicked(value);
        setStatus('correct');
        setCelebrate(true);
        recordCorrectAnswer();
      } else {
        setPicked(value);
        setStatus('wrong');
        recordWrongAnswer();
      }
    },
    [problem, status, recordCorrectAnswer, recordWrongAnswer],
  );

  const nextProblem = useCallback(() => {
    if (!topic) return;
    const p = generateDistinctProblem(mathConfigFor(topic), recentRef.current);
    recentRef.current = [problemSignature(p), ...recentRef.current].slice(
      0,
      RECENT_MEMORY,
    );
    setProblem(p);
    setPicked(null);
    setStatus(null);
    setCelebrate(false);
  }, [topic, mathConfigFor]);

  const confetti = useMemo(() => (celebrate ? makeConfetti() : []), [celebrate]);

  // --- Selector de temas ---
  if (topic === null || problem === null) {
    return (
      <div className={styles.root}>
        <div className={styles.topBar}>
          <BackToMapButton iconColor="var(--accent)" />
          <div className={styles.title}>{t.chooseTopic}</div>
          <div className={styles.starsPill}>
            <StarIcon size={26} />
            <span className={styles.starsValue}>{stars}</span>
          </div>
        </div>
        <div className={styles.topicPicker}>
          <div className={styles.topicGrid}>
            {topics.map((item) => (
              <button
                key={item}
                className={styles.topicCard}
                onClick={() => startTopic(item)}
              >
                <span className={styles.topicEmoji}>{topicEmoji[item]}</span>
                <span className={styles.topicName}>{topicLabel(item, t)}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- Vista de ejercicio ---
  const isMultiplication = problem.operation === 'multiplication';
  const isDivision = problem.operation === 'division';
  const showApples =
    (problem.operation === 'addition' || problem.operation === 'subtraction') &&
    problem.a <= APPLE_LIMIT &&
    problem.b <= APPLE_LIMIT;

  // Tamaños fluidos: clamp() se adapta al viewport y `scale` encoge
  // la cifra cuando tiene muchos dígitos.
  const answerBoxStyle: React.CSSProperties = {
    fontSize: `calc(clamp(34px, 9vw, 58px) * ${scale})`,
    ...(solved
      ? {
          background: '#9FD9B8',
          color: '#1f6e4d',
          boxShadow: '0 0 0 5px #2FAE7A, 0 14px 30px rgba(50,80,110,0.12)',
        }
      : {
          background: '#fff',
          color: palette.ink,
          boxShadow: `inset 0 0 0 4px ${palette.yellow}, 0 14px 30px rgba(50,80,110,0.12)`,
        }),
  };

  const operandNumberStyle = {
    fontSize: `calc(clamp(26px, 7vw, 40px) * ${scale})`,
  };

  return (
    <div className={styles.root}>
      {/* Barra superior */}
      <div className={styles.topBar}>
        <button className={styles.backToTopics} onClick={backToTopics}>
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path
              d="M15 5l-7 7 7 7"
              stroke="var(--accent)"
              strokeWidth="2.6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {t.topics}
        </button>
        <div className={styles.title}>{titleFor(problem, t)}</div>
        <div className={styles.starsPill}>
          <StarIcon size={26} />
          <span className={styles.starsValue}>{stars}</span>
        </div>
      </div>

      {/* Ecuación (con apoyo visual según la operación) */}
      <div className={styles.equationArea}>
        {isMultiplication && <GroupsVisual a={problem.a} b={problem.b} />}
        {isDivision && <SharingVisual a={problem.a} b={problem.b} />}

        <div className={styles.equation}>
          <div className={styles.operandCard}>
            {showApples && (
              <div className={styles.apples}>
                {Array.from({ length: problem.a }).map((_, i) => (
                  <Apple key={i} size={48} />
                ))}
              </div>
            )}
            <div
              className={`${styles.operandNumber} ${styles.operandA}`}
              style={operandNumberStyle}
            >
              {problem.a}
            </div>
          </div>

          <div className={styles.operator}>
            {operationSymbol[problem.operation]}
          </div>

          <div className={styles.operandCard}>
            {showApples && (
              <div className={styles.apples}>
                {Array.from({ length: problem.b }).map((_, i) => (
                  <Apple key={i} size={48} />
                ))}
              </div>
            )}
            <div
              className={`${styles.operandNumber} ${styles.operandB}`}
              style={operandNumberStyle}
            >
              {problem.b}
            </div>
          </div>

          <div className={styles.operator}>=</div>

          <div className={styles.answerBox} style={answerBoxStyle}>
            {solved ? problem.answer : '?'}
          </div>
        </div>

        {/* Feedback */}
        <div className={styles.feedbackRow}>
          {status === 'wrong' && (
            <div className={styles.feedbackWrong}>
              <CrossCircleIcon size={22} />
              {t.almost}
            </div>
          )}
          {solved && !celebrate && (
            <div className={styles.feedbackCorrect}>
              <CheckCircleIcon size={22} />
              {t.great}
            </div>
          )}
        </div>
      </div>

      {/* Opciones */}
      <div className={styles.options}>
        {problem.options.map((value, i) => {
          const isPicked = picked === value;
          const isCorrect = solved && value === problem.answer;
          const isWrong = isPicked && status === 'wrong';

          const optStyle: React.CSSProperties = {
            background: optionColors[i % 3],
            cursor: solved ? 'default' : 'pointer',
            fontSize: `calc(clamp(28px, 8vw, 46px) * ${scale})`,
          };
          if (isCorrect) {
            optStyle.boxShadow = '0 0 0 5px #2FAE7A, 0 8px 0 rgba(0,0,0,0.10)';
          }
          if (isWrong) {
            optStyle.animation = 'shake .4s ease';
            optStyle.boxShadow = '0 0 0 5px #E58A7E, 0 8px 0 rgba(0,0,0,0.10)';
          }
          if (solved && !isCorrect) {
            optStyle.opacity = 0.45;
          }

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

      {/* Botón de ayuda */}
      <HelpButton onClick={() => setShowHelp(true)} label={t.help} />

      {/* Celebración */}
      {celebrate && (
        <div className={`${styles.overlay} ${styles.celebrateOverlay}`}>
          {confetti.map((c, i) => (
            <span
              key={i}
              className={styles.confetti}
              style={{
                left: c.left,
                width: c.size,
                height: c.size,
                background: c.background,
                borderRadius: c.borderRadius,
                animation: c.animation,
              }}
            />
          ))}
          <div className={styles.celebrateCard}>
            <ProfessorBananaFull size={120} />
            <div className={styles.celebrateTitle}>{t.great}</div>
            <div className={styles.celebrateStars}>
              <StarIcon size={34} style={{ animation: 'twinkle 1.4s ease-in-out infinite' }} />
              <StarIcon size={44} style={{ animation: 'twinkle 1.4s ease-in-out infinite .2s' }} />
              <StarIcon size={34} style={{ animation: 'twinkle 1.4s ease-in-out infinite .4s' }} />
            </div>
            <button className={styles.nextButton} onClick={nextProblem}>
              {t.next}
              <ArrowRightIcon size={22} />
            </button>
          </div>
        </div>
      )}

      {/* Modal de ayuda con tips reales según la operación */}
      {showHelp && (
        <div
          className={`${styles.overlay} ${styles.helpOverlay}`}
          onClick={() => setShowHelp(false)}
        >
          <div className={styles.helpCard} onClick={(e) => e.stopPropagation()}>
            <div style={{ flexShrink: 0 }}>
              <ProfessorBananaFull size={92} bob />
            </div>
            <div>
              <div className={styles.helpTitle} style={{ fontFamily: headingFontFamily }}>
                {t.helpTitle}
              </div>
              <ul className={styles.helpHintList}>
                {hints.map((line, i) => (
                  <li key={i} className={styles.helpHint}>
                    {line}
                  </li>
                ))}
              </ul>
              <button className={styles.helpGotIt} onClick={() => setShowHelp(false)}>
                {t.gotit}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
