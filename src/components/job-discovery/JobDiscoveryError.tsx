import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

interface JobDiscoveryErrorProps {
  onReset: () => void;
}

export const JobDiscoveryError = ({ onReset }: JobDiscoveryErrorProps) => {
  return (
    <div className="text-center space-y-4 animate-fade-in-up">
      <p className="text-destructive font-space text-lg">
        Something went wrong. Please try again.
      </p>
      <Button variant="ghostFuturistic" onClick={onReset}>
        <RotateCcw className="w-4 h-4" />
        Try Again
      </Button>
    </div>
  );
};