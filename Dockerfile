# ========== STAGE 1: Dependencies + Build ==========
FROM node:18-alpine AS builder

# Install dependencies for Prisma and python
RUN apk add --no-cache libc6-compat openssl python3 py3-pip make g++

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
COPY prisma ./prisma
RUN npm install

# Copy rest of the app
COPY . .

# Provide a dummy database URL at build time.
# This is needed for `next build` to run without a real database connection.
# The real DATABASE_URL will be provided at runtime.
ARG DATABASE_URL="postgresql://dummy:dummy@dummy:5432/dummy"
ENV DATABASE_URL=${DATABASE_URL}

# Build Next.js app
RUN npm run build

# ========== STAGE 2: Production Server ==========
FROM node:18-alpine AS runner

# Set working directory
WORKDIR /app

# Install OS dependencies for Prisma
RUN apk add --no-cache libc6-compat openssl

ENV NODE_ENV=production

# Copy the standalone Next.js server
COPY --from=builder /app/.next/standalone ./

# Copy the public and static folders
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

# Copy Prisma schema
COPY --from=builder /app/prisma ./prisma

# Expose port
EXPOSE 3000

# Start the app
CMD ["node", "server.js"]
