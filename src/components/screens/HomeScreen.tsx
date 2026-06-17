import styles from './HomeScreen.module.css';
import { useApp } from '../../state/useApp';
import { StarCounter } from '../common/StarCounter';
import { LangToggle } from '../common/LangToggle';
import { ChildAvatar } from '../art/Characters';
import {
  MapScenery,
  MathIslandArt,
  WordIslandArt,
  EnglishIslandArt,
} from '../art/Scenery';
import { PlayIcon, GearIcon } from '../icons/Icons';

export function HomeScreen() {
  const { t, stars, level, settings, goTo } = useApp();

  const greeting = `${t.hi}, ${settings.childName}!`;

  return (
    <div className={styles.root}>
      {/* Barra superior: perfil + idioma + estrellas */}
      <div className={styles.topBar}>
        <button
          className={styles.profile}
          onClick={() => goTo('achievements')}
          aria-label={t.achievements}
          title={t.achievements}
        >
          <div className={styles.avatar}>
            <ChildAvatar size={56} />
          </div>
          <div>
            <div className={styles.greeting}>{greeting}</div>
            <div className={styles.levelRow}>
              <span className={styles.levelLabel}>
                {t.level} {level.level}
              </span>
              <div className={styles.progressTrack}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${level.progressPct}%` }}
                />
              </div>
              <span className={styles.starsLabel}>
                {level.into}/{level.needed}
              </span>
            </div>
          </div>
        </button>
        <div className={styles.topRight}>
          <LangToggle />
          <button
            className={styles.iconButton}
            onClick={() => goTo('settings')}
            aria-label={t.settings}
            title={t.settings}
          >
            <GearIcon size={28} color="var(--ink)" />
          </button>
          <StarCounter stars={stars} />
        </div>
      </div>

      {/* Título de la aventura */}
      <div className={styles.adventureTitle}>
        <div className={styles.adventureBadge}>{t.adventure}</div>
      </div>

      {/* Mapa con las islas */}
      <div className={styles.map}>
        <MapScenery />

        <button
          className={`${styles.islandButton} ${styles.islandMath}`}
          onClick={() => goTo('math')}
        >
          <div className={styles.islandFloat}>
            <MathIslandArt />
          </div>
          <div className={styles.islandCard}>
            <div className={styles.islandTitle}>{t.mathIsland}</div>
            <div className={styles.islandSub}>{t.mathSub}</div>
            <div className={`${styles.playBadge} ${styles.playBadgeMath}`}>
              <PlayIcon size={14} />
              {t.play}
            </div>
          </div>
        </button>

        <button
          className={`${styles.islandButton} ${styles.islandEnglish}`}
          onClick={() => goTo('english')}
        >
          <div className={styles.islandFloat}>
            <EnglishIslandArt />
          </div>
          <div className={styles.islandCard}>
            <div className={styles.islandTitle}>{t.englishIsland}</div>
            <div className={styles.islandSub}>{t.englishSub}</div>
            <div className={`${styles.playBadge} ${styles.playBadgeEnglish}`}>
              <PlayIcon size={14} />
              {t.play}
            </div>
          </div>
        </button>

        <button
          className={`${styles.islandButton} ${styles.islandWord}`}
          onClick={() => goTo('reading')}
        >
          <div className={`${styles.islandFloat} ${styles.islandFloatDelayed}`}>
            <WordIslandArt />
          </div>
          <div className={styles.islandCard}>
            <div className={styles.islandTitle}>{t.wordIsland}</div>
            <div className={styles.islandSub}>{t.wordSub}</div>
            <div className={`${styles.playBadge} ${styles.playBadgeWord}`}>
              <PlayIcon size={14} />
              {t.play}
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
