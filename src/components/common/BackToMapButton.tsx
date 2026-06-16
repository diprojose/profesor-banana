import styles from './Common.module.css';
import { HomeIcon } from '../icons/Icons';
import { useApp } from '../../state/useApp';

/** Botón "Mapa" que regresa a Home. El color del ícono es configurable. */
export function BackToMapButton({ iconColor }: { iconColor?: string }) {
  const { goTo, t } = useApp();
  return (
    <button className={styles.backButton} onClick={() => goTo('home')}>
      <HomeIcon size={20} color={iconColor ?? 'var(--accent)'} />
      {t.map}
    </button>
  );
}
