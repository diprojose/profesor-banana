import { type ReactNode } from 'react';
import styles from './DeviceFrame.module.css';
import { useApp } from '../../state/useApp';
import { paletteToCssVars } from '../../theme/palettes';

/**
 * Lienzo de la app a pantalla completa. Aplica las variables CSS del
 * theme (paleta + fuente) para que toda la UI hija las herede vía
 * var(--...). (Antes dibujaba un marco de tablet en desktop; se
 * eliminó para aprovechar toda la pantalla.)
 */
export function DeviceFrame({ children }: { children: ReactNode }) {
  const { palette, headingFontFamily } = useApp();

  const themeVars = {
    ...paletteToCssVars(palette),
    '--head': headingFontFamily,
  } as React.CSSProperties;

  return (
    <div className={styles.screen} style={themeVars}>
      <div className={styles.canvas}>{children}</div>
    </div>
  );
}
