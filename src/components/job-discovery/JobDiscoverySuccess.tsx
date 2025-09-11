import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, ArrowRight, RotateCcw } from "lucide-react";
import type { JobDiscoveryResponse } from "@/types/job";

interface JobDiscoverySuccessProps {
  result: JobDiscoveryResponse | null;
  onReset: () => void;
}

export const JobDiscoverySuccess = ({ result, onReset }: JobDiscoverySuccessProps) => {
  return (
    <Card className="animate-fade-in-up bg-card/90 backdrop-blur-sm border-2 border-primary/30 shadow-futuristic">
      <CardContent className="p-8 text-center space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-3">
            <Sparkles className="w-8 h-8 text-primary animate-pulse" />
            <h2 className="text-3xl md:text-4xl font-bold font-space bg-gradient-primary bg-clip-text text-transparent">
              I found something for you 🚀
            </h2>
          </div>
          <p className="text-lg text-muted-foreground font-space">
            Here's a match based on what you told me.
          </p>
        </div>

        <div className="bg-secondary/50 rounded-lg p-6 space-y-4 border border-primary/10">
          <h3 className="text-xl font-semibold font-space text-primary">
            {result?.title || "AI-Matched Career Opportunity"}
          </h3>
          <p className="text-muted-foreground">
            {result?.description || "Based on your profile and preferences, we've identified exciting opportunities that align with your career goals and expertise."}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="futuristic" size="lg" className="group">
            View More
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button 
            variant="ghostFuturistic" 
            size="lg" 
            onClick={onReset}
            className="group"
          >
            <RotateCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
            Try Again
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};