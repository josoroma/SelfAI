import { useEffect, useRef, useState } from "react";

/**
 * useLiveAnalyser
 * Sets up an AudioContext and AnalyserNode for a live MediaStream (e.g., microphone).
 * Returns a ref to the analyser and a boolean indicating readiness.
 */
export function useLiveAnalyser(stream: MediaStream) {
  const analyserRef = useRef<AnalyserNode | null>(null);
  const [audioReady, setAudioReady] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  useEffect(() => {
    if (!stream) {
      setAudioReady(false);
      return;
    }
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 4 * 64;
    const source = ctx.createMediaStreamSource(stream);
    source.connect(analyser);
    analyserRef.current = analyser;
    audioContextRef.current = ctx;
    sourceRef.current = source;
    setAudioReady(true);
    return () => {
      source.disconnect();
      analyser.disconnect();
      ctx.close();
      analyserRef.current = null;
      audioContextRef.current = null;
      sourceRef.current = null;
      setAudioReady(false);
    };
  }, [stream]);

  return { analyserRef, audioReady };
} 