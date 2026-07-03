import { useState } from 'react';
import styles from './OnboardingScreen.module.css';
import { useApp } from '../../state/useApp';
import { Segmented, type SegmentedOption } from '../settings/Controls';
import { avatarOptions } from '../../state/profiles';
import { gradeOrder, type Grade } from '../../game/grades';

/**
 * Onboarding: crear un aventurero nuevo (avatar + nombre + grado).
 * Se muestra tras el registro (si no hay perfiles) o al pulsar
 * "Nuevo aventurero" en el selector.
 */
export function OnboardingScreen() {
  const { t, profiles, createChildProfile, goTo } = useApp();

  const [avatar, setAvatar] = useState<string>(avatarOptions[0]);
  const [name, setName] = useState('');
  const [grade, setGrade] = useState<Grade>('grade1');

  const gradeLabels: Record<Grade, string> = {
    preschool: t.gradePreschool,
    grade1: t.grade1,
    grade2: t.grade2,
    grade3: t.grade3,
  };
  const gradeOptions: SegmentedOption<Grade>[] = gradeOrder.map((g) => ({
    value: g,
    label: gradeLabels[g],
  }));

  const canStart = name.trim().length > 0;

  return (
    <div className={styles.root}>
      <div className={styles.card}>
        <h1 className={styles.title}>{t.onboardingTitle}</h1>

        <div className={styles.section}>
          <div className={styles.sectionLabel}>{t.onboardingAvatar}</div>
          <div className={styles.avatarGrid}>
            {avatarOptions.map((option) => (
              <button
                key={option}
                className={`${styles.avatarButton} ${
                  avatar === option ? styles.avatarActive : ''
                }`}
                onClick={() => setAvatar(option)}
                aria-pressed={avatar === option}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionLabel}>{t.onboardingName}</div>
          <input
            className={styles.nameInput}
            value={name}
            placeholder={t.childNamePlaceholder}
            maxLength={20}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className={styles.section}>
          <div className={styles.sectionLabel}>{t.onboardingGrade}</div>
          <Segmented options={gradeOptions} value={grade} onChange={setGrade} />
        </div>

        <button
          className={styles.startButton}
          disabled={!canStart}
          onClick={() => createChildProfile(name, avatar, grade)}
        >
          {avatar} {t.onboardingStart}
        </button>

        {profiles.length > 0 && (
          <button className={styles.backButton} onClick={() => goTo('profiles')}>
            {t.onboardingBack}
          </button>
        )}
      </div>
    </div>
  );
}
