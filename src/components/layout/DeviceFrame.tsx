import { type ReactNode } from 'react';
import styles from './DeviceFrame.module.css';
import { useApp } from '../../state/useApp';
import { paletteToCssVars } from '../../theme/palettes';

/**
 * Marco de tablet que envuelve la pantalla activa. Aplica las
 * variables CSS del theme (paleta + fuente) sobre el lienzo para
 * que toda la UI hija las herede vía var(--...).
 */
export function DeviceFrame({ children }: { children: ReactNode }) {
  const { palette, headingFontFamily, t } = useApp();

  const themeVars = {
    ...paletteToCssVars(palette),
    '--head': headingFontFamily,
  } as React.CSSProperties;

  return (
    <div className={styles.stage}>
      <div className={styles.column}>
        <div className={styles.bezel}>
          <div className={styles.speakerLeft} />
          <div className={styles.speakerRight} />
          <div className={styles.screen} style={themeVars}>
            <div className={styles.canvas}>{children}</div>
          </div>
        </div>
        <div className={styles.caption}>{t.subtitle}</div>
      </div>
    </div>
  );
}
