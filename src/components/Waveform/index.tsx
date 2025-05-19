import React, { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";
import { WaveformProps } from "./types";
import { WAVE_COLOR, PROGRESS_COLOR, WAVEFORM_HEIGHT, CURSOR_WIDTH } from "./constants";

/**
 * Waveform
 * Renders an interactive audio waveform using WaveSurfer.js.
 * Props:
 *   - audioBuffer: The audio data to visualize.
 *   - playing: Whether playback is active.
 *   - onReady: Optional callback when waveform is ready.
 *   - audioPosition: Current playback position (seconds).
 *   - setAudioPosition: Callback to update playback position.
 */
export default function Waveform({ audioBuffer, playing, onReady, audioPosition, setAudioPosition }: WaveformProps) {
  // Ref to the waveform container div
  const containerRef = useRef<HTMLDivElement>(null);
  // Ref to the WaveSurfer instance
  const waveSurferRef = useRef<WaveSurfer | null>(null);
  // Tracks whether playback is currently active
  const isPlayingRef = useRef(false);

  /**
   * Initializes WaveSurfer when audioBuffer or container changes.
   * Cleans up the instance on unmount or when dependencies change.
   * Registers event listeners for ready and finish events.
   */
  useEffect(() => {
    if (!audioBuffer || !containerRef.current) return;

    // Destroy any previous WaveSurfer instance
    if (waveSurferRef.current) {
      waveSurferRef.current.destroy();
    }

    // Create a new WaveSurfer instance
    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: WAVE_COLOR,
      progressColor: PROGRESS_COLOR,
      height: WAVEFORM_HEIGHT,
      interact: false,
      cursorWidth: CURSOR_WIDTH,
    });

    // Load the audio buffer as a Blob
    ws.loadBlob(new Blob([audioBuffer], { type: "audio/mpeg" }));
    waveSurferRef.current = ws;
    isPlayingRef.current = false;

    // Notify parent when waveform is ready
    ws.on("ready", () => {
      if (onReady) onReady();
    });

    // Reset playing state when playback finishes
    ws.on("finish", () => {
      isPlayingRef.current = false;
    });

    // Cleanup on unmount or when dependencies change
    return () => {
      ws.destroy();
    };
  }, [audioBuffer, onReady]);

  /**
   * Controls playback and seeking based on props.
   * - Starts playback and seeks to audioPosition when 'playing' becomes true.
   * - Pauses playback and updates position when 'playing' becomes false.
   */
  useEffect(() => {
    const ws = waveSurferRef.current;
    if (!ws) return;
    if (playing && !isPlayingRef.current) {
      ws.seekTo(audioPosition / (ws.getDuration() || 1));
      ws.play();
      isPlayingRef.current = true;
    } else if (!playing && isPlayingRef.current) {
      ws.pause();
      isPlayingRef.current = false;
      setAudioPosition(ws.getCurrentTime());
    }
  }, [playing, audioPosition, setAudioPosition]);

  // Render the waveform container
  return <div ref={containerRef} />;
}
