# 🧠 Prompt Guide for AI Tutor App (Next.js + OpenAI)
This document contains a collection of refined prompts designed for use with the Cursor AI Editor or similar AI code assistants. These prompts help automate and streamline common development tasks for a Next.js-based AI tutor app using tools like Zustand, Tailwind CSS, and OpenAI APIs.

## 📦 State Management

Migrate to Zustand or Jotai

Migrate all useState logic to either Jotai or Zustand for centralized state management. Choose the most suitable based on this app’s data flow. Avoid prop drilling by leveraging shared state where necessary.

## 🎨 Tailwind Styling

Apply Contrasting Text Color for Dark Mode

In Tailwind CSS, apply a text color that contrasts well with dark mode (e.g., use text-white for dark backgrounds and text-black for light). Adjust dynamically using dark: utilities.

## 🧾 Markdown + Text Rendering

Clean AI Response Output

The current response includes metadata and token details. Extract and display only the actual text content from the AI response. Strip objects like messageId, usage, and intermediate token fragments.

Support Markdown in AI Response

In this codebase, what is the best approach to render AI responses with Markdown formatting (e.g., paragraphs, lists, code blocks)? Identify required rendering libraries (e.g., react-markdown) and where to apply them in the tutor UI flow.

## 💬 Chat and Message Handling

Extract Last User Message

From the chatHistoryWithFeedback array, extract the most recent entry where role === "user" and return its content field as userPrompt.

## 🧠 AI + TTS Integration

Where to Trigger Text-to-Speech

In this codebase, where is the most logical place to pass the finalized systemResponse to the OpenAI text-to-speech (TTS) API? Consider timing and side effects (e.g., end of streaming, useEffect triggers, etc.).

## Add OpenAI TTS Playback Logic

Search the web and show how to import and use OpenAI's TTS (text-to-speech) API. 

Include the code integration specifically for the tutor chat window response playback.

## 🔐 Environment Setup

Setup Environment Variable for OpenAI

Add local environment configuration for Next.js to securely include OPENAI_API_KEY. Ensure .env.local is correctly loaded and accessible throughout the app.

## 🧹 Refactor for Reusability

Modularization, State, and Types

Refactor the code to improve reusability and structure:

Hooks Refactoring: Move reusable state/effects logic into custom hooks under a hooks/ folder. Suggest which state could be elevated to Zustand or Jotai.

Server Actions: Identify API/data calls to extract into actions.ts files to separate client/server logic cleanly.

Types: Extract prop and response types into a types.ts file in the same folder. Recommend clear, descriptive names for each.

Provide suggestions as structured bullet points per section.

## 🎧 Audio + Visualizer Logic

Move Chat Send to Audio Hook

Move the handleSend logic into the useChatAudio hook to consolidate side effects, state, and audio handling related to chat submission.

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

