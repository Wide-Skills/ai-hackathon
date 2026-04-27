# Dockerfile for ai-hackathon server
# Optimized multi-stage build for deployment

# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

# Copy workspace configuration
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml ./

# Copy all package.json files
COPY apps/server/package.json ./apps/server/
COPY apps/web/package.json ./apps/web/
COPY packages/api/package.json ./packages/api/
COPY packages/auth/package.json ./packages/auth/
COPY packages/config/package.json ./packages/config/
COPY packages/db/package.json ./packages/db/
COPY packages/env/package.json ./packages/env/
COPY packages/queue/package.json ./packages/queue/
COPY packages/shared/package.json ./packages/shared/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the source code
COPY . .

# Build the server and its dependencies
RUN pnpm dlx turbo run build --filter=@ai-hackathon/server...

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

RUN npm install -g pnpm

ENV NODE_ENV=production
ENV PORT=3000

# Copy workspace files
COPY --from=builder /app/pnpm-lock.yaml* /app/pnpm-workspace.yaml /app/package.json ./

# Copy package.json files for all packages to maintain workspace structure
COPY --from=builder /app/apps/server/package.json ./apps/server/
COPY --from=builder /app/packages/api/package.json ./packages/api/
COPY --from=builder /app/packages/auth/package.json ./packages/auth/
COPY --from=builder /app/packages/db/package.json ./packages/db/
COPY --from=builder /app/packages/env/package.json ./packages/env/
COPY --from=builder /app/packages/queue/package.json ./packages/queue/
COPY --from=builder /app/packages/shared/package.json ./packages/shared/

# Install production dependencies
# This ensures node_modules are correctly populated for all packages
RUN pnpm install --prod --frozen-lockfile

# Copy built artifacts
COPY --from=builder /app/apps/server/dist ./apps/server/dist

# Copy package source for internal dependencies that are not bundled
COPY --from=builder /app/packages ./packages

EXPOSE 3000

# Run from the server directory or use absolute path
WORKDIR /app/apps/server
CMD ["node", "dist/index.mjs"]
