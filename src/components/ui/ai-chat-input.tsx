"use client"

import * as React from "react"
import { useState, useEffect, useRef } from "react";
import { Lightbulb, Mic, Globe, Paperclip, Send } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
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
  const [thinkActive, setThinkActive] = useState(false);
  const [deepSearchActive, setDeepSearchActive] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

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

  const handleActivate = () => setIsActive(true);

  const containerVariants = {
    collapsed: {
      height: 80,
      boxShadow: "var(--shadow-futuristic)",
      transition: { type: "spring" as const, stiffness: 120, damping: 18 },
    },
    expanded: {
      height: 150,
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
    <div className="sticky bottom-0 bg-background/80 backdrop-blur-sm border-t border-border p-4">
      <div className="w-full max-w-6xl mx-auto flex justify-center">
        <motion.div
          ref={wrapperRef}
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
        >
          <div className="flex flex-col items-stretch w-full h-full">
            {/* Input Row */}
            <div className="flex items-start gap-2 p-3 rounded-full max-w-5xl w-full">
              <button
                className="p-3 rounded-full hover:bg-accent transition text-foreground"
                title="Attach file"
                type="button"
                tabIndex={-1}
              >
                <Paperclip size={20} />
              </button>

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
                  onFocus={handleActivate}
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

              <button
                className="p-3 rounded-full hover:bg-accent transition text-foreground"
                title="Voice input"
                type="button"
                tabIndex={-1}
              >
                <Mic size={20} />
              </button>
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

            {/* Expanded Controls */}
            <motion.div
              className="w-full flex justify-start px-4 items-center text-sm"
              variants={{
                hidden: {
                  opacity: 0,
                  y: 20,
                  pointerEvents: "none" as const,
                  transition: { duration: 0.25 },
                },
                visible: {
                  opacity: 1,
                  y: 0,
                  pointerEvents: "auto" as const,
                  transition: { duration: 0.35, delay: 0.08 },
                },
              }}
              initial="hidden"
              animate={isActive || inputValue ? "visible" : "hidden"}
              style={{ marginTop: 8 }}
            >
              <div className="flex gap-3 items-center">
                {/* Think Toggle */}
                <button
                  className={`flex items-center gap-1 px-4 py-2 rounded-full transition-all font-medium group ${
                    thinkActive
                      ? "bg-primary/10 outline outline-primary/60 text-primary"
                      : "bg-accent text-accent-foreground hover:bg-accent/80"
                  }`}
                  title="Think"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setThinkActive((a) => !a);
                  }}
                >
                  <Lightbulb
                    className="group-hover:fill-yellow-300 transition-all"
                    size={18}
                  />
                  Think
                </button>

                {/* Deep Search Toggle */}
                <motion.button
                  className={`flex items-center px-4 gap-1 py-2 rounded-full transition font-medium whitespace-nowrap overflow-hidden justify-start ${
                    deepSearchActive
                      ? "bg-primary/10 outline outline-primary/60 text-primary"
                      : "bg-accent text-accent-foreground hover:bg-accent/80"
                  }`}
                  title="Deep Search"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeepSearchActive((a) => !a);
                  }}
                  initial={false}
                  animate={{
                    width: deepSearchActive ? 125 : 36,
                    paddingLeft: deepSearchActive ? 8 : 9,
                  }}
                >
                  <div className="flex-1">
                    <Globe size={18} />
                  </div>
                  <motion.span
                    className="pb-[2px]"
                    initial={false}
                    animate={{
                      opacity: deepSearchActive ? 1 : 0,
                    }}
                  >
                    Deep Search
                  </motion.span>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export { AIChatInput };