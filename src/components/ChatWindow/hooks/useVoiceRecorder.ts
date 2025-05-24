import { useRef, useState } from "react";

interface UseVoiceRecorderOptions {
  onTranscribed: (text: string) => void;
  energyThreshold?: number; // Optional: allow custom threshold
}

export function useVoiceRecorder({ onTranscribed, energyThreshold = 0.01 }: UseVoiceRecorderOptions) {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Utility: Analyze audio energy
  const checkAudioEnergy = async (audioBlob: Blob): Promise<boolean> => {
    const arrayBuffer = await audioBlob.arrayBuffer();
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    const data = audioBuffer.getChannelData(0);
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      sum += data[i] * data[i];
    }
    const rms = Math.sqrt(sum / data.length);
    audioCtx.close();
    return rms > energyThreshold;
  };

  // Start recording audio from the user's microphone
  const startRecording = async () => {
    if (isRecording) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        // Check energy/volume before sending to transcription
        const hasSpeech = await checkAudioEnergy(audioBlob);
        if (!hasSpeech) {
          onTranscribed(""); // No speech detected
          return;
        }
        // Send audio to /api/transcribe
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.webm');
        try {
          const res = await fetch('/api/transcribe', {
            method: 'POST',
            body: formData
          });
          if (!res.ok) throw new Error('Transcription failed');
          const text = await res.text();
          onTranscribed(text);
        } catch (err) {
          onTranscribed('');
        }
      };
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      setIsRecording(false);
      onTranscribed('');
    }
  };

  // Stop recording and trigger transcription
  const stopRecordingAndTranscribe = () => {
    if (!isRecording || !mediaRecorderRef.current) return;
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  return {
    isRecording,
    startRecording,
    stopRecordingAndTranscribe
  };
} 