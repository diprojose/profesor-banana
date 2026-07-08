import styles from './HomeScreen.module.css';
import { useApp } from '../../state/useApp';
import { type Screen } from '../../state/AppContext';
import { StarCounter } from '../common/StarCounter';
import { LangToggle } from '../common/LangToggle';
import { ProfessorBananaFull } from '../art/Characters';
import {
  MathIslandArt,
  WordIslandArt,
  EnglishIslandArt,
  FrenchIslandArt,
  DictationIslandArt,
} from '../art/Scenery';
import { PlayIcon, GearIcon } from '../icons/Icons';
import { type ReactNode } from 'react';

interface IslandDef {
  id: string;
  screen: Screen;
  art: ReactNode;
  title: string;
  sub: string;
  badgeClass: string;
  floatDelayed?: boolean;
}

export function HomeScreen() {
  const { t, stars, level, settings, goTo, profiles, activeProfileId } =
    useApp();

  const greeting = `${t.hi}, ${settings.childName}!`;
  const avatar =
    profiles.find((p) => p.id === activeProfileId)?.avatar ?? '🦊';

  // Las islas del mapa. Para añadir una nueva: agregarla aquí con
  // su arte y su pantalla (la cuadrícula las acomoda sola).
  const islands: IslandDef[] = [
    {
      id: 'math',
      screen: 'math',
      art: <MathIslandArt />,
      title: t.mathIsland,
      sub: t.mathSub,
      badgeClass: styles.playBadgeMath,
    },
    {
      id: 'english',
      screen: 'english',
      art: <EnglishIslandArt />,
      title: t.englishIsland,
      sub: t.englishSub,
      badgeClass: styles.playBadgeEnglish,
    },
    {
      id: 'french',
      screen: 'french',
      art: <FrenchIslandArt />,
      title: t.frenchIsland,
      sub: t.frenchSub,
      badgeClass: styles.playBadgeFrench,
      floatDelayed: true,
    },
    {
      id: 'word',
      screen: 'reading',
      art: <WordIslandArt />,
      title: t.wordIsland,
      sub: t.wordSub,
      badgeClass: styles.playBadgeWord,
      floatDelayed: true,
    },
    {
      id: 'dictation',
      screen: 'dictation',
      art: <DictationIslandArt />,
      title: t.dictationIsland,
      sub: t.dictationSub,
      badgeClass: styles.playBadgeDictation,
    },
  ];

  return (
    <div className={styles.root}>
      {/* Barra superior: perfil + idioma + estrellas */}
      <div className={styles.topBar}>
        <button
          className={styles.profile}
          onClick={() => goTo('achievements')}
          aria-label={t.achievements}
          title={t.achievements}
        >
          <div className={styles.avatar}>
            <span className={styles.avatarEmoji}>{avatar}</span>
          </div>
          <div>
            <div className={styles.greeting}>{greeting}</div>
            <div className={styles.levelRow}>
              <span className={styles.levelLabel}>
                {t.level} {level.level}
              </span>
              <div className={styles.progressTrack}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${level.progressPct}%` }}
                />
              </div>
              <span className={styles.starsLabel}>
                {level.into}/{level.needed}
              </span>
            </div>
          </div>
        </button>
        <div className={styles.topRight}>
          <LangToggle />
          <button
            className={styles.iconButton}
            onClick={() => goTo('settings')}
            aria-label={t.settings}
            title={t.settings}
          >
            <GearIcon size={28} color="var(--ink)" />
          </button>
          <StarCounter stars={stars} />
        </div>
      </div>

      {/* El Profesor Banana presenta la aventura */}
      <div className={styles.adventureTitle}>
        <ProfessorBananaFull size={62} />
        <div className={styles.adventureBadge}>{t.adventure}</div>
      </div>

      {/* Mapa con las islas, todas sobre el mar */}
      <div className={styles.map}>
        {islands.map((island) => (
          <button
            key={island.id}
            className={styles.islandButton}
            onClick={() => goTo(island.screen)}
          >
            <div
              className={`${styles.islandFloat} ${
                island.floatDelayed ? styles.islandFloatDelayed : ''
              }`}
            >
              {island.art}
            </div>
            <div className={styles.islandCard}>
              <div className={styles.islandTitle}>{island.title}</div>
              <div className={styles.islandSub}>{island.sub}</div>
              <div className={`${styles.playBadge} ${island.badgeClass}`}>
                <PlayIcon size={14} />
                {t.play}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
