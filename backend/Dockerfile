# Backend Build Stage
FROM node:20-alpine AS builder

# Install build dependencies for native modules
RUN apk add --no-cache python3 make g++ git openssl

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Production Stage
FROM node:20-alpine

# Install runtime dependencies
RUN apk add --no-cache openssl

WORKDIR /app

# Copy package files and install production dependencies only
COPY package*.json ./
RUN npm install --legacy-peer-deps --omit=dev

# Copy Prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Expose port 5000
EXPOSE 5000

# Start the application
CMD ["node", "dist/server.js"]
