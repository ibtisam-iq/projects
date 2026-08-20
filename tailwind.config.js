/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'surface-0': '#070b14',
        'surface-1': 'rgba(22, 31, 53, 0.88)',
        'surface-2': '#1e2a45',
        'surface-3': '#101827',
        
        'border-color': '#2c3c5e',
        'border-soft': '#1e2a41',
        
        'text-primary': '#f8fafc',
        'text-muted': '#b3c0d1',
        'text-dim': '#8797ad',

        'emerald': '#10d492',
        'emerald-soft': '#4ef0b5',
        'emerald-glow': 'rgba(16, 212, 146, 0.20)',

        'indigo': '#7c7cff',
        'indigo-soft': '#a5a5ff',
        'indigo-glow': 'rgba(124, 124, 255, 0.20)',

        'cyan': '#16c8ec',
        'cyan-soft': '#5ee4ff',
        'cyan-glow': 'rgba(22, 200, 236, 0.20)',

        'amber': '#ffc93c',
        'amber-glow': 'rgba(255, 201, 60, 0.18)',

        'red': '#ff8080',
        
        // Aliases to keep existing classes working seamlessly, pointing to new tokens
        'border-subtle': '#2c3c5e',
        'teal-accent': '#16c8ec',
        'teal-muted': '#10d492',

        // `light-*` aliases resolve to the dark-theme values on purpose. The site
        // is locked to dark (`<html class="dark">` + `color-scheme: dark`), so the
        // base half of every `x-light-* dark:x-*` pair never paints. Defining them
        // keeps those classes from silently compiling to nothing if the `dark:`
        // half is ever edited away. See index.css "Lock everything to the deep
        // space theme".
        'light-text': '#f8fafc',      // = text-primary
        'light-muted': '#b3c0d1',     // = text-muted
        'light-bg': '#070b14',        // = surface-0
        'light-surface': 'rgba(22, 31, 53, 0.88)', // = surface-1
        'light-surface-2': '#1e2a45', // = surface-2
        'light-border': '#2c3c5e',    // = border-subtle
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'Consolas', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        // Drawer is anchored to the right edge, so it travels in from the right.
        'slide-in-right': 'slideInRight 0.25s cubic-bezier(0.32, 0.72, 0, 1)',
        'slide-up': 'slideUp 0.2s ease-out',
        'bounce-gentle': 'bounceGentle 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(6px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
