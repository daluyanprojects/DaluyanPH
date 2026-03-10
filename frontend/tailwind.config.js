import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: { 
      fontFamily: {
        // This tells Tailwind that 'sans' = Inter
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    
    },
    
  },
  plugins: [daisyui],
  daisyui: {
    themes: ["nord", "dark"],
  },
};

