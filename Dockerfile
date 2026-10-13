# --- STAGE 1: Install dependencies ---
FROM node:24-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci --verbose

# Stage 2: Build
FROM node:24-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 1. Define Build Arguments (Client-side variables baked into JS bundles)
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_IMAGE_URL
ARG NEXT_PUBLIC_GA_MEASUREMENT_ID
ARG NEXT_PUBLIC_POSTHOG_KEY
ARG NEXT_PUBLIC_POSTHOG_HOST
ARG NEXT_PUBLIC_PUSHER_KEY
ARG NEXT_PUBLIC_PUSHER_CLUSTER
ARG NEXT_PUBLIC_PUSHER_HOST
ARG NEXT_PUBLIC_PUSHER_PORT
ARG NEXT_PUBLIC_ENABLE_SURVEY

# 2. Make them available to the 'npm run build' process
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_IMAGE_URL=$NEXT_PUBLIC_IMAGE_URL
ENV NEXT_PUBLIC_GA_MEASUREMENT_ID=$NEXT_PUBLIC_GA_MEASUREMENT_ID
ENV NEXT_PUBLIC_POSTHOG_KEY=$NEXT_PUBLIC_POSTHOG_KEY
ENV NEXT_PUBLIC_POSTHOG_HOST=$NEXT_PUBLIC_POSTHOG_HOST
ENV NEXT_PUBLIC_PUSHER_KEY=$NEXT_PUBLIC_PUSHER_KEY
ENV NEXT_PUBLIC_PUSHER_CLUSTER=$NEXT_PUBLIC_PUSHER_CLUSTER
ENV NEXT_PUBLIC_PUSHER_HOST=$NEXT_PUBLIC_PUSHER_HOST
ENV NEXT_PUBLIC_PUSHER_PORT=$NEXT_PUBLIC_PUSHER_PORT
ENV NEXT_PUBLIC_ENABLE_SURVEY=$NEXT_PUBLIC_ENABLE_SURVEY
ENV NODE_ENV=production
ENV DIRECT_URL="postgresql://postgres:postgres@localhost:5432/dummy" 

RUN npx prisma generate

ENV NEXT_TELEMETRY_DISABLED=1
ENV SKIP_ENV_VALIDATION=true
RUN npm run build

# --- STAGE 3: Production Runner (The Slim Image) ---
FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# ONLY copy the minimal files needed to run the server
# Standalone output doesn't include public or static by default
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000

# Use the standalone server.js instead of 'npm start'
CMD ["node", "server.js"]