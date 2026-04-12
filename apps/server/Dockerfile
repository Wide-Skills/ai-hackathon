# Dockerfile for ai-hackathon server
# Optimized multi-stage build for Railway deployment

# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml ./
COPY apps/server/package.json ./apps/server/
COPY packages/db/package.json ./packages/db/

# Install dependencies target strictly
RUN pnpm install

# Copy source code
COPY . .

# Build the application
RUN pnpm dlx turbo run build --filter=@ai-hackathon/server

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

RUN npm install -g pnpm

ENV NODE_ENV=production
ENV PORT=3000

# Copy built application
COPY --from=builder /app/apps/server/dist ./dist
COPY --from=builder /app/apps/server/package.json ./

# Install production dependencies only
RUN pnpm install --prod

EXPOSE 3000

CMD ["node", "dist/index.js"]
