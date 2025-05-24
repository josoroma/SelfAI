"use client"

import { useState } from "react";
import { useConversationStore } from "@/store/conversation";
import MessageBubble from "../MessageBubble";
import TopicSelector from "../TopicSelector";
import AudioVisualizer from "../AudioVisualizer";
import { FaPlay, FaPause, FaMicrophone, FaStop } from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";
import { ChatMessage } from "./types";

import { BUTTON_CLASS, INPUT_PLACEHOLDER, CONTAINER_CLASS } from "./constants";
import { useChatAudio } from "./hooks/useChatAudio";
import { useVoiceRecorder } from "./hooks/useVoiceRecorder";

/**
 * ChatWindow
 * Main chat interface for displaying messages, topic selection, and audio playback controls.
 * Integrates with Zustand for conversation state and uses custom audio hooks for TTS playback.
 */
export default function ChatWindow() {
  // Retrieve messages and actions from the global conversation store
  const messages = useConversationStore((s) => s.messages) as ChatMessage[];
  const addMessage = useConversationStore((s) => s.addMessage);
  const topic = useConversationStore((s) => s.topic);
  const userPrefs = useConversationStore((s) => s.userPrefs);

  // Local state for chat input and loading status
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Custom hook for managing audio playback and TTS
  const {
    audioBuffer,
    playing,
    audioPosition,
    setAudioPosition,
    handlePause,
    handlePlay,
    handleSend,
    resetAudio,
  } = useChatAudio();

  // Voice recorder hook for speech-to-text
  const {
    isRecording,
    transcribing,
    stream,
    startRecording: _startRecording,
    stopRecordingAndTranscribe
  } = useVoiceRecorder({
    onTranscribed: (text: string) => setInput(text)
  });

  // Wrap startRecording to also reset audio
  const startRecording = () => {
    resetAudio();
    _startRecording();
  };

  return (
    <div className={CONTAINER_CLASS}>
      {/* Topic selection dropdown */}
      <TopicSelector />
      {/* Message list */}
      <div className="flex-1 overflow-y-auto py-4">
        {messages.map((msg, i) => (
          <MessageBubble key={i} role={msg.role} content={msg.content} />
        ))}
      </div>
      {/* Audio playback controls and visualizer */}
      {audioBuffer && !loading && !isRecording && (
        <div className="flex items-center gap-2 mb-2">
          <div>
            {playing ? (
              <button
                aria-label="Pause audio"
                className={BUTTON_CLASS}
                onClick={handlePause}
              >
                <FaPause />
              </button>
            ) : (
              <button
                aria-label="Play audio"
                className={BUTTON_CLASS}
                onClick={handlePlay}
              >
                <FaPlay />
              </button>
            )}
          </div>
          <div className="flex-1">
            <AudioVisualizer
              audioBuffer={audioBuffer}
              playing={playing}
              currentTime={audioPosition}
              onSeek={setAudioPosition}
              onEnd={handlePause}
            />
          </div>
        </div>
      )}
      {/* Live audio visualizer during recording */}
      {isRecording && stream && (
        <div className="mb-2">
          <AudioVisualizer
            audioBuffer={null}
            playing={true}
            currentTime={0}
            showProgressBar={false}
            // @ts-ignore
            liveStream={stream}
          />
        </div>
      )}
      {/* Input area for sending new messages */}
      <div className="flex p-2 gap-2 border-t">
        {/* Voice record button - now on the left */}
        <button
          className={BUTTON_CLASS}
          type="button"
          aria-label={isRecording ? "Stop recording" : "Start recording"}
          style={isRecording ? { color: 'red' } : {}}
          onClick={isRecording ? stopRecordingAndTranscribe : startRecording}
          disabled={loading || transcribing}
        >
          {(transcribing || loading) ? <ImSpinner2 className="animate-spin" /> : isRecording ? <FaStop /> : <FaMicrophone />}
        </button>
        <input
          className="flex-1 border rounded px-3 py-2"
          value={input}
          disabled={loading || transcribing}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend(input, messages, topic, userPrefs, addMessage, setInput, setLoading)}
          placeholder={INPUT_PLACEHOLDER}
        />
        <button
          className={BUTTON_CLASS}
          onClick={() => handleSend(input, messages, topic, userPrefs, addMessage, setInput, setLoading)}
          disabled={loading || transcribing}
        >
          {(loading || transcribing) ? <ImSpinner2 className="animate-spin" /> : "Send"}
        </button>
      </div>
    </div>
  );
}
