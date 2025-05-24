import { useState, useRef, useCallback, useEffect } from "react";
import { useConversationStore } from "@/store/conversation";
import { ChatMessage } from "../types";

export function useChatAudio() {
  const audioPosition = useConversationStore((s) => s.audioPosition);
  const setAudioPosition = useConversationStore((s) => s.setAudioPosition);

  const [audioBuffer, setAudioBuffer] = useState<ArrayBuffer | null>(null);
  const [playing, setPlaying] = useState(false);
  const [pendingPlay, setPendingPlay] = useState(false);

  const resetAudio = useCallback(() => {
    setPlaying(false);
    setAudioBuffer(null);
    setAudioPosition(0);
    setPendingPlay(false);
  }, [setAudioPosition]);

  const speakWithOpenAITTS = useCallback(async (text: string) => {
    const response = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });
    if (!response.ok) throw new Error("TTS request failed");
    const audioData = await response.arrayBuffer();
    setPlaying(false);      // Reset playing before loading new audio
    setAudioBuffer(audioData);
    setAudioPosition(0);    // Reset position for new audio
    setPendingPlay(true);   // Request playback after ready
  }, [setAudioPosition]);

  useEffect(() => {
    if (pendingPlay) {
      setPlaying(true);
      setPendingPlay(false);
    }
  }, [pendingPlay]);

  const handleWaveformReady = useCallback(() => {
    if (pendingPlay) {
      // No-op: useEffect will handle the delay and playback
    }
  }, [pendingPlay]);

  const handlePause = useCallback(() => {
    setPlaying(false);
    // Waveform will call setAudioPosition with the current position
  }, []);

  const handlePlay = useCallback(() => {
    setPlaying(true);
    // Waveform will resume from audioPosition
  }, []);

  // handleSend moved from ChatWindow
  const handleSend = useCallback(
    async (
      input: string,
      messages: ChatMessage[],
      topic: string,
      userPrefs: any,
      addMessage: (role: string, content: string) => void,
      setInput: (val: string) => void,
      setLoading: (val: boolean) => void
    ) => {
      if (!input.trim()) return;
      addMessage("user", input);
      setLoading(true);

      const res = await fetch("/api/conversation", {
        method: "POST",
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: input }],
          topic,
          userPrefs,
        }),
      });

      if (!res.body) throw new Error("No response body");
      const reader = res.body.getReader();
      let systemResponse = "";
      let isFirstChunk = true;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        systemResponse += new TextDecoder().decode(value);

        // On first chunk, add a new assistant message;
        // on subsequent chunks, update it.
        if (isFirstChunk) {
          addMessage("assistant", systemResponse);
          isFirstChunk = false;
        } else {
          // Update the last assistant message in the store
          useConversationStore.setState(state => {
            const updated = [...state.messages];
            // Find last assistant message
            for (let i = updated.length - 1; i >= 0; i--) {
              if (updated[i].role === "assistant") {
                updated[i] = { ...updated[i], content: systemResponse };
                break;
              }
            }
            return { messages: updated };
          });
        }
      }

      // TTS: Speak the completed system response
      await speakWithOpenAITTS(systemResponse);

      setInput("");
      setLoading(false);
      setPlaying(true);
    },
    [speakWithOpenAITTS]
  );

  return {
    audioBuffer,
    setAudioBuffer,
    playing,
    setPlaying,
    pendingPlay,
    setPendingPlay,
    audioPosition,
    setAudioPosition,
    handlePause,
    handlePlay,
    handleSend,
    resetAudio,
  };
}
