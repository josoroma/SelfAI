"use client"

import { DEFAULT_TOPICS } from "./constants";
import { useConversationStore } from "@/store/conversation";

/**
 * TopicSelector
 * Renders a dropdown for selecting the current conversation topic.
 * Integrates with Zustand store for global topic state management.
 */
export default function TopicSelector() {
  // Current selected topic from global store
  const topic = useConversationStore((s) => s.topic);
  // Store action to change the topic
  const changeTopic = useConversationStore((s) => s.changeTopic);
  // List of available topics
  const topics = DEFAULT_TOPICS;

  return (
    <div className="py-2 flex gap-2 items-center">
      <span>Topic:</span>
      {/* Dropdown for selecting a topic. Updates global state on change. */}
      <select
        value={topic}
        onChange={e => changeTopic(e.target.value)}
        className="border border-gray-700 rounded p-2"
      >
        {topics.map(t => (
          <option key={t}>{t}</option>
        ))}
      </select>
    </div>
  );
}
