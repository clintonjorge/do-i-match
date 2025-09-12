import { AIChatInput } from "@/components/ui/ai-chat-input";
import type { JobDiscoveryState } from "@/types/job";

interface ChatInputProps {
  inputValue: string;
  state: JobDiscoveryState;
  onInputChange: (value: string) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onSubmit: (textToSubmit?: string) => void;
  hasMessages: boolean;
}

export const ChatInput = (props: ChatInputProps) => {
  return <AIChatInput {...props} />;
};