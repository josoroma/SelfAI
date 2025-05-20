import { useEffect } from "react";

/**
 * Keeps the parent component in sync with the audio element's current time.
 * @param audio - The HTMLAudioElement to listen to.
 * @param onSeek - Optional callback on time updates.
 */
export function useAudioTimeUpdate(audio: HTMLAudioElement | null, onSeek?: (time: number) => void) {
  useEffect(() => {
    if (!audio) return;
    const update = () => { if (onSeek) onSeek(audio.currentTime); };
    audio.ontimeupdate = update;
    return () => { audio.ontimeupdate = null; };
  }, [audio, onSeek]);
}
