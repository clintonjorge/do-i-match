"use client";

import { Mic } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface AIVoiceInputProps {
  onStart?: (e?: React.MouseEvent) => void;
  onStop?: (duration: number, e?: React.MouseEvent) => void;
  visualizerBars?: number;
  isRecording?: boolean;
  duration?: number;
  className?: string;
  disabled?: boolean;
}

export function AIVoiceInput({
  onStart,
  onStop,
  visualizerBars = 24,
  isRecording = false,
  duration = 0,
  className,
  disabled = false
}: AIVoiceInputProps) {
  const [isClient, setIsClient] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent parent container click
    if (disabled) return;
    
    setIsExpanded(true);
    
    if (isRecording) {
      onStop?.(duration, e);
    } else {
      onStart?.(e);
    }
  };

  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      <button
        className={cn(
          "group w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
          isRecording
            ? "bg-primary/10 hover:bg-primary/20"
            : "hover:bg-accent",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        type="button"
        onClick={handleClick}
        disabled={disabled}
        title={isRecording ? "Stop recording" : "Start voice input"}
      >
        {isRecording ? (
          <div
            className="w-4 h-4 rounded-sm bg-primary animate-pulse"
            style={{ animationDuration: "1s" }}
          />
        ) : (
          <Mic className="w-5 h-5 text-foreground/70" />
        )}
      </button>

      {/* Timer - only show when recording and expanded */}
      {isExpanded && isRecording && (
        <span className="font-mono text-xs text-muted-foreground">
          {formatTime(duration)}
        </span>
      )}

      {/* Visualizer bars - only show when expanded */}
      {isExpanded && (
        <div className="h-3 w-32 flex items-center justify-center gap-0.5">
          {[...Array(visualizerBars)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-0.5 rounded-full transition-all duration-300",
                isRecording
                  ? "bg-primary/60 animate-pulse"
                  : "bg-muted-foreground/20 h-1"
              )}
              style={
                isRecording && isClient
                  ? {
                      height: `${20 + Math.random() * 60}%`,
                      animationDelay: `${i * 0.03}s`,
                    }
                  : undefined
              }
            />
          ))}
        </div>
      )}

      {/* Status text - only show when expanded */}
      {isExpanded && (
        <p className="text-xs text-muted-foreground">
          {isRecording ? "Listening..." : "Voice"}
        </p>
      )}
    </div>
  );
}