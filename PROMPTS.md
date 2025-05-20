# 🧠 Prompt Guide for AI Tutor App (Next.js + OpenAI)

This document contains a collection of refined prompts designed for use with the Cursor AI Editor or similar AI code assistants. These prompts help automate and streamline common development tasks.

## To Build the Initial App Codebase

```
Build an interactive, psychologically supportive AI tutor web app with the following features and architecture:

## 1. Core Features

- **Conversational AI Tutor:**
  - Chat interface where users interact with an AI that responds in a friendly, concise, and helpful manner.
  - The AI always asks a single, relevant follow-up question to maintain engagement.
  - Responses support markdown formatting for clarity (examples, lists, code, etc.).

- **Topic Selection:**
  - Users can select or change learning topics at any time.
  - The AI adapts its responses and follow-up questions to the selected topic.

- **Audio Playback & TTS:**
  - AI responses are available as audio using text-to-speech (TTS) powered by OpenAI.
  - Users can play, pause, and seek within the audio response.

- **Custom Audio Visualizer:**
  - Real-time, interactive frequency bar visualization synchronized with audio playback.
  - Visual feedback is sharp, responsive, and accessible.

- **Stateful Experience:**
  - Use a global state manager (like Zustand) to handle messages, topics, user preferences, and audio playback position.

- **Modern UI/UX:**
  - Responsive, accessible design with dark mode support.
  - Encouraging, non-judgmental, and psychologically safe user experience.

---

## 2. AI Prompt Engineering

- **System Prompt Template:**
  - The AI is always supportive, concise, and keeps the conversation going.
  - It adapts to the user's native and target language, and the current topic.
  - It follows these rules:
    - If the user asks a question about the current topic, answer and ask a related follow-up.
    - If the user asks about a different topic, answer and gently steer the conversation or ask about the new topic.
    - If the user answers the AI's question, acknowledge and ask a new, relevant follow-up.
    - If the user sends an unrelated thought, respond supportively and ask a question that keeps the conversation flowing.
    - Always prepend a heading indicating the type of exchange (e.g., "Related Question:", "Unrelated Thought:").
    - Use markdown for formatting.
    - Keep responses short, clear, and precise.

- **Example System Prompt:**
  `
  You are an interactive AI tutor.

  - Native Language: {userPrefs.nativeLanguage}
  - Target Language: {userPrefs.targetLanguage}
  - Current Topic: {topic}
  - User Prompt: {userPrompt}

  General Guidelines:
  - Always respond in a friendly, concise, and helpful manner.
  - Keep answers short, clear, and precise. Avoid unnecessary details or filler.
  - Always ask just one relevant follow-up question to maintain a natural conversational flow.
  - Maintain respect and encourage conversation, even if the user changes topics.

  [Behavior logic for different user input types, as described above.]
  `

---

## 3. Architecture & Stack

- **Frontend:**
  - Next.js (React 19+), TypeScript, Tailwind CSS for styling.
  - Component-based structure: ChatWindow, MessageBubble, TopicSelector, AudioVisualizer, Waveform, etc.
  - Custom hooks for all side effects and UI logic (audio, visualization, chat, etc.).

- **State Management:**
  - Zustand for global state (messages, topics, user preferences, audio position).

- **Backend/API:**
  - Endpoints for OpenAI chat and TTS (text-to-speech) integration.

- **Accessibility & UX:**
  - Keyboard navigation, ARIA labels, and accessible color schemes.
  - Encouraging, psychologically safe feedback in all AI responses.

---

## 4. Key Implementation Details

- **AudioVisualizer:**
  - Uses custom hooks for container width, audio element management, audio context/analyser, and drawing.
  - All side effects and event logic are encapsulated in hooks for maintainability.

- **ChatWindow:**
  - Integrates topic selection, message display, audio controls, and input.
  - Uses a custom hook for managing TTS and audio playback state.

- **Global Store:**
  - Manages messages, topics, user preferences, and audio playback position.
  - Provides actions for updating state and resetting on topic change.

---

### Instructions for the AI:

- Generate a full-stack, production-ready AI tutor app as described above.
- Use modular, well-documented code with clear separation of concerns.
- Ensure all AI prompts and user interactions follow the psychological and UX principles outlined.
- Include markdown rendering, audio playback with visualization, and a modern, accessible UI.
- Provide clear, concise comments and documentation throughout the codebase.
```

## To Create a New Feature

```
Conduct a detailed analysis of the current codebase to plan the careful creation of a new feature: [New Feature].

Instructions:

- Systematically explore relevant parts of the codebase.
- Identify all modules, components, or files that will be impacted or should be extended.
- Highlight dependencies, potential risks, and integration points.
- Suggest a step-by-step implementation plan.
- Flag any unclear requirements or open questions for clarification.
- Output should be a clear, actionable plan ready for review before coding begins.
```

## To Extend an Existing Feature

```
Conduct a detailed analysis of all the current and nested folders files to plan the careful extension of the existing feature: [Feature].

Instructions:

- Map out the current implementation of [Feature] in the codebase.
- Identify all relevant files, modules, and integration points.
- Analyze dependencies and potential side effects.
- Propose a step-by-step extension plan, specifying:
    - Which parts should be modified, extended, or refactored
    - Any new components required
    - Testing and validation steps to ensure stability
- Flag any ambiguous aspects or requirements needing clarification.
- Output should be a comprehensive, actionable plan ready for engineering review.
```

## Build Custom Visualizer

Analyze how the LiveAudioVisualizer works in this repo. Use the findings to create a custom in-app audio visualizer that replaces waveform.js and wavesurf, and syncs with your internal audio player.

## React 19 Compatibility

Ensure the code is fully compatible with React 19.

Confirm that all used APIs, hooks, and external packages align with React 19’s latest features and conventions.

## Auto-Play Audio and Visual Bars

Ensure that audio playback autoplays as soon as TTS audio is available. Visual bars must react to the audio dynamically, reflecting live waveform changes.

## Delay UI Until Audio is Ready

Audio and visualizer should not autoplay or render until the TTS audio is ready. Once the audio is available, play it once without looping, and only then show visual playback components.

## Prevent AudioContext Error

Fix runtime error on repeated runs:

Error: Cannot close a closed AudioContext.
Ensure AudioContext is checked before closing or creating a new instance only if needed.

## Hide UI Until Ready

Hide all play/pause buttons and visualizer UI while awaiting a text or audio response. Only display audio-related controls once the TTS data has been received.

Sync Audio Duration With Visualizer

Fix sync issues: The visual playback color and animation must align precisely with the actual audio duration. Ensure progress bars and visualizer logic reflect accurate time progression.

