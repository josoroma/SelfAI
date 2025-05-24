"use client"

import ReactMarkdown from "react-markdown";
import { MessageBubbleProps } from "./types";
import { ASSISTANT_BG, USER_BG, BUBBLE_CLASS, OUTER_CLASS, INNER_CLASS } from "./constants";

/**
 * MessageBubble
 * Displays a single chat message with role-based styling.
 * Props:
 *   - role: The sender of the message (e.g., 'assistant' or 'user').
 *   - content: The message text, rendered as Markdown.
 */
export default function MessageBubble({ role, content }: MessageBubbleProps) {
  return (
    <div
      className={`${OUTER_CLASS} ${role === "user" ? "justify-end flex-row-reverse" : "justify-start flex-row"}`}
      aria-label={role === "assistant" ? "Assistant message" : "User message"}
    >
      {/* Bubble with dynamic background based on role */}
      <span className={`${BUBBLE_CLASS} ${role === "assistant" ? ASSISTANT_BG : USER_BG}`}>
        <div className={INNER_CLASS}>
          {/* Render message content as Markdown */}
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </span>
    </div>
  );
}
