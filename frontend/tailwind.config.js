/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Colores principales para IngRide (naranja)
        "orange-primary": "#ff9800",
        "orange-dark": "#e68900",
        "orange-light": "#ffb74d",
        "orange-pale": "#ffe0b2",
        
        // Colores secundarios
        "gray-custom": "#374151",
        "blue-custom": "#1e40af",
        
        // Estados del sistema
        "status-free": "#10b981",
        "status-occupied": "#ef4444", 
        "status-maintenance": "#f59e0b",
        "status-reserved": "#3b82f6"
      },
      animation: {
        'fadeIn': 'fadeIn 0.5s ease-in-out',
        'slideIn': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        }
      }
    },
  },
  plugins: [],
}