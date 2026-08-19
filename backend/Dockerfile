# Stage 1: deps
FROM node:20-alpine AS deps

WORKDIR /app

RUN apk add --no-cache curl

COPY backend/package*.json ./
RUN npm ci --omit=dev


# Stage 2: runtime
FROM node:20-alpine AS runner

RUN apk add --no-cache curl

# Non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY backend .

RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 4000

STOPSIGNAL SIGTERM

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:4000/health || exit 1

CMD ["node", "index.js"]
