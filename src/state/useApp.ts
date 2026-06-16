import { useContext } from 'react';
import { AppContext } from './AppContext';

/** Hook para acceder al estado global de la app. */
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp debe usarse dentro de <AppProvider>');
  }
  return ctx;
}
