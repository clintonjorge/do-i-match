import { LiquidButton } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { JobDiscoveryState } from "@/types/job";

interface ChatInputProps {
  inputValue: string;
  state: JobDiscoveryState;
  onInputChange: (value: string) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onSubmit: () => void;
  hasMessages: boolean;
}

export const ChatInput = ({
  inputValue,
  state,
  onInputChange,
  onKeyPress,
  onSubmit,
  hasMessages,
}: ChatInputProps) => {
  return (
    <div className="sticky bottom-0 bg-background/80 backdrop-blur-sm border-t border-border p-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex flex-col space-y-4">
          <div className="relative">
            <Textarea
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyPress={onKeyPress}
              placeholder={
                hasMessages 
                  ? "Ask a follow-up question..." 
                  : "Type your name, LinkedIn URL, desired position, and location..."
              }
              disabled={state === "processing"}
              rows={Math.min(4, Math.max(1, inputValue.split('\n').length))}
              className={`
                w-full resize-none pr-4 py-3 bg-card/80 backdrop-blur-sm border-2 transition-all duration-300 rounded-xl
                ${state === "processing" 
                  ? "animate-glow-pulse border-primary bg-gradient-processing bg-[length:200%_100%]" 
                  : "border-border hover:border-primary/50 focus:border-primary"
                }
              `}
            />
          </div>
          
          <div className="flex justify-center">
            <LiquidButton
              onClick={onSubmit}
              disabled={state === "processing" || !inputValue.trim()}
              size="lg"
              className="px-8 text-black"
            >
              {state === "processing" 
                ? "Thinking..." 
                : hasMessages 
                  ? "Send" 
                  : "I'm feeling lucky"
              }
            </LiquidButton>
          </div>
        </div>
      </div>
    </div>
  );
};