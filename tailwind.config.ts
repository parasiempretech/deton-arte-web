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
        // Mantenemos tu paleta de oscuros pero optimizada
        ink: {
          950: "#050507",
          900: "#0b0b10",
          800: "#141421",
          700: "#1e1e33",
          600: "#2b2b45",
        },
      },
      animation: {
        // Animación sutil para la imagen del Hero
        "slow-zoom": "slow-zoom 20s ease-in-out infinite alternate",
        // Animación de entrada suave para elementos UI
        "fade-in-up": "fade-in-up 0.5s ease-out forwards",
      },
      keyframes: {
        "slow-zoom": {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.15)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      backgroundImage: {
        // Gradiente radial para fondos profundos
        "radial-gradient": "radial-gradient(var(--tw-gradient-stops))",
      },
      boxShadow: {
        // Sombras con color para el estilo "Glow" de los botones y cards
        "red-glow": "0 0 20px -5px rgba(220, 38, 38, 0.5)",
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      },
    },
  },
  plugins: [],
};

export default config;
