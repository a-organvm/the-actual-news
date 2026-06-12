FROM node:26-alpine AS deps
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/public-web/package.json apps/public-web/package.json
RUN pnpm install --frozen-lockfile

FROM node:26-alpine AS builder
WORKDIR /app
RUN corepack enable
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/public-web/node_modules ./apps/public-web/node_modules
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/public-web ./apps/public-web
RUN pnpm --filter public-web build

FROM node:26-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
RUN addgroup -S nextjs && adduser -S nextjs -G nextjs
COPY --from=builder --chown=nextjs:nextjs /app/apps/public-web/.next/standalone ./
COPY --from=builder --chown=nextjs:nextjs /app/apps/public-web/.next/static ./apps/public-web/.next/static
USER nextjs
EXPOSE 3000
CMD ["node", "apps/public-web/server.js"]
