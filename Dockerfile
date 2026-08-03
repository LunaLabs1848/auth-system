# ==========================================
# STAGE 1: Build Stage
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package manifests
COPY package*.json ./

# Install all dependencies (including devDependencies for tsc)
RUN npm ci

# Copy application source code
COPY . .

# Build TypeScript into JavaScript (/dist)
RUN npm run build

# ==========================================
# STAGE 2: Production Runner Stage
# ==========================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy package manifests
COPY package*.json ./

# 🔧 FIX: --ignore-scripts prevents lifecycle scripts (like husky) from crashing
RUN npm ci --omit=dev --ignore-scripts

# Copy compiled JavaScript output from Stage 1
COPY --from=builder /app/dist ./dist

# Expose server port
EXPOSE 3001

# Run as non-root user
USER node

# Start the application
CMD ["node", "dist/app.js"]