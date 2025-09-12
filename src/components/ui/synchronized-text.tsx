import React, { useMemo } from "react"
import ReactMarkdown from "react-markdown"
import { cn } from "@/lib/utils"
import { WordTiming } from "@/types/job"

interface SynchronizedTextProps {
  content: string
  wordTimings?: WordTiming[]
  currentTime: number
  onWordClick?: (timestamp: number) => void
  className?: string
}

interface WordWithTiming extends WordTiming {
  isActive: boolean
  isPast: boolean
}

const parseContentWithTimings = (content: string, wordTimings: WordTiming[], currentTime: number): WordWithTiming[] => {
  return wordTimings.map((timing) => ({
    ...timing,
    isActive: currentTime >= timing.start && currentTime < timing.end,
    isPast: currentTime >= timing.end,
  }))
}

export const SynchronizedText = ({ 
  content, 
  wordTimings, 
  currentTime, 
  onWordClick, 
  className 
}: SynchronizedTextProps) => {
  const wordsWithTimings = useMemo(() => {
    if (!wordTimings || wordTimings.length === 0) return null
    return parseContentWithTimings(content, wordTimings, currentTime)
  }, [content, wordTimings, currentTime])

  // If no word timings available, fall back to regular markdown
  if (!wordsWithTimings) {
    return (
      <div className={cn("prose prose-sm max-w-none text-foreground", className)}>
        <ReactMarkdown 
          components={{
            a: ({ href, children }) => (
              <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                {children}
              </a>
            ),
            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
            strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    )
  }

  // Render synchronized text with word-level highlighting
  return (
    <div className={cn("prose prose-sm max-w-none text-foreground", className)}>
      <div className="space-y-2">
        {wordsWithTimings.map((wordTiming, index) => (
          <span
            key={`${wordTiming.index}-${index}`}
            className={cn(
              "cursor-pointer transition-all duration-200 rounded px-0.5 py-0.5",
              {
                // Active word - bright highlight
                "bg-primary/20 text-primary font-medium animate-pulse": wordTiming.isActive,
                // Past words - muted
                "text-muted-foreground": wordTiming.isPast && !wordTiming.isActive,
                // Future words - default
                "text-foreground hover:bg-muted/50": !wordTiming.isActive && !wordTiming.isPast,
              }
            )}
            onClick={() => onWordClick?.(wordTiming.start)}
            title={`Seek to ${Math.floor(wordTiming.start / 60)}:${Math.floor(wordTiming.start % 60).toString().padStart(2, '0')}`}
          >
            {wordTiming.word}
          </span>
        ))}
      </div>
    </div>
  )
}