"use client"

import { DEFAULT_TOPICS } from "./constants";
import { useConversationStore } from "@/store/conversation";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

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
      <Select value={topic} onValueChange={changeTopic}>
        <SelectTrigger className="min-w-[140px]">
          <SelectValue placeholder="Select a topic" />
        </SelectTrigger>
        <SelectContent>
          {topics.map(t => (
            <SelectItem key={t} value={t}>{t}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
