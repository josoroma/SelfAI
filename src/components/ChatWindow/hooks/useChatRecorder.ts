import { useVoiceRecorder } from "./useVoiceRecorder";

interface UseChatRecorderOptions {
  resetAudio: () => void;
  onTranscribed: (text: string) => void;
  energyThreshold?: number;
}

export function useChatRecorder({ resetAudio, onTranscribed, energyThreshold }: UseChatRecorderOptions) {
  const {
    isRecording,
    transcribing,
    stream,
    startRecording: _startRecording,
    stopRecordingAndTranscribe
  } = useVoiceRecorder({ onTranscribed, energyThreshold });

  // Wrap startRecording to also reset audio
  const startRecording = () => {
    resetAudio();
    _startRecording();
  };

  return {
    isRecording,
    transcribing,
    stream,
    startRecording,
    stopRecordingAndTranscribe
  };
} 