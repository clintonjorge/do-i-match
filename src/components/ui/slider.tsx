import * as React from "react"
import { cn } from "@/lib/utils"

export interface SliderProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value?: number
  onValueChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
  disabled?: boolean
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, value = 0, onValueChange, min = 0, max = 100, step = 1, disabled, ...props }, ref) => {
    const percentage = ((value - min) / (max - min)) * 100

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = Number(e.target.value)
      onValueChange?.(newValue)
    }

    return (
      <div className={cn("relative flex w-full touch-none select-none items-center", className)}>
        <input
          ref={ref}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className="sr-only"
          {...props}
        />
        
        {/* Track background */}
        <div className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-muted">
          {/* Progress fill */}
          <div
            className="absolute h-full bg-primary transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
        
        {/* Thumb */}
        <div
          className={cn(
            "absolute h-4 w-4 rounded-full bg-background border-2 border-primary shadow-sm transition-all",
            "hover:scale-110 focus:scale-110",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          style={{ left: `${percentage}%`, transform: 'translateX(-50%)' }}
        />
        
        {/* Invisible input overlay for interactions */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className={cn(
            "absolute inset-0 h-full w-full cursor-pointer opacity-0",
            disabled && "cursor-not-allowed"
          )}
        />
      </div>
    )
  }
)
Slider.displayName = "Slider"

export { Slider }