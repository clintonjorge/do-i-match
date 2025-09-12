import React, { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "./button"
import { Slider } from "./slider"
import { Play, Pause, Square } from "lucide-react"
import { cn } from "@/lib/utils"
import { isIOSSafari, isMobile, createAudioContext, unlockAudioContext } from "@/utils/deviceDetection"

interface AudioPlayerProps {
  audioFile: {
    data?: string
    id?: string
  }
  className?: string
  onTimeUpdate?: (currentTime: number) => void
  onSeek?: (time: number) => void
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export const AudioPlayer = React.forwardRef<
  { seekTo: (time: number) => void }, 
  AudioPlayerProps
>(({ audioFile, className, onTimeUpdate, onSeek }, ref) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [audioInitialized, setAudioInitialized] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)

  // Initialize audio context for iOS
  const initializeAudioContext = useCallback(async () => {
    if (isMobile() && !audioContextRef.current) {
      audioContextRef.current = createAudioContext()
      if (audioContextRef.current) {
        await unlockAudioContext(audioContextRef.current)
      }
    }
  }, [])

  // Create audio element only when needed (user interaction)
  const initializeAudio = useCallback(async () => {
    if (audioInitialized || !audioFile.data && !audioFile.id) return

    try {
      setIsLoading(true)
      setError(null)

      // Initialize audio context for mobile
      await initializeAudioContext()

      let audioUrl: string
      if (audioFile.data) {
        // For iOS Safari, handle base64 data more carefully
        if (isIOSSafari() && audioFile.data.length > 2 * 1024 * 1024) {
          throw new Error('Audio file too large for iOS Safari')
        }
        audioUrl = `data:audio/mp3;base64,${audioFile.data}`
      } else if (audioFile.id) {
        audioUrl = `https://api.your-domain.com/audio/${audioFile.id}`
      } else {
        return
      }

      const audio = new Audio()
      
      // Set up event listeners before setting src
      const updateTime = () => {
        const time = audio.currentTime
        setCurrentTime(time)
        onTimeUpdate?.(time)
      }
      
      const updateDuration = () => {
        setDuration(audio.duration || 0)
        setIsLoading(false)
      }
      
      const handleEnded = () => {
        setIsPlaying(false)
        setCurrentTime(0)
      }
      
      const handleError = (e: Event) => {
        console.error('Audio loading error:', e)
        setError('Failed to load audio')
        setIsLoading(false)
        setIsPlaying(false)
      }

      audio.addEventListener('timeupdate', updateTime)
      audio.addEventListener('loadedmetadata', updateDuration)
      audio.addEventListener('ended', handleEnded)
      audio.addEventListener('error', handleError)
      audio.addEventListener('canplay', () => setIsLoading(false))

      // Set source and load
      audio.src = audioUrl
      audio.load()
      
      audioRef.current = audio
      setAudioInitialized(true)

    } catch (err) {
      console.error('Failed to initialize audio:', err)
      setError(err instanceof Error ? err.message : 'Failed to initialize audio')
      setIsLoading(false)
    }
  }, [audioFile, audioInitialized, initializeAudioContext, onTimeUpdate])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
        audioContextRef.current = null
      }
    }
  }, [])

  const handlePlayPause = async () => {
    // Initialize audio on first user interaction
    if (!audioInitialized) {
      await initializeAudio()
    }

    const audio = audioRef.current
    if (!audio) return

    try {
      if (isPlaying) {
        audio.pause()
        setIsPlaying(false)
      } else {
        // Ensure audio context is unlocked on mobile
        if (audioContextRef.current) {
          await unlockAudioContext(audioContextRef.current)
        }
        
        await audio.play()
        setIsPlaying(true)
        setError(null)
      }
    } catch (error) {
      console.error('Failed to play/pause audio:', error)
      setError('Failed to play audio')
      setIsPlaying(false)
    }
  }

  const handleStop = () => {
    const audio = audioRef.current
    if (!audio) return

    audio.pause()
    audio.currentTime = 0
    setIsPlaying(false)
    setCurrentTime(0)
  }

  const handleSeek = (value: number) => {
    const audio = audioRef.current
    if (!audio) return

    audio.currentTime = value
    setCurrentTime(value)
    onSeek?.(value)
  }

  // Expose seekTo method via ref
  React.useImperativeHandle(ref, () => ({
    seekTo: handleSeek,
  }), [])

  return (
    <div className={cn("flex items-center gap-3 p-3 bg-muted/30 rounded-lg", className)}>
      {error && (
        <div className="text-xs text-destructive mb-2">{error}</div>
      )}
      
      {/* Control buttons */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePlayPause}
          disabled={isLoading}
          className={cn(
            "mobile-touch-target ios-audio-button touch-manipulation mobile-no-select",
            isMobile() ? "h-11 w-11" : "h-8 w-8",
            "p-0"
          )}
        >
          {isLoading ? (
            <div className="h-3 w-3 animate-spin rounded-full border border-muted-foreground border-t-transparent" />
          ) : isPlaying ? (
            <Pause className="h-3 w-3" />
          ) : (
            <Play className="h-3 w-3" />
          )}
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleStop}
          disabled={isLoading || (!isPlaying && currentTime === 0)}
          className={cn(
            "mobile-touch-target ios-audio-button touch-manipulation mobile-no-select",
            isMobile() ? "h-11 w-11" : "h-8 w-8",
            "p-0"
          )}
        >
          <Square className="h-3 w-3" />
        </Button>
      </div>

      {/* Timeline scrubber */}
      <div className="flex-1 flex items-center gap-2">
        <span className="text-xs text-muted-foreground font-mono min-w-[2.5rem]">
          {formatTime(currentTime)}
        </span>
        
        <Slider
          value={currentTime}
          onValueChange={handleSeek}
          min={0}
          max={duration}
          step={0.1}
          disabled={isLoading || duration === 0}
          className="flex-1"
        />
        
        <span className="text-xs text-muted-foreground font-mono min-w-[2.5rem]">
          {formatTime(duration)}
        </span>
      </div>
    </div>
  )
})