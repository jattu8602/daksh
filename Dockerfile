# ========== STAGE 1: Dependencies + Build ==========
FROM node:18-alpine AS builder

# Install dependencies for Prisma
RUN apk add --no-cache libc6-compat openssl


# Add required packages (including Python for youtube-dl-exec)
RUN apk add --no-cache libc6-compat openssl python3 py3-pip make g++

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy rest of the app
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build Next.js app (SSG + SSR output)
RUN npm run build

# ========== STAGE 2: Production Server ==========
FROM node:18-alpine AS runner

# Install OS dependencies for Prisma
RUN apk add --no-cache libc6-compat openssl

# Set working directory
WORKDIR /app

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.env ./.env

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
