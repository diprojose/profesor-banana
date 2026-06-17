import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Graba la voz del niño con MediaRecorder para poder reproducirla
 * después (escucharse a sí mismos). Corre en paralelo al
 * reconocimiento de voz: este transcribe para corregir, y el
 * grabador guarda el audio real para volver a escucharlo.
 */

export type RecorderError = 'denied' | 'failed' | null;

export interface UseVoiceRecorder {
  supported: boolean;
  recording: boolean;
  /** URL del audio grabado (object URL) o null. */
  audioUrl: string | null;
  error: RecorderError;
  start: () => void;
  stop: () => void;
  clear: () => void;
}

export function useVoiceRecorder(): UseVoiceRecorder {
  const [supported] = useState(
    () =>
      typeof navigator !== 'undefined' &&
      !!navigator.mediaDevices?.getUserMedia &&
      typeof MediaRecorder !== 'undefined',
  );
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<RecorderError>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const urlRef = useRef<string | null>(null);

  const revokeUrl = useCallback(() => {
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }
  }, []);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  const clear = useCallback(() => {
    revokeUrl();
    setAudioUrl(null);
  }, [revokeUrl]);

  const start = useCallback(() => {
    if (!supported) return;
    setError(null);
    revokeUrl();
    setAudioUrl(null);

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        streamRef.current = stream;
        const recorder = new MediaRecorder(stream);
        chunksRef.current = [];

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunksRef.current.push(e.data);
        };
        recorder.onstop = () => {
          const blob = new Blob(chunksRef.current, {
            type: recorder.mimeType || 'audio/webm',
          });
          const url = URL.createObjectURL(blob);
          urlRef.current = url;
          setAudioUrl(url);
          stopStream();
        };

        recorder.start();
        recorderRef.current = recorder;
        setRecording(true);
      })
      .catch((err: unknown) => {
        const name = (err as { name?: string } | null)?.name;
        setError(
          name === 'NotAllowedError' || name === 'SecurityError'
            ? 'denied'
            : 'failed',
        );
        setRecording(false);
        stopStream();
      });
  }, [supported, revokeUrl, stopStream]);

  const stop = useCallback(() => {
    const recorder = recorderRef.current;
    if (recorder && recorder.state !== 'inactive') {
      recorder.stop();
    }
    setRecording(false);
  }, []);

  // Limpieza al desmontar.
  useEffect(() => {
    return () => {
      const recorder = recorderRef.current;
      if (recorder && recorder.state !== 'inactive') recorder.stop();
      stopStream();
      revokeUrl();
    };
  }, [stopStream, revokeUrl]);

  return { supported, recording, audioUrl, error, start, stop, clear };
}
