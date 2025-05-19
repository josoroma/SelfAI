export interface WaveformProps {
  audioBuffer: ArrayBuffer;
  playing: boolean;
  onReady?: () => void;
  audioPosition: number;
  setAudioPosition: (pos: number) => void;
}
