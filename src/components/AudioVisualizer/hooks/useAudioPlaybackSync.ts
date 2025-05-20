import { useEffect } from "react";

/**
 * Syncs playback state and current time with the audio element.
 * @param audio - The HTMLAudioElement to control.
 * @param audioReady - Boolean indicating if the audio is ready.
 * @param playing - Whether playback is active.
 * @param currentTime - Current playback position (seconds).
 */
export function useAudioPlaybackSync(
  audio: HTMLAudioElement | null,
  audioReady: boolean,
  playing: boolean,
  currentTime: number
) {
  useEffect(() => {
    if (!audio || !audioReady) return;
    if (playing) {
      audio.currentTime = currentTime;
      const playPromise = audio.play();
      if (playPromise) playPromise.catch(() => {});
    } else {
      audio.pause();
    }
  }, [playing, audio, currentTime, audioReady]);
}
