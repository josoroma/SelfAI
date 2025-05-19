import React, { useEffect, useRef } from "react";
import { AudioVisualizerProps } from "./types";
import { DEFAULT_HEIGHT, DEFAULT_BAR_COLOR, DEFAULT_BAR_PLAYED_COLOR } from "./constants";
import { useContainerWidth, useAudioElement, useAudioContextAnalyser } from "./hooks/useContainerWidth";

/**
 * AudioVisualizer
 * Renders a real-time audio frequency bar visualization for a given audio buffer.
 * Handles audio playback, seeking, and progress indication.
 * Props:
 *   - audioBuffer: The audio data to visualize.
 *   - playing: Whether playback is active.
 *   - currentTime: Current playback position (seconds).
 *   - onSeek: Optional callback for seeking to a new time.
 *   - onEnd: Optional callback when playback ends.
 *   - height, barColor, barPlayedColor: Visualization appearance options.
 */
export default function AudioVisualizer({
  audioBuffer,
  playing,
  currentTime,
  onSeek,
  onEnd,
  height = DEFAULT_HEIGHT,
  barColor = DEFAULT_BAR_COLOR,
  barPlayedColor = DEFAULT_BAR_PLAYED_COLOR,
}: AudioVisualizerProps) {
  // Ref to the canvas element for drawing the visualization
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Ref to the container div for responsive sizing
  const containerRef = useRef<HTMLDivElement>(null);
  // Get container width and device pixel ratio for sharp rendering
  const { width: canvasWidth, dpr } = useContainerWidth(containerRef as React.RefObject<HTMLElement>);
  // Manage audio element and playback state
  const { audio, duration, audioReady } = useAudioElement(audioBuffer);
  // Set up audio context and analyser for frequency data
  const { analyserRef } = useAudioContextAnalyser(audio, audioReady);

  /**
   * Syncs playback state and current time with the audio element.
   * Plays or pauses audio based on the 'playing' prop and seeks to 'currentTime'.
   * Runs whenever 'playing', 'audio', 'currentTime', or 'audioReady' changes.
   */
  useEffect(() => {
    if (!audio || !audioReady) return;
    if (playing) {
      audio.currentTime = currentTime;
      const playPromise = audio.play();
      if (playPromise) playPromise.catch(() => {}); // Prevent unhandled promise
    } else {
      audio.pause();
    }
  }, [playing, audio, currentTime, audioReady]);

  /**
   * Registers a callback for when audio playback ends.
   * Calls the optional 'onEnd' prop when triggered.
   * Cleans up the event handler on unmount or when dependencies change.
   */
  useEffect(() => {
    if (!audio) return;
    const handleEnded = () => {
      if (onEnd) onEnd();
    };
    audio.onended = handleEnded;
    return () => {
      audio.onended = null;
    };
  }, [audio, onEnd]);

  /**
   * Keeps the parent component in sync with the audio element's current time.
   * Calls the optional 'onSeek' callback on time updates.
   * Cleans up the event handler on unmount or when dependencies change.
   */
  useEffect(() => {
    if (!audio) return;
    const update = () => {
      if (onSeek) onSeek(audio.currentTime);
    };
    audio.ontimeupdate = update;
    return () => {
      audio.ontimeupdate = null;
    };
  }, [audio, onSeek]);

  /**
   * Draws the real-time frequency bar visualization on the canvas.
   * Uses analyser node data to render bars and a progress indicator.
   * Scales drawing for device pixel ratio for sharpness.
   * Runs whenever audio, canvas size, colors, duration, or analyser changes.
   */
  useEffect(() => {
    if (!audio || !audioReady) return;
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
      // Draw a thin progress line indicating current playback position
      if (duration) {
        ctx.fillStyle = barPlayedColor;
        ctx.fillRect((audio.currentTime / duration) * canvasWidth * dpr, 0, 2 * dpr, height * dpr);
      }
      animationId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animationId);
  }, [audio, canvasWidth, height, barColor, barPlayedColor, duration, audioReady, analyserRef, dpr]);

  /**
   * Handles user clicks on the canvas to seek to a new playback position.
   * Calculates the seek time based on click position and updates audio.
   */
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!audio || !duration) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / canvasWidth;
    const seekTime = percent * duration;
    audio.currentTime = seekTime;
    if (onSeek) onSeek(seekTime);
  };

  // Render the responsive audio visualization canvas
  return (
    <div ref={containerRef} style={{ width: "100%" }}>
      <canvas
        ref={canvasRef}
        width={canvasWidth * dpr}
        height={height * dpr}
        style={{ width: "100%", height, display: "block", cursor: onSeek ? "pointer" : "default" }}
        onClick={handleCanvasClick}
      />
    </div>
  );
}
