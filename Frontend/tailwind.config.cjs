/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        heading: ["Space Grotesk", "sans-serif"],
        sans: ["Plus Jakarta Sans", "sans-serif"],
        mono: ["Fira Code", "monospace"],
      },
      colors: {
        dark: {
          950: "#04070D",
          900: "#080C14",
          800: "#0F172A",
          700: "#1E293B",
          600: "#334155",
        },
        brand: {
          indigo: "#6366F1",
          cyan: "#06B6D4",
          emerald: "#10B981",
          amber: "#F59E0B",
          rose: "#F43F5E",
        },
      },
      boxShadow: {
        "neon-indigo": "0 0 30px -5px rgba(99, 102, 241, 0.35)",
        "neon-cyan": "0 0 30px -5px rgba(6, 182, 212, 0.35)",
        "neon-emerald": "0 0 30px -5px rgba(16, 185, 129, 0.35)",
        "glass": "0 10px 30px -10px rgba(0, 0, 0, 0.5)",
      },
    },
  },
  plugins: [],
};
