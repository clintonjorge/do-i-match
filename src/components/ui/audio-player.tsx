import React, { useState, useRef, useEffect } from "react"
import { Button } from "./button"
import { Slider } from "./slider"
import { Play, Pause, Square } from "lucide-react"
import { cn } from "@/lib/utils"

interface AudioPlayerProps {
  audioFile: {
    data?: string
    id?: string
  }
  className?: string
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export const AudioPlayer = ({ audioFile, className }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration || 0)
    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }
    const handleLoadStart = () => setIsLoading(true)
    const handleCanPlay = () => setIsLoading(false)

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('loadstart', handleLoadStart)
    audio.addEventListener('canplay', handleCanPlay)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('loadstart', handleLoadStart)
      audio.removeEventListener('canplay', handleCanPlay)
    }
  }, [])

  useEffect(() => {
    // Create audio element when component mounts
    let audioUrl: string

    if (audioFile.data) {
      audioUrl = `data:audio/mp3;base64,${audioFile.data}`
    } else if (audioFile.id) {
      audioUrl = `https://api.your-domain.com/audio/${audioFile.id}`
    } else {
      return
    }

    const audio = new Audio(audioUrl)
    audioRef.current = audio

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [audioFile])

  const handlePlayPause = async () => {
    const audio = audioRef.current
    if (!audio) return

    try {
      if (isPlaying) {
        audio.pause()
        setIsPlaying(false)
      } else {
        await audio.play()
        setIsPlaying(true)
      }
    } catch (error) {
      console.error('Failed to play/pause audio:', error)
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
  }

  return (
    <div className={cn("flex items-center gap-3 p-3 bg-muted/30 rounded-lg", className)}>
      {/* Control buttons */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePlayPause}
          disabled={isLoading}
          className="h-8 w-8 p-0"
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
          className="h-8 w-8 p-0"
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
}