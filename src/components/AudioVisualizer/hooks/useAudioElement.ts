import { useEffect, useRef, useState } from "react";

/**
 * React hook to create and manage an HTMLAudioElement from an ArrayBuffer.
 * @param audioBuffer - The audio data as an ArrayBuffer (e.g., from a file upload or fetch).
 * @returns { audio, duration, audioReady }
 */
export function useAudioElement(audioBuffer: ArrayBuffer | null) {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [duration, setDuration] = useState(0);
  const [audioReady, setAudioReady] = useState(false);
  const audioUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (!audioBuffer) return;
    if (audio) {
      audio.pause();
      setAudio(null);
    }
    setAudioReady(false);
    const blob = new Blob([audioBuffer], { type: "audio/mpeg" });
    const url = URL.createObjectURL(blob);
    audioUrlRef.current = url;
    const audioEl = new Audio(url);
    setAudio(audioEl);
    audioEl.onloadedmetadata = () => {
      setDuration(audioEl.duration);
      setAudioReady(true);
    };
    return () => {
      audioEl.pause();
      if (audioUrlRef.current === url) {
        setTimeout(() => {
          URL.revokeObjectURL(url);
          audioUrlRef.current = null;
        }, 100);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioBuffer]);

  return { audio, duration, audioReady };
} 