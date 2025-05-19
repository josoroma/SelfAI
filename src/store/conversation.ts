import { DEFAULT_TOPICS } from "@/components/TopicSelector/constants";
import { DEFAULT_NATIVE_LANGUAGE, DEFAULT_TARGET_LANGUAGE } from "@/constants";
import { create } from "zustand";

// Message type representing a single chat message
export type Message = { role: string; content: string };
// User preferences for language settings
export type UserPrefs = { nativeLanguage: string; targetLanguage: string };

/**
 * Zustand store for managing the state of the conversation/chat session.
 * Includes messages, topic, user preferences, and audio playback position.
 */
interface ConversationState {
  // List of all chat messages in the current session
  messages: Message[];
  // The currently selected topic
  topic: string;
  // User language preferences
  userPrefs: UserPrefs;
  // Current audio playback position (in seconds)
  audioPosition: number;
  // Setters and actions for updating state
  setAudioPosition: (pos: number) => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (role: string, content: string) => void;
  setTopic: (topic: string) => void;
  changeTopic: (topic: string) => void;
  setUserPrefs: (prefs: UserPrefs) => void;
}

/**
 * useConversationStore
 * Zustand store for global chat/conversation state.
 * Provides actions for updating messages, topic, user preferences, and audio position.
 */
export const useConversationStore = create<ConversationState>((set) => ({
  messages: [],
  topic: DEFAULT_TOPICS[0],
  userPrefs: { nativeLanguage: DEFAULT_NATIVE_LANGUAGE, targetLanguage: DEFAULT_TARGET_LANGUAGE },
  audioPosition: 0,
  // Update the current audio playback position
  setAudioPosition: (pos) => set({ audioPosition: pos }),
  // Replace the entire message list
  setMessages: (messages) => set({ messages }),
  // Add a new message to the conversation
  addMessage: (role, content) =>
    set((state) => ({ messages: [...state.messages, { role, content }] })),
  // Set the current topic
  setTopic: (topic) => set({ topic }),
  // Change topic and reset messages
  changeTopic: (topic) => set({ topic, messages: [] }),
  // Update user language preferences
  setUserPrefs: (userPrefs) => set({ userPrefs }),
}));
