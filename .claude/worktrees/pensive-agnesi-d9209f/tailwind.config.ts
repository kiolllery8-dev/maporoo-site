import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "#FAF5EA",
          50: "#FCF9F1",
          100: "#FAF5EA",
          200: "#F2EBDA",
          300: "#E8DEC4"
        },
        ink: {
          DEFAULT: "#2A241D",
          soft: "#645C50",
          mute: "#8A8275"
        },
        tea: {
          DEFAULT: "#A4845A",
          light: "#D4A574",
          deep: "#76583B"
        }
      },
      fontFamily: {
        serif: ['"Noto Serif TC"', '"Noto Serif JP"', '"Songti TC"', "serif"],
        sans: ['"Noto Sans TC"', '"Noto Sans JP"', "system-ui", "sans-serif"],
        en: ['"Cormorant Garamond"', '"Playfair Display"', "Georgia", "serif"]
      },
      letterSpacing: {
        wider2: "0.18em",
        widest2: "0.32em"
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
