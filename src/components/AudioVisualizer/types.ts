export interface AudioVisualizerProps {
  audioBuffer: ArrayBuffer | null;
  playing: boolean;
  currentTime: number;
  onSeek?: (time: number) => void;
  onEnd?: () => void;
  width?: number; // Ignored, now always 100%
  height?: number;
  barColor?: string;
  barPlayedColor?: string;
  showProgressBar?: boolean; // Optional: hide progress bar if false
  liveStream?: MediaStream; // Optional: live microphone stream for visualization
}
