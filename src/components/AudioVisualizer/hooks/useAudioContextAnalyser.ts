import { useEffect, useRef } from "react";

/**
 * React hook to create and manage an AudioContext analyser for a given HTMLAudioElement.
 * @param audio - The HTMLAudioElement to analyse.
 * @param audioReady - Boolean indicating if the audio is ready for analysis.
 * @returns { analyserRef }
 */
export function useAudioContextAnalyser(audio: HTMLAudioElement | null, audioReady: boolean) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  useEffect(() => {
    if (!audio || !audioReady) return;
    if (audioContextRef.current) {
      if (audioContextRef.current.state !== "closed") {
        audioContextRef.current.close();
      }
      audioContextRef.current = null;
    }
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 4 * 64;
    const source = ctx.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(ctx.destination);
    audioContextRef.current = ctx;
    analyserRef.current = analyser;
    sourceRef.current = source;
    return () => {
      source.disconnect();
      analyser.disconnect();
      if (ctx.state !== "closed") {
        ctx.close();
      }
    };
  }, [audio, audioReady]);

  return { analyserRef };
} 