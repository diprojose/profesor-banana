import { useApp } from './state/useApp';
import { DeviceFrame } from './components/layout/DeviceFrame';
import { HomeScreen } from './components/screens/HomeScreen';
import { MathScreen } from './components/screens/MathScreen';
import { ReadingScreen } from './components/screens/ReadingScreen';
import { LanguageScreen } from './components/screens/LanguageScreen';
import { DictationScreen } from './components/screens/DictationScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { AchievementsScreen } from './components/screens/AchievementsScreen';
import { AuthScreen } from './components/screens/AuthScreen';
import { ProfilesScreen } from './components/screens/ProfilesScreen';
import { OnboardingScreen } from './components/screens/OnboardingScreen';
import { RewardOverlay } from './components/common/RewardOverlay';

/**
 * Enruta entre las pantallas según la sesión y el estado global:
 * 1. Sin sesión decidida → pantalla de cuenta (login/registro/invitado).
 * 2. Con sesión pero sin niño elegido → selector de perfiles
 *    (u onboarding directo si aún no hay ninguno).
 * 3. Con niño activo → las pantallas del juego.
 */
function CurrentScreen() {
  const { screen, authStatus, profiles, activeProfileId } = useApp();

  if (authStatus === 'loading') {
    return null; // instante mientras Firebase restaura la sesión
  }
  if (authStatus === 'signedOut') {
    return <AuthScreen />;
  }

  const hasActiveProfile = profiles.some((p) => p.id === activeProfileId);
  if (!hasActiveProfile && screen !== 'onboarding') {
    return profiles.length > 0 ? <ProfilesScreen /> : <OnboardingScreen />;
  }

  switch (screen) {
    case 'math':
      return <MathScreen />;
    case 'reading':
      return <ReadingScreen />;
    case 'english':
      return <LanguageScreen island="english" />;
    case 'french':
      return <LanguageScreen island="french" />;
    case 'dictation':
      return <DictationScreen />;
    case 'settings':
      return <SettingsScreen />;
    case 'achievements':
      return <AchievementsScreen />;
    case 'profiles':
      return <ProfilesScreen />;
    case 'onboarding':
      return <OnboardingScreen />;
    case 'home':
    default:
      return <HomeScreen />;
  }
}

export function App() {
  return (
    <DeviceFrame>
      <CurrentScreen />
      <RewardOverlay />
    </DeviceFrame>
  );
}
