import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#050507",
          900: "#0b0b10",
          800: "#141421",
          700: "#1e1e33",
          600: "#2b2b45",
        },
      },
    },
  },
  plugins: [],
};

export default config;
