# Backend Build Stage
FROM node:20-alpine AS builder

# Install build dependencies for native modules
RUN apk add --no-cache python3 make g++ git openssl openssl-dev

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Generate Prisma client with correct binary targets
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Production Stage
FROM node:20-alpine

# Install runtime dependencies
RUN apk add --no-cache openssl libssl3

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm install --legacy-peer-deps --omit=dev

# Install prisma CLI for migrations
RUN npm install prisma@6.12.0

# Copy Prisma schema and migrations
COPY prisma ./prisma

# Copy generated Prisma client from builder (includes binaries)
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Create a startup script for better error handling
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'set -e' >> /app/start.sh && \
    echo 'echo "Starting Pronova Backend..."' >> /app/start.sh && \
    echo 'echo "Node version: $(node --version)"' >> /app/start.sh && \
    echo 'echo "Running Prisma migrations..."' >> /app/start.sh && \
    echo 'npx prisma migrate deploy || { echo "Migration failed, but continuing..."; }' >> /app/start.sh && \
    echo 'echo "Starting Node.js server..."' >> /app/start.sh && \
    echo 'exec node dist/server.js' >> /app/start.sh && \
    chmod +x /app/start.sh

# Expose port 5000
EXPOSE 5000

# Run the startup script
CMD ["/app/start.sh"]
