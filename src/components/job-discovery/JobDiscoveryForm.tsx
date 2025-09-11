import { Button } from "@/components/ui/button";
import { LiquidGlassButton } from "@/components/ui/liquid-glass-button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles } from "lucide-react";
import type { JobDiscoveryState } from "@/types/job";

interface JobDiscoveryFormProps {
  inputValue: string;
  state: JobDiscoveryState;
  onInputChange: (value: string) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onSubmit: () => void;
}

export const JobDiscoveryForm = ({
  inputValue,
  state,
  onInputChange,
  onKeyPress,
  onSubmit,
}: JobDiscoveryFormProps) => {
  return (
    <div className="space-y-6">
      <div className="relative">
        <Textarea
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyPress={onKeyPress}
          placeholder="Type your name, LinkedIn URL, desired position, and location..."
          disabled={state === "processing"}
          rows={5}
          className={`
            w-full max-w-lg mx-auto px-6 py-4 text-lg font-space bg-card/80 backdrop-blur-sm resize-none
            border-2 transition-all duration-300 rounded-2xl
            ${state === "processing" 
              ? "animate-glow-pulse border-primary bg-gradient-processing bg-[length:200%_100%]" 
              : "border-border hover:border-primary/50 focus:border-primary"
            }
          `}
        />
        {state === "processing" && (
          <div className="absolute inset-0 rounded-2xl bg-gradient-glow opacity-20 animate-processing-flow pointer-events-none" />
        )}
      </div>

      <LiquidGlassButton
        onClick={onSubmit}
        disabled={state === "processing" || !inputValue.trim()}
        variant={state === "processing" ? "processing" : "primary"}
        size="lg"
        className="px-12 group"
      >
        {state === "processing" ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin-slow" />
            Thinking...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            I'm feeling lucky
          </>
        )}
      </LiquidGlassButton>
    </div>
  );
};