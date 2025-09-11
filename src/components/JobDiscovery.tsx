import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Sparkles, ArrowRight, RotateCcw } from "lucide-react";
import heroImage from "@/assets/futuristic-hero-bg.jpg";

type JobDiscoveryState = "idle" | "processing" | "success" | "error";

interface JobDiscoveryResponse {
  title?: string;
  description?: string;
  link?: string;
}

export default function JobDiscovery() {
  const [state, setState] = useState<JobDiscoveryState>("idle");
  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState<JobDiscoveryResponse | null>(null);

  const handleSubmit = async () => {
    if (!inputValue.trim()) return;
    
    setState("processing");
    
    try {
      const response = await fetch("https://clintonjorge.app.n8n.cloud/webhook-test/73d4858d-d028-41a2-9b1a-ec224c65fd07", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: inputValue }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setResult(data);
        setState("success");
      } else {
        setState("error");
      }
    } catch (error) {
      console.error("Webhook error:", error);
      setState("error");
    }
  };

  const handleReset = () => {
    setState("idle");
    setInputValue("");
    setResult(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && state === "idle") {
      handleSubmit();
    }
  };

  return (
    <div 
      className="min-h-screen bg-gradient-background flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        backgroundImage: `url(${heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'overlay'
      }}
    >
      {/* Ambient glow effects */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="w-full max-w-2xl mx-auto">
        {state !== "success" && (
          <div className="text-center space-y-8 animate-fade-in-up">
            {/* Hero Section */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold font-space bg-gradient-primary bg-clip-text text-transparent leading-tight">
                Find me something good
              </h1>
              <p className="text-xl md:text-2xl font-space font-light text-muted-foreground">
                What is your dream job?
              </p>
            </div>

            {/* Input Section */}
            <div className="space-y-6">
              <div className="relative">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your name, LinkedIn URL, desired position, and location..."
                  disabled={state === "processing"}
                  className={`
                    w-full max-w-lg mx-auto h-16 px-6 text-lg font-space bg-card/80 backdrop-blur-sm
                    border-2 transition-all duration-300 rounded-full
                    ${state === "processing" 
                      ? "animate-glow-pulse border-primary bg-gradient-processing bg-[length:200%_100%]" 
                      : "border-border hover:border-primary/50 focus:border-primary"
                    }
                  `}
                />
                {state === "processing" && (
                  <div className="absolute inset-0 rounded-full bg-gradient-glow opacity-20 animate-processing-flow pointer-events-none" />
                )}
              </div>

              {/* Button Section */}
              <Button
                onClick={handleSubmit}
                disabled={state === "processing" || !inputValue.trim()}
                variant={state === "processing" ? "processing" : "futuristic"}
                size="lg"
                className="px-12"
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
              </Button>
            </div>
          </div>
        )}

        {/* Success State */}
        {state === "success" && (
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

              {/* Dynamic Content Area */}
              <div className="bg-secondary/50 rounded-lg p-6 space-y-4 border border-primary/10">
                <h3 className="text-xl font-semibold font-space text-primary">
                  {result?.title || "AI-Matched Career Opportunity"}
                </h3>
                <p className="text-muted-foreground">
                  {result?.description || "Based on your profile and preferences, we've identified exciting opportunities that align with your career goals and expertise."}
                </p>
              </div>

              {/* Call-to-Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="futuristic" size="lg" className="group">
                  View More
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  variant="ghostFuturistic" 
                  size="lg" 
                  onClick={handleReset}
                  className="group"
                >
                  <RotateCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {state === "error" && (
          <div className="text-center space-y-4 animate-fade-in-up">
            <p className="text-destructive font-space text-lg">
              Something went wrong. Please try again.
            </p>
            <Button variant="ghostFuturistic" onClick={handleReset}>
              <RotateCcw className="w-4 h-4" />
              Try Again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}