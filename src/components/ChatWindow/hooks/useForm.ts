import { useForm as useReactHookForm, UseFormProps, UseFormReturn } from "react-hook-form";

export function useForm(options?: UseFormProps<{ input: string }>): UseFormReturn<{ input: string }> {
  return useReactHookForm<{ input: string }>(options);
} 