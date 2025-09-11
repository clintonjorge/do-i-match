import { Button } from "@/components/ui/button";
import { RotateCcw, Sparkles } from "lucide-react";
import type { JobDiscoveryResponse } from "@/types/job";

interface JobDiscoveryTextSuccessProps {
  result: JobDiscoveryResponse | null;
  onReset: () => void;
}

export const JobDiscoveryTextSuccess = ({ 
  result, 
  onReset 
}: JobDiscoveryTextSuccessProps) => {
  const textResponse = result?.text_response;

  if (!textResponse) {
    return (
      <div className="text-center space-y-4 animate-fade-in-up">
        <p className="text-destructive text-lg">
          No response received. Please try again.
        </p>
        <Button variant="ghostFuturistic" onClick={onReset}>
          <RotateCcw className="w-4 h-4" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="text-center space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-center gap-3">
          <Sparkles className="w-8 h-8 text-primary animate-pulse" />
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            AI Career Guidance 🚀
          </h2>
        </div>
        <p className="text-lg text-muted-foreground">
          Here's your personalized career advice
        </p>
      </div>

      {/* Response Content */}
      <div className="bg-secondary/50 rounded-lg p-6 border border-primary/10 text-left">
        <div className="prose prose-lg max-w-none text-foreground">
          <div className="whitespace-pre-wrap text-base leading-relaxed">
            {textResponse}
          </div>
        </div>
      </div>

      {/* Action Button */}
      <Button 
        variant="ghostFuturistic" 
        onClick={onReset}
        className="group"
      >
        <RotateCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
        Try Another Search
      </Button>
    </div>
  );
};