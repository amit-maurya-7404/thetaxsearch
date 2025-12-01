import type { Config } from "tailwindcss"
import defaultTheme from "tailwindcss/defaultTheme"

const config = {
  darkMode: ["class"],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#8f63d9',
        'primary-light': '#a78bdb',
        'primary-dark': '#7a4fc9',
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
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
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-up": {
          from: { transform: "translateY(20px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-in",
        "slide-up": "slide-up 0.5s ease-out",
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      width: {
        vw10: '10vw',
        vw20: '20vw',
        vw25: '25vw',
        vw30: '30vw',
        vw40: '40vw',
        vw50: '50vw',
        vw60: '60vw',
        vw70: '70vw',
        vw80: '80vw',
        vw90: '90vw',
        vw100: '100vw',
      },
      height: {
        vh10: '10vh',
        vh20: '20vh',
        vh25: '25vh',
        vh30: '30vh',
        vh40: '40vh',
        vh50: '50vh',
        vh60: '60vh',
        vh70: '70vh',
        vh80: '80vh',
        vh90: '90vh',
        vh100: '100vh',
      },
      fontSize: {
        'vw-xs': 'clamp(0.75rem, 2vw, 1rem)',
        'vw-sm': 'clamp(0.875rem, 2.5vw, 1.125rem)',
        'vw-base': 'clamp(1rem, 3vw, 1.25rem)',
        'vw-lg': 'clamp(1.125rem, 3.5vw, 1.5rem)',
        'vw-xl': 'clamp(1.25rem, 4vw, 1.875rem)',
        'vw-2xl': 'clamp(1.5rem, 5vw, 2.25rem)',
        'vw-3xl': 'clamp(1.875rem, 6vw, 3rem)',
        'vw-4xl': 'clamp(2.25rem, 7vw, 3.75rem)',
        'vw-5xl': 'clamp(3rem, 8vw, 5rem)',
        'vw-6xl': 'clamp(3.75rem, 10vw, 6rem)',
      },
      spacing: {
        'vw-1': '1vw',
        'vw-2': '2vw',
        'vw-3': '3vw',
        'vw-4': '4vw',
        'vw-5': '5vw',
        'vw-6': '6vw',
        'vw-8': '8vw',
        'vw-10': '10vw',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
