// frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // Ensure these paths correctly scan your HTML and all JSX files
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}