import styles from './Common.module.css';
import { useApp } from '../../state/useApp';

/** Conmutador de idioma ES / EN. */
export function LangToggle() {
  const { lang, setLang } = useApp();
  return (
    <div className={styles.langToggle}>
      <button
        onClick={() => setLang('es')}
        className={`${styles.langButton} ${lang === 'es' ? styles.langButtonActive : ''}`}
      >
        ES
      </button>
      <button
        onClick={() => setLang('en')}
        className={`${styles.langButton} ${lang === 'en' ? styles.langButtonActive : ''}`}
      >
        EN
      </button>
    </div>
  );
}
