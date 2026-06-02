FROM node:20-alpine AS builder
ARG SERVICE_DIR
ARG SERVICE_NAME
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY services/${SERVICE_DIR}/package.json services/${SERVICE_DIR}/package.json
RUN pnpm install --frozen-lockfile
COPY services/${SERVICE_DIR} services/${SERVICE_DIR}
RUN pnpm --filter ${SERVICE_NAME} build

FROM node:20-alpine AS runner
ARG SERVICE_DIR
ENV SERVICE_DIR=${SERVICE_DIR}
ENV NODE_ENV=production
WORKDIR /app
RUN addgroup -S service && adduser -S service -G service
COPY --from=builder --chown=service:service /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --from=builder --chown=service:service /app/node_modules ./node_modules
COPY --from=builder --chown=service:service /app/services/${SERVICE_DIR} ./services/${SERVICE_DIR}
USER service
CMD ["sh", "-c", "node services/${SERVICE_DIR}/dist/server.js"]
