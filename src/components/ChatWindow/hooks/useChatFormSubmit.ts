import { UseFormSetValue } from "react-hook-form";
import { useState } from "react";

interface UseChatFormSubmitOptions {
  handleSend: Function;
  messages: any[];
  topic: string;
  userPrefs: any;
  addMessage: (role: string, content: string) => void;
  setValue: UseFormSetValue<{ input: string }>;
}

export function useChatFormSubmit({
  handleSend,
  messages,
  topic,
  userPrefs,
  addMessage,
  setValue,
}: UseChatFormSubmitOptions) {
  const [loading, setLoading] = useState(false);
  const onSubmit = ({ input }: { input: string }) => {
    handleSend(
      input,
      messages,
      topic,
      userPrefs,
      addMessage,
      (val: string) => setValue("input", val),
      setLoading
    );
  };
  return { onSubmit, loading };
} 