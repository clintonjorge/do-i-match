"use client"

import * as React from "react"
import { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { AIVoiceInput } from "./ai-voice-input";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";
import type { JobDiscoveryState } from "@/types/job";

const JOB_DISCOVERY_PLACEHOLDERS = [
  "Tell me about yourself and your dream job...",
  "Share your LinkedIn profile and desired position...",
  "What type of role are you looking for?",
  "Describe your ideal work environment...",
  "What skills do you want to use in your next role?",
  "Where would you like to work and what's your experience?",
];

interface AIChatInputProps {
  inputValue: string;
  state: JobDiscoveryState;
  onInputChange: (value: string) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onSubmit: () => void;
  hasMessages: boolean;
}

const AIChatInput = ({
  inputValue,
  state,
  onInputChange,
  onKeyPress,
  onSubmit,
  hasMessages,
}: AIChatInputProps) => {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Voice recognition hook
  const {
    isRecording,
    transcript,
    isSupported,
    startRecording,
    stopRecording,
    clearTranscript,
    error: voiceError,
    duration
  } = useVoiceRecognition();

  // Cycle placeholder text when input is inactive
  useEffect(() => {
    if (isActive || inputValue || hasMessages) return;

    const interval = setInterval(() => {
      setShowPlaceholder(false);
      setTimeout(() => {
        setPlaceholderIndex((prev) => (prev + 1) % JOB_DISCOVERY_PLACEHOLDERS.length);
        setShowPlaceholder(true);
      }, 400);
    }, 3000);

    return () => clearInterval(interval);
  }, [isActive, inputValue, hasMessages]);

  // Close input when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        if (!inputValue) setIsActive(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [inputValue]);

  const handleActivate = (e?: React.MouseEvent) => {
    // Only activate if clicking the container itself, not child elements
    if (e && e.target !== e.currentTarget) return;
    setIsActive(true);
  };

  const handleFocus = () => setIsActive(true);

  // Handle voice recording
  const handleVoiceStart = async (e?: React.MouseEvent) => {
    e?.stopPropagation(); // Prevent container click
    try {
      await startRecording();
      setIsActive(true);
    } catch (error) {
      console.error("Failed to start voice recording:", error);
    }
  };

  const handleVoiceStop = (duration: number, e?: React.MouseEvent) => {
    e?.stopPropagation(); // Prevent container click
    console.log('=== Voice Stop ===');
    console.log('Current inputValue:', inputValue);
    console.log('Current transcript:', transcript);
    
    stopRecording();
    // Add transcript to input value only once when recording stops
    if (transcript.trim()) {
      const newValue = inputValue + (inputValue ? " " : "") + transcript.trim();
      console.log('Adding transcript to input:', newValue);
      onInputChange(newValue);
      clearTranscript();
    }
  };

  // DO NOT update input value with live transcript - this causes duplication
  // The transcript will be added only when recording stops

  const containerVariants = {
    collapsed: {
      height: 70,
      boxShadow: "var(--shadow-futuristic)",
      transition: { type: "spring" as const, stiffness: 120, damping: 18 },
    },
    expanded: {
      height: 120,
      boxShadow: "var(--glow-primary)",
      transition: { type: "spring" as const, stiffness: 120, damping: 18 },
    },
  };

  const placeholderContainerVariants = {
    initial: {},
    animate: { transition: { staggerChildren: 0.025 } },
    exit: { transition: { staggerChildren: 0.015, staggerDirection: -1 } },
  };

  const letterVariants = {
    initial: {
      opacity: 0,
      filter: "blur(12px)",
      y: 10,
    },
    animate: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        opacity: { duration: 0.25 },
        filter: { duration: 0.4 },
        y: { type: "spring" as const, stiffness: 80, damping: 20 },
      },
    },
    exit: {
      opacity: 0,
      filter: "blur(12px)",
      y: -10,
      transition: {
        opacity: { duration: 0.2 },
        filter: { duration: 0.3 },
        y: { type: "spring" as const, stiffness: 80, damping: 20 },
      },
    },
  };

  const getPlaceholder = () => {
    if (hasMessages) return "Ask a follow-up question...";
    return JOB_DISCOVERY_PLACEHOLDERS[placeholderIndex];
  };

  return (
    <div className={cn(
      "w-full p-4 transition-all duration-500",
      hasMessages ? "bg-background/80 backdrop-blur-sm border-t border-border" : ""
    )}>
      <div className="w-full max-w-6xl mx-auto flex justify-center">
        <motion.div
          ref={wrapperRef}
          layout
          layoutId="chat-input"
          className={`w-full max-w-5xl bg-card border-2 ${
            state === "processing" 
              ? "animate-glow-pulse border-primary bg-gradient-processing bg-[length:200%_100%]" 
              : "border-border"
          }`}
          variants={state === "processing" ? {} : containerVariants}
          animate={state === "processing" ? undefined : (isActive || inputValue ? "expanded" : "collapsed")}
          initial="collapsed"
          style={{ 
            overflow: "hidden", 
            borderRadius: 32,
          }}
          onClick={handleActivate}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
        >
          <div className="flex flex-col items-stretch w-full h-full">
            {/* Input Row */}
            <div className="flex items-start gap-2 p-3 rounded-full max-w-5xl w-full">

              {/* Text Input & Placeholder */}
              <div className="relative flex-1">
                <textarea
                  value={inputValue}
                  onChange={(e) => onInputChange(e.target.value)}
                  onKeyDown={onKeyPress}
                  disabled={state === "processing"}
                  rows={2}
                  className="flex-1 border-0 outline-0 rounded-md py-2 text-base bg-transparent w-full font-normal text-foreground resize-none leading-relaxed"
                  style={{ position: "relative", zIndex: 2 }}
                  onFocus={handleFocus}
                />
                <div className="absolute left-0 top-0 w-full h-full pointer-events-none flex items-start px-3 pt-2">
                  <AnimatePresence mode="wait">
                    {showPlaceholder && !isActive && !inputValue && (
                      <motion.span
                        key={hasMessages ? "follow-up" : placeholderIndex}
                        className="text-muted-foreground select-none pointer-events-none leading-relaxed"
                        style={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          zIndex: 1,
                        }}
                        variants={placeholderContainerVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                      >
                        {getPlaceholder()
                          .split("")
                          .map((char, i) => (
                            <motion.span
                              key={i}
                              variants={letterVariants}
                              style={{ display: "inline-block" }}
                            >
                              {char === " " ? "\u00A0" : char}
                            </motion.span>
                          ))}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {isSupported && (
                <div className="relative z-10" style={{ pointerEvents: "auto" }}>
                  <AIVoiceInput
                    onStart={handleVoiceStart}
                    onStop={handleVoiceStop}
                    isRecording={isRecording}
                    duration={duration}
                    disabled={state === "processing"}
                    className="px-2"
                  />
                </div>
              )}
              <button
                className="flex items-center gap-1 bg-primary hover:bg-primary/90 text-primary-foreground p-3 rounded-full font-medium justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                title="Send"
                type="button"
                disabled={state === "processing" || !inputValue.trim()}
                onClick={onSubmit}
              >
                <Send size={18} />
              </button>
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
};

export { AIChatInput };
