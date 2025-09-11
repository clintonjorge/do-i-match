import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const liquidGlassButtonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-medium transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 overflow-hidden backdrop-blur-xl border border-primary/20 shadow-lg",
  {
    variants: {
      variant: {
        default: "bg-white/80 text-foreground hover:bg-white/90 shadow-[0_8px_32px_0_hsl(var(--primary)/0.15)]",
        primary: "bg-primary/10 text-primary hover:bg-primary/20 shadow-[0_8px_32px_0_hsl(var(--primary)/0.25)] border-primary/30",
        accent: "bg-accent/10 text-accent hover:bg-accent/20 shadow-[0_8px_32px_0_hsl(var(--accent)/0.25)] border-accent/30",
        processing: "bg-gradient-processing bg-[length:200%_100%] text-primary-foreground animate-processing-flow cursor-not-allowed border-primary/40",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-9 px-4 text-xs",
        lg: "h-14 px-10 text-base",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface LiquidGlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof liquidGlassButtonVariants> {
  asChild?: boolean;
}

const LiquidGlassButton = React.forwardRef<HTMLButtonElement, LiquidGlassButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    return (
      <Comp
        className={cn(liquidGlassButtonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      >
        {/* Liquid morphing background */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute inset-0 bg-gradient-radial from-primary/15 via-transparent to-transparent animate-[liquid-morph_4s_ease-in-out_infinite]" />
          <div className="absolute inset-0 bg-gradient-radial from-transparent via-accent/10 to-transparent animate-[liquid-morph_6s_ease-in-out_infinite_reverse]" />
        </div>
        
        {/* Glass reflection */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-primary/5 opacity-60" />
        
        {/* Content */}
        <span className="relative z-10 flex items-center gap-2">
          {children}
        </span>
        
        {/* Hover glow effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </Comp>
    );
  }
);

LiquidGlassButton.displayName = "LiquidGlassButton";

export { LiquidGlassButton, liquidGlassButtonVariants };