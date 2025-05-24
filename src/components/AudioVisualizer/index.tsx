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
import { useLiveAnalyser } from "./hooks/useLiveAnalyser";

/**
 * AudioVisualizer
 * Renders a real-time audio frequency bar visualization for a given audio buffer.
 * Handles audio playback, seeking, and progress indication.
 *
 * Props:
 *   - audioBuffer: The audio data to visualize (ArrayBuffer).
 *   - playing: Whether playback is active (boolean).
 *   - currentTime: Current playback position in seconds (number).
 *   - onSeek: Optional callback for seeking to a new time (function).
 *   - onEnd: Optional callback when playback ends (function).
 *   - height: Height of the visualization (number, optional).
 *   - barColor: Color of the bars (string, optional).
 *   - barPlayedColor: Color of the played bar (string, optional).
 *   - showProgressBar: Whether to show the progress bar (boolean, optional).
 *   - liveStream: Optional live stream data (any, optional).
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
  showProgressBar = true,
  liveStream,
}: AudioVisualizerProps) {
  // Ref to the canvas element for drawing the visualization
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Ref to the container div for responsive sizing
  const containerRef = useRef<HTMLDivElement>(null);

  // Get container width and device pixel ratio for sharp rendering
  const { width: canvasWidth, dpr } = useContainerWidth(containerRef as React.RefObject<HTMLElement>);

  // If liveStream is provided, use live analyser, else use audioBuffer logic
  let analyserRef, audioReady, duration, audio;
  if (liveStream) {
    ({ analyserRef, audioReady } = useLiveAnalyser(liveStream));
    duration = 0;
    audio = null;
  } else {
    // Manage audio element and playback state from the provided audio buffer
    ({ audio, duration, audioReady } = useAudioElement(audioBuffer));
    // Set up audio context and analyser for frequency data
    ({ analyserRef } = useAudioContextAnalyser(audio, audioReady));
    // Sync playback state and current time with the audio element
    useAudioPlaybackSync(audio, audioReady, playing, currentTime);
    // Register a callback for when audio playback ends
    useAudioEndHandler(audio, onEnd);
    // Keep the parent component in sync with the audio element's current time
    useAudioTimeUpdate(audio, onSeek);
  }

  // Draw the real-time frequency bar visualization on the canvas
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
    dpr,
    showProgressBar
  );

  // Returns a click handler for seeking in the audio when the canvas is clicked
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
