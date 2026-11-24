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
        navy: {
          950: '#060911',
          900: '#0a0f1d',
          850: '#0e1628',
          800: '#131e36',
          700: '#1c2b4d',
          600: '#283c66',
        },
        cyan: {
          400: '#22d3ee',
          500: '#06b6d4',
          glow: '#00f2fe',
        },
        emerald: {
          400: '#34d399',
          500: '#10b981',
          glow: '#05df95',
        },
        amber: {
          400: '#fbbf24',
          500: '#f59e0b',
        },
        rose: {
          500: '#f43f5e',
          600: '#e11d48',
        }
      },
      boxShadow: {
        'glow-cyan': '0 0 20px -2px rgba(6, 182, 212, 0.45)',
        'glow-cyan-lg': '0 0 35px -5px rgba(0, 242, 254, 0.55)',
        'glow-emerald': '0 0 20px -2px rgba(16, 185, 129, 0.45)',
        'glow-emerald-lg': '0 0 35px -5px rgba(5, 223, 149, 0.55)',
        'glow-rose': '0 0 20px -2px rgba(244, 63, 94, 0.45)',
        'glow-amber': '0 0 20px -2px rgba(245, 158, 11, 0.45)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar': 'radarSweep 4s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
