import { RefObject, useCallback } from "react";

/**
 * Returns a click handler for seeking in the audio when the canvas is clicked.
 * @param audio - The HTMLAudioElement to control.
 * @param duration - Duration of the audio.
 * @param canvasRef - Ref to the canvas element.
 * @param canvasWidth - Width of the canvas.
 * @param onSeek - Optional callback for seeking.
 */
export function useCanvasSeekHandler(
  audio: HTMLAudioElement | null,
  duration: number,
  canvasRef: RefObject<HTMLCanvasElement>,
  canvasWidth: number,
  onSeek?: (time: number) => void
) {
  return useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!audio || !duration) return;
      const rect = canvasRef.current!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percent = x / canvasWidth;
      const seekTime = percent * duration;
      audio.currentTime = seekTime;
      if (onSeek) onSeek(seekTime);
    },
    [audio, duration, canvasRef, canvasWidth, onSeek]
  );
}
