import ChatWindow from "@/components/ChatWindow";

export default function Home() {
  return (
    <main className="h-screen bg-dark">
      <h1 className="text-3xl font-bold text-center py-6">SelfAI</h1>
      <ChatWindow />
    </main>
  );
}
