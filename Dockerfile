# syntax=docker/dockerfile:1.7
#
# Node 24：後台與會員系統用 Node 內建的 node:sqlite（Node 22.5 才有，24 起不需 flag）。
# 原本的 node:20 沒有這個模組，升上來是必要的，不是順手更新。
# 對齊 auslife.tw（澳喀萊買）的做法：SQLite 單檔 + 本地上傳目錄，皆掛 volume。

# ─── deps ──────────────────────────────────────────────────────────────
FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --no-audit --no-fund

# ─── builder ───────────────────────────────────────────────────────────
FROM node:24-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ─── runner (standalone) ───────────────────────────────────────────────
FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV DATA_DIR=/app/data

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# schema.sql 是執行期讀取的（app/lib/db.ts），standalone 的檔案追蹤不會把它帶進來，
# 必須自己 COPY。漏掉這行的話容器會在第一次查詢時炸掉。
COPY --from=builder --chown=nextjs:nodejs /app/db ./db

# 這兩個目錄在 compose 掛 volume；先建好並給對擁有者，
# 否則 volume 首次掛載時會是 root 所有，nextjs 寫不進去。
RUN mkdir -p /app/data /app/public/uploads && chown -R nextjs:nodejs /app/data /app/public/uploads

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
