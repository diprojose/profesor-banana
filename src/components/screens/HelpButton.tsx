import styles from './MathScreen.module.css';
import { ProfessorBananaSimple } from '../art/Characters';

/** Botón amarillo con el Profesor Banana que abre el modal de ayuda. */
export function HelpButton({
  onClick,
  label,
}: {
  onClick: () => void;
  label: string;
}) {
  return (
    <button className={styles.helpButton} onClick={onClick}>
      <span className={styles.helpButtonBubble}>
        <ProfessorBananaSimple size={34} />
      </span>
      {label}
    </button>
  );
}
