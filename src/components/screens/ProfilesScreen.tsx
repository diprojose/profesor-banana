import styles from './ProfilesScreen.module.css';
import { useApp } from '../../state/useApp';
import { LangToggle } from '../common/LangToggle';
import { ProfessorBananaFull } from '../art/Characters';
import { levelFromStars } from '../../progress/levels';

/**
 * Selector de aventureros: cada niño de la familia tiene su perfil
 * con avatar, nombre y nivel. Desde aquí también se crea uno nuevo.
 */
export function ProfilesScreen() {
  const {
    t,
    profiles,
    selectProfile,
    goTo,
    authStatus,
    userEmail,
    accountsEnabled,
    signOutAccount,
    goToAuth,
  } = useApp();

  return (
    <div className={styles.root}>
      <div className={styles.topBar}>
        <div className={styles.sessionInfo}>
          {authStatus === 'signedIn' ? (
            <>
              <span className={styles.sessionEmail}>{userEmail}</span>
              <button
                className={styles.sessionButton}
                onClick={() => void signOutAccount()}
              >
                {t.signOut}
              </button>
            </>
          ) : (
            <>
              <span className={styles.guestBadge}>{t.guestBadge}</span>
              {accountsEnabled && (
                <button className={styles.sessionButton} onClick={goToAuth}>
                  {t.createAccountCta}
                </button>
              )}
            </>
          )}
        </div>
        <LangToggle />
      </div>

      <div className={styles.mascot}>
        <ProfessorBananaFull size={84} />
      </div>
      <h1 className={styles.title}>{t.whoIsPlaying}</h1>

      <div className={styles.grid}>
        {profiles.map((profile) => (
          <button
            key={profile.id}
            className={styles.profileCard}
            onClick={() => selectProfile(profile.id)}
          >
            <span className={styles.avatar}>{profile.avatar}</span>
            <span className={styles.name}>{profile.settings.childName}</span>
            <span className={styles.level}>
              {t.level} {levelFromStars(profile.progress.stars)} · ⭐{' '}
              {profile.progress.stars}
            </span>
          </button>
        ))}

        <button
          className={`${styles.profileCard} ${styles.addCard}`}
          onClick={() => goTo('onboarding')}
        >
          <span className={styles.avatar}>➕</span>
          <span className={styles.name}>{t.newProfile}</span>
        </button>
      </div>
    </div>
  );
}
