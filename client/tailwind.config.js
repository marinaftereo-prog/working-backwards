/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Deep, warm dark backgrounds
        ink: {
          900: "#0a0a0a",
          800: "#121110",
          700: "#1a1715",
        },
        // Warm cream / off-white for obituary text
        cream: {
          100: "#f5efe3",
          200: "#e8dfce",
          300: "#d8cdb6",
        },
        // Muted warm gray for UI / forms
        ash: {
          300: "#b8aea0",
          400: "#928679",
          500: "#6f655a",
          600: "#4a423a",
        },
        // Candle / amber glow
        ember: {
          300: "#f0c27b",
          400: "#e0a85e",
          500: "#c8884a",
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', '"Lora"', "Georgia", "serif"],
        body: ['"Lora"', "Georgia", "serif"],
        sans: ['"Inter"', "system-ui", "-apple-system", "sans-serif"],
      },
      keyframes: {
        flicker: {
          "0%, 100%": { opacity: "0.85", transform: "scale(1)" },
          "45%": { opacity: "1", transform: "scale(1.03)" },
          "70%": { opacity: "0.78", transform: "scale(0.99)" },
        },
        fadeup: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadein: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        // The opening quote dissolves upward to make way for the title.
        quoteout: {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(-10px)" },
        },
      },
      animation: {
        flicker: "flicker 7s ease-in-out infinite",
        fadeup: "fadeup 0.9s ease-out both",
        fadein: "fadein 1.2s ease-out both",
        quoteout: "quoteout 0.9s ease-in both",
      },
    },
  },
  plugins: [],
};
