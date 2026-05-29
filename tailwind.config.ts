import type { Config } from "tailwindcss";

// The site styling is driven primarily by globals.css (CSS variables + ported
// classes) for 1:1 fidelity with the approved preview. These tokens mirror the
// same palette for any Tailwind utility usage.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: { DEFAULT: "#F2EFE8", 2: "#EBE7DD" },
        ink: { DEFAULT: "#1C1B18", soft: "#4F4C44", mute: "#857F74" },
        line: "#D6D1C5",
        accent: "#6E6A5C"
      },
      fontFamily: {
        sans: ['"Noto Sans TC"', "system-ui", "sans-serif"]
      },
      maxWidth: {
        wrap: "1120px"
      }
    }
  },
  plugins: []
};

export default config;
