import { useCallback, useEffect, useRef, useState } from 'react';
import { type Lang } from '../i18n/strings';

/**
 * Reconocimiento de voz del navegador (Web Speech API).
 * Funciona en Chrome y Edge; en otros navegadores `supported` es
 * false y la pantalla muestra una alternativa.
 *
 * Modo continuo: escucha aunque el niño haga pausas (lectores lentos)
 * y va acumulando lo que dice. La evaluación se hace cuando la
 * grabación termina: el niño toca "¡Listo!", O automáticamente tras
 * un silencio largo después de haber dicho algo (los niños pequeños
 * no siempre entienden que hay que tocar el botón otra vez).
 *
 * Tipamos lo mínimo necesario porque la API no está en los tipos
 * estándar del DOM y vive bajo el prefijo `webkit`.
 */

/**
 * Silencio (tras haber oído algo en firme) que dispara la evaluación
 * automática. Generoso a propósito: un lector lento hace pausas entre
 * palabras, pero rara vez de 3.5 segundos tras terminar una frase.
 */
const SILENCE_STOP_MS = 3500;

interface RecognitionAlternative {
  transcript: string;
  confidence: number;
}
interface RecognitionResult {
  readonly length: number;
  readonly isFinal: boolean;
  [index: number]: RecognitionAlternative;
}
interface RecognitionResultList {
  readonly length: number;
  [index: number]: RecognitionResult;
}
interface RecognitionEvent {
  results: RecognitionResultList;
}
interface RecognitionErrorEvent {
  error: string;
}
interface RecognitionInstance {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  onresult: ((e: RecognitionEvent) => void) | null;
  onerror: ((e: RecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}
type RecognitionCtor = new () => RecognitionInstance;

function getRecognitionCtor(): RecognitionCtor | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as {
    SpeechRecognition?: RecognitionCtor;
    webkitSpeechRecognition?: RecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export type RecognitionError = 'denied' | 'no-speech' | 'failed' | null;

export interface UseSpeechRecognition {
  supported: boolean;
  listening: boolean;
  error: RecognitionError;
  /** Empieza a escuchar; `onResult` recibe TODO lo dicho al terminar. */
  start: (onResult: (transcript: string) => void) => void;
  /** Termina la grabación y evalúa lo dicho. */
  stop: () => void;
  /** Corta la grabación SIN evaluar (p. ej. al cambiar de página). */
  cancel: () => void;
}

export function useSpeechRecognition(lang: Lang): UseSpeechRecognition {
  const [supported] = useState(() => getRecognitionCtor() !== null);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<RecognitionError>(null);

  const recognitionRef = useRef<RecognitionInstance | null>(null);
  const finalTranscriptRef = useRef('');
  const onResultRef = useRef<((transcript: string) => void) | null>(null);
  const erroredRef = useRef(false);
  const cancelledRef = useRef(false);
  // Vigilante de silencio (evaluación automática).
  const lastResultAtRef = useRef(0);
  const watchdogRef = useRef<number | null>(null);

  const clearWatchdog = useCallback(() => {
    if (watchdogRef.current !== null) {
      window.clearInterval(watchdogRef.current);
      watchdogRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    clearWatchdog();
    recognitionRef.current?.stop();
  }, [clearWatchdog]);

  const cancel = useCallback(() => {
    cancelledRef.current = true;
    clearWatchdog();
    recognitionRef.current?.abort();
    setListening(false);
  }, [clearWatchdog]);

  const start = useCallback(
    (onResult: (transcript: string) => void) => {
      const Ctor = getRecognitionCtor();
      if (!Ctor) return;

      // Cierra cualquier sesión previa.
      recognitionRef.current?.abort();

      const recognition = new Ctor();
      recognition.lang = lang === 'en' ? 'en-US' : 'es-ES';
      recognition.interimResults = true;
      recognition.maxAlternatives = 3;
      recognition.continuous = true;

      finalTranscriptRef.current = '';
      onResultRef.current = onResult;
      erroredRef.current = false;
      cancelledRef.current = false;

      recognition.onresult = (e) => {
        // Reconstruye todo lo dicho juntando los resultados finales.
        let finalText = '';
        for (let i = 0; i < e.results.length; i++) {
          const res = e.results[i];
          if (res.isFinal) finalText += res[0].transcript + ' ';
        }
        finalTranscriptRef.current = finalText.trim();
        lastResultAtRef.current = Date.now();
      };
      recognition.onerror = (e) => {
        erroredRef.current = true;
        setError(
          e.error === 'not-allowed' || e.error === 'service-not-allowed'
            ? 'denied'
            : e.error === 'no-speech'
              ? 'no-speech'
              : 'failed',
        );
      };
      recognition.onend = () => {
        clearWatchdog();
        setListening(false);
        // Evaluamos salvo que haya habido error o cancelación.
        if (!erroredRef.current && !cancelledRef.current && onResultRef.current) {
          onResultRef.current(finalTranscriptRef.current);
        }
      };

      setError(null);
      setListening(true);
      lastResultAtRef.current = 0;
      try {
        recognition.start();
        recognitionRef.current = recognition;
      } catch {
        // start() lanza si ya está activo; lo ignoramos.
        setListening(false);
        return;
      }

      // Evaluación automática: si ya se oyó algo en firme y luego hay
      // un silencio largo, paramos solos (el niño no tiene que tocar).
      clearWatchdog();
      watchdogRef.current = window.setInterval(() => {
        const heardSomething = finalTranscriptRef.current.length > 0;
        const silentFor = Date.now() - lastResultAtRef.current;
        if (heardSomething && silentFor > SILENCE_STOP_MS) {
          clearWatchdog();
          recognitionRef.current?.stop();
        }
      }, 400);
    },
    [lang, clearWatchdog],
  );

  // Limpia al desmontar.
  useEffect(() => {
    return () => {
      clearWatchdog();
      recognitionRef.current?.abort();
    };
  }, [clearWatchdog]);

  return { supported, listening, error, start, stop, cancel };
}
