# SelfAI – Smart & Helpful AI Tutor

SelfAI is an interactive AI-powered tutor designed to help users learn and practice languages or topics in a conversational, engaging, and psychologically supportive way. Built with Next.js, React 19, Zustand, Tailwind CSS, and OpenAI APIs, SelfAI combines chat, audio, and visual feedback to create a modern, responsive, and delightful learning experience.

## 🚀 Product Vision
SelfAI aims to be your always-available, endlessly patient tutor. It adapts to your needs, keeps you motivated, and provides concise, friendly, and helpful feedback. The app leverages the latest AI and UX best practices to foster a psychologically safe and effective learning environment.

## ✨ Features
- **Conversational AI Tutor:** Chat with an AI that responds in a friendly, concise, and helpful manner, always asking relevant follow-up questions.
- **Topic Selection:** Choose learning topics to focus your sessions.
- **Markdown Rendering:** AI responses support markdown for clear formatting of examples, lists, and code.
- **Audio Playback & TTS:** Listen to AI responses with integrated text-to-speech (TTS) powered by OpenAI.
- **Custom Audio Visualizer:** Real-time, interactive audio frequency bars visualize playback and progress.
- **Reactivity:** Instant feedback, auto-updating UI, and seamless chat flow.
- **Stateful Experience:** Uses Zustand for global state, ensuring smooth topic and preference management.
- **Dark Mode & Accessibility:** Modern, accessible design with dynamic dark mode support.

## 🧠 Tutor Psychology & UX Principles
- **Supportive & Encouraging:** The AI always maintains a positive, respectful tone, encouraging continued conversation and learning.
- **Short, Clear, Precise:** Responses are concise to avoid cognitive overload.
- **Conversational Flow:** The tutor always asks a single, relevant follow-up to keep you engaged.
- **Safe Space:** The app is designed to be non-judgmental, adaptive, and patient, reducing anxiety and promoting confidence.
- **Visual & Auditory Feedback:** The audio visualizer and TTS make learning multi-sensory, catering to different learning styles.

## 🖥️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd ai-self
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Configure environment variables:**
   - Create a `.env.local` file in the root directory.
   - Add your OpenAI API key:
     ```env
     OPENAI_API_KEY=your-openai-api-key-here
     ```

## ▶️ Running the App

Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to use SelfAI.

## 📝 How It Works
- Select a topic and start chatting with the AI tutor.
- The AI responds with markdown-formatted answers, always asking a follow-up question.
- Listen to responses with TTS and watch the real-time audio visualizer.
- Change topics or language preferences at any time for a personalized experience.

## 🛠️ Tech Stack
- **Next.js 15**
- **React 19**
- **Zustand** (state management)
- **Tailwind CSS** (styling)
- **OpenAI API** (chat & TTS)
- **react-markdown** (markdown rendering)
- **Custom Audio Visualizer**

## 🤝 Contributing
Pull requests and issues are welcome! Please open an issue to discuss your ideas or report bugs.

---

*SelfAI – Your smart, supportive, and endlessly patient AI tutor.*
