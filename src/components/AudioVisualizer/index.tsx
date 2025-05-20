import React, { useRef } from "react";
import { AudioVisualizerProps } from "./types";
import { DEFAULT_HEIGHT, DEFAULT_BAR_COLOR, DEFAULT_BAR_PLAYED_COLOR } from "./constants";
import { useContainerWidth } from "./hooks/useContainerWidth";
import { useAudioElement } from "./hooks/useAudioElement";
import { useAudioContextAnalyser } from "./hooks/useAudioContextAnalyser";
import { useAudioPlaybackSync } from "./hooks/useAudioPlaybackSync";
import { useAudioEndHandler } from "./hooks/useAudioEndHandler";
import { useAudioTimeUpdate } from "./hooks/useAudioTimeUpdate";
import { useAudioVisualizerDraw } from "./hooks/useAudioVisualizerDraw";
import { useCanvasSeekHandler } from "./hooks/useCanvasSeekHandler";

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

  useAudioPlaybackSync(audio, audioReady, playing, currentTime);
  useAudioEndHandler(audio, onEnd);
  useAudioTimeUpdate(audio, onSeek);
  useAudioVisualizerDraw(
    audio,
    audioReady,
    analyserRef as React.RefObject<AnalyserNode>,
    canvasRef as React.RefObject<HTMLCanvasElement>,
    canvasWidth,
    height,
    barColor,
    barPlayedColor,
    duration,
    dpr
  );
  const handleCanvasClick = useCanvasSeekHandler(
    audio,
    duration,
    canvasRef as React.RefObject<HTMLCanvasElement>,
    canvasWidth,
    onSeek
  );

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
