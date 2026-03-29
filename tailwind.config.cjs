/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#EEF5FF",
          100: "#D9E8FF",
          500: "#2563D6",
          600: "#1657C0",
          700: "#1046A2",
        },
        canvas: "#F7F8FF",
        line: "#E5EAF3",
      },
      boxShadow: {
        panel: "0 1px 2px rgba(16, 24, 40, 0.04), 0 12px 32px rgba(15, 23, 42, 0.04)",
        modal: "0 20px 50px rgba(15, 23, 42, 0.15)",
      },
      fontFamily: {
        sans: ["Inter", "Segoe UI", "sans-serif"],
      },
    },
  },
  plugins: [],
};
