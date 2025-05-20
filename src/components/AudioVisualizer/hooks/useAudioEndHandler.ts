import { useEffect } from "react";

/**
 * Registers a callback for when audio playback ends.
 * @param audio - The HTMLAudioElement to listen to.
 * @param onEnd - Optional callback when playback ends.
 */
export function useAudioEndHandler(audio: HTMLAudioElement | null, onEnd?: () => void) {
  useEffect(() => {
    if (!audio) return;
    const handleEnded = () => { if (onEnd) onEnd(); };
    audio.onended = handleEnded;
    return () => { audio.onended = null; };
  }, [audio, onEnd]);
}
