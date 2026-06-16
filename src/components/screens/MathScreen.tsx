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
import { getHints } from '../../game/hints';

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

export function MathScreen() {
  const {
    t,
    lang,
    stars,
    recordCorrectAnswer,
    recordWrongAnswer,
    palette,
    headingFontFamily,
    mathConfig,
  } = useApp();

  // Memoria de problemas recientes (firmas) para evitar repeticiones.
  const recentRef = useRef<string[]>([]);

  const [problem, setProblem] = useState<MathProblem>(() => {
    const p = generateDistinctProblem(mathConfig, recentRef.current);
    recentRef.current = [problemSignature(p)];
    return p;
  });
  const [picked, setPicked] = useState<number | null>(null);
  const [status, setStatus] = useState<Status>(null);
  const [celebrate, setCelebrate] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const solved = status === 'correct';
  const optionColors = [palette.mint, palette.yellow, palette.lilac];

  const scale = useMemo(() => digitScale(problem), [problem]);
  const showApples = problem.a <= APPLE_LIMIT && problem.b <= APPLE_LIMIT;
  const hints = useMemo(() => getHints(problem, lang), [problem, lang]);

  const pick = useCallback(
    (value: number) => {
      if (status === 'correct') return;
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
    [status, problem.answer, recordCorrectAnswer, recordWrongAnswer],
  );

  const nextProblem = useCallback(() => {
    const p = generateDistinctProblem(mathConfig, recentRef.current);
    recentRef.current = [problemSignature(p), ...recentRef.current].slice(
      0,
      RECENT_MEMORY,
    );
    setProblem(p);
    setPicked(null);
    setStatus(null);
    setCelebrate(false);
  }, [mathConfig]);

  const confetti = useMemo(() => (celebrate ? makeConfetti() : []), [celebrate]);

  const answerBoxStyle: React.CSSProperties = {
    fontSize: `${58 * scale}px`,
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

  const operandNumberStyle = { fontSize: `${40 * scale}px` };

  return (
    <div className={styles.root}>
      {/* Barra superior */}
      <div className={styles.topBar}>
        <BackToMapButton iconColor="var(--accent)" />
        <div className={styles.title}>{t.mathTitle}</div>
        <div className={styles.starsPill}>
          <StarIcon size={26} />
          <span className={styles.starsValue}>{stars}</span>
        </div>
      </div>

      {/* Ecuación (con manzanas solo si son pocas) */}
      <div className={styles.equationArea}>
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
            fontSize: `${46 * scale}px`,
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
