import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Champagne cream-gold palette — elegant, restrained (Aesop-like calm).
        champagne: {
          DEFAULT: "#F5EEDC", // primary background
          50: "#FBF7EC",
          100: "#F8F2E3",
          200: "#F5EEDC", // primary bg
          300: "#EFE4CC", // secondary bg
          400: "#E7D8B8", // deeper panel
          500: "#DCC8A0"
        },
        ink: {
          DEFAULT: "#2B2722", // warm near-black text
          soft: "#5A5246",
          mute: "#857B69"
        },
        // Muted antique gold for lines / labels / accents.
        gold: {
          DEFAULT: "#B8923D",
          light: "#C9A95C",
          deep: "#8C6D2F",
          pale: "#D8C390"
        },
        // Logo bunny charcoal.
        bunny: "#3A3A38"
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Noto Serif TC"', '"Noto Serif JP"', "serif"],
        sans: ['"Noto Sans TC"', '"Noto Sans JP"', "system-ui", "sans-serif"],
        en: ['"Cormorant Garamond"', '"Playfair Display"', "Georgia", "serif"]
      },
      letterSpacing: {
        wider2: "0.18em",
        widest2: "0.32em",
        widest3: "0.42em"
      },
      maxWidth: {
        "8xl": "88rem"
      },
      transitionTimingFunction: {
        soft: "cubic-bezier(0.22, 1, 0.36, 1)"
      },
      animation: {
        "scroll-hint": "scrollHint 2.4s ease-in-out infinite"
      },
      keyframes: {
        scrollHint: {
          "0%, 100%": { transform: "translateY(0)", opacity: "0.4" },
          "50%": { transform: "translateY(8px)", opacity: "1" }
        }
      }
    }
  },
  plugins: []
};

export default config;
