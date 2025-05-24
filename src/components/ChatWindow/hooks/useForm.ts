import { useForm as useReactHookForm } from "react-hook-form";

export function useForm() {
  return useReactHookForm<{ input: string }>({
    defaultValues: { input: "" }
  });
} 