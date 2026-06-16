import styles from './Common.module.css';
import { StarIcon } from '../icons/Icons';

/** Píldora blanca con la estrella animada y el total de estrellas. */
export function StarCounter({ stars }: { stars: number }) {
  return (
    <div className={styles.starCounter}>
      <span
        style={{
          display: 'inline-flex',
          animation: 'twinkle 2.4s ease-in-out infinite',
        }}
      >
        <StarIcon size={28} />
      </span>
      <span className={styles.starCounterValue}>{stars}</span>
    </div>
  );
}
