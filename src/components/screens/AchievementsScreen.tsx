import styles from './AchievementsScreen.module.css';
import { useApp } from '../../state/useApp';
import { BackToMapButton } from '../common/BackToMapButton';
import { medals } from '../../progress/medals';

export function AchievementsScreen() {
  const { t, lang, progress, level, resetProgress } = useApp();

  const unlockedCount = progress.unlockedMedals.length;

  const handleReset = () => {
    if (window.confirm(t.resetProgressConfirm)) resetProgress();
  };

  const stats = [
    { value: progress.mathSolved, label: t.statsMath },
    { value: progress.pagesRead, label: t.statsReading },
    { value: progress.completedStories.length, label: t.statsStories },
    { value: progress.englishWordIds.length, label: t.statsEnglish },
    { value: progress.frenchWordIds.length, label: t.statsFrench },
    { value: progress.completedDictations.length, label: t.statsDictation },
    { value: progress.bestStreak, label: t.statsStreak },
    { value: progress.stars, label: t.statsStars },
  ];

  return (
    <div className={styles.root}>
      <div className={styles.topBar}>
        <BackToMapButton iconColor="var(--accent)" />
        <div className={styles.title}>{t.achievementsTitle}</div>
        <button className={styles.resetButton} onClick={handleReset}>
          {t.resetProgressButton}
        </button>
      </div>

      <div className={styles.scroll}>
        <div className={styles.inner}>
          {/* Nivel */}
          <div className={styles.levelCard}>
            <div className={styles.levelBadge}>
              <span className={styles.levelBadgeWord}>{t.levelBig}</span>
              <span className={styles.levelBadgeNum}>{level.level}</span>
            </div>
            <div className={styles.levelInfo}>
              <div className={styles.levelBarTrack}>
                <div
                  className={styles.levelBarFill}
                  style={{ width: `${level.progressPct}%` }}
                />
              </div>
              <div className={styles.levelNextLabel}>
                {level.needed - level.into} ⭐ {t.toNextLevel}
              </div>
            </div>
          </div>

          {/* Estadísticas */}
          <div className={styles.stats}>
            {stats.map((s) => (
              <div key={s.label} className={styles.statBox}>
                <div className={styles.statValue}>{s.value}</div>
                <div className={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Medallas */}
          <div className={styles.medalsHeader}>
            <span className={styles.medalsTitle}>{t.medalsTitle}</span>
            <span className={styles.medalsCount}>
              {unlockedCount}/{medals.length} {t.medalsProgress}
            </span>
          </div>
          <div className={styles.medalGrid}>
            {medals.map((medal) => {
              const unlocked = progress.unlockedMedals.includes(medal.id);
              const text = medal.text[lang];
              return (
                <div
                  key={medal.id}
                  className={`${styles.medal} ${unlocked ? styles.medalUnlocked : styles.medalLocked}`}
                >
                  <span className={styles.medalEmoji}>
                    {unlocked ? medal.emoji : '🔒'}
                  </span>
                  <span className={styles.medalName}>
                    {unlocked ? text.name : t.locked}
                  </span>
                  <span className={styles.medalDesc}>{text.desc}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
