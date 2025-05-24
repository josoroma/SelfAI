import { useRef, useState } from "react";

interface UseVoiceRecorderOptions {
  onTranscribed: (text: string) => void;
}

export function useVoiceRecorder({ onTranscribed }: UseVoiceRecorderOptions) {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

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