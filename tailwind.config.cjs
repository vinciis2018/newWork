/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#3B82F6',
          dark: '#1D4ED8',
          hover: '#2563EB',
        },
        background: {
          light: '#FFFFFF',
          dark: '#000000',
          alt: {
            light: '#F3F4F6',
            dark: '#2D2D2D',
          }
        },
        text: {
          light: '#000000',
          dark: '#FFFFFF',
          muted: {
            light: '#6B7280',
            dark: '#9CA3AF',
          }
        },
        accent: {
          light: '#10B981',
          dark: '#059669',
        },
        error: {
          light: '#EF4444',
          dark: '#DC2626'
        },
        border: {
          red: '#EF4444',
          green: '#10B981',
          blue: '#3B82F6'
        }
      },
      borderColor: {
        'red': '#EF4444',
        'green': '#10B981',
        'blue': '#3B82F6'
      }
    },
  },
  variants: {
    extend: {
      backgroundColor: ['dark'],
      textColor: ['dark'],
    },
  },
  plugins: [],
}
