import { useEffect, RefObject } from "react";

/**
 * Draws the real-time frequency bar visualization on the canvas.
 * @param audio - The HTMLAudioElement to visualize, or null for live.
 * @param audioReady - Boolean indicating if the audio or live stream is ready.
 * @param analyserRef - Ref to the AnalyserNode.
 * @param canvasRef - Ref to the canvas element.
 * @param canvasWidth - Width of the canvas.
 * @param height - Height of the canvas.
 * @param barColor - Color of the bars.
 * @param barPlayedColor - Color of the played bar.
 * @param duration - Duration of the audio.
 * @param dpr - Device pixel ratio.
 * @param showProgressBar - Whether to draw the progress bar (default: true)
 */
export function useAudioVisualizerDraw(
  audio: HTMLAudioElement | null,
  audioReady: boolean,
  analyserRef: RefObject<AnalyserNode>,
  canvasRef: RefObject<HTMLCanvasElement>,
  canvasWidth: number,
  height: number,
  barColor: string,
  barPlayedColor: string,
  duration: number,
  dpr: number,
  showProgressBar: boolean = true
) {
  useEffect(() => {
    if (!audioReady) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const analyser = analyserRef.current;
    if (!analyser) return;
    let animationId: number;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const draw = () => {
      ctx.clearRect(0, 0, canvasWidth * dpr, height * dpr);
      analyser.getByteFrequencyData(dataArray);
      for (let i = 0; i < bufferLength; i++) {
        const x = (i * canvasWidth * dpr) / bufferLength;
        const barH = (dataArray[i] / 255) * height * dpr;
        ctx.fillStyle = barColor;
        ctx.fillRect(x, height * dpr - barH, (canvasWidth * dpr) / bufferLength - 1, barH);
      }
      if (showProgressBar && audio && duration) {
        ctx.fillStyle = barPlayedColor;
        ctx.fillRect((audio.currentTime / duration) * canvasWidth * dpr, 0, 2 * dpr, height * dpr);
      }
      animationId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animationId);
  }, [audio, canvasWidth, height, barColor, barPlayedColor, duration, audioReady, analyserRef, dpr, showProgressBar]);
}
