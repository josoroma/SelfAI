import { useEffect, useRef, useState, RefObject } from "react";

export function useContainerWidth<T extends HTMLElement>(ref: RefObject<T>) {
  const [width, setWidth] = useState(500);
  const [dpr, setDpr] = useState(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1);
  useEffect(() => {
    const update = () => {
      if (ref.current) setWidth(ref.current.offsetWidth);
      setDpr(window.devicePixelRatio || 1);
    };
    update();
    const ro = new window.ResizeObserver(update);
    if (ref.current) ro.observe(ref.current);
    window.addEventListener('resize', update);
    window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`).addEventListener('change', update);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', update);
      window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`).removeEventListener('change', update);
    };
  }, [ref]);
  return { width, dpr };
}

export function useAudioElement(audioBuffer: ArrayBuffer | null) {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [duration, setDuration] = useState(0);
  const [audioReady, setAudioReady] = useState(false);
  const audioUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (!audioBuffer) return;
    if (audio) {
      audio.pause();
      setAudio(null);
    }
    setAudioReady(false);
    const blob = new Blob([audioBuffer], { type: "audio/mpeg" });
    const url = URL.createObjectURL(blob);
    audioUrlRef.current = url;
    const audioEl = new Audio(url);
    setAudio(audioEl);
    audioEl.onloadedmetadata = () => {
      setDuration(audioEl.duration);
      setAudioReady(true);
    };
    return () => {
      audioEl.pause();
      if (audioUrlRef.current === url) {
        setTimeout(() => {
          URL.revokeObjectURL(url);
          audioUrlRef.current = null;
        }, 100);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioBuffer]);

  return { audio, duration, audioReady };
}

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