import type { Config } from "tailwindcss";

// @ts-ignore
const { default: flattenColorPalette } = require("tailwindcss/lib/util/flattenColorPalette");

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        'space': ['Space Grotesk', 'system-ui', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      backgroundImage: {
        'gradient-primary': 'var(--gradient-primary)',
        'gradient-background': 'var(--gradient-background)',
        'gradient-glow': 'var(--gradient-glow)',
        'gradient-processing': 'var(--gradient-processing)',
      },
      boxShadow: {
        'glow-primary': 'var(--glow-primary)',
        'glow-accent': 'var(--glow-accent)',
        'futuristic': 'var(--shadow-futuristic)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        'full': '9999px',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "glow-pulse": {
          "0%, 100%": { 
            boxShadow: "0 0 20px hsl(217, 91%, 60% / 0.4)",
            borderColor: "hsl(217, 91%, 60%)"
          },
          "50%": { 
            boxShadow: "0 0 40px hsl(217, 91%, 60% / 0.8)",
            borderColor: "hsl(262, 100%, 75%)"
          },
        },
        "processing-flow": {
          "0%": { 
            backgroundPosition: "0% 0%",
            transform: "rotate(0deg)"
          },
          "100%": { 
            backgroundPosition: "200% 0%",
            transform: "rotate(360deg)"
          },
        },
        "fade-in-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)"
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)"
          }
        },
        "success-glow": {
          "0%, 100%": { 
            boxShadow: "0 0 30px hsl(142, 76%, 36% / 0.5)" 
          },
          "50%": { 
            boxShadow: "0 0 50px hsl(142, 76%, 36% / 0.8)" 
          },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "liquid-morph": {
          "0%, 100%": {
            transform: "scale(1) rotate(0deg)",
            borderRadius: "50% 40% 60% 30%"
          },
          "25%": {
            transform: "scale(1.05) rotate(90deg)",
            borderRadius: "30% 60% 40% 50%"
          },
          "50%": {
            transform: "scale(0.95) rotate(180deg)",
            borderRadius: "60% 30% 50% 40%"
          },
          "75%": {
            transform: "scale(1.02) rotate(270deg)",
            borderRadius: "40% 50% 30% 60%"
          }
        },
        "aurora": {
          from: {
            backgroundPosition: "50% 50%, 50% 50%",
          },
          to: {
            backgroundPosition: "350% 50%, 350% 50%",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "processing-flow": "processing-flow 3s linear infinite",
        "fade-in-up": "fade-in-up 0.6s ease-out",
        "success-glow": "success-glow 2s ease-in-out infinite",
        "spin-slow": "spin-slow 2s linear infinite",
        "liquid-morph": "liquid-morph 4s ease-in-out infinite",
        "aurora": "aurora 60s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), addVariablesForColors],
} satisfies Config;

// This plugin adds each Tailwind color as a global CSS variable, e.g. var(--gray-200).
function addVariablesForColors({ addBase, theme }: any) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}
