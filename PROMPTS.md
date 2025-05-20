# 🧠 Prompt Guide for AI Tutor App (Next.js + OpenAI)

This document contains a collection of refined prompts designed for use with the Cursor AI Editor or similar AI code assistants. These prompts help automate and streamline common development tasks.

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

