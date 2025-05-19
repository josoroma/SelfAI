# 🧠 Prompt Guide for AI Tutor App (Next.js + OpenAI)

This document contains a collection of refined prompts designed for use with the Cursor AI Editor or similar AI code assistants. These prompts help automate and streamline common development tasks for a Next.js-based AI tutor app using tools like Zustand, Tailwind CSS, and OpenAI APIs.

## You are a senior AI engineer and Next.js expert

Your task is to plan and generate the full structure and key implementation pieces of a modern web app.

## Objective
Create a fully functional **AI Tutor Chat App** using:

- The **latest version of Next.js with the App Router architecture** (including layouts, templates, loading states, and server actions)
- The **latest version of the Vercel AI SDK**
- The **latest version of `@ai-sdk/openai`**
- TypeScript and modern coding conventions
- Tailwind CSS for styling (optional but preferred)

The app should allow:

- A user to **select a topic** (e.g., "Kubernetes", "French", "Algebra")
- A user to send a **chat message** (e.g., a question)
- The AI Tutor to respond in a **fluid, adaptive, friendly way** using streaming responses
- Topic memory to persist across messages during a session

## Persistent Documentation Awareness

You **must** keep the following directive in mind for the duration of this task:

- Always check and use the **most recent official documentation** for:
    - `next.js` App Router
    - `vercel/ai` SDK
    - `@ai-sdk/openai`

Apply this **automatically** when:
- Planning the directory structure or routing
- Using server actions or edge functions
- Instantiating AI models and streaming logic
- Selecting package versions and writing imports
- Handling context/session/topic state

## Output expectations

1. **Project Plan**:
   - Key features, folder structure (`app/`, `components/`, `lib/`, etc.)
   - State and memory management strategy (for topic and user chat)
   - Data flow and component interaction (client/server split)

2. **Installation Instructions**:
   - With all correct package versions based on latest stable docs

3. **Sample Code**:
   - `app/page.tsx` with the main chat UI
   - `lib/ai.ts` for model initialization
   - A `route.ts` or `action.ts` server handler using `@ai-sdk/openai`
   - `components/ChatBubble.tsx` or similar for chat display

4. **Explain**:
   - Why specific decisions were made (e.g., using `StreamingTextResponse`, edge runtime, etc.)
   - Any notable recent changes in docs or APIs

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

