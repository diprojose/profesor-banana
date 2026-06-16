import styles from './RewardOverlay.module.css';
import { useApp } from '../../state/useApp';
import { getMedal } from '../../progress/medals';

/**
 * Muestra, una a una, las recompensas pendientes (subida de nivel o
 * medalla nueva). Se monta encima de cualquier pantalla.
 */
export function RewardOverlay() {
  const { rewards, dismissReward, t, lang } = useApp();

  const reward = rewards[0];
  if (!reward) return null;

  return (
    <div className={styles.overlay} onClick={dismissReward}>
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        {reward.kind === 'level' ? (
          <>
            <div className={styles.kind}>{t.levelUp}</div>
            <div className={styles.levelRing}>
              <span className={styles.levelRingWord}>{t.levelBig}</span>
              <span className={styles.levelRingNum}>{reward.level}</span>
            </div>
          </>
        ) : (
          <>
            <div className={styles.kind}>{t.newMedal}</div>
            <div className={styles.bigEmoji}>
              {getMedal(reward.medalId)?.emoji ?? '🏅'}
            </div>
            <div className={styles.name}>
              {getMedal(reward.medalId)?.text[lang].name}
            </div>
            <div className={styles.desc}>
              {getMedal(reward.medalId)?.text[lang].desc}
            </div>
          </>
        )}
        <button className={styles.button} onClick={dismissReward}>
          {t.awesome}
        </button>
      </div>
    </div>
  );
}
