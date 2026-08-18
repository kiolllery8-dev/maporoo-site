import type { Config } from "tailwindcss";

// 後台的版面與元件移植自 auslife-www 的 admin（同一位老闆的另一個站），
// 所以這裡沿用它那套 token 名稱（cream / ink / brand-50…900），
// 讓兩邊的 class 可以直接對照、日後互相搬移不用改名。
//
// 差別只在顏色：auslife 是橘金配色，那是它的品牌色。
// 這裡把同一組刻度換成 MAPOROO 自己的紙感米白與暖調近黑，
// 兩個品牌的後台才不會長得一模一樣。
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: { DEFAULT: "#F2EFE8", 2: "#EBE7DD" },
        ink: { DEFAULT: "#1C1B18", soft: "#4F4C44", mute: "#857F74" },
        line: "#D6D1C5",
        accent: "#6E6A5C",

        // ── 後台專用刻度（對應 auslife 的 brand-*）──
        brand: {
          50: "#FAF8F3",   // 最淺的底，表頭用
          100: "#EFEBE1",  // 淺分隔線、標籤底
          200: "#D6D1C5",  // 邊框（＝ --line）
          300: "#C8C2B4",  // 較實的邊框
          400: "#A39C8C",
          500: "#857F74",  // 次要文字（＝ --mute）
          600: "#6E6A5C",  // eyebrow 小字（＝ --accent）
          700: "#4F4C44",  // 主要動作的 hover（＝ --soft）
          800: "#3A3830",
          900: "#1C1B18"   // 最深（＝ --ink）
        },
        cream: "#F2EFE8"
      },
      fontFamily: {
        sans: ['"Noto Sans TC"', "system-ui", "sans-serif"],
        serif: ['"Noto Sans TC"', "system-ui", "sans-serif"]
      },
      maxWidth: { wrap: "1120px" },
      boxShadow: { soft: "0 6px 24px -8px rgba(40, 36, 28, 0.12)" }
    }
  },
  plugins: []
};

export default config;
