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
import { useChatRecorder } from "./hooks/useChatRecorder";
import { useChatFormSubmit } from "./hooks/useChatFormSubmit";
import { useForm } from "./hooks/useForm";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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

  // Chat input schema
  const formSchema = z.object({
    input: z.string().min(1, "Message cannot be empty"),
  });

  // React Hook Form for chat input
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { input: "" },
  });
  const { handleSubmit, setValue, control } = form;

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

  // Voice recorder hook for speech-to-text (now via useChatRecorder)
  const {
    isRecording,
    transcribing,
    stream,
    startRecording,
    stopRecordingAndTranscribe
  } = useChatRecorder({
    resetAudio,
    onTranscribed: (text: string) => setValue("input", text)
  });

  // Form submit handler (now via useChatFormSubmit)
  const { onSubmit, loading } = useChatFormSubmit({
    handleSend,
    messages,
    topic,
    userPrefs,
    addMessage,
    setValue,
  });

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
              <Button
                type="button"
                aria-label="Pause audio"
                variant="outline"
                onClick={handlePause}
                className="mr-1"
              >
                <FaPause />
              </Button>
            ) : (
              <Button
                type="button"
                aria-label="Play audio"
                variant="outline"
                onClick={handlePlay}
                className="mr-1"
              >
                <FaPlay />
              </Button>
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
        <Button
          type="button"
          aria-label={isRecording ? "Stop recording" : "Start recording"}
          variant={isRecording ? "destructive" : "outline"}
          style={isRecording ? { color: 'red' } : {}}
          onClick={isRecording ? stopRecordingAndTranscribe : startRecording}
          disabled={loading || transcribing}
        >
          {(transcribing || loading) ? <ImSpinner2 className="animate-spin" /> : isRecording ? <FaStop /> : <FaMicrophone />}
        </Button>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex">
            <FormField
              control={control}
              name="input"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={loading || transcribing}
                      placeholder={INPUT_PLACEHOLDER}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={loading || transcribing}
            >
              {(loading || transcribing) ? <ImSpinner2 className="animate-spin" /> : "Send"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
