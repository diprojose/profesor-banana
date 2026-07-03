import { useCallback, useEffect, useState } from 'react';

/**
 * Idiomas que puede pronunciar la app. La UI solo está en es/en,
 * pero las islas de idiomas también pronuncian francés.
 */
export type SpeechLang = 'es' | 'en' | 'fr';

const speechLocale: Record<SpeechLang, string> = {
  es: 'es-ES',
  en: 'en-US',
  fr: 'fr-FR',
};

export interface SpeechOptions {
  /** Si está desactivado, speak() no hace nada. */
  enabled?: boolean;
  /** Velocidad de lectura. */
  rate?: number;
  /** Tono de la voz. */
  pitch?: number;
}

/**
 * Envuelve la API SpeechSynthesis del navegador para leer texto en
 * voz alta con una voz amable para niños. La velocidad y el tono son
 * configurables desde los ajustes.
 */
export function useSpeech(lang: SpeechLang, options: SpeechOptions = {}) {
  const { enabled = true, rate = 0.85, pitch = 1.12 } = options;
  const [speaking, setSpeaking] = useState(false);

  const supported =
    typeof window !== 'undefined' && 'speechSynthesis' in window;

  const cancel = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [supported]);

  const speak = useCallback(
    (text: string) => {
      if (!supported || !enabled) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = speechLocale[lang];
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      setSpeaking(true);
      window.speechSynthesis.speak(utterance);
    },
    [supported, enabled, lang, rate, pitch],
  );

  // Cancela la lectura al desmontar el componente.
  useEffect(() => cancel, [cancel]);

  return { speak, cancel, speaking, supported, enabled };
}
