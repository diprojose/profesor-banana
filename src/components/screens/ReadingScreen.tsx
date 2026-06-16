import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './ReadingScreen.module.css';
import { useApp } from '../../state/useApp';
import { useSpeech } from '../../hooks/useSpeech';
import { BackToMapButton } from '../common/BackToMapButton';
import { StorybookScene } from '../art/Scenery';
import {
  ArrowRightIcon,
  CheckCircleIcon,
  MicIcon,
  SpeakerIcon,
} from '../icons/Icons';
import { readingPages } from '../../content/readingPages';

/** Duración simulada de la "grabación" antes de premiar al niño. */
const RECORD_MS = 1800;

export function ReadingScreen() {
  const { t, lang, palette, goTo, recordPageRead, settings } = useApp();
  const { speak, speaking, enabled: voiceEnabled } = useSpeech(
    lang,
    settings.speech,
  );

  const [page, setPage] = useState(0);
  const [recording, setRecording] = useState(false);
  const [recorded, setRecorded] = useState(false);
  const recordTimer = useRef<number | undefined>(undefined);

  const sentence = readingPages[page][lang];
  const pageLabel = `${t.page} ${page + 1}/${readingPages.length}`;

  useEffect(() => {
    return () => window.clearTimeout(recordTimer.current);
  }, []);

  const record = useCallback(() => {
    if (recording) return;
    setRecording(true);
    setRecorded(false);
    window.clearTimeout(recordTimer.current);
    recordTimer.current = window.setTimeout(() => {
      setRecording(false);
      setRecorded(true);
      recordPageRead();
    }, RECORD_MS);
  }, [recording, recordPageRead]);

  const nextPage = useCallback(() => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    window.clearTimeout(recordTimer.current);
    setRecording(false);
    setRecorded(false);
    const next = page + 1;
    if (next >= readingPages.length) {
      goTo('home');
      setPage(0);
    } else {
      setPage(next);
    }
  }, [page, goTo]);

  return (
    <div className={styles.root}>
      <div className={styles.topBar}>
        <BackToMapButton iconColor="var(--coralInk)" />
        <div className={styles.title}>{t.readingTitle}</div>
        <div className={styles.pagePill}>{pageLabel}</div>
      </div>

      <div className={styles.content}>
        {/* Ilustración del cuento */}
        <div className={styles.illustrationFrame}>
          <div className={styles.illustrationInner}>
            <StorybookScene />
          </div>
        </div>

        {/* Frase */}
        <div className={styles.sentenceCard}>
          <div className={styles.sentence}>{sentence}</div>
        </div>

        {/* Controles de audio */}
        <div className={styles.audioControls}>
          <button
            className={`${styles.audioButton} ${speaking ? styles.audioButtonActive : ''}`}
            style={{
              background: palette.accent,
              opacity: voiceEnabled ? 1 : 0.4,
              cursor: voiceEnabled ? 'pointer' : 'not-allowed',
            }}
            onClick={() => speak(sentence)}
            disabled={!voiceEnabled}
          >
            <SpeakerIcon size={26} />
            {speaking ? t.speaking : t.listen}
          </button>

          <button
            className={`${styles.audioButton} ${recording ? styles.audioButtonActive : ''}`}
            style={{ background: palette.coralInk }}
            onClick={record}
          >
            <span className={styles.micRing}>
              {recording && <span className={styles.micRingPulse} />}
              <MicIcon size={26} />
            </span>
            {recording ? t.listening : t.readAloud}
          </button>
        </div>

        <div className={styles.statusRow}>
          {recorded && (
            <div className={styles.recordedOk}>
              <CheckCircleIcon size={20} />
              {t.wellRead}
            </div>
          )}
        </div>
      </div>

      <button className={styles.continueButton} onClick={nextPage}>
        {t.nextPage}
        <ArrowRightIcon size={24} />
      </button>
    </div>
  );
}
