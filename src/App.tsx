import { useApp } from './state/useApp';
import { DeviceFrame } from './components/layout/DeviceFrame';
import { HomeScreen } from './components/screens/HomeScreen';
import { MathScreen } from './components/screens/MathScreen';
import { ReadingScreen } from './components/screens/ReadingScreen';
import { EnglishScreen } from './components/screens/EnglishScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { AchievementsScreen } from './components/screens/AchievementsScreen';
import { RewardOverlay } from './components/common/RewardOverlay';

/** Enruta entre las pantallas según el estado global. */
function CurrentScreen() {
  const { screen } = useApp();
  switch (screen) {
    case 'math':
      return <MathScreen />;
    case 'reading':
      return <ReadingScreen />;
    case 'english':
      return <EnglishScreen />;
    case 'settings':
      return <SettingsScreen />;
    case 'achievements':
      return <AchievementsScreen />;
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
